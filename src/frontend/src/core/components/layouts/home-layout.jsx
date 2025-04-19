import React from "react";
import "@/core/style/global.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Lumora - Decentralized Eco-Rewards Platform",
  description: "Earn rewards for real-world eco-friendly actions through our decentralized, community-driven platform built on the Internet Computer Protocol.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
