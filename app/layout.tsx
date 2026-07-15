import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
