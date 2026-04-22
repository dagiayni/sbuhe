import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ስቡሐ - የእለት ተእለት መንፈሳዊ ጉዞ",
  description: "የእለት ተእለት የመጽሐፍ ቅዱስ ጥቅሶች፣ ተግባራት እና የቅዱሳን ታሪኮች",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="am">
      <body className="antialiased">{children}</body>
    </html>
  );
}
