"use client";

import React, { useState } from "react";
import { LMStudioStatusResponse, DEFAULT_LMSTUDIO_URL } from "../lib/lmstudio";

interface LMStudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: LMStudioStatusResponse | null;
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  onRefresh: () => void;
}

export function LMStudioSettingsModal({
  isOpen,
  onClose,
  status,
  baseUrl,
  setBaseUrl,
  selectedModel,
  setSelectedModel,
  onRefresh,
}: LMStudioSettingsModalProps) {
  const [tempUrl, setTempUrl] = useState(baseUrl);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    setTesting(true);
    setBaseUrl(tempUrl);
    await onRefresh();
    setTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 p-6 sm:p-8 space-y-6 text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-xl shadow-md">
              💻
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">LM Studio 로컬 API 연동 설정</h3>
              <p className="text-xs text-slate-400">내 컴퓨터의 Local LLM 서버 주소 및 모델을 설정하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Live Status Pill */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            status?.connected
              ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/70 border-rose-500/40 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full animate-pulse ${
                status?.connected ? "bg-emerald-400" : "bg-rose-500"
              }`}
            />
            <div>
              <p className="text-sm font-bold">
                {status?.connected ? "LM Studio 연결 성공!" : "LM Studio 연결 불가"}
              </p>
              <p className="text-xs opacity-80">
                {status?.connected
                  ? `감지된 사용 가능 모델: ${status.models.length}개`
                  : status?.error || "LM Studio의 Local Server를 확인해 주세요."}
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={testing}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold shadow-sm hover:bg-slate-800 transition-all text-slate-200 disabled:opacity-50"
          >
            {testing ? "확인 중..." : "🔄 연결 재시험"}
          </button>
        </div>

        {/* Base URL Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            LM Studio Server Base URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder={DEFAULT_LMSTUDIO_URL}
              className="flex-1 px-4 py-2.5 text-sm font-mono border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950 text-slate-100"
            />
            <button
              onClick={() => setTempUrl(DEFAULT_LMSTUDIO_URL)}
              className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
            >
              기본값 (127.0.0.1:1234)
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            LM Studio 앱 Developer (-&gt; Local Server) 탭의 <code className="px-1 py-0.5 bg-slate-950 text-indigo-300 rounded font-mono">http://127.0.0.1:1234</code> 와 동일한 주소입니다.
          </p>
        </div>

        {/* Model Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            현재 로드된 모델 선택
          </label>
          {status?.models && status.models.length > 0 ? (
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-semibold border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950 text-slate-100"
            >
              {status.models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id}
                </option>
              ))}
            </select>
          ) : (
            <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded-xl text-xs text-amber-300 space-y-1">
              <p className="font-bold">💡 로드된 모델이 없습니다.</p>
              <p>LM Studio 앱 상단의 <strong>+ Load Model</strong> 버튼을 눌러 모델을 로드해 주세요.</p>
            </div>
          )}
        </div>

        {/* LM Studio Launch Instruction Guide */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-1.5">
          <p className="font-bold text-indigo-300 flex items-center gap-1.5">
            <span>⚙️</span> 사진 참고 연동 가이드:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed">
            <li>LM Studio 프로그램을 엽니다.</li>
            <li>좌측 사이드바 <strong>&lt;/&gt; Developer</strong> 아이콘을 클릭합니다.</li>
            <li><strong>Local Server</strong>의 <strong>Status: Running</strong> 스위치 ON 확인!</li>
            <li>상단 <strong>+ Load Model</strong> 버튼으로 원하시는 언어모델을 로드합니다.</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            닫기
          </button>
          <button
            onClick={handleSaveAndTest}
            disabled={testing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all"
          >
            {testing ? "연동 확인 중..." : "저장 및 연결 상태 재시험"}
          </button>
        </div>
      </div>
    </div>
  );
}
