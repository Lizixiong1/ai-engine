import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
