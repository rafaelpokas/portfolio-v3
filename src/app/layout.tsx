import type { Metadata } from "next";
import { Space_Grotesk, Syncopate } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const syncopate = Syncopate({
  variable: "--font-syncopate",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rafael França — Product Designer",
  description: "Product Designer especializado em UX Research, Design Systems e CRO. Portfolio com certificações Google UX, Harvard CS50 e mais de 20 credenciais técnicas.",
  keywords: ["Product Designer", "UX Design", "Design System", "CRO", "Portfolio", "Rafael França"],
  authors: [{ name: "Rafael França" }],
  openGraph: {
    title: "Rafael França — Product Designer",
    description: "Systems & Strategy — Design intencional, métricas e pesquisa transformados em interfaces que escalam.",
    type: "website",
    locale: "pt_BR",
    siteName: "Rafael França Portfolio",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${spaceGrotesk.variable} ${syncopate.variable} font-body antialiased bg-bg text-text-main overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
