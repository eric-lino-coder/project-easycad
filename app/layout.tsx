import type { Metadata } from "next";
import ClientProviders from "./ClientProviders";

export const metadata: Metadata = {
  title: "EasyCAD",
  description: "Sistema de Gestão de Cadastros",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ overflow: "hidden", margin: 0 }}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
