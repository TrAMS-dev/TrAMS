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
  title: {
    default: "TrAMS - Trondheim Akuttmedisinske Studentforening",
    template: "%s | TrAMS",
  },
  description: "TrAMS tilbyr førstehjelpskurs i Trondheim for bedrifter og organisasjoner. Lær akuttmedisin, HLR og livreddende førstehjelp fra medisinstudenter. First aid course Trondheim.",
  keywords: [
    "førstehjelpskurs trondheim",
    "førstehjelpskurs",
    "akuttmedisin",
    "first aid course trondheim",
    "HLR kurs",
    "hjerte-lungeredning",
    "førstehjelp trondheim",
    "førstehjelp bedrift",
    "livredning kurs",
    "TrAMS",
    "medisinstudenter trondheim",
    "NTNU medisin",
    "akuttmedisinsk studentforening",
  ],
  authors: [{ name: "TrAMS - Trondheim Akuttmedisinske Studentforening" }],
  creator: "TrAMS",
  publisher: "TrAMS",
  metadataBase: new URL("https://www.trams.no"),
  alternates: {
    canonical: "/",
    languages: {
      "nb-NO": "/",
      "en": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    alternateLocale: "en_US",
    url: "https://www.trams.no",
    siteName: "TrAMS - Trondheim Akuttmedisinske Studentforening",
    title: "TrAMS - Trondheim Akuttmedisinske Studentforening",
    description: "TrAMS tilbyr førstehjelpskurs i Trondheim for bedrifter og organisasjoner. Lær akuttmedisin, HLR og livreddende førstehjelp fra medisinstudenter.",
    images: [
      {
        url: "/assets/images/gruppebilde_fly.jpg",
        width: 1200,
        height: 630,
        alt: "TrAMS - Trondheim Akuttmedisinske Studentforening",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrAMS - Førstehjelpskurs Trondheim | Akuttmedisin",
    description: "TrAMS tilbyr førstehjelpskurs i Trondheim for bedrifter. Lær akuttmedisin og HLR fra medisinstudenter.",
    images: ["/assets/images/gruppebilde_fly.jpg"],
  },
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
