import zhCN from "./zh-cn";
export type Translations = typeof zhCN;

export const LANGUAGE_CONFIG = [
  { name: "简体中文", code: "zh-CN" },
  { name: "English", code: "es-UA" },
  { name: "日本語", code: "ja-JP" },
  { name: "한국어", code: "ko-KR" },
];
export type LangCode = "zh-CN" | "en-US" | "ja-JP" | "ko-KR";

export const LANGUAGE_TRANSLATION: Record<LangCode, Translations> = {
  "zh-CN": zhCN,
  "en-US": zhCN,
  "ja-JP": zhCN,
  "ko-KR": zhCN,
};
