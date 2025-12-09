"use client";

import { useI18n } from "../lib/i18n/context";
import { locales } from "../lib/i18n/types";
import { Globe } from "lucide-react";
import { useState } from "react";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const current = locales.find((o) => o.code === locale) || locales[0];
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="切换语言"
      >
        <Globe className="w-5 h-5" />
        <span>{current.name}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => {
                  setLocale(loc.code);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  locale === loc.code
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

