import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from '@/components/theme-providers';




export const metadata: Metadata = {
  title: "bananaType",
  description: "A typing test game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body> 
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        {/* <Navbar /> */}
        {children}
        {/* <Footer /> */}
        <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
