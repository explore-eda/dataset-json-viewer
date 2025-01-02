import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EDA JSON Viewer",
  description: "© EDA Clinical",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" suppressHydrationWarning> 
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> 
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
