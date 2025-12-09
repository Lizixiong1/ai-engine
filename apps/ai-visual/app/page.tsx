'use client';

import Link from 'next/link';
import { useI18n } from '../lib/i18n/context';
import { Sparkles, Zap, Shield } from 'lucide-react';

export default function Page() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              {t.home.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {t.home.subtitle}
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/register"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {t.home.getStarted}
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                {t.home.login}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {t.home.features.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
              <div className="mb-4 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t.home.features.visualization.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.home.features.visualization.desc}
              </p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
              <div className="mb-4 text-blue-600 dark:text-blue-400">
                <Zap className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t.home.features.fast.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.home.features.fast.desc}
              </p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
              <div className="mb-4 text-blue-600 dark:text-blue-400">
                <Shield className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t.home.features.secure.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.home.features.secure.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {t.home.cta.title}
          </h2>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
            {t.home.cta.subtitle}
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t.home.cta.button}
          </Link>
        </div>
      </section>
    </div>
  );
}
