// Avisos en el teléfono (Web Push), hechos a mano con WebCrypto: sin librerías.
//   - VAPID (RFC 8292): Lokl firma cada aviso con su llave privada; los servicios de avisos
//     (Google, Apple, Mozilla) solo aceptan avisos firmados con la llave con que se suscribió el teléfono.
//   - Cifrado aes128gcm (RFC 8291): solo el teléfono puede leer el texto del aviso.
// La llave PÚBLICA va aquí (la usa el navegador al suscribirse). La PRIVADA es un secreto de
// Cloudflare (VAPID_PRIVADA) y nunca se guarda en el código.
// Funciona igual en Cloudflare Workers y en Node (pruebas).

export const VAPID_PUBLICA = "BJSp7-hHt2i-sy8Y34w59XV0seC_WZswD86QxBTqOIhRqzxqA3UZRU3_siBw7O5owzjzpAlUnEydYNLpMb3jGT8";
const SUJETO = "https://usalokl.com";
const enc = new TextEncoder();

export function aBase64Url(bytes) {
  let s = "";
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function deBase64Url(texto) {
  const b = String(texto).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b + "=".repeat((4 - (b.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

const unir = (...partes) => {
  const total = new Uint8Array(partes.reduce((n, p) => n + p.length, 0));
  let i = 0;
  for (const p of partes) { total.set(p, i); i += p.length; }
  return total;
};

async function hkdf(sal, ikm, info, largo) {
  const llave = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt: sal, info }, llave, largo * 8));
}

/**
 * Cifra el texto para un teléfono (RFC 8291, un solo bloque).
 * @param {{p256dh: string, auth: string}} claves  las que dio el navegador al suscribirse
 * @param {string} texto
 * @param {{sal?: Uint8Array, efimera?: CryptoKeyPair}} [fijo] solo para pruebas
 */
export async function cifrar(claves, texto, fijo = {}) {
  const uaPublica = deBase64Url(claves.p256dh);
  const secreto = deBase64Url(claves.auth);
  const efimera = fijo.efimera ?? (await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]));
  const asPublica = new Uint8Array(await crypto.subtle.exportKey("raw", efimera.publicKey));
  const llaveUa = await crypto.subtle.importKey("raw", uaPublica, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const compartido = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: llaveUa }, efimera.privateKey, 256));

  const ikm = await hkdf(secreto, compartido, unir(enc.encode("WebPush: info\0"), uaPublica, asPublica), 32);
  const sal = fijo.sal ?? crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(sal, ikm, enc.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(sal, ikm, enc.encode("Content-Encoding: nonce\0"), 12);

  const llaveAes = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const claro = unir(enc.encode(texto), new Uint8Array([2])); // 2 = último bloque, sin relleno
  const cifrado = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, llaveAes, claro));

  const tam = new Uint8Array(4);
  new DataView(tam.buffer).setUint32(0, 4096);
  return unir(sal, tam, new Uint8Array([asPublica.length]), asPublica, cifrado);
}

/** Llave privada de VAPID a partir de "d" (32 bytes en base64url) y la llave pública. */
async function llavePrivada(privada, publica = VAPID_PUBLICA) {
  const p = deBase64Url(publica);
  const jwk = { kty: "EC", crv: "P-256", d: privada, x: aBase64Url(p.slice(1, 33)), y: aBase64Url(p.slice(33, 65)), ext: true };
  return crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
}

/** Encabezado Authorization de VAPID para un servicio de avisos (vale 12 horas). */
export async function firmaVapid(endpoint, privada, { publica = VAPID_PUBLICA, ahora = Date.now() } = {}) {
  const cabecera = aBase64Url(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const datos = aBase64Url(enc.encode(JSON.stringify({
    aud: new URL(endpoint).origin,
    exp: Math.floor(ahora / 1000) + 12 * 3600,
    sub: SUJETO,
  })));
  const llave = await llavePrivada(privada, publica);
  const firma = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, llave, enc.encode(`${cabecera}.${datos}`));
  return `vapid t=${cabecera}.${datos}.${aBase64Url(firma)}, k=${publica}`;
}

/**
 * Envía un aviso a varios teléfonos. Nunca lanza error: un aviso que no sale no frena nada.
 * @param {{endpoint: string, claves: {p256dh: string, auth: string}}[]} suscripciones
 * @param {{titulo: string, cuerpo: string, url: string, tag?: string}} aviso
 * @returns {Promise<{enviados: number, vencidos: string[]}>} vencidos = teléfonos que ya no existen (borrarlos)
 */
export async function enviarAvisos(suscripciones, aviso, privada, { esperar = 4000 } = {}) {
  const lista = (suscripciones || []).filter((s) => s?.endpoint && s?.claves?.p256dh && s?.claves?.auth);
  if (!lista.length || !privada) return { enviados: 0, vencidos: [] };
  const texto = JSON.stringify(aviso);
  const vencidos = [];
  let enviados = 0;
  await Promise.all(lista.map(async (s) => {
    try {
      const cuerpo = await cifrar(s.claves, texto);
      const r = await fetch(s.endpoint, {
        method: "POST",
        headers: {
          Authorization: await firmaVapid(s.endpoint, privada),
          "Content-Encoding": "aes128gcm",
          "Content-Type": "application/octet-stream",
          TTL: "86400",
          Urgency: "high",
        },
        body: cuerpo,
        signal: AbortSignal.timeout(esperar),
      });
      if (r.status === 404 || r.status === 410) vencidos.push(s.endpoint);
      else if (r.ok) enviados++;
      else console.error("aviso", r.status, await r.text().catch(() => ""));
    } catch (e) {
      console.error("aviso", e?.message || e);
    }
  }));
  return { enviados, vencidos };
}
