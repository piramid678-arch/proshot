"use client";

import { useMemo, useRef, useState, ChangeEvent } from "react";
import { useLanguage } from "../context/LanguageContext";
import { STYLE_TRANSLATIONS } from "../lib/i18n";
import {
  BG_COLORS,
  CATEGORIES,
  STYLES,
  getStyle,
  type BgColor,
  type CategoryId,
} from "../lib/styles";
import { PRINT_SIZES, generatePhotoSheet, type PrintSize } from "../lib/photoSheet";
import CompareSlider from "./CompareSlider";

interface ModelSuccessResult {
  success: true;
  imageUrl: string;
  timeSec: string;
}

interface ModelErrorResult {
  success: false;
  error: string;
}

type ModelResult = ModelSuccessResult | ModelErrorResult;

interface GenerationResult {
  lite: ModelResult;
  pro: ModelResult;
}

export default function UploadCard() {
  const { language, t, consumeCredit } = useLanguage();

  const [selfieBase64, setSelfieBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryId>("business");
  const [selectedStyleId, setSelectedStyleId] = useState<string>("corporate");
  const [bgColor, setBgColor] = useState<BgColor>("white");
  const [customPrompt, setCustomPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [usedStyleId, setUsedStyleId] = useState<string>("corporate");
  const [printSizeId, setPrintSizeId] = useState<string>(PRINT_SIZES[1].id);
  const [isSheetGenerating, setIsSheetGenerating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const FUN_STYLE_IDS = useMemo(() => STYLES.filter((s) => s.category === "fun").map((s) => s.id), []);

  const stylesInCategory = useMemo(
    () => STYLES.filter((s) => s.category === category),
    [category]
  );

  const selectedStyle = getStyle(selectedStyleId);
  const usedStyle = getStyle(usedStyleId);

  const getCategoryLabel = (catId: CategoryId) => {
    switch (catId) {
      case "business": return t("catBusiness");
      case "id": return t("catId");
      case "fun": return t("catFun");
      case "custom": return t("catCustom");
      default: return catId;
    }
  };

  const getCategoryDesc = (catId: CategoryId) => {
    switch (catId) {
      case "business": return t("catBusinessDesc");
      case "id": return t("catIdDesc");
      case "fun": return t("catFunDesc");
      case "custom": return t("catCustomDesc");
      default: return "";
    }
  };

  const getTranslatedStyle = (styleId: string) => {
    const s = getStyle(styleId);
    if (!s) return null;
    const tr = STYLE_TRANSLATIONS[styleId]?.[language];
    return {
      ...s,
      label: tr?.label ?? s.label,
      description: tr?.description ?? s.description,
    };
  };

  const getBgLabel = (bgId: BgColor) => {
    switch (bgId) {
      case "white": return t("bgWhite");
      case "blue": return t("bgBlue");
      case "gray": return t("bgGray");
      default: return bgId;
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFile(files[0]);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(t("errorNoSelfie"));
      setSelfieBase64(null);
      setFileName(null);
      return;
    }

    const maxSize = 8 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(t("fileSupportInfo"));
      setSelfieBase64(null);
      setFileName(null);
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setSelfieBase64(reader.result);
      } else {
        setError(t("errorNoSelfie"));
      }
    };
    reader.onerror = () => {
      setError(t("errorNoSelfie"));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    processFile(files[0]);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelfieBase64(null);
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const selectCategory = (id: CategoryId) => {
    setCategory(id);
    if (id === "custom") {
      setSelectedStyleId("custom");
    } else {
      const first = STYLES.find((s) => s.category === id);
      if (first) setSelectedStyleId(first.id);
    }
  };

  const pickRandomFunStyle = () => {
    const pool = FUN_STYLE_IDS.filter((id) => id !== selectedStyleId);
    const picked = pool[Math.floor(Math.random() * pool.length)] ?? FUN_STYLE_IDS[0];
    setCategory("fun");
    setSelectedStyleId(picked);
  };

  const handleSubmit = async () => {
    if (!selfieBase64) return;
    if (selectedStyleId === "custom" && !customPrompt.trim()) {
      setError(t("errorCustomEmpty"));
      return;
    }

    const hasCredit = consumeCredit();
    if (!hasCredit) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: selfieBase64,
          styleId: selectedStyleId,
          bgColor,
          customPrompt: selectedStyleId === "custom" ? customPrompt.trim() : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI Error");
      }

      setUsedStyleId(selectedStyleId);
      setResult({
        lite: data.lite,
        pro: data.pro,
      });
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || t("errorNoSelfie"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (imageUrl: string, label: string) => {
    try {
      const blob = await (await fetch(imageUrl)).blob();
      const file = new File([blob], `proshot_${usedStyleId}.png`, { type: blob.type });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `ProShot — ${label}`,
          text: "ProShot AI",
          files: [file],
        });
      } else {
        await navigator.clipboard?.write?.([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        alert("Image copied to clipboard!");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error(err);
    }
  };

  const handleSheetDownload = async () => {
    if (!result) return;
    const best = result.pro.success ? result.pro : result.lite.success ? result.lite : null;
    if (!best) return;
    const size = PRINT_SIZES.find((s) => s.id === printSizeId) ?? PRINT_SIZES[1];

    setIsSheetGenerating(true);
    try {
      const { dataUrl, count } = await generatePhotoSheet(best.imageUrl, size);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `proshot_sheet_${size.id}_${count}cut.png`;
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSheetGenerating(false);
    }
  };

  const resetForNewStyle = () => {
    setResult(null);
    setError(null);
  };

  const resetAll = () => {
    setResult(null);
    setSelfieBase64(null);
    setFileName(null);
    setError(null);
    setCustomPrompt("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center min-h-[380px]">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">
            {selectedStyle?.emoji ?? "✨"}
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 transition-all">
          {t("generatingButton")}
        </h3>
      </div>
    );
  }

  // 2. Result View
  if (result) {
    const bestResult = result.pro.success ? result.pro : result.lite.success ? result.lite : null;
    const translatedUsed = getTranslatedStyle(usedStyleId);
    const usedLabel = usedStyleId === "custom" ? t("catCustom") : translatedUsed?.label ?? "Headshot";
    const isPrintable = usedStyle?.printable ?? false;

    return (
      <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl border border-slate-100/80 p-6 sm:p-8 md:p-10 shadow-2xl shadow-slate-300/40">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 mb-3 shadow-sm">
            {usedStyle?.emoji ?? "✨"} {usedLabel}
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t("resultTitle")}</h3>
          <p className="text-xs text-slate-500 mt-1">{t("resultDesc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {[
            {
              key: "lite" as const,
              data: result.lite,
              name: "Gemini 3.1 Flash Lite ⚡",
              tag: t("liteTag"),
              nameClass: "text-indigo-700 bg-indigo-50",
              btnClass: "bg-slate-900 hover:bg-slate-800",
            },
            {
              key: "pro" as const,
              data: result.pro,
              name: "Gemini 3 Pro ✨",
              tag: t("proTag"),
              nameClass: "text-violet-700 bg-violet-50",
              btnClass: "bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/10",
            },
          ].map((card) => (
            <div
              key={card.key}
              className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 flex flex-col items-center shadow-sm"
            >
              <div className="w-full flex items-center justify-between mb-4">
                <span className={`text-sm font-bold px-3 py-1 rounded-xl ${card.nameClass}`}>
                  {card.name}
                </span>
                <span className="text-[11px] font-bold text-slate-400">{card.tag}</span>
              </div>

              {card.data.success ? (
                <>
                  <div className="relative w-full aspect-[3/4] max-w-[240px] rounded-xl overflow-hidden shadow-md border-2 border-white ring-4 ring-slate-100 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.data.imageUrl}
                      alt={`${card.name} Result`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="w-full flex gap-2">
                    <a
                      href={card.data.imageUrl}
                      download={`proshot_${card.key}_${usedStyleId}.png`}
                      className={`flex-1 text-white text-xs font-bold py-3 px-4 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors ${card.btnClass}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {t("downloadSingle")}
                    </a>
                    <button
                      onClick={() => card.data.success && handleShare(card.data.imageUrl, usedLabel)}
                      className="bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-600 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {t("share")}
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full flex-grow flex flex-col items-center justify-center p-6 border-2 border-dashed border-rose-100 rounded-xl bg-rose-50/20 text-center min-h-[280px]">
                  <h4 className="text-xs font-extrabold text-rose-800 uppercase mb-1">Error</h4>
                  <p className="text-[11px] font-bold text-rose-600 px-2 leading-relaxed max-w-xs">
                    {card.data.error}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Before / After Slider */}
        {selfieBase64 && bestResult && (
          <div className="mb-8">
            <div className="text-center mb-4">
              <h4 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {t("beforeLabel")} vs {t("afterLabel")}
              </h4>
            </div>
            <div className="max-w-[320px] mx-auto">
              <CompareSlider
                beforeSrc={selfieBase64}
                afterSrc={bestResult.imageUrl}
                beforeLabel={t("beforeLabel")}
                afterLabel={usedLabel}
              />
            </div>
          </div>
        )}

        {/* Print Sheet Generator */}
        {isPrintable && bestResult && (
          <div className="mb-8 bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-2xl border border-indigo-100/60 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🖨️</span>
              <h4 className="text-base font-extrabold text-slate-900 tracking-tight">{t("downloadSheet")}</h4>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch mt-4">
              <div className="flex-1 grid grid-cols-3 gap-2">
                {PRINT_SIZES.map((size: PrintSize) => {
                  const selected = printSizeId === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setPrintSizeId(size.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selected
                          ? "border-indigo-600 bg-white shadow-sm ring-2 ring-indigo-500/10"
                          : "border-slate-200/80 bg-white/60 hover:bg-white"
                      }`}
                    >
                      <p className="text-xs font-extrabold text-slate-800">{size.label}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{size.note}</p>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={handleSheetDownload}
                disabled={isSheetGenerating}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                {isSheetGenerating ? t("generatingButton") : t("downloadSheet")}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetForNewStyle}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm active:scale-[0.98]"
          >
            {t("step2")}
          </button>
          <button
            onClick={resetAll}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm active:scale-[0.98]"
          >
            {t("changePhoto")}
          </button>
        </div>
      </div>
    );
  }

  // 3. Selection & Upload View
  return (
    <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl border border-slate-100/80 p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/50">
      {error && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs sm:text-sm font-medium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl">✨</span>
            <div>
              <p className="font-bold text-amber-950">AI 엔진을 준비 중입니다</p>
              <p className="text-xs text-amber-800/90 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 active:scale-95 self-end sm:self-center"
          >
            다시 시도하기 ↺
          </button>
        </div>
      )}

      {/* Step 1: Selfie Upload */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs items-center justify-center">
            1
          </span>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            {t("step1")}
          </h3>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {!selfieBase64 ? (
          <div
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 flex flex-col items-center justify-center ${
              isDragging
                ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]"
                : "border-slate-200 hover:border-indigo-400 bg-slate-50/40 hover:bg-slate-50/80"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl mb-4 shadow-sm">
              📷
            </div>
            <p className="text-slate-800 text-sm sm:text-base font-bold mb-1">
              {t("dragDropText")}
            </p>
            <p className="text-slate-400 text-xs font-medium">
              {t("fileSupportInfo")}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-sm border border-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selfieBase64}
                  alt="Uploaded Selfie"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 max-w-[180px] sm:max-w-xs truncate">
                  {fileName ?? "selfie.png"}
                </p>
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                  ✓ Ready
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={triggerFileInput}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-all"
              >
                {t("changePhoto")}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold px-3 py-2 rounded-xl transition-all"
              >
                {t("removePhoto")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Category & Style Selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs items-center justify-center">
              2
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              {t("step2")}
            </h3>
          </div>
          {category === "fun" && (
            <button
              type="button"
              onClick={pickRandomFunStyle}
              className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
            >
              {t("randomFunStyle")}
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => selectCategory(cat.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-base">{cat.emoji}</span>
                  <span className="text-xs font-extrabold">{getCategoryLabel(cat.id)}</span>
                </div>
                <p className={`text-[10px] font-medium leading-tight line-clamp-1 ${
                  isSelected ? "text-indigo-100" : "text-slate-400"
                }`}>
                  {getCategoryDesc(cat.id)}
                </p>
              </button>
            );
          })}
        </div>

        {/* Style Cards for Selected Category */}
        {category !== "custom" ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stylesInCategory.map((style) => {
              const translated = getTranslatedStyle(style.id);
              const isSelected = selectedStyleId === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyleId(style.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-sm"
                      : "border-slate-200/80 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{style.emoji}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-extrabold text-slate-900 mb-1">
                      {translated?.label ?? style.label}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-tight">
                      {translated?.description ?? style.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Custom Prompt Textarea */
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t("customPromptLabel")}
            </label>
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={t("customPromptPlaceholder")}
              className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
            />
          </div>
        )}

        {/* Optional Background Color picker for ID photos */}
        {selectedStyle?.supportsBgColor && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-xs font-bold text-slate-700 mb-2">
              {t("bgColorLabel")}
            </p>
            <div className="flex gap-2">
              {BG_COLORS.map((bg) => {
                const isSelected = bgColor === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setBgColor(bg.id)}
                    className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-white ring-2 ring-indigo-500/20 font-bold"
                        : "border-slate-200 bg-white/60 text-slate-600"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-inner"
                      style={{ backgroundColor: bg.swatch }}
                    />
                    <span className="text-xs">{getBgLabel(bg.id)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Step 3: Submit CTA */}
      <div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selfieBase64}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
            selfieBase64
              ? "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-950/10 active:scale-[0.99] cursor-pointer"
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          <span>{t("generateButton")}</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
