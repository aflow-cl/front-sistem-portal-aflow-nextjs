import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AFLOW Portal - Sistema Empresarial",
  description: "Portal corporativo modular AFLOW - Gestión empresarial integrada",
  keywords: ["AFLOW", "Portal", "Empresarial", "Gestión", "Corporativo"],
  authors: [{ name: "AFLOW" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#FF7A00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
