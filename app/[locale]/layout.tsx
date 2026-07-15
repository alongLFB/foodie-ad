import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

import {routing} from '@/i18n/routing';
import "../globals.css";

export const metadata: Metadata = {
  title: "Foodie-AD | Abu Dhabi's Funniest Food Guide",
  description: "阿布扎比最毒舌的美食点评平台 | Abu Dhabi's most brutally honest food review platform. Find where to eat, where to avoid, and let the drama unfold.",
  keywords: ["Abu Dhabi food", "restaurants", "food guide", "阿布扎比美食", "UAE dining"],
  openGraph: {
    title: "Foodie-AD | Abu Dhabi's Funniest Food Guide",
    description: "阿布扎比最毒舌的美食点评平台",
    url: "https://foodie-ad.alonglfb.com",
    siteName: "Foodie-AD",
    locale: "en_US",
    type: "website",
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!routing.locales.includes(locale as any)) {
    // handled by middleware normally, but standard to check here too
  }
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
