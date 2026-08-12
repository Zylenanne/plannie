import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plannie — Cute Planner Studio",
  description: "Your aesthetic weekly, daily, monthly & period planner in one cute place. Plan your week. Stay focused. You've got this!",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Plannie",
    statusBarStyle: "default",
  },
  applicationName: "Plannie",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Plannie — Cute Planner Studio",
    description: "Daily • Weekly • Study • Monthly • Period planners — all cute, all in one app. Install to your phone!",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#8fb8ff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Comfortaa:wght@400;600;700&family=Dancing+Script:wght@600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-[#f6f7ff] text-slate-800 antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/plannie/sw.js').then(
                    (reg) => console.log('SW registered', reg.scope),
                    (err) => console.log('SW failed', err)
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
