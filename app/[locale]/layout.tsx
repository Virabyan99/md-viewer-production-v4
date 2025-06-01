import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto_Flex } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SkipToContent } from "@/components/SkipToContent";
import { ThemeTransitionWrapper } from "@/components/ThemeTransitionWrapper";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto_Flex({ subsets: ["latin"], variable: "--font-roboto" });

export const metadata: Metadata = {
  title: { default: "Markdown Viewer", template: "%s · Markdown Viewer" },
  description: "Secure, client-side, drag-and-drop Markdown renderer.",
};

export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "es" },
    { locale: "fr" },
    { locale: "zh-Hans" },
    { locale: "zh-Hant" },
    { locale: "ja" },
    { locale: "ko" },
    { locale: "hy" },
    { locale: "ru" },
    { locale: "fa" },
    { locale: "ar" },
  ];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!["en", "es", "fr", "zh-Hans", "zh-Hant", "ja", "ko", "hy", "ru", "fa", "ar"].includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${roboto.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SkipToContent />
          <ThemeProvider>
            <ThemeTransitionWrapper>
              <Header />
              <main id="main" role="main" className="mx-auto w-full max-w-7xl flex-1">
                {children}
              </main>
              {/* <Footer /> */}
            </ThemeTransitionWrapper>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}