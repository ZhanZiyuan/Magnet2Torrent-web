import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "Magnet2Torrent — Magnet to torrent converter",
  description:
    "Convert complete magnet links or info hashes into downloadable torrent files using peer-to-peer metadata.",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e6f2ff" },
    { media: "(prefers-color-scheme: dark)", color: "#111d32" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="magnet2torrent.theme"
        >
          {children}
          <Toaster position="top-center" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
