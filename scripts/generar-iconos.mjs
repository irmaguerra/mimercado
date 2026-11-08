// Convierte los SVG de identidad/iconos/ en un módulo JS para dibujarlos en línea
// (sin peticiones extra). Uso: npm run iconos
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const dir = new URL("../identidad/iconos/", import.meta.url);
const salida = new URL("../src/components/iconos-datos.js", import.meta.url);

const iconos = {};
for (const archivo of readdirSync(dir).filter((f) => f.endsWith(".svg")).sort()) {
  const svg = readFileSync(new URL(archivo, dir), "utf8");
  const interior = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();
  iconos[archivo.replace(/\.svg$/, "")] = interior;
}

writeFileSync(
  salida,
  "// Archivo generado por scripts/generar-iconos.mjs. No editar a mano.\n" +
    `export const ICONOS = ${JSON.stringify(iconos, null, 2)};\n`
);
console.log(`${Object.keys(iconos).length} íconos → src/components/iconos-datos.js`);
