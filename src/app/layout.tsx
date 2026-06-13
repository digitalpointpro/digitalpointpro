import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Point Pro - Knowledge & Trends Platform",
  description: "Your premier destination for expert insights in technology, business, finance, and personal development. Stay ahead with Digital Point Pro.",
  keywords: ["technology", "business", "finance", "personal development", "AI", "cybersecurity", "productivity", "Digital Point Pro"],
  authors: [{ name: "Digital Point Pro Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Digital Point Pro - Knowledge & Trends Platform",
    description: "Expert insights in technology, business, finance, and personal development.",
    url: "https://digitalpointpro.com",
    siteName: "Digital Point Pro",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Point Pro - Knowledge & Trends Platform",
    description: "Expert insights in technology, business, finance, and personal development.",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
