import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Official Shrimp Appointment Office",
  description: "A tiny proposal with potentially large consequences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
