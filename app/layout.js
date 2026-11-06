import "./globals.css";

export const metadata = {
  title: "Parte por parte",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
