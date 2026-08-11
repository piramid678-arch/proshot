"use client";

import React, { useState, useEffect } from "react";

interface ContentOutputEditorProps {
  platform: string;
  content: string;
  onContentChange: (val: string) => void;
  modelUsed?: string;
  onRegenerate?: () => void;
  isGenerating?: boolean;
}

export function ContentOutputEditor({
  platform,
  content,
  onContentChange,
  modelUsed,
  onRegenerate,
  isGenerating,
}: ContentOutputEditorProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "visual" | "raw">("preview");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Text-To-Speech (TTS) State for YouTube & Reels Audio Preview
  const [isPlayingTTS, setIsPlayingTTS] = useState<boolean>(false);

  useEffect(() => {
    // Stop speech when content or tab changes
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
    }
  }, [content, platform]);

  // Statistics calculation
  const charCountWithSpace = content.length;
  const charCountNoSpace = content.replace(/\s/g, "").length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const estVideoTimeSec = Math.ceil(charCountNoSpace / 6); // Avg 6 chars per sec for Korean voiceover

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleDownloadText = (ext: "md" | "txt" = "md") => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creator_${platform}_${new Date().toISOString().slice(0, 10)}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Plain speech text extractor for YouTube voiceover
  const extractSpeechText = (raw: string) => {
    return raw
      .replace(/\[시각 연출:[^\]]*\]/g, "") // Remove visual director notes
      .replace(/\[화면:[^\]]*\]/g, "")
      .replace(/\[BGM:[^\]]*\]/g, "")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .trim();
  };

  // TTS Speech Synthesis Toggle
  const handleToggleTTS = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("현재 브라우저에서 음성 합성(TTS) 기능을 지원하지 않습니다.");
      return;
    }

    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
    } else {
      const textToSpeak = extractSpeechText(content);
      if (!textToSpeak) {
        alert("읽을 오디오 멘트가 없습니다.");
        return;
      }
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "ko-KR";
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingTTS(false);
      utterance.onerror = () => setIsPlayingTTS(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingTTS(true);
    }
  };

  // Naver / Social Clean Text Copy
  const handleCleanCopy = () => {
    const cleanText = content
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/^>\s+/gm, "💬 ");
    copyToClipboard(cleanText, "clean");
  };

  // Formatter for Preview HTML
  const formatMarkdownToHtml = (md: string) => {
    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Highlight Visual/Director tags [시각 연출: ...]
    html = html.replace(
      /\[시각 연출:\s*(.*?)\]/gim,
      '<span class="inline-block bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs px-2.5 py-1 rounded-lg my-1 font-mono">🎬 시각 연출: $1</span>'
    );
    html = html.replace(
      /\[화면:\s*(.*?)\]/gim,
      '<span class="inline-block bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs px-2.5 py-1 rounded-lg my-1 font-mono">🎥 화면: $1</span>'
    );

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-indigo-300 mt-5 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-extrabold text-white border-b border-slate-800 pb-2 mt-6 mb-3 flex items-center gap-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-indigo-400 mt-4 mb-4">$1</h1>');

    // Blockquotes
    html = html.replace(/^&gt;\s+(.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 bg-slate-900/80 p-3.5 my-3 rounded-r-xl italic text-slate-300">$1</blockquote>');

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-amber-300 bg-amber-950/40 px-1 rounded">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-300">$1</em>');

    // Lists
    html = html.replace(/^\-\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-300 my-1">$1</li>');

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="my-3 leading-relaxed text-slate-200 text-base font-sans">');

    return `<div class="prose prose-invert max-w-none"><p class="my-3 leading-relaxed text-slate-200 text-base font-sans">${html}</p></div>`;
  };

  // Helper to parse slides for Instagram or Threads/X card visualization
  const parseVisualCards = (raw: string) => {
    const lines = raw.split("\n");
    const cards: { title: string; content: string[] }[] = [];
    let currentCard: { title: string; content: string[] } | null = null;

    for (const line of lines) {
      if (
        line.match(/^(slide|슬라이드|\d+\/|#|\d+\.)/i) ||
        line.startsWith("🧵") ||
        line.startsWith("Slide")
      ) {
        if (currentCard) cards.push(currentCard);
        currentCard = { title: line.replace(/^#+\s*/, ""), content: [] };
      } else if (currentCard) {
        if (line.trim()) currentCard.content.push(line);
      } else {
        if (!currentCard && line.trim()) {
          currentCard = { title: "인트로 훅", content: [line] };
        }
      }
    }
    if (currentCard) cards.push(currentCard);
    return cards.length > 0 ? cards : [{ title: "포스팅 원고", content: [raw] }];
  };

  const visualCards = parseVisualCards(content);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all">
      {/* Top Header Toolbar */}
      <div className="bg-slate-950 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center text-xl">
              ✨
            </div>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>AI 크리에이터 원고 스튜디오</span>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                {platform.toUpperCase()}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {modelUsed ? `LM Studio Model: ${modelUsed}` : "완성된 대본 및 콘텐츠를 확인하세요"}
            </p>
          </div>
        </div>

        {/* View Mode Switch Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "preview"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            👁️ 전체 텍스트
          </button>
          <button
            onClick={() => setActiveTab("visual")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "visual"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🎴 카드로 보기 (카드뉴스/타래)
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "raw"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            📝 에디터 직접 수정
          </button>
        </div>
      </div>

      {/* Analytics & Voiceover Bar */}
      <div className="bg-slate-950/60 border-b border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white">{charCountWithSpace.toLocaleString()}</span>
            <span>자</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white">{wordCount.toLocaleString()}</span>
            <span>단어</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
            <span>⏱️ 예상 영상/낭독 시간: 약 {estVideoTimeSec}초 ({Math.ceil(estVideoTimeSec / 60)}분)</span>
          </div>
        </div>

        {/* TTS & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* TTS Audio Player for YouTube/Reels */}
          {(platform === "youtube" || platform === "instagram") && (
            <button
              onClick={handleToggleTTS}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                isPlayingTTS
                  ? "bg-rose-600 text-white border-rose-500 animate-pulse"
                  : "bg-purple-950/60 border-purple-500/40 text-purple-300 hover:bg-purple-900/60"
              }`}
            >
              <span>{isPlayingTTS ? "🔊 낭독 정지" : "🎙️ 오디오 음성 낭독 (TTS)"}</span>
            </button>
          )}

          <button
            onClick={handleCleanCopy}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              copiedType === "clean"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60"
            }`}
          >
            {copiedType === "clean" ? "✅ 복사 완료!" : "📋 텍스트 깔끔 복사"}
          </button>

          <button
            onClick={() => copyToClipboard(content, "md")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              copiedType === "md"
                ? "bg-indigo-600 text-white border-indigo-500"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            {copiedType === "md" ? "✅ 마크다운 복사!" : "📄 마크다운 복사"}
          </button>

          <button
            onClick={() => handleDownloadText("md")}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            💾 다운로드
          </button>
        </div>
      </div>

      {/* Main Content Display Area */}
      <div className="p-6 min-h-[450px] max-h-[700px] overflow-y-auto bg-slate-900/90">
        {activeTab === "preview" && (
          <div
            className="leading-relaxed font-sans"
            dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(content) }}
          />
        )}

        {activeTab === "visual" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>카드 슬라이드 / 포스트 뷰어 (총 {visualCards.length}개 카드로 분할됨)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visualCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3 relative group hover:border-indigo-500/50 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-extrabold text-indigo-400">
                      카드 #{idx + 1}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${card.title}\n\n${card.content.join("\n")}`,
                          `card-${idx}`
                        )
                      }
                      className="text-[11px] px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      {copiedType === `card-${idx}` ? "✅ 복사됨" : "복사"}
                    </button>
                  </div>
                  <h4 className="font-bold text-white text-sm">{card.title}</h4>
                  <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                    {card.content.map((cLine, i) => (
                      <p key={i}>{cLine}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "raw" && (
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full h-[500px] p-4 font-mono text-sm border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950 text-slate-200 leading-relaxed"
            placeholder="생성된 대본/원고를 직접 수정하세요..."
          />
        )}
      </div>

      {/* Bottom Re-generate / Polish Bar */}
      {onRegenerate && (
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            결과물이 마음에 드시나요? 추가 가이드를 주거나 다시 생성할 수 있습니다.
          </p>
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>🔄</span> {isGenerating ? "생성 중..." : "다시 생성하기"}
          </button>
        </div>
      )}
    </div>
  );
}
