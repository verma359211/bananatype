import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from "next";

import "./globals.css";
// import { ThemeProvider } from '@/components/theme-providers';


export const fetchCache = "force-no-store";

export const metadata: Metadata = {
	title: "bananaType",
	description: "A typing test game",
	icons: {
		icon: "/favicon.ico", // Path to my favicon file
	},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
		<html lang="en">
			<head>
				<meta name="description" content="A typing test game" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{/* Explicit favicon link */}
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body>
				{/* <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          > */}
				{/* <Navbar /> */}
				{children}
				{/* <Footer /> */}
				<Analytics />
				{/* </ThemeProvider> */}
			</body>
		</html>
	);
}
