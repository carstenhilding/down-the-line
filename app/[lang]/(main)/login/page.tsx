"use client";

import { useState, FormEvent, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../firebase/config';
import { useLanguage } from '../../../../components/LanguageContext';

export default function LoginPage({
  params: paramsPromise
}: {
  params: Promise<{ lang: 'da' | 'en' }>;
}) {
  const params = use(paramsPromise);
  const { lang } = params;
  const router = useRouter();
  const { t, language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!t || !t.login || Object.keys(t.login).length === 0) {
    return <div className="text-center text-xl text-gray-700">Loading translations...</div>;
  }

  const translations = t.login;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(`/${language}/dashboard`);
    } catch (firebaseError: any) {
      console.error("Login error:", firebaseError.code, firebaseError.message);
      if (firebaseError.code === 'auth/invalid-email' || firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
        setError(translations.invalidCredentials);
      } else {
        setError(translations.errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex items-center justify-center w-full min-h-[calc(100vh-76px)] px-4 pb-10 overflow-hidden">
      {/* Baggrundsbillede med Next.js Image */}
      <Image
        src="/images/hero-bg.jpg"
        alt="Fodboldbane baggrund"
        fill
        className="object-cover object-center z-0"
        priority
      />
      {/* Grå/Sort slør (overlay) over billedet */}
      <div className="absolute inset-0 bg-black opacity-70 z-10"></div>

      {/* Login-boksen, med mt-10 for afstand til headeren */}
      <div className="relative w-full max-w-sm bg-white rounded-lg shadow-xl p-4 space-y-4 text-black z-20 mt-10">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/logo.png"
            alt="Down The Line Logo"
            width={180}
            height={27}
            priority
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
            <strong className="font-bold">Fejl:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {translations.emailLabel}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="john.doe@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {translations.passwordLabel}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="********"
            />
          </div>

          <div className="text-center text-sm">
            <Link href={`/${language}/forgot-password`} className="font-medium text-orange-600 hover:text-orange-500">
              {translations.forgotPassword}
            </Link>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-black rounded-md shadow-sm text-lg font-medium text-black transition-colors hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            disabled={loading}
          >
            {loading ? (lang === 'da' ? 'Logger ind...' : 'Logging in...') : translations.loginButton}
          </button>
        </form> {/* <--- Denne lukker form-tagget */}

        <div className="text-center text-sm mt-4">
          <p className="text-gray-600">{translations.noAccountPrompt}</p>
          <Link href={`/${language}/signup`} className="font-medium text-orange-600 hover:text-orange-500">
            {t.headerJoin}
          </Link>
        </div>

        <div className="text-center text-sm mt-4">
          <Link href={`/${language}/contact`} className="font-medium text-gray-600 hover:text-gray-900">
            {translations.contactSupport}
          </Link>
        </div>
      </div> {/* <--- Denne lukker Login-boksen */}
    </main>
  );
}