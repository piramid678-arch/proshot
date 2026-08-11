"use client";

import React from "react";
import { useLanguage } from "./context/LanguageContext";
import UploadCard from "./components/UploadCard";
import LanguageSelector from "./components/LanguageSelector";

export default function ProShotStudioPage() {
  const { t, credits, openPaymentModal } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Ambient Lighting Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-[20%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[160px] opacity-70" />
        <div className="absolute top-[30%] right-[15%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[150px] opacity-60" />
        <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[160px] opacity-50" />
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center text-xl font-black">
                📸
              </div>
            </div>
            <div>
              <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                ProShot AI
              </span>
              <span className="ml-2.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full">
                AI Photo Studio
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openPaymentModal}
              className="px-3.5 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span className="text-amber-400">⚡</span>
              <span>
                {t("creditsLeft")}:{" "}
                <strong className="text-indigo-400 font-extrabold">{credits}회</strong>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold">
                {t("rechargeButton")}
              </span>
            </button>

            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-xl">
            <span>📸 스튜디오 예약 없는 1초 Instant AI 프로필</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            셀카 한 장이면, <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300">
              증명사진부터 컨셉 화보까지
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            {t("heroSubheadline")}
          </p>

          {/* Key Value Feature Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5">
              <span>🖨️</span> 4K 인화용 시트(4x6) 자동 생성
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5">
              <span>⚡</span> Gemini Pro 기반 고화질 AI 변환
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5">
              <span>💳</span> 자동 결제 없는 안전한 단건 패스
            </span>
          </div>
        </section>

        {/* AI Selfie Photo Studio Upload Card */}
        <section className="max-w-4xl mx-auto">
          <UploadCard />
        </section>

        {/* 4 Feature Highlights Grid */}
        <section className="max-w-5xl mx-auto pt-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              ProShot AI 스튜디오가 제공하는 4가지 프로필 솔루션
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-2xl font-bold">
                🖨️
              </div>
              <h3 className="font-extrabold text-base text-white">1. 증명 & 여권사진</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                취업 이력서, 여권, 주민등록증 용도에 맞는 규격 및 4x6 인화 시트(8구) 자동 변환
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-2xl font-bold">
                💼
              </div>
              <h3 className="font-extrabold text-base text-white">2. 비즈니스 헤드샷</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                LinkedIn, 사원증, 프로필용 신뢰감 있고 깔끔한 고화질 정장 헤드샷
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-pink-600/20 text-pink-400 flex items-center justify-center text-2xl font-bold">
                🌟
              </div>
              <h3 className="font-extrabold text-base text-white">3. K-POP & 화보</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                아이돌 앨범 컨셉, 스튜디오 감성 조명, 인스타용 감성 화보 컷 생성
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-2xl font-bold">
                🎨
              </div>
              <h3 className="font-extrabold text-base text-white">4. 커스텀 AI 씬</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                원하는 분위기, 의상, 배경을 직접 프롬프트로 입력하여 생성
              </p>
            </div>
          </div>
        </section>

        {/* Simple 3 Step Guide */}
        <section className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-6">
          <h3 className="text-lg sm:text-xl font-extrabold text-white">
            스튜디오 방문 없이 3단계 만에 완성
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 font-black text-sm flex items-center justify-center mx-auto border border-indigo-500/40">
                1
              </div>
              <h4 className="font-bold text-sm text-white">{t("step1Title")}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t("step1Desc")}</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 font-black text-sm flex items-center justify-center mx-auto border border-indigo-500/40">
                2
              </div>
              <h4 className="font-bold text-sm text-white">{t("step2Title")}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t("step2Desc")}</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 font-black text-sm flex items-center justify-center mx-auto border border-indigo-500/40">
                3
              </div>
              <h4 className="font-bold text-sm text-white">{t("step3Title")}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t("step3Desc")}</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500 space-y-1">
        <p className="font-bold text-slate-400">ProShot AI — AI Profile & ID Photo Studio</p>
        <p className="text-[11px] text-slate-600">
          ID Photo · Passport · Business Headshot · K-POP Concept · 4K Print Sheet
        </p>
        <p className="text-[10px] text-slate-600 pt-2">
          Copyright © 2026 ProShot AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
