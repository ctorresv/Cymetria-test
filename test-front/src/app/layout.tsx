import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestión de Usuarios | Cymetria Test",
  description: "Prueba técnica Fullstack: CRUD de usuarios con Arquitectura Hexagonal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen bg-background text-foreground`}>
        <Providers>
          <Header />
          <main className="flex-1 container mx-auto py-8 px-4">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}