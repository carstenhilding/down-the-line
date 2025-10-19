"use client";

import React, { use, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { LayoutDashboard, Users, Zap, Calendar, Activity, Shield, BookOpen, LogOut, Settings, Plus, List, User as UserIcon, HelpCircle, ClipboardList, Menu, Globe } from 'lucide-react';
import { auth, db } from '../../../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '../../../../components/LanguageContext';
import Link from 'next/link';
import ActivityItem from '../../../../components/dashboard/ActivityItem';

type UserRole = 'developer' | 'tester' | 'unknown';

const modules = [
    { nameKey: 'dashboard', path: '/dashboard', icon: LayoutDashboard, role: 'tester' },
    { nameKey: 'training', path: '/trainer/new', icon: BookOpen, role: 'tester' },
    { nameKey: 'club', path: '/club', icon: Calendar, role: 'developer' },
    { nameKey: 'players', path: '/players', icon: Users, role: 'developer' },
    { nameKey: 'video', path: '/video', icon: Zap, role: 'developer' },
    { nameKey: 'scouting', path: '/scouting', icon: Shield, role: 'developer' },
    { nameKey: 'chat', path: '/chat', icon: Activity, role: 'developer' },
];

const mockActivity = [
    { type: 'exercise_created', text: "Du oprettede øvelsen 'Hurtige afslutninger'", time: '2 timer siden' },
    { type: 'player_added', text: "Mads Larsen blev tilføjet til U19 holdet", time: 'I går' },
    { type: 'report_viewed', text: "Cheftræneren så din scouting-rapport om Jonas Wind", time: 'I går' },
    { type: 'exercise_created', text: "Du redigerede øvelsen 'Defensiv organisation'", time: '3 dage siden' },
];

export default function DashboardPage({
    params: paramsPromise
}: {
    params: Promise<{ lang: 'da' | 'en' }>;
}) {
    const params = use(paramsPromise);
    const { lang } = params;
    const router = useRouter();
    const pathname = usePathname();
    const { t, language } = useLanguage();

    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userRole, setUserRole] = useState<UserRole>('unknown');
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar
    const profileRef = useRef<HTMLDivElement>(null);

    const changeLanguage = (newLang: 'da' | 'en') => {
        if (newLang !== language) {
            const newPath = pathname.replace(`/${language}`, `/${newLang}`);
            router.push(newPath);
            setIsProfileOpen(false);
        }
    };

    const fetchUserRole = useCallback(async (uid: string) => {
        try {
            const userRef = doc(db, 'users', uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                setUserRole(docSnap.data().role as UserRole);
            } else {
                setUserRole('tester');
            }
        } catch (error) {
            console.error("Fejl ved hentning af brugerrolle:", error);
            setUserRole('unknown');
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                if(language) router.push(`/${language}/login`);
            } else {
                setUser(currentUser);
                fetchUserRole(currentUser.uid);
            }
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, [router, language, fetchUserRole]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsProfileOpen(false);
        } catch (error) {
            console.error("Fejl ved logout:", error);
        }
    };

    if (!t || !t.dashboard || !t.sidebar) {
        return <div className="flex min-h-screen items-center justify-center bg-white"><p className="text-xl text-black">Loading translations...</p></div>;
    }
    
    const dashboardTranslations = t.dashboard;
    const sidebarTranslations = t.sidebar as { [key: string]: string };

    if (loadingAuth || !user || userRole === 'unknown') {
        const loadingText = lang === 'da' ? 'Indlæser dashboard...' : 'Loading dashboard...';
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-xl text-black">
                    {dashboardTranslations.loading || loadingText}
                </p>
            </div>
        );
    }
    
    if (userRole !== 'developer' && userRole !== 'tester') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-orange-50">
                <p className="text-xl text-orange-800">
                    {lang === 'da' ? 'Adgang nægtet. Din rolle er ikke godkendt til dette system.' : 'Access denied. Your role is not approved for this system.'}
                </p>
            </div>
        );
    }

    const currentRoute = pathname.replace(`/${language}`, '').replace('//', '/');
    
    const accessibleModules = modules.filter(module => {
        if (userRole === 'developer') return true;
        if (userRole === 'tester' && module.role !== 'developer') return true;
        return false;
    });

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <header className="h-12 bg-white border-b sticky top-0 z-50 w-full flex items-center justify-between">
                <div className="flex items-center pl-4">
                   <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-100 mr-2 cursor-pointer">
                       <Menu className="h-5 w-5 text-gray-700" />
                   </button>
                   <div className="p-2">
                        <img src="/images/logo.png" alt="Down The Line Logo" className="h-8 w-auto" />
                    </div>
                </div>
                
                <div className="relative pr-4" ref={profileRef}>
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center p-2 rounded-lg cursor-pointer">
                        <UserIcon className="h-8 w-8 bg-orange-500 text-white rounded-full p-1.5" />
                    </button>
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-10">
                            <div className="p-3 border-b">
                                <p className="font-semibold text-sm text-black truncate">{user.email}</p>
                                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                            </div>
                            <div className="p-1.5">
                                <a href="#" className="flex items-center w-full text-left p-2 rounded-md hover:bg-gray-100 text-xs cursor-pointer">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Account Settings
                                </a>
                                <div className="my-1 border-t"></div>
                                <div className="flex items-center p-2 text-xs text-gray-400">
                                    <Globe className="h-4 w-4 mr-2" />
                                    Language
                                </div>
                                <button onClick={() => changeLanguage('da')} className={`w-full text-left px-2 py-1 rounded-md text-xs cursor-pointer ${language === 'da' ? 'font-semibold text-orange-600' : 'hover:bg-gray-100'}`}>Dansk</button>
                                <button onClick={() => changeLanguage('en')} className={`w-full text-left px-2 py-1 rounded-md text-xs cursor-pointer ${language === 'en' ? 'font-semibold text-orange-600' : 'hover:bg-gray-100'}`}>English</button>
                            </div>
                            <div className="border-t p-1.5">
                                <button onClick={handleLogout} className="flex items-center w-full text-left p-2 rounded-md bg-orange-500 text-white text-xs hover:bg-orange-600 font-bold cursor-pointer">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    {dashboardTranslations.logoutButton}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex" style={{ height: 'calc(100vh - 48px)' }}>
                <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r flex flex-col shrink-0 transition-all duration-300`}>
                    <nav className="flex-1 mt-2 space-y-1 p-2">
                        {accessibleModules.map((module) => {
                            const isActive = currentRoute.startsWith(module.path);
                            return (
                                <Link 
                                    key={module.nameKey}
                                    href={`/${language}${module.path}`} 
                                    className={`relative flex items-center p-3 rounded-lg transition-colors text-sm font-medium group cursor-pointer ${!isSidebarOpen && 'justify-center'} ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <module.icon className="h-5 w-5 shrink-0" />
                                    <span className={`ml-3 whitespace-nowrap transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} ${!isSidebarOpen && 'hidden'}`}>{sidebarTranslations[module.nameKey]}</span>
                                    
                                    {!isSidebarOpen && (
                                        <span className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                            {sidebarTranslations[module.nameKey]}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-screen-2xl">
                        <h2 className="text-2xl font-bold text-black mb-6">
                            {sidebarTranslations.dashboard} Overview
                        </h2>
                        <div className="flex flex-col lg:flex-row gap-6">
                            <section className="lg:w-3/4 space-y-6">
                                <div className="bg-white shadow rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-black border-b pb-2 mb-4">{lang === 'da' ? 'Hurtig Adgang' : 'Quick Access'}</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        <Link href={`/${language}/trainer/new`} className="group bg-orange-500 rounded-lg shadow hover:shadow-md transition-all duration-300 p-4 flex flex-col items-start space-y-2 hover:bg-orange-600">
                                            <Plus className="h-6 w-6 text-white" />
                                            <h2 className="text-base font-semibold text-white">{dashboardTranslations.createTrainingTitle}</h2>
                                        </Link>
                                        <Link href={`/${language}/trainer/library`} className="group bg-black rounded-lg shadow hover:shadow-md transition-all duration-300 p-4 flex flex-col items-start space-y-2 hover:bg-gray-800">
                                            <List className="h-6 w-6 text-white" />
                                            <h2 className="text-base font-semibold text-white">{dashboardTranslations.viewTrainingTitle}</h2>
                                        </Link>
                                        {userRole === 'developer' && (
                                            <div className="bg-black rounded-lg shadow p-4 flex flex-col items-start space-y-2">
                                                <Settings className="h-6 w-6 text-white" />
                                                <h2 className="text-base font-semibold text-white">Udvikler Værktøjer</h2>
                                            </div>
                                        )}
                                        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start space-y-2 border border-gray-200">
                                            <ClipboardList className="h-6 w-6 text-gray-500" />
                                            <h2 className="text-base font-semibold text-gray-700">Opgaveoversigt</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white shadow rounded-lg p-6">
                                    <h3 className="text-xl sm:text-2xl font-semibold text-black mb-4 border-b pb-2">{dashboardTranslations.recentActivityTitle}</h3>
                                    <div className="space-y-2">
                                        {mockActivity.length > 0 ? (
                                            mockActivity.map((activity, index) => (
                                                <ActivityItem
                                                    key={index}
                                                    type={activity.type}
                                                    text={activity.text}
                                                    time={activity.time}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-gray-500">{dashboardTranslations.activityPlaceholder}</p>
                                        )}
                                    </div>
                                </div>
                            </section>
                            <aside className="lg:w-1/4 space-y-6">
                                <h3 className="text-lg font-semibold text-gray-600 border-b pb-2 mb-4">{lang === 'da' ? 'Information & Widgets' : 'Information & Widgets'}</h3>
                                <div className="bg-white shadow rounded-lg p-4 border-l-4 border-orange-500">
                                    <h4 className="text-lg font-semibold text-black mb-2">Nyheder</h4>
                                    <p className="text-gray-500 text-sm">Seneste opdateringer fra Down The Line teamet.</p>
                                </div>
                                <div className="bg-white shadow rounded-lg p-4 border-l-4 border-black">
                                    <h4 className="text-lg font-semibold text-black mb-2">Belastning (AI)</h4>
                                    <p className="text-gray-500 text-sm">Din ugentlige træningsbelastning vises her.</p>
                                </div>
                            </aside>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

