"use client";

import React from "react";
import { TEMPLATES, ContentTemplate } from "../lib/templates";

interface TemplateSelectorProps {
  activePlatform: string;
  selectedTemplateId: string | null;
  onSelectTemplate: (template: ContentTemplate) => void;
}

export function TemplateSelector({
  activePlatform,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const filteredTemplates = TEMPLATES.filter(
    (tmpl) => tmpl.platform === activePlatform || activePlatform === "all"
  );

  if (filteredTemplates.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>💡</span>
          <span>원클릭 추천 템플릿</span>
        </label>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          클릭 한 번으로 최적의 프롬프트와 어조가 설정됩니다
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTemplates.map((tmpl) => {
          const isSelected = selectedTemplateId === tmpl.id;
          return (
            <button
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl)}
              type="button"
              className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between backdrop-blur-md ${
                isSelected
                  ? "bg-indigo-950/70 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/30 text-white"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                    {tmpl.icon}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 border border-slate-700 text-slate-300 rounded-full">
                    {tmpl.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {tmpl.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
