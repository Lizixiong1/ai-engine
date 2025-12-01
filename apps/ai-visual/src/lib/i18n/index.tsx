"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { LangCode, LANGUAGE_TRANSLATION, Translations } from "./locales";
import { StorageFactory, StorageType } from "../storage";

export interface I18nContext {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: Translations;
}

const STORAGE_KEY = "lang-type-code";

const i18nContext = createContext<null | I18nContext>(null);

const I18nProvider = ({ children }: { children?: ReactNode }) => {
  const [lang, setLangState] = useState<LangCode>("zh-CN");
  const setLang = useCallback((newLang: LangCode) => {
    if (!LANGUAGE_TRANSLATION[newLang]) return;
    setLangState(newLang);

    StorageFactory.create({ type: StorageType.LOCAL }).set(
      STORAGE_KEY,
      newLang
    );

    document.documentElement.lang = newLang;
  }, []);

  return (
    <i18nContext.Provider
      value={{
        lang,
        setLang,
        t: LANGUAGE_TRANSLATION[lang],
      }}
    >
      {children}
    </i18nContext.Provider>
  );
};

const useI18nContext = () => {
  const context = useContext(i18nContext);

  if (!context) {
    throw new Error(`未发现i18provider`);
  }

  return context;
};

export { useI18nContext, I18nProvider };
