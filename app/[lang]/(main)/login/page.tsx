"use client";

import { useState, FormEvent, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
// RETTET: Stien er justeret til at være 3 niveauer op i stedet for 4.
import { signInUser } from '../../../../firebase/auth'; 
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

    // Venter på at oversættelserne er klar
    if (!t || !t.login) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    const translations = t.login;

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // OPDATERET: Bruger nu den genanvendelige signInUser servicefunktion
            await signInUser(email, password); 
            router.push(`/${language}/dashboard`);
        } catch (firebaseError: any) {
            // Fejlkoder fra Firebase Auth forbliver de samme
            if (
                firebaseError.code === 'auth/invalid-email' || 
                firebaseError.code === 'auth/user-not-found' || 
                firebaseError.code === 'auth/wrong-password' || 
                firebaseError.code === 'auth/invalid-credential'
            ) {
                setError(translations.invalidCredentials);
            } else {
                setError(translations.errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // OPDATERET: Hele containeren er nu en flex-boks, der centrerer indholdet
        <main className="relative flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Baggrundsbillede */}
            <Image
                src="/images/hero-bg.jpg"
                alt="Fodboldbane baggrund"
                fill
                className="object-cover object-center z-0"
                priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-70 z-10"></div>

            {/* Login-boks (nu fuldt responsiv) */}
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6 sm:p-8 space-y-6 text-black z-20">
                <div className="flex justify-center">
                    <Image
                        src="/images/logo.png"
                        alt="Down The Line Logo"
                        width={200} // Lidt større logo
                        height={37}
                        priority
                    />
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            {translations.emailLabel}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            placeholder="john.doe@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            {translations.passwordLabel}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
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
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-black transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        disabled={loading}
                    >
                        {loading ? (lang === 'da' ? 'Logger ind...' : 'Logging in...') : translations.loginButton}
                    </button>
                </form>

                {/* FJERNEDE: Signup/Opret Bruger sektionen for at begrænse adgang i testfasen. */}

            </div>
        </main>
    );
}
