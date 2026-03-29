import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abearica Online — You've Got Projects",
  description: "Abearica Online — AI-powered IT services, web design, and marketing. 23 years experience. Oregon. 48-hour website delivery.",
  keywords: "AI agents, IT consulting, web design, Oregon, Abearica",
  openGraph: {
    title: "Abearica Online — You've Got Projects",
    description: "AI-Powered. Human-Tested. 23 Years in the Making. Free 1000 Hours!",
    url: "https://abearicaonline.com",
    images: [
      {
        url: "https://raw.githubusercontent.com/abigailleahgoldberg/abearicaonline/main/bear.png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abearica Online — You've Got Projects",
    description: "AI-Powered. Human-Tested. 23 Years in the Making.",
  },
  other: {
    "theme-color": "#008080",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="canonical" href="https://abearicaonline.com" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
