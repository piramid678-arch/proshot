"use client";

import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

interface PassOption {
  id: string;
  credits: number;
  titleKey: string;
  descKey: string;
  priceKey: string;
  popular?: boolean;
}

const PASS_OPTIONS: PassOption[] = [
  {
    id: "pass1",
    credits: 1,
    titleKey: "pass1Title",
    descKey: "pass1Desc",
    priceKey: "pass1Price",
  },
  {
    id: "pass3",
    credits: 3,
    titleKey: "pass3Title",
    descKey: "pass3Desc",
    priceKey: "pass3Price",
    popular: true,
  },
  {
    id: "pass5",
    credits: 5,
    titleKey: "pass5Title",
    descKey: "pass5Desc",
    priceKey: "pass5Price",
  },
];

type PaymentMethod = "kakaopay" | "card" | "paypal" | "naverpay";

export default function PaymentModal() {
  const { t, isPaymentModalOpen, closePaymentModal, addCredits } = useLanguage();
  const [selectedPassId, setSelectedPassId] = useState<string>("pass3");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("kakaopay");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  if (!isPaymentModalOpen) return null;

  const selectedPass = PASS_OPTIONS.find((p) => p.id === selectedPassId) ?? PASS_OPTIONS[1];

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate instant secure payment approval
    await new Promise((res) => setTimeout(res, 1000));

    addCredits(selectedPass.credits);
    setIsProcessing(false);

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      closePaymentModal();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-100 p-7 sm:p-10 shadow-2xl shadow-slate-950/25 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closePaymentModal}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-base font-bold shadow-sm"
        >
          ✕
        </button>

        {/* Test Simulation Notice Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-sky-50 border border-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center gap-2">
          <span className="text-sm">🧪</span>
          <span>현재 화면은 UI/UX 테스트용 시뮬레이터입니다. (실제 청구/출금 없음 ❌)</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-amber-50 text-amber-800 border border-amber-200/80 mb-3 shadow-sm">
            <span className="text-base">🎁</span>
            <span>{t("paymentModalTitle")}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            단건 1회성 패스 선택
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium leading-relaxed max-w-md mx-auto">
            {t("paymentModalSubtitle")}
          </p>
        </div>

        {/* Pricing Pass Cards (Enlarged) */}
        <div className="space-y-3.5 mb-8">
          {PASS_OPTIONS.map((pass) => {
            const isSelected = selectedPassId === pass.id;
            return (
              <div
                key={pass.id}
                onClick={() => setSelectedPassId(pass.id)}
                className={`cursor-pointer relative p-5 sm:p-6 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-md"
                    : "border-slate-200/80 bg-white hover:bg-slate-50/80 hover:border-slate-300"
                }`}
              >
                {pass.popular && (
                  <span className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm tracking-wide">
                    {t("pass3Tag")}
                  </span>
                )}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
                    }`}
                  >
                    {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {t(pass.titleKey)} <span className="text-indigo-600 font-black">({pass.credits}회)</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      {t(pass.descKey)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-black text-slate-900">{t(pass.priceKey)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Method Selection (Excluding Toss Pay) */}
        <div className="mb-8">
          <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-3">
            {t("paymentMethodLabel")}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* KakaoPay */}
            <button
              type="button"
              onClick={() => setPaymentMethod("kakaopay")}
              className={`py-3.5 px-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all ${
                paymentMethod === "kakaopay"
                  ? "border-amber-400 bg-amber-300/40 text-slate-900 ring-2 ring-amber-400/40 shadow-sm"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="w-5 h-5 bg-amber-400 text-slate-900 rounded-full font-black text-xs flex items-center justify-center shadow-sm">
                카
              </span>
              <span>{t("kakaoPay")}</span>
            </button>

            {/* Credit Card */}
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`py-3.5 px-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all ${
                paymentMethod === "card"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20 shadow-sm"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="text-base">💳</span>
              <span>{t("cardPay")}</span>
            </button>

            {/* PayPal */}
            <button
              type="button"
              onClick={() => setPaymentMethod("paypal")}
              className={`py-3.5 px-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all ${
                paymentMethod === "paypal"
                  ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 shadow-sm"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="text-base">🅿️</span>
              <span>{t("paypalPay")}</span>
            </button>

            {/* Naver Pay */}
            <button
              type="button"
              onClick={() => setPaymentMethod("naverpay")}
              className={`py-3.5 px-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all ${
                paymentMethod === "naverpay"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20 shadow-sm"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="w-5 h-5 bg-emerald-500 text-white rounded font-black text-xs flex items-center justify-center shadow-sm">
                N
              </span>
              <span>{t("naverPay")}</span>
            </button>
          </div>
        </div>

        {/* Security badge & Guarantee */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold mb-6">
          <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span>안전한 1회성 단건 결제 · 자동 정기 구독 결제 없음</span>
        </div>

        {/* Submit Pay Button */}
        <button
          type="button"
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-4.5 sm:py-5 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base sm:text-lg transition-all duration-200 shadow-xl shadow-slate-950/10 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              보안 결제 승인 중...
            </span>
          ) : (
            <span>{t(selectedPass.priceKey)} {t("paySubmitButton")}</span>
          )}
        </button>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="absolute inset-0 bg-emerald-600/95 text-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-200 z-20">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl mb-4 animate-bounce">
              ✓
            </div>
            <h4 className="text-2xl font-black mb-2">{t("paymentSuccessMsg")}</h4>
            <p className="text-sm text-emerald-100">잠시 후 이전 창으로 이동하여 바로 생성합니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
