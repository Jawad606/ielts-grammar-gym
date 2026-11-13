import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "IELTS Grammar Gym",
  description: "Practise the grammar structures that raise your IELTS GT Writing band — Task 1 letters and Task 2 essays.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Grammar Gym", statusBarStyle: "default" },
  icons: { icon: "/icon-192.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
    { media: "(prefers-color-scheme: dark)", color: "#141513" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        {children}
        <Nav />
      </body>
    </html>
  );
}
