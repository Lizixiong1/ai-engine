import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

export const metadata = {
  title: "AI App",
  description: "AI-first fullstack app scaffold",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
