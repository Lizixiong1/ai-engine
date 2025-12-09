"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useI18n } from "../lib/i18n/context";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // 防止移动端菜单打开时页面滚动
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md z-50 sticky w-full top-0 left-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-2xl font-bold text-blue-600 dark:text-blue-400"
              >
                AI Visual
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/")
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {t.nav.home}
                </Link>
              </div>
            </div>

            {/* Desktop Auth Buttons & Language Switcher - 应该在PC端显示 */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />
              <Link
                href="/login"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/login")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {t.nav.register}
              </Link>
            </div>

            {/* Mobile: Language Switcher and Menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="切换菜单"
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - 弹出层 */}
      {mobileMenuOpen && (
        <>
          {/* 背景遮罩 - 带淡入动画 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ease-in-out"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* 弹出菜单 - 从右侧滑入 */}
          <div className="fixed inset-y-0 right-0 w-full bg-white dark:bg-gray-900 shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex flex-col h-full">
              {/* 菜单头部 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <Link
                  href="/"
                  className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                >
                  AI Visual
                </Link>
                <div className="ml-auto">
                  <LanguageSwitcher />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label={t.common.close}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* 菜单内容 */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 font-mono text-2xs uppercase tracking-wider text-zinc-400 hover:text-acid transition-colors block"
                >
                  {t.nav.home}
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 font-mono text-2xs uppercase tracking-wider text-zinc-400 hover:text-acid transition-colors block"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 font-mono text-2xs uppercase tracking-wider text-zinc-400 hover:text-acid transition-colors block"
                >
                  {t.nav.register}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
