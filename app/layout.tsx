import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Font ─────────────────────────────────────────────────────────────────────

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-archivo",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "mrknown. — Find the Best Products Before You Buy",
    template: "%s — mrknown.",
  },
  description:
    "Curated picks across headphones, tablets, wearables, and more — with honest pros, cons, and direct buy links.",
  openGraph: {
    title: "mrknown.",
    description:
      "Curated product picks with honest pros, cons, and direct buy links.",
    type: "website",
  },
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="min-h-screen flex flex-col bg-white font-sans">
        <Navbar />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
