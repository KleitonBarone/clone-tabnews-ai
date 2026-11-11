import "./globals.css";

export const metadata = {
  title: "Em construção | TabNews",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
