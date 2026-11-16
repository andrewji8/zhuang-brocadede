import type { Metadata } from "next";
import { Inter, DM_Serif_Display, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { CartProvider, CartDrawer } from "@/components/cart";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ZHUAJIN 壮锦 — 把千年纹样织进日常",
    template: "%s | ZHUAJIN 壮锦",
  },
  description:
    "广西山区壮族手工挑花织锦，靛蓝、朱红、藤黄。一块壮锦，织进山与水的历史。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${dmSerif.variable} ${notoSerifSC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
