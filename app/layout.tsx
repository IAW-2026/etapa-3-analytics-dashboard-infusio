import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Infusio Analytics",
  description: "Panel de análisis consolidado del ecosistema Infusio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in">
      <html lang="es" className={`${inter.variable} ${playfair.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
        <head>
          <link rel="dns-prefetch" href="https://clerk.com" />
          <link rel="preconnect" href="https://clerk.com" crossOrigin="anonymous" />
          <script
            dangerouslySetInnerHTML={{
              __html: `try{var d=document.documentElement.classList,t=localStorage.getItem('theme');(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))?d.add('dark'):d.remove('dark')}catch(e){}`,
            }}
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
