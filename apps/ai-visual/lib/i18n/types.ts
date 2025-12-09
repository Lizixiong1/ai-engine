import { enUS } from "./locales/en-us";
import { zhCN } from "./locales/zh-cn";

/**
 * 将对象类型中的所有字符串字面量类型转换为 string
 * 移除 readonly 修饰符，保持结构但允许不同的字符串值
 */
type DeepMutableStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
  ? U extends string
    ? string[]
    : DeepMutableStringify<U>[]
  : T extends object
  ? { -readonly [K in keyof T]: DeepMutableStringify<T[K]> }
  : T;

/**
 * 翻译内容类型 - 基于 zh-CN 基准语言结构
 * 使用 DeepMutableStringify 允许不同语言使用不同的字符串值
 */
export type Translations = DeepMutableStringify<typeof zhCN>;
export type Locale = "zh-cn" | "en-us";

export interface LocalOption {
  name: string;
  code: Locale;
}
export const locales: LocalOption[] = [
  { name: "中文", code: "zh-cn" },
  { name: "English", code: "en-us" },
];

export const translations: Record<Locale, Translations> = {
  "zh-cn": zhCN,
  "en-us": enUS,
};

