import type { Metadata } from "next";
import { Noto_Sans_KR, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "BlogCraft AI — 로컬 LM Studio 기반 전문 AI 블로그 자동 작성 스튜디오",
  description:
    "글 한 줄로 네이버 블로그, 티스토리, 브런치, 워드프레스 맞춤형 고품질 블로그 원고 완벽 생성. 로컬 LM Studio AI(http://127.0.0.1:1234) 연동으로 개인정보 유출 없이 빠르게 포스팅을 완성하세요.",
};

import { LanguageProvider } from "./context/LanguageContext";
import PaymentModal from "./components/PaymentModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S4D14P7GPH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S4D14P7GPH');
          `}
        </Script>
      </head>
      <body
        className={`${notoSansKr.variable} ${outfit.variable} font-sans antialiased`}
      >
        <LanguageProvider>
          {children}
          <PaymentModal />
        </LanguageProvider>
      </body>
    </html>
  );
}
