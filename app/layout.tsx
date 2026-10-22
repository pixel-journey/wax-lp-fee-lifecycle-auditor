import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A collect followed by an add",
  description: "A collect at 100 and an add at 110, inside 30 seconds, is one compound. A swap 40 seconds later is idle. No pool is read.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
