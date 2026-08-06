"use client";

import Image from "next/image";
import UploadCard from "./components/UploadCard";
import LanguageSelector from "./components/LanguageSelector";
import PaymentModal from "./components/PaymentModal";
import { useLanguage } from "./context/LanguageContext";
import { CATEGORIES, STYLES } from "./lib/styles";
import { STYLE_TRANSLATIONS } from "./lib/i18n";

export default function Home() {
  const { language, t, credits, openPaymentModal } = useLanguage();

  const scrollToUpload = () => {
    const element = document.getElementById("upload-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getCategoryLabel = (catId: string) => {
    switch (catId) {
      case "business": return t("catBusiness");
      case "id": return t("catId");
      case "fun": return t("catFun");
      case "custom": return t("catCustom");
      default: return catId;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50/40 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-200/20 to-purple-200/20 blur-3xl opacity-75" />
        <div className="absolute top-[20%] right-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-100/30 to-amber-100/20 blur-3xl opacity-60" />
        <div className="absolute bottom-[10%] left-[20%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-sky-100/30 to-indigo-100/20 blur-3xl opacity-50" />
      </div>

      {/* Header / Navbar with Language Selector & Credit Badge */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100/80 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-950 font-outfit">
              ProShot
            </span>
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">{t("navHowItWorks")}</a>
            <a href="#showcase" className="hover:text-indigo-600 transition-colors">{t("navShowcase")}</a>
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Credit Badge & Recharge Button (Enlarged & Prominent) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-300/90 text-amber-950 shadow-md shadow-amber-500/10">
              <span className="text-base leading-none">🎁</span>
              <span className="text-sm font-black tracking-tight">{credits > 0 ? `${credits}회 남음` : "0회"}</span>
              <button
                type="button"
                onClick={openPaymentModal}
                className="ml-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl transition-all duration-150 shadow-sm active:scale-95 flex items-center gap-1"
              >
                <span>⚡</span>
                <span>{t("rechargeButton")}</span>
              </button>
            </div>

            <LanguageSelector />

            <button
              onClick={scrollToUpload}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-slate-950/5 active:scale-[0.98]"
            >
              {t("navStart")}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-32 md:pb-20 px-6 max-w-7xl mx-auto text-center">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100/80 mb-8 animate-fade-in shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          {t("heroEyebrow")}
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6 max-w-4xl mx-auto text-balance">
          {t("heroTitleLine1")}<br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
            {t("heroTitleGradient")}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium mb-8 leading-relaxed text-balance">
          {t("heroSubheadline")}
        </p>

        {/* Category chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/80 text-slate-600 border border-slate-200/80 shadow-sm"
            >
              {cat.emoji} {getCategoryLabel(cat.id)}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-sm">
            {t("heroSheetChip")}
          </span>
        </div>

        {/* Primary CTA button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={scrollToUpload}
            className="group relative inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg px-8 py-4.5 rounded-2xl transition-all duration-300 shadow-xl shadow-slate-950/10 hover:shadow-2xl hover:shadow-indigo-500/20 active:scale-[0.98] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("heroCTA")}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </section>

      {/* Before-After Showcase Section */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="relative bg-white/60 backdrop-blur-md rounded-3xl border border-slate-100/80 p-6 sm:p-10 md:p-12 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {/* Before Card */}
          <div className="w-full md:w-5/12 flex flex-col items-center">
            <div className="relative w-60 h-60 sm:w-68 sm:h-68 rounded-2xl overflow-hidden shadow-md border-4 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <Image
                src="/images/selfie_before.png"
                alt="Original Selfie"
                fill
                sizes="(max-width: 768px) 240px, 272px"
                className="object-cover"
                priority
              />
              <div className="absolute bottom-3 left-3 bg-rose-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Before: {t("beforeLabel")}
              </div>
            </div>
          </div>

          {/* Connection Indicator */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 shadow-md text-indigo-600 animate-bounce">
              <svg className="w-6 h-6 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <span className="text-[10px] font-extrabold text-indigo-600 tracking-wider uppercase bg-indigo-50 px-2.5 py-0.5 rounded-full">
              ProShot AI
            </span>
          </div>

          {/* After Card */}
          <div className="w-full md:w-5/12 flex flex-col items-center">
            <div className="relative w-60 h-60 sm:w-68 sm:h-68 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-300 ring-4 ring-indigo-500/5">
              <Image
                src="/images/profile_after.png"
                alt="AI Generated Headshot"
                fill
                sizes="(max-width: 768px) 240px, 272px"
                className="object-cover"
                priority
              />
              <div className="absolute bottom-3 left-3 bg-indigo-600/95 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                After: {t("afterLabel")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload & Style Selection Section */}
      <section id="upload-section" className="max-w-5xl mx-auto px-6 pb-24 scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            {t("uploadTitle")}
          </h2>
        </div>
        <UploadCard />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-slate-100/40 border-y border-slate-100 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4 sm:text-4xl">
              {t("howItWorksTitle")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-100/80 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t("step1Title")}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {t("step1Desc")}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-100/80 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t("step2Title")}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {t("step2Desc")}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-100/80 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t("step3Title")}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {t("step3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Style Gallery / Showcase Section */}
      <section id="showcase" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4 sm:text-4xl">
            {t("showcaseTitle")}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            {t("showcaseSubtitle")}
          </p>
        </div>

        {/* Full style lineup */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto mb-16">
          {STYLES.map((style) => {
            const translatedLabel = STYLE_TRANSLATIONS[style.id]?.[language]?.label ?? style.label;
            const translatedDesc = STYLE_TRANSLATIONS[style.id]?.[language]?.description ?? style.description;
            return (
              <div
                key={style.id}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-indigo-100 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center"
              >
                <span className="text-3xl mb-2">{style.emoji}</span>
                <span className="text-sm font-bold text-slate-800 leading-tight">{translatedLabel}</span>
                <span className="text-[11px] text-slate-400 font-medium mt-1 leading-tight">
                  {translatedDesc}
                </span>
              </div>
            );
          })}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center text-center text-white">
            <span className="text-3xl mb-2">✍️</span>
            <span className="text-sm font-bold leading-tight">{t("catCustom")}</span>
            <span className="text-[11px] text-indigo-100 font-medium mt-1 leading-tight">
              {t("catCustomDesc")}
            </span>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="relative bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-16 text-center shadow-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-35" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-35" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 text-balance">
              {t("heroTitleGradient")}
            </h2>
            <p className="text-indigo-200 text-sm md:text-base mb-8 leading-relaxed max-w-lg mx-auto text-balance">
              {t("heroSubheadline")}
            </p>
            <button
              onClick={scrollToUpload}
              className="group relative inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-900 font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-white/5 hover:shadow-xl hover:shadow-white/10"
            >
              {t("heroCTA")}
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 font-outfit">ProShot</span>
            <span>— AI CITY BUILDERS</span>
          </div>
          <div>
            <p>© 2026 ProShot. {t("footerRights")}</p>
          </div>
        </div>
      </footer>

      {/* Payment Modal for Pay-per-use Single Pass */}
      <PaymentModal />

    </div>
  );
}
