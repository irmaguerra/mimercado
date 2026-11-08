// Tiempos de caché para páginas públicas (en la red de Cloudflare).
// maxAge: segundos que se sirve la copia guardada sin consultar la base de datos.
// swr: segundos extra en que se sigue sirviendo la copia mientras se regenera por detrás.

/** Portada, listados, fichas y tiendas: se regeneran cada 60 s. */
export const PUBLICA = { maxAge: 60, swr: 600 };

/** Páginas informativas (/conoce, /vende, /verificado): cambian poco. */
export const INFORMATIVA = { maxAge: 3600, swr: 86400 };
