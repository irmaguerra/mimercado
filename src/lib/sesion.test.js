import { test } from "node:test";
import assert from "node:assert/strict";
import { navegadorDeApp, destinoSeguro } from "./sesion.js";

test("reconoce los navegadores de Instagram, Facebook, TikTok y los WebView de Android", () => {
  assert.equal(navegadorDeApp("Mozilla/5.0 (Linux; Android 13; SM-A135M Build/TP1A; wv) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36 Instagram 312.0"), true);
  assert.equal(navegadorDeApp("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 [FBAN/FBIOS;FBAV/440.0]"), true);
  assert.equal(navegadorDeApp("Mozilla/5.0 (Linux; Android 12; wv) AppleWebKit/537.36 Chrome/119 Mobile Safari/537.36 musical_ly_2023"), true);
  assert.equal(navegadorDeApp("Mozilla/5.0 (Linux; Android 11; Redmi; wv) AppleWebKit/537.36 Version/4.0 Chrome/118 Mobile Safari/537.36"), true);
});
test("deja pasar Chrome, Safari, Samsung Internet y la computadora", () => {
  assert.equal(navegadorDeApp("Mozilla/5.0 (Linux; Android 13; SM-A135M) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36"), false);
  assert.equal(navegadorDeApp("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1"), false);
  assert.equal(navegadorDeApp("Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 SamsungBrowser/23.0 Chrome/115 Mobile Safari/537.36"), false);
  assert.equal(navegadorDeApp("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"), false);
  assert.equal(navegadorDeApp(""), false);
  assert.equal(navegadorDeApp(null), false);
});

test("solo acepta rutas internas", () => {
  assert.equal(destinoSeguro("/panel/presupuestos"), "/panel/presupuestos");
  assert.equal(destinoSeguro("//otro.com"), "/panel");
  assert.equal(destinoSeguro("https://otro.com"), "/panel");
});
