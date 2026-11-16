import { test } from "node:test";
import assert from "node:assert/strict";
import nodeCrypto from "node:crypto";
import { cifrar, firmaVapid, aBase64Url, deBase64Url, enviarAvisos, VAPID_PUBLICA } from "./push.js";

// Descifra como lo hace el teléfono (RFC 8291), para comprobar el cifrado.
function descifrar(cuerpo, ua, auth) {
  const b = Buffer.from(cuerpo);
  const sal = b.subarray(0, 16), largoId = b[20], asPublica = b.subarray(21, 21 + largoId), datos = b.subarray(21 + largoId);
  const compartido = ua.computeSecret(asPublica);
  const hk = (s, k, info, n) => Buffer.from(nodeCrypto.hkdfSync("sha256", k, s, info, n));
  const ikm = hk(auth, compartido, Buffer.concat([Buffer.from("WebPush: info\0"), ua.getPublicKey(), asPublica]), 32);
  const cek = hk(sal, ikm, Buffer.from("Content-Encoding: aes128gcm\0"), 16);
  const nonce = hk(sal, ikm, Buffer.from("Content-Encoding: nonce\0"), 12);
  const d = nodeCrypto.createDecipheriv("aes-128-gcm", cek, nonce);
  d.setAuthTag(datos.subarray(datos.length - 16));
  const claro = Buffer.concat([d.update(datos.subarray(0, datos.length - 16)), d.final()]);
  assert.equal(claro[claro.length - 1], 2);
  return claro.subarray(0, claro.length - 1).toString("utf8");
}

test("base64url ida y vuelta", () => {
  const b = new Uint8Array([0, 251, 255, 62, 63]);
  assert.deepEqual(deBase64Url(aBase64Url(b)), b);
  assert.equal(deBase64Url(VAPID_PUBLICA).length, 65);
});

test("solo el teléfono puede leer el aviso", async () => {
  const ua = nodeCrypto.createECDH("prime256v1");
  ua.generateKeys();
  const auth = nodeCrypto.randomBytes(16);
  const claves = { p256dh: ua.getPublicKey().toString("base64url"), auth: auth.toString("base64url") };
  const texto = JSON.stringify({ titulo: "Te piden presupuesto", cuerpo: "Pizza ñ €" });
  const cuerpo = await cifrar(claves, texto);
  assert.equal(new DataView(cuerpo.buffer).getUint32(16), 4096);
  assert.equal(descifrar(cuerpo, ua, auth), texto);
});

test("firma VAPID válida para el servicio de avisos", async () => {
  const k = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const publica = aBase64Url(await crypto.subtle.exportKey("raw", k.publicKey));
  const { d } = await crypto.subtle.exportKey("jwk", k.privateKey);
  const h = await firmaVapid("https://web.push.apple.com/abc", d, { publica, ahora: 0 });
  const [, jwt, kk] = h.match(/^vapid t=([^,]+), k=(.+)$/);
  const [a, b, c] = jwt.split(".");
  assert.equal(kk, publica);
  assert.deepEqual(JSON.parse(Buffer.from(b, "base64url")), { aud: "https://web.push.apple.com", exp: 43200, sub: "https://usalokl.com" });
  assert.ok(await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, k.publicKey, deBase64Url(c), new TextEncoder().encode(`${a}.${b}`)));
});

test("sin llave o sin teléfonos no envía nada", async () => {
  assert.deepEqual(await enviarAvisos([], { titulo: "x" }, "llave"), { enviados: 0, vencidos: [] });
  assert.deepEqual(await enviarAvisos([{ endpoint: "https://x", claves: { p256dh: "a", auth: "b" } }], {}, ""), { enviados: 0, vencidos: [] });
});
