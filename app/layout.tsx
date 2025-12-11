import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next"

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["200", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "TrAMS - Trondheim Akuttmedisinske Studentforening",
  description: "Trondheim Akuttmedisinske Studentforening (TrAMS), er en ideell student-organisasjon i Trondheim, som holder kurs i HLR og Førstehjelp.",
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body className={`${nunitoSans.variable} antialiased`}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
