import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto_Flex } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SkipToContent } from "@/components/SkipToContent";
import { ThemeTransitionWrapper } from "@/components/ThemeTransitionWrapper"; // New import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto_Flex({ subsets: ["latin"], variable: "--font-roboto" });

export const metadata: Metadata = {
  title: { default: "Markdown Viewer", template: "%s · Markdown Viewer" },
  description: "Secure, client-side, drag-and-drop Markdown renderer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${roboto.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <SkipToContent />
        <ThemeProvider>
          <ThemeTransitionWrapper>
            <Header />
            <main
              id="main"
              role="main"
              className="mx-auto w-full max-w-7xl flex-1 px-4"
            >
              {children}
            </main>
            {/* <Footer /> */}
          </ThemeTransitionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}