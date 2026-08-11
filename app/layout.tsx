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
  title: "ProShot AI — 셀카 한 장으로 만드는 증명사진 & AI 프로필 스튜디오",
  description:
    "취업용 증명사진, 여권사진, 비즈니스 헤드샷, K-POP 프로필, 화보까지 스튜디오 예약 없이 5분 만에 완벽 생성. 4K 인화 시트 자동 제공.",
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
