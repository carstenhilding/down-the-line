"use client";

import React, { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
// KORREKT STILØSNING: Fire niveauer op for at nå firebase/config
import { auth, db } from '../../../../firebase/config'; 
import { doc, getDoc } from 'firebase/firestore'; 
// KORREKT STILØSNING: Fire niveauer op for at nå components
import { useLanguage } from '../../../../components/LanguageContext'; 
import Link from 'next/link';
import { Plus, List, LogOut } from 'lucide-react';

// Definerer de mulige roller for type-sikkerhed
type UserRole = 'developer' | 'tester' | 'unknown'; 

export default function DashboardPage({
    params: paramsPromise
}: {
    params: Promise<{ lang: 'da' | 'en' }>;
}) {
    const params = use(paramsPromise);
    const { lang } = params;
    const router = useRouter();
    const { t, language } = useLanguage();

    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userRole, setUserRole] = useState<UserRole>('unknown'); 
    const [loadingAuth, setLoadingAuth] = useState(true);

    // Funktion til at hente brugerens rolle fra Firestore
    const fetchUserRole = useCallback(async (uid: string) => {
        try {
            const userRef = doc(db, 'users', uid); // Antager kollektionen hedder 'users'
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const role = docSnap.data().role as UserRole;
                setUserRole(role);
            } else {
                // Håndter brugere uden en defineret rolle (f.eks. de får kun adgang som 'tester')
                setUserRole('tester');
            }
        } catch (error) {
            console.error("Fejl ved hentning af brugerrolle:", error);
            setUserRole('unknown');
        }
    }, []);

    // 1. Auth State Listener & Beskyttelse af ruten
    useEffect(() => {
        // Lytter på Firebase Authentication state
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                // Hvis brugeren IKKE er logget ind, omdiriger til login
                router.push(`/${language}/login`);
            } else {
                // Hvis brugeren ER logget ind, sæt brugeren og hent rollen
                setUser(currentUser);
                fetchUserRole(currentUser.uid); // Henter rollen
            }
            // Sæt loading til falsk, når auth state er kendt (uanset om logget ind eller nej)
            setLoadingAuth(false);
        });

        // Oprydning ved komponentens nedlukning
        return () => unsubscribe();
    }, [router, language, fetchUserRole]); // Tilføjet fetchUserRole som dependency

    // 2. Log Ud Funktion
    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Redirection sker automatisk via onAuthStateChanged listeneren ovenfor
        } catch (error) {
            console.error("Fejl ved logout:", error);
            // Valgfrit: Vis en fejlmeddelelse til brugeren
        }
    };

    // Tjekker at oversættelser er klar FØR vi bruger dem
    if (!t || !t.dashboard) {
        return <div className="flex min-h-screen items-center justify-center bg-gray-50"><p className="text-xl text-gray-700">Loading translations...</p></div>;
    }
    
    // NYT: Viser loading screen EFTER oversættelser er klar
    if (loadingAuth || !user || userRole === 'unknown') {
        const loadingText = lang === 'da' ? 'Indlæser dashboard...' : 'Loading dashboard...';
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-xl text-gray-700">
                    {t?.dashboard?.loading || loadingText}
                </p>
            </div>
        );
    }
    
    const dashboardTranslations = t.dashboard;
    
    // NY: Hvis rollen ikke er en gyldig tester/udvikler rolle, vis fejl/begrænset adgang
    if (userRole !== 'developer' && userRole !== 'tester') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-red-50">
                <p className="text-xl text-red-700">
                    {lang === 'da' ? 'Adgang nægtet. Din rolle er ikke godkendt til dette system.' : 'Access denied. Your role is not approved for this system.'}
                </p>
            </div>
        );
    }


    return (
        <main className="min-h-screen bg-gray-50">
            {/* Dashboard Header/Velkomstsektion */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">
                        {dashboardTranslations.welcomeTitle}, {user.email} 
                        {/* Viser rollen ved siden af mailen (Kun for udvikling) */}
                        <span className="text-lg text-orange-500 ml-3 capitalize">({userRole})</span>
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 bg-black text-white font-medium py-2 px-4 rounded-md shadow hover:bg-gray-800 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>{dashboardTranslations.logoutButton || (lang === 'da' ? 'Log Ud' : 'Log Out')}</span>
                    </button>
                </div>
            </header>

            {/* Hovedindhold: Hurtig Adgang & Oversigt */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    
                    {/* MVP Hurtig Adgang - Opret og Se Træningspas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        
                        {/* Kort 1: Opret Nyt Træningspas */}
                        <Link href={`/${language}/trainer/new`} className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-start space-y-4 border-t-4 border-orange-500 hover:-translate-y-1">
                            <Plus className="h-10 w-10 text-orange-500 group-hover:text-orange-600 transition-colors" />
                            <h2 className="text-xl font-semibold text-gray-900">{dashboardTranslations.createTrainingTitle}</h2>
                            <p className="text-gray-600 text-sm">{dashboardTranslations.createTrainingDesc}</p>
                        </Link>

                        {/* Kort 2: Se Egne Træningspas (Bibliotek) */}
                        <Link href={`/${language}/trainer/library`} className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-start space-y-4 border-t-4 border-black hover:-translate-y-1">
                            <List className="h-10 w-10 text-black group-hover:text-gray-700 transition-colors" />
                            <h2 className="text-xl font-semibold text-gray-900">{dashboardTranslations.viewTrainingTitle}</h2>
                            <p className="text-gray-600 text-sm">{dashboardTranslations.viewTrainingDesc}</p>
                        </Link>
                        
                        {/* NYT: Viser kun Developer-kortet, hvis brugeren er Developer */}
                        {userRole === 'developer' && (
                            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start space-y-4 border-t-4 border-blue-500 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl">
                                <h2 className="text-xl font-semibold text-blue-700 mb-2">Udvikler Værktøjer</h2>
                                <p className="text-gray-500 text-sm">Adgang til logfiler og testfunktioner.</p>
                            </div>
                        )}

                        {/* Placeholder kort for fremtidig statistik */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-500 mb-2">Statistik (Fremtid)</h2>
                            <p className="text-gray-400 text-sm">Viser antal trænede timer/oprettede pas i denne måned.</p>
                        </div>
                        
                         <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-500 mb-2">Nyheder</h2>
                            <p className="text-gray-400 text-sm">Seneste opdateringer fra Down The Line teamet.</p>
                        </div>

                    </div>
                    
                    {/* MVP Detaljeret Oversigt (Skelet) */}
                    <div className="bg-white shadow-xl rounded-xl">
                        <div className="p-6">
                             <h3 className="text-2xl font-semibold text-gray-900 mb-4">{dashboardTranslations.recentActivityTitle}</h3>
                             <div className="border-t border-gray-200 pt-4">
                                 <p className="text-gray-500">
                                     {dashboardTranslations.activityPlaceholder}
                                 </p>
                             </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </main>
    );
}
