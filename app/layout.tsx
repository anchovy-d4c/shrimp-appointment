import type { Metadata } from "next";
import "@fontsource/pixelify-sans/400.css";
import "@fontsource/pixelify-sans/700.css";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://teddy-shrimp-appointment.mahditasnimenan.chatgpt.site").replace(/\/$/, "");
const title = "Shrimp Redemption: Press Start";
const description = "A pixel-powered late-night appointment request—with snacks, sober mode, and zero pressure.";
const socialImage = `${siteUrl}/og.png`;

export const dynamic = "force-static";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: socialImage, width: 1731, height: 909, alt: "A pixel shrimp inside a colorful late-night arcade" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
