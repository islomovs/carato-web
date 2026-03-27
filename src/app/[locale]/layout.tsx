import type { Metadata } from "next";
import "./globals.css";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing, Locale } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Manrope, Montserrat } from "next/font/google";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import MobileAppBarWrapper from "@/components/layout/MobileAppBarWrapper";
import HeaderWrapper from "@/components/layout/HeaderWrapper";
import { WishlistCartBootstrap } from "@/components/layout/HeaderWrapper";
import GlobalAuthModal from "@/components/shared/auth-modal/GlobalAuthModal";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Carato - Ваш ювелирный помощник",
  description: "Магазин ювелирных изделий, где стиль встречается с качеством.",
  other: {
    "google-site-verification": "LFq4zYUs20To60_Qlh_Ith1KyHq2eWMiJPPhSL8irwU",
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  const resources = await getMessages();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${montserrat.variable}`}
    >
      <body className="antialiased">
        <NextIntlClientProvider locale={locale as Locale} messages={resources}>
          <WishlistCartBootstrap />
          <HeaderWrapper />
          <main className="md:pt-[66px]">{children}</main>
          <div style={{ margin: 0, padding: 0 }}>
            <Toaster position="top-right" richColors />
          </div>
          <Footer />
          <MobileAppBarWrapper />
          <GlobalAuthModal />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
