"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, LANGUAGES, TRANSLATIONS, LanguageOption } from "../lib/i18n";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: LanguageOption[];
  credits: number;
  consumeCredit: () => boolean;
  addCredits: (amount: number) => void;
  isPaymentModalOpen: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ko");
  const [credits, setCredits] = useState<number>(2); // Default 2 free credits for new visitors
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Load language preference
    const savedLang = localStorage.getItem("proshot_lang") as Language;
    if (savedLang && LANGUAGES.some((l) => l.code === savedLang)) {
      setLanguageState(savedLang);
    }

    // Load credits
    const savedCredits = localStorage.getItem("proshot_credits");
    if (savedCredits !== null) {
      const parsed = parseInt(savedCredits, 10);
      if (!isNaN(parsed)) {
        setCredits(parsed);
      }
    } else {
      localStorage.setItem("proshot_credits", "2");
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("proshot_lang", lang);
  };

  const addCredits = (amount: number) => {
    setCredits((prev) => {
      const next = prev + amount;
      localStorage.setItem("proshot_credits", next.toString());
      return next;
    });
  };

  const consumeCredit = (): boolean => {
    if (credits <= 0) {
      setIsPaymentModalOpen(true);
      return false;
    }
    setCredits((prev) => {
      const next = Math.max(0, prev - 1);
      localStorage.setItem("proshot_credits", next.toString());
      return next;
    });
    return true;
  };

  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] ?? TRANSLATIONS["ko"]?.[key] ?? key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: LANGUAGES,
        credits,
        consumeCredit,
        addCredits,
        isPaymentModalOpen,
        openPaymentModal,
        closePaymentModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
