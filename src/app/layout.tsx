import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ROLES } from "@/lib/profile";
import { THEME_INIT_SCRIPT } from "@/lib/theme-script";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const DESCRIPTION =
  "0266st / 0168th のポートフォリオ。madgen、VOICEVOX TTS Engine for Android などの開発と、EDM / DTM。";
// What link previews (Discord, X, …) show as the headline.
const SHARE_TITLE = "Portfolio - profile.ztssst.dev";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://profile.ztssst.dev"),
  title: `0266st / 0168th — ${ROLES.join(" · ")}`,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "profile.ztssst.dev",
    locale: "ja_JP",
    title: SHARE_TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: DESCRIPTION,
  },
};

// Discord tints the embed's side bar with this.
export const viewport: Viewport = {
  themeColor: "#f37fb0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
