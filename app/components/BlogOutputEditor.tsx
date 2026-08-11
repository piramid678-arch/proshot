"use client";

import React, { useState } from "react";

interface BlogOutputEditorProps {
  content: string;
  onContentChange: (val: string) => void;
  modelUsed?: string;
  onRegenerate?: () => void;
  isGenerating?: boolean;
}

export function BlogOutputEditor({
  content,
  onContentChange,
  modelUsed,
  onRegenerate,
  isGenerating,
}: BlogOutputEditorProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "raw" | "html">("preview");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Statistics calculation
  const charCountWithSpace = content.length;
  const charCountNoSpace = content.replace(/\s/g, "").length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 180));

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blog_post_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Naver Blog Optimized Copy (Plaintext with preserved paragraph breaks)
  const handleNaverCopy = () => {
    // Strip markdown symbols gently while keeping paragraph breaks & emojis
    const cleanNaverText = content
      .replace(/^#{1,6}\s+/gm, "") // remove heading #
      .replace(/\*\*(.*?)\*\*/g, "$1") // remove bold **
      .replace(/\*(.*?)\*/g, "$1") // remove italic *
      .replace(/`(.*?)`/g, "$1") // remove inline code `
      .replace(/^>\s+/gm, "💬 "); // replace blockquote > with quote emoji

    copyToClipboard(cleanNaverText, "naver");
  };

  // Markdown to simple HTML converter for HTML view
  const formatMarkdownToHtml = (md: string) => {
    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-slate-800 mt-6 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-extrabold text-slate-900 border-b border-slate-200 pb-2 mt-8 mb-3">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-indigo-950 mt-4 mb-4">$1</h1>');

    // Blockquotes
    html = html.replace(/^&gt;\s+(.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 bg-indigo-50/50 p-4 my-4 rounded-r-xl italic text-slate-700">$1</blockquote>');

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 bg-amber-50 px-1 rounded">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');

    // Lists
    html = html.replace(/^\-\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-700 my-1">$1</li>');

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="my-3 leading-relaxed text-slate-700 text-base font-sans">');

    return `<div class="prose max-w-none"><p class="my-3 leading-relaxed text-slate-700 text-base font-sans">${html}</p></div>`;
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col transition-all">
      {/* Top Bar / Actions */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-lg shadow-md shadow-indigo-500/30">
            ✍️
          </div>
          <div>
            <h3 className="text-base font-extrabold tracking-tight">AI 생성 결과 스튜디오</h3>
            <p className="text-xs text-slate-400">
              {modelUsed ? `LM Studio Model: ${modelUsed}` : "완성된 원고를 확인하고 바로 복사하세요"}
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "preview"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            👁️ 실시간 프리뷰
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "raw"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            📝 마크다운 에디터
          </button>
          <button
            onClick={() => setActiveTab("html")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "html"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🌐 HTML 소스
          </button>
        </div>
      </div>

      {/* Analytics Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900">{charCountWithSpace.toLocaleString()}</span>
            <span>자 (공백 포함)</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900">{charCountNoSpace.toLocaleString()}</span>
            <span>자 (공백 제외)</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900">{wordCount.toLocaleString()}</span>
            <span>단어</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-300" />
          <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
            <span>⏱️ 예상 읽기: 약 {readingTimeMin}분</span>
          </div>
        </div>

        {/* Copy Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNaverCopy}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              copiedType === "naver"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
            }`}
          >
            {copiedType === "naver" ? "✅ 네이버 복사완료!" : "🟢 네이버 블로그 맞춤 복사"}
          </button>

          <button
            onClick={() => copyToClipboard(content, "md")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              copiedType === "md"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
            }`}
          >
            {copiedType === "md" ? "✅ 마크다운 복사완료!" : "📄 마크다운 복사"}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            💾 .md 다운로드
          </button>
        </div>
      </div>

      {/* Editor Main Content Body */}
      <div className="p-6 min-h-[450px] max-h-[700px] overflow-y-auto bg-white">
        {activeTab === "preview" && (
          <div
            className="prose prose-indigo max-w-none text-slate-800 leading-relaxed font-sans"
            dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(content) }}
          />
        )}

        {activeTab === "raw" && (
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full h-[500px] p-4 font-mono text-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 leading-relaxed"
            placeholder="생성된 포스팅 마크다운을 직접 수정하세요..."
          />
        )}

        {activeTab === "html" && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button
                onClick={() => copyToClipboard(formatMarkdownToHtml(content), "html")}
                className="px-3 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100"
              >
                {copiedType === "html" ? "✅ HTML 복사 완료" : "HTML 소스 복사"}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 text-slate-100 font-mono text-xs rounded-2xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[450px]">
              {formatMarkdownToHtml(content)}
            </pre>
          </div>
        )}
      </div>

      {/* Bottom Re-generate / Polish Bar */}
      {onRegenerate && (
        <div className="bg-slate-50 border-t border-slate-200/80 p-4 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            글 내용이 마음에 들지 않나요? 어조나 옵션을 조절하여 다시 생성해 보세요.
          </p>
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>🔄</span> {isGenerating ? "다시 생성 중..." : "글 다시 생성하기"}
          </button>
        </div>
      )}
    </div>
  );
}
