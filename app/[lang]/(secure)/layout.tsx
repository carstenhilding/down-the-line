"use client";

import React, { use, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { LayoutDashboard, Users, Zap, Calendar, Activity, Shield, BookOpen, LogOut, Settings, User as UserIcon, Menu, Globe, ChevronDown } from 'lucide-react';
import { auth, db } from '../../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '../../../components/LanguageContext'; 
import Link from 'next/link';

// KORREKT IMPORTERET: Funktion fra den ene fil
import { getAllSecureTranslations } from '../../../i18n/getSecurePageTranslations'; 
// KORREKT IMPORTERET: Type fra den centrale index-fil
import { secureI18n } from '../../../i18n/index'; 


type UserRole = 'developer' | 'tester' | 'unknown';
// Denne type er nu korrekt hentet fra index.ts
type SecureTranslations = typeof secureI18n['en'];

const modules = [
    { nameKey: 'dashboard', path: '/dashboard', icon: LayoutDashboard, role: 'tester' },
    { 
        nameKey: 'training', 
        icon: BookOpen, 
        role: 'tester',
        path: '/trainer',
        subModules: [
            { nameKey: 'training_new', path: '/trainer/new' },
            { nameKey: 'training_library', path: '/trainer/library' },
        ] 
    },
    { nameKey: 'club', path: '/club', icon: Calendar, role: 'developer' },
    { nameKey: 'players', path: '/players', icon: Users, role: 'developer' },
    { nameKey: 'video', path: '/video', icon: Zap, role: 'developer' },
    { nameKey: 'scouting', path: '/scouting', icon: Shield, role: 'developer' },
    { nameKey: 'chat', path: '/chat', icon: Activity, role: 'developer' },
];

export default function SecureLayout({ children, params: paramsPromise }: { children: ReactNode, params: Promise<{ lang: 'da' | 'en' }> }) {
    
    const params = use(paramsPromise);
    const { lang } = params;
    const router = useRouter();
    const pathname = usePathname();
    const { language, setLanguage } = useLanguage(); 

    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userRole, setUserRole] = useState<UserRole>('unknown');
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const [secureTranslations, setSecureTranslations] = useState<SecureTranslations | null>(null);

    const changeLanguage = (newLang: 'da' | 'en') => {
        if (newLang !== language) {
            const newPath = pathname.replace(`/${language}`, `/${newLang}`);
            router.push(newPath);
            setIsProfileOpen(false);
            setLanguage(newLang);
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
        } catch (error) { console.error("Error fetching user role:", error); setUserRole('unknown'); }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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
        try { await signOut(auth); setIsProfileOpen(false); } 
        catch (error) { console.error("Error signing out:", error); }
    };
    
    // NY LOGIK: Henter secure translations lokalt
    useEffect(() => {
        async function loadTranslations() {
            try {
                const allTranslations = getAllSecureTranslations(lang);
                setSecureTranslations(allTranslations);
            } catch (error) {
                console.error("SecureLayout failed to load translations:", error);
                // RETTET FEJL 1: Type-casting af fallback
                setSecureTranslations({} as SecureTranslations); 
            }
        }
        loadTranslations();
    }, [lang]); 

    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 350); 
        return () => clearTimeout(timer);
    }, [isSidebarOpen]);

    const currentRoute = pathname.replace(`/${language}`, '').replace('//', '/');

    useEffect(() => {
        const activeModule = modules.find(m => m.subModules?.some(sub => currentRoute.startsWith(sub.path)) || (m.path && currentRoute.startsWith(m.path) && m.subModules));
        setOpenMenu(activeModule ? activeModule.nameKey : null);
    }, [currentRoute]);
    
    // TJEK PÅ OVERSÆTTELSER
    if (!secureTranslations || !secureTranslations.dashboard || !secureTranslations.sidebar) {
         const loadingText = secureTranslations?.dashboard?.loading || (lang === 'da' ? 'Indlæser oversættelser...' : 'Loading translations...');
         return <div className="flex min-h-screen items-center justify-center bg-white"><p>{loadingText}</p></div>;
    }
    
    // RETTET FEJL 2, 3, 4: Bruger index signatur for dynamisk adgang
    const dashboardTranslations = secureTranslations.dashboard;
    const sidebarTranslations: { [key: string]: string } = secureTranslations.sidebar;

    if (loadingAuth || !user || userRole === 'unknown') {
        return <div className="flex min-h-screen items-center justify-center bg-white"><p>{dashboardTranslations.loading || (lang === 'da' ? 'Indlæser...' : 'Loading...')}</p></div>;
    }
    
    if (userRole !== 'developer' && userRole !== 'tester') {
        return <div className="flex min-h-screen items-center justify-center bg-orange-50"><p>{lang === 'da' ? 'Adgang nægtet.' : 'Access denied.'}</p></div>;
    }
    
    const accessibleModules = modules.filter(m => userRole === 'developer' || (userRole === 'tester' && m.role !== 'developer'));

    return (
        <div id="secure-layout-root" className="min-h-screen bg-gray-50 text-black">
            <header className="h-12 bg-white border-b sticky top-0 z-50 w-full flex items-center justify-between">
                <div className="flex items-center pl-4">
                   <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-100 mr-2 cursor-pointer">
                        <Menu className="h-5 w-5 text-gray-700" />
                   </button>
                   <div className="p-2">
                        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
                    </div>
                </div>
                <div className="relative pr-4" ref={profileRef}>
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="p-2 rounded-lg cursor-pointer">
                        <UserIcon className="h-8 w-8 bg-orange-500 text-white rounded-full p-1.5" />
                    </button>
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-10">
                            <div className="p-3 border-b"><p className="font-semibold text-sm truncate">{user.email}</p><p className="text-xs text-gray-500 capitalize">{userRole}</p></div>
                            <div className="p-1.5">
                                <a href="#" className="flex items-center w-full text-left p-2 rounded-md hover:bg-gray-100 text-xs cursor-pointer"><Settings className="h-4 w-4 mr-2" />Account Settings</a>
                                <div className="my-1 border-t"></div>
                                <div className="flex items-center p-2 text-xs text-gray-400"><Globe className="h-4 w-4 mr-2" />Language</div>
                                <button onClick={() => changeLanguage('da')} className={`w-full text-left px-2 py-1 rounded-md text-xs cursor-pointer ${language === 'da' ? 'font-semibold text-orange-600' : 'hover:bg-gray-100'}`}>Dansk</button>
                                <button onClick={() => changeLanguage('en')} className={`w-full text-left px-2 py-1 rounded-md text-xs cursor-pointer ${language === 'en' ? 'font-semibold text-orange-600' : 'hover:bg-gray-100'}`}>English</button>
                            </div>
                            <div className="border-t p-1.5">
                                <button onClick={handleLogout} className="flex items-center w-full text-left p-2 rounded-md bg-orange-500 text-white text-xs hover:bg-orange-600 font-bold cursor-pointer"><LogOut className="h-4 w-4 mr-2" />{dashboardTranslations.logoutButton}</button>
                            </div>
                        </div>
                    )}
                </div>
            </header>
            <div className="flex" style={{ height: 'calc(100vh - 48px)' }}>
                <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r flex flex-col shrink-0 transition-all duration-300`}>
                    <nav className="flex-1 mt-2 space-y-1 p-2">
                        {accessibleModules.map((module) => {
                            if (!module.subModules) {
                                const isActive = module.path && currentRoute.startsWith(module.path);
                                return (
                                    <Link key={module.nameKey} href={`/${language}${module.path}`} className={`relative flex items-center p-2 rounded-lg transition-colors group cursor-pointer ${!isSidebarOpen && 'justify-center'} ${isActive ? 'bg-black text-orange-500 font-bold text-sm' : 'text-black hover:text-orange-500 text-xs'}`}>
                                        <module.icon className="h-5 w-5 shrink-0" />
                                        <span className={`ml-3 whitespace-nowrap transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} ${!isSidebarOpen && 'hidden'}`}>{sidebarTranslations[module.nameKey]}</span>
                                    </Link>
                                );
                            }
                            const isParentActive = module.path ? currentRoute.startsWith(module.path) : false;
                            const isOpen = openMenu === module.nameKey;
                            return (
                                <div key={module.nameKey}>
                                    <button
                                        onClick={() => {
                                            router.push(`/${language}${module.path}`);
                                            if (isSidebarOpen) {
                                                setOpenMenu(isOpen ? null : module.nameKey);
                                            }
                                        }}
                                        className={`relative flex items-center w-full p-2 rounded-lg transition-colors group cursor-pointer ${!isSidebarOpen && 'justify-center'} ${isParentActive || isOpen ? 'bg-black text-orange-500 font-bold text-sm' : 'text-black hover:text-orange-500 text-xs'}`}
                                    >
                                        <module.icon className="h-5 w-5 shrink-0" />
                                        <span className={`ml-3 whitespace-nowrap transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} ${!isSidebarOpen && 'hidden'}`}>{sidebarTranslations[module.nameKey]}</span>
                                        {isSidebarOpen && <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
                                    </button>
                                    {isSidebarOpen && isOpen && (
                                        <div className="mt-1 ml-4 pl-2 border-l-2 border-gray-200">
                                            {module.subModules!.map(subModule => {
                                                const isSubActive = currentRoute.startsWith(subModule.path);
                                                return <Link key={subModule.nameKey} href={`/${language}${subModule.path}`} className={`flex items-center w-full py-1.5 px-2 rounded-lg my-0.5 transition-colors cursor-pointer ${isSubActive ? 'bg-black text-orange-500 font-bold text-sm' : 'text-black hover:text-orange-500 text-xs'}`}>{sidebarTranslations[subModule.nameKey]}</Link>
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </nav>
                </aside>
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}