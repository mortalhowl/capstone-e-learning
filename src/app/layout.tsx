import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Cyber E-Learning",
    default: "Cyber E-Learning - Nền tảng học trực tuyến",
  },
  description: "Nền tảng học trực tuyến hàng đầu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col justify-between">
            <Header />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
