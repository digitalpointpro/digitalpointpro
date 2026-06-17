import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_CONFIG } from "@/lib/site-config";
import { ADS_CONFIG, adsterraScriptUrl, adsterraSocialBarScriptUrl } from "@/lib/ads-config";
import { JsonLd } from "@/components/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  keywords: [
    "breaking news",
    "latest news",
    "world news",
    "technology",
    "AI",
    "artificial intelligence",
    "business",
    "online business",
    "health",
    "lifestyle",
    "freelancing",
    "cybersecurity",
    "cyber security",
    "remote jobs",
    "smartphone tips",
    "Pakistan news",
    "tech news",
    "Digital Point Pro",
  ],
  authors: [{ name: `${SITE_CONFIG.name} Team`, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  category: "news",
  alternates: {
    canonical: "/",
  },
  // Google Search Console verification — paste token in site-config.ts
  verification: SITE_CONFIG.gscVerification
    ? { google: SITE_CONFIG.gscVerification }
    : undefined,
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_CONFIG.social.twitter,
    creator: SITE_CONFIG.social.twitter,
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "1024x1024", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icon.png", sizes: "1024x1024" }],
  },
  appleWebApp: {
    capable: true,
    title: SITE_CONFIG.name,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: SITE_CONFIG.themeColor },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={SITE_CONFIG.language} suppressHydrationWarning>
      <head>
        {/* Organization + WebSite structured data (sitewide). */}
        {/* JSON-LD scripts are data-only (not executable), so raw script tags
            are the recommended approach per Next.js docs. */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
            logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
            description: SITE_CONFIG.description,
            sameAs: [
              SITE_CONFIG.social.facebook,
              SITE_CONFIG.social.telegram,
              SITE_CONFIG.social.youtube,
              `https://twitter.com/${SITE_CONFIG.social.twitter.replace("@", "")}`,
            ],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
            description: SITE_CONFIG.description,
            inLanguage: SITE_CONFIG.language,
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_CONFIG.url}/?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
      </head>
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

        {/* Google Analytics 4 — only loads if GA4 ID is set in site-config.ts */}
        {SITE_CONFIG.ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${SITE_CONFIG.ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${SITE_CONFIG.ga4Id}', {
                  anonymize_ip: true,
                  send_page_view: true
                });
              `}
            </Script>
          </>
        )}

        {/* OneSignal Web Push SDK — only loads if app ID is set */}
        {SITE_CONFIG.oneSignalAppId && (
          <>
            <Script
              src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
              strategy="afterInteractive"
              defer
            />
            <Script id="onesignal-init" strategy="afterInteractive">
              {`
                window.OneSignalDeferred = window.OneSignalDeferred || [];
                OneSignalDeferred.push(async function(OneSignal) {
                  try {
                    await OneSignal.init({
                      appId: "${SITE_CONFIG.oneSignalAppId}",
                      notifyButton: {
                        enable: true,
                        position: 'bottom-right',
                        size: 'medium',
                        showCredit: false,
                        text: {
                          'tip.state.unsubscribed': 'Subscribe to breaking news alerts',
                          'tip.state.subscribed': "You're subscribed to breaking news alerts",
                          'tip.state.blocked': "You've blocked notifications",
                          'message.prenotify': 'Click to subscribe to notifications',
                          'message.action.subscribed': "Thanks for subscribing!",
                          'message.action.resubscribed': "You're subscribed to notifications",
                          'message.action.unsubscribed': "You won't receive notifications again",
                          'dialog.main.title': 'Manage Notifications',
                          'dialog.main.button.subscribe': 'SUBSCRIBE',
                          'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
                          'dialog.blocked.title': 'Unblock Notifications',
                          'dialog.blocked.message': 'Follow these instructions to allow notifications:'
                        },
                        colors: {
                          'circle.background': '#10b981',
                          'circle.foreground': 'white',
                          'badge.background': '#10b981',
                          'badge.foreground': 'white',
                          'badge.bordercolor': 'white',
                          'pulse.color': '#10b981',
                          'dialog.button.background.hovering': '#0f766e',
                          'dialog.button.background.active': '#0f766e',
                          'dialog.button.background': '#10b981',
                          'dialog.button.foreground': 'white'
                        }
                      },
                      promptOptions: {
                        slidedown: {
                          prompts: [
                            {
                              type: "push",
                              autoPrompt: false,
                              text: {
                                actionMessage: "Get breaking news and trending stories notifications from Digital Point Pro.",
                                acceptButton: "ALLOW",
                                cancelButton: "NO THANKS"
                              },
                              delay: {
                                pageViews: 1,
                                timeDelay: 15
                              }
                            }
                          ]
                        }
                      },
                      welcomeNotification: {
                        title: "${SITE_CONFIG.name}",
                        message: "Thanks for subscribing! You'll get the latest news alerts.",
                        url: "${SITE_CONFIG.url}"
                      }
                    });
                  } catch (err) {
                    // OneSignal dashboard may not yet have Web Push configured for this domain.
                    // Silently swallow init errors so they don't spam the console / break the page.
                    // User must add the production URL in OneSignal dashboard → Settings → Web Push.
                    if (typeof console !== 'undefined' && console.warn) {
                      console.warn('OneSignal init skipped:', err && err.message ? err.message : err);
                    }
                  }
                });
              `}
            </Script>
          </>
        )}

        {/* ============================================
            ADSTERRA POPUNDER AD
            Fires on user click — opens ad tab behind current page.
            Loaded globally (NOT sandboxed) so it can detect clicks
            on the whole document and trigger the popunder.
            Only renders on production (Adsterra validates referrer).
            ============================================ */}
        {ADS_CONFIG.popunderKey && (
          <Script id="adsterra-popunder" strategy="afterInteractive">
            {`
              (function() {
                var atOptions = {
                  'key' : '${ADS_CONFIG.popunderKey}',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = '${adsterraScriptUrl(ADS_CONFIG.popunderKey)}';
                var opts = document.createElement('script');
                opts.type = 'text/javascript';
                opts.innerHTML = 'atOptions = ' + JSON.stringify(atOptions) + ';';
                document.head.appendChild(opts);
                document.head.appendChild(s);
              })();
            `}
          </Script>
        )}

        {/* ============================================
            ADSTERRA SOCIAL BAR
            Floating widget with social icons (WhatsApp, Telegram, etc).
            Loaded globally so it renders as an overlay on the page.
            Only renders on production (Adsterra validates referrer).
            ============================================ */}
        {ADS_CONFIG.socialBarKey && (
          <Script
            id="adsterra-social-bar"
            src={adsterraSocialBarScriptUrl(ADS_CONFIG.socialBarKey)}
            strategy="afterInteractive"
            async
            defer
          />
        )}
      </body>
    </html>
  );
}
