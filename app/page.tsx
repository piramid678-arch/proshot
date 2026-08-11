"use client";

import React, { useState, useRef } from "react";
import { useLanguage } from "./context/LanguageContext";
import UploadCard from "./components/UploadCard";
import LanguageSelector from "./components/LanguageSelector";
import {
  PLATFORMS,
  CONTENT_TYPES,
  TONES,
  LENGTHS,
  ContentTemplate,
} from "./lib/templates";
import { TemplateSelector } from "./components/TemplateSelector";
import { ContentOutputEditor } from "./components/ContentOutputEditor";

type AppTab = "auto_script" | "trend_discovery" | "photo_studio";

interface TrendingItem {
  id: string;
  rank: number;
  title: string;
  category: string;
  viewsOrGrowth: string;
  platform: "youtube" | "tiktok" | "instagram" | "community";
  suggestedPrompt: string;
  badge?: string;
}

const TRENDING_MOCK_ITEMS: TrendingItem[] = [
  {
    id: "tr-1",
    rank: 1,
    title: "2026년 청년 도약 계좌 및 지원금 신청 자격 총정리",
    category: "금융 & 정보",
    viewsOrGrowth: "조회수 120만 · +45만/일",
    platform: "youtube",
    suggestedPrompt: "2026년 청년 도약 계좌 조건 및 지원금 신청 가이드. (초반 3초 훅 + 핵심 요약)",
    badge: "🔥 급상승 1위",
  },
  {
    id: "tr-2",
    rank: 2,
    title: "편의점 꿀조합 레시피 3가지 (먹자마자 감탄 나오는 미친 맛)",
    category: "푸드 & 숏폼",
    viewsOrGrowth: "조회수 98만 · +38만/일",
    platform: "tiktok",
    suggestedPrompt: "편의점 꿀조합 레시피 TOP 3. 15초 세로 대본 (자막 + 시각 연출 지침)",
    badge: "⚡ 틱톡 인기",
  },
  {
    id: "tr-3",
    rank: 3,
    title: "성수동 신상 감성 카페 탐방 및 릴스 인생샷 명소",
    category: "일상 & 릴스",
    viewsOrGrowth: "조회수 85만 · +29만/일",
    platform: "instagram",
    suggestedPrompt: "성수동 카페거리 신상 카페 탐방 릴스 대본 및 본문 캡션/해시태그",
    badge: "📸 릴스 바이럴",
  },
  {
    id: "tr-4",
    rank: 4,
    title: "연봉 3,000만 원에서 1억 만든 이직 & 자기계발 법칙 3가지",
    category: "커리어 & 스레드",
    viewsOrGrowth: "좋아요 4.2만 · 리트윗 1.8만",
    platform: "community",
    suggestedPrompt: "연봉 3,000에서 1억 올린 직장인의 자기계발 3가지 규칙 스레드 타래",
    badge: "🧵 스레드 핫이슈",
  },
];

export default function PixelingStudioPage() {
  const { t, credits, openPaymentModal, consumeCredit } = useLanguage();
  const [activeTab, setActiveTab] = useState<AppTab>("photo_studio");

  // Script Generator Form State
  const [activePlatform, setActivePlatform] = useState<string>("youtube");
  const [contentType, setContentType] = useState<string>("shorts_script");
  const [prompt, setPrompt] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [tone, setTone] = useState<string>("viral_hook");
  const [length, setLength] = useState<string>("medium");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);

  // Handle Quick Conversion from Trend Item
  const handleQuickTrendConvert = (item: TrendingItem) => {
    setActiveTab("auto_script");
    if (item.platform === "youtube") {
      setActivePlatform("youtube");
      setContentType("shorts_script");
    } else if (item.platform === "tiktok") {
      setActivePlatform("tiktok");
      setContentType("tiktok_script");
    } else if (item.platform === "instagram") {
      setActivePlatform("instagram");
      setContentType("reels_script");
    } else {
      setActivePlatform("threads");
      setContentType("thread_chain");
    }
    setPrompt(item.suggestedPrompt);
  };

  // Select Template Handler
  const handleSelectTemplate = (tmpl: ContentTemplate) => {
    setSelectedTemplateId(tmpl.id);
    setActivePlatform(tmpl.platform);
    if (tmpl.contentType) setContentType(tmpl.contentType);
    setPrompt(tmpl.suggestedPrompt);
    setKeywords(tmpl.suggestedKeywords);
    setTone(tmpl.suggestedTone);
  };

  // Generate Script Handler
  const handleGenerateScript = async () => {
    if (!prompt.trim()) {
      alert("제작하려는 콘텐츠 주제나 아이디어를 입력해 주세요!");
      return;
    }

    const hasCredit = consumeCredit();
    if (!hasCredit) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          keywords,
          platform: activePlatform,
          contentType,
          tone,
          length,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "원고 생성에 실패했습니다.");
      }

      setGeneratedResult(data.result);

      // Smooth scroll to output
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setGenerationError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentPlatformObj = PLATFORMS.find((p) => p.id === activePlatform);
  const currentContentTypes = CONTENT_TYPES[activePlatform] || [];

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
                ⚡
              </div>
            </div>
            <div>
              <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                PulseCraft AI
              </span>
              <span className="ml-2.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full">
                All-in-One Creator Suite
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab("photo_studio")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === "photo_studio"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <span>🎨</span>
              <span>ProShot AI 포토 스튜디오</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("auto_script")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === "auto_script"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <span>🚀</span>
              <span>올인원 원고 생성</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("trend_discovery")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === "trend_discovery"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <span>📈</span>
              <span>바이럴 트렌드 픽</span>
            </button>
          </nav>

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

        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex border-t border-slate-800 bg-slate-950 p-2 gap-1 justify-around text-xs font-bold">
          <button
            onClick={() => setActiveTab("photo_studio")}
            className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-1 ${
              activeTab === "photo_studio" ? "bg-indigo-600 text-white" : "text-slate-400"
            }`}
          >
            <span>🎨</span>
            <span>포토 스튜디오</span>
          </button>
          <button
            onClick={() => setActiveTab("auto_script")}
            className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-1 ${
              activeTab === "auto_script" ? "bg-indigo-600 text-white" : "text-slate-400"
            }`}
          >
            <span>🚀</span>
            <span>원고 생성</span>
          </button>
          <button
            onClick={() => setActiveTab("trend_discovery")}
            className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-1 ${
              activeTab === "trend_discovery" ? "bg-indigo-600 text-white" : "text-slate-400"
            }`}
          >
            <span>📈</span>
            <span>트렌드 픽</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* TAB 1: 🚀 올인원 콘텐츠 자동 생성 (Automation Script Studio) */}
        {activeTab === "auto_script" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Hero Sub-header */}
            <section className="text-center space-y-3 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-xl">
                <span>🤖 2026 GEO(생성형 엔진 최적화) & 바이럴 알고리즘 탑재</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                주제 한 줄이면 유튜브·틱톡·인스타·스레드·X부터 <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300">
                  GEO & SEO AI 답변 엔진 최적화 원고까지 완벽 자동 완성
                </span>
              </h1>
            </section>

            {/* Platform Selector Grid */}
            <section className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>🎯</span>
                <span>1. 생성할 SNS / 영상 플랫폼 선택</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {PLATFORMS.map((p) => {
                  const isActive = activePlatform === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePlatform(p.id);
                        setSelectedTemplateId(null);
                      }}
                      type="button"
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between backdrop-blur-md relative overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-br from-indigo-900/90 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-500/30 text-white"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{p.icon}</span>
                        {p.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <div className="mt-2.5 space-y-1">
                        <h3 className="font-bold text-xs sm:text-sm text-white">{p.label}</h3>
                      </div>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Template Presets Gallery */}
            <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md shadow-2xl">
              <TemplateSelector
                activePlatform={activePlatform}
                selectedTemplateId={selectedTemplateId}
                onSelectTemplate={handleSelectTemplate}
              />
            </section>

            {/* Generator Main Controls Form */}
            <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentPlatformObj?.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {currentPlatformObj?.label} 상세 맞춤 설정
                    </h3>
                    <p className="text-xs text-slate-400">
                      주제를 적고 원클릭으로 바이럴 대본 및 연출 가이드를 받아보세요
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Segment & Topic Prompt */}
                <div className="lg:col-span-2 space-y-5">
                  {/* Content Segment */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      2. 콘텐츠 세부 서식 (Segment)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentContentTypes.map((ct) => (
                        <button
                          key={ct.id}
                          onClick={() => setContentType(ct.id)}
                          type="button"
                          className={`p-3 rounded-xl border text-left transition-all text-xs font-semibold flex items-center justify-between ${
                            contentType === ct.id
                              ? "bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-md"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{ct.icon}</span>
                            <span>{ct.label}</span>
                          </div>
                          {contentType === ct.id && <span className="text-indigo-400">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Topic Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      <span>3. 기획 주제 및 상세 요청</span>
                    </label>
                    <textarea
                      rows={4}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="예: 2026년 청년 도약 계좌 혜택 및 신청 조건. (초반 3초 훅 + 가독성 높은 정리)"
                      className="w-full p-4 text-sm font-sans border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950 text-white placeholder-slate-600 leading-relaxed shadow-inner"
                    />
                  </div>
                </div>

                {/* Right Col: Tone & Generate Button */}
                <div className="space-y-5 bg-slate-950/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Tone Select */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        4. 어조 & 스타일 (Tone)
                      </label>
                      <div className="space-y-2">
                        {TONES.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setTone(t.id)}
                            type="button"
                            className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                              tone === t.id
                                ? "bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-md"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                            }`}
                          >
                            <div>
                              <div className="font-bold text-white">{t.label}</div>
                            </div>
                            {tone === t.id && <span className="text-indigo-400 font-bold">✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Length Select */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        5. 목표 분량 (Length)
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {LENGTHS.map((l) => (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => setLength(l.id)}
                            className={`p-2 rounded-xl text-center text-xs font-bold transition-all border ${
                              length === l.id
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {l.id === "short" ? "⚡ 숏폼" : l.id === "medium" ? "📝 표준" : "📚 장문"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3 border-t border-slate-800">
                    <button
                      onClick={handleGenerateScript}
                      disabled={isGenerating}
                      type="button"
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>AI 바이럴 원고 자동 생성 중...</span>
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          <span>원클릭 올인원 원고 즉시 생성하기</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Error Display */}
            {generationError && (
              <div className="bg-rose-950/80 border border-rose-500/50 rounded-3xl p-6 text-rose-200 text-sm space-y-2 shadow-2xl">
                <div className="font-extrabold flex items-center gap-2 text-rose-300 text-base">
                  <span>⚠️</span> 원고 생성 처리 오류
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{generationError}</p>
              </div>
            )}

            {/* Output Display */}
            <div ref={outputRef}>
              {generatedResult && (
                <ContentOutputEditor
                  platform={activePlatform}
                  content={generatedResult}
                  onContentChange={setGeneratedResult}
                  modelUsed="PulseCraft AI Engine (Gemini Pro)"
                  onRegenerate={handleGenerateScript}
                  isGenerating={isGenerating}
                />
              )}
            </div>
          </div>
        )}

        {/* TAB 2: 📈 실시간 바이럴 트렌드 픽 (Trend Discovery) */}
        {activeTab === "trend_discovery" && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                <span>🔥 실시간 탐색 ➔ 원클릭 대본 즉시 변환</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                요즘 알고리즘이 밀어주는 실시간 바이럴 트렌드
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                트렌딩 주제를 클릭하면 AI가 대본과 카드뉴스 원고를 자동으로 변환하여 즉시 생성합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TRENDING_MOCK_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {item.badge}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{item.viewsOrGrowth}</span>
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
                    <p className="text-xs text-slate-400">카테고리: {item.category}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickTrendConvert(item)}
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>⚡</span>
                    <span>이 주제로 1초 만에 바이럴 대본 생성하기</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 🎨 4대 AI 비주얼 & 미디어 스튜디오 (4-in-1 AI Visual Studio) */}
        {activeTab === "photo_studio" && (
          <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-xl">
                <span>🎨 4대 AI 비주얼 & 미디어 그래픽 스튜디오</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                크리에이터를 위한 4가지 핵심 비주얼 그래픽 도구
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                유튜브 썸네일, AI 프로필 캐릭터, 카드뉴스 그래픽, 4K 규격 인화 시트까지 한곳에서 생성하세요.
              </p>
            </div>

            {/* 4 Core Visual Tool Features Showcase Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xl font-bold">
                  📸
                </div>
                <h3 className="font-extrabold text-sm text-white">1. AI 썸네일 & 표지</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  유튜브 숏폼/롱폼, 틱톡, 릴스용 시선 강탈 썸네일 레이아웃 생성
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xl font-bold">
                  👤
                </div>
                <h3 className="font-extrabold text-sm text-white">2. 크리에이터 아바타</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  셀카 기반 비즈니스 헤드샷, 3D 캐릭터, 프로필 화보 변환
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-600/20 text-pink-400 flex items-center justify-center text-xl font-bold">
                  🖼️
                </div>
                <h3 className="font-extrabold text-sm text-white">3. 카드뉴스 슬라이드</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  인스타그램 1~10번 슬라이드 이미지 규격 텍스트 배치 디자인
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
                  🖨️
                </div>
                <h3 className="font-extrabold text-sm text-white">4. 4K 고화질 내보내기</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  증명사진/여권/에셋 4K 시트 자동 인화 및 단일 다운로드
                </p>
              </div>
            </div>

            {/* AI Avatar & Portrait Creation Component */}
            <div className="pt-4">
              <UploadCard />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>PulseCraft AI — Next-Gen All-in-One Creator Automation Platform</p>
        <p className="mt-1 text-[11px] text-slate-600">
          YouTube · TikTok · Instagram · Threads · X · Blog · 4-in-1 AI Visual Studio
        </p>
      </footer>
    </div>
  );
}

