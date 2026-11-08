export const metadata = {
  title: "Lokl",
  description: "Compra desde tu teléfono en San Fernando de Apure. Supermercado, comida, tiendas y servicios con delivery.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Lokl — San Fernando de Apure",
    description: "Compra desde tu teléfono: supermercado, comida, tiendas y servicios con delivery.",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "Lokl",
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-title" content="Lokl" />
        <meta name="application-name" content="Lokl" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#f8fafc" }}>
        {children}
      </body>
    </html>
  );
}
