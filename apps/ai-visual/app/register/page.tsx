'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '../../lib/i18n/context';
import { User, Mail, Lock } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(t.register.passwordMismatch);
      return;
    }
    // TODO: 实现注册逻辑
    console.log('注册:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t.register.title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t.register.hasAccount}{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {t.register.loginLink}
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <label htmlFor="name" className="sr-only">
                {t.register.name}
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder={t.register.name}
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                {t.register.email}
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder={t.register.email}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                {t.register.password}
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder={t.register.password}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">
                {t.register.confirmPassword}
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder={t.register.confirmPassword}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 accent-blue-500"
            />
            <label
              htmlFor="agree-terms"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              {t.register.agreeTerms}{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                {t.register.termsOfService}
              </a>{' '}
              {t.register.and}{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                {t.register.privacyPolicy}
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {t.register.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
