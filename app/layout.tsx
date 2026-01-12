import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["200", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "TrAMS - Trondheim Akuttmedisinske Studentforening",
  description: "Trondheim Akuttmedisinske Studentforening (TrAMS), er en ideell student-organisasjon i Trondheim, som holder kurs i HLR og Førstehjelp.",
  icons: {
    icon: [
      { url: "/assets/incons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/incons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/incons/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/assets/incons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/assets/incons/site.webmanifest",
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
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
