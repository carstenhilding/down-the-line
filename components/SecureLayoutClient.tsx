// components/SecureLayoutClient.tsx (RENSERET: Quick Access Knapper fjernet fra Header)
'use client';

import React, { useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
// Opdateret imports for at fjerne Rocket og Zap, da de nu bor i DashboardClient
import {
  LayoutDashboard,
  Users,
  Menu,
  LogOut,
  Settings,
  User as UserIcon,
  Globe,
  ChevronDown,
  BookOpen,
  Calendar,
  Activity,
  Shield,
} from 'lucide-react';
import { UserRole, DTLUser, SubscriptionLevel } from '@/lib/server/data';
// Sikr dig at stien til LanguageContext er korrekt
import { useLanguage } from './LanguageContext';
// Sikr dig at stien til firebase config er korrekt
import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';

// Typer for oversættelser
interface SecureTranslations {
  header: any;
  sidebar: any;
  dashboard: any;
  trainer_page?: any;
  trainer?: any;
  // ... andre nøgler ...
}

interface SecureLayoutClientProps {
  children: ReactNode;
  user: DTLUser;
  dict: SecureTranslations;
  lang: 'da' | 'en';
  initialPathname: string;
}

// Definition af moduler
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
    ],
  },
  { nameKey: 'club', path: '/calendar', icon: Calendar, role: 'developer' },
  { nameKey: 'players', path: '/profiles', icon: Users, role: 'developer' },
  { nameKey: 'video', path: '/analysis', icon: Users, role: 'developer' }, // OBS: Users Icon er brugt her - bør måske være Zap/Video
  { nameKey: 'scouting', path: '/scouting', icon: Shield, role: 'developer' },
  { nameKey: 'chat', path: '/comms', icon: Activity, role: 'developer' },
];

export default function SecureLayoutClient({
  children,
  user,
  dict,
  lang,
  initialPathname,
}: SecureLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname() ?? initialPathname;
  const langContext = useLanguage();
  const language = langContext?.language ?? lang;
  const setLanguage =
    langContext?.setLanguage ?? (() => console.warn('setLanguage not available'));

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const accessibleModules = modules.filter(
    (m) =>
      user.role === UserRole.Developer ||
      (user.role === UserRole.Tester && m.role !== UserRole.Developer)
  );

  // --- Client-side logik (hooks, handlers) ---
  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      )
        setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (newLang: 'da' | 'en') => {
    if (language && newLang !== language) {
      const currentLangSegment = `/${language}`;
      const newPath = pathname.startsWith(currentLangSegment)
        ? pathname.replace(currentLangSegment, `/${newLang}`)
        : `/${newLang}${pathname}`;
      router.push(newPath);
      setIsProfileOpen(false);
      setLanguage(newLang);
    } else {
      console.warn('Language context not ready or lang unchanged.');
      const newPath = pathname.includes('/da/')
        ? pathname.replace('/da/', `/${newLang}`)
        : pathname.includes('/en/')
        ? pathname.replace('/en/', `/${newLang}`)
        : `/${newLang}${pathname}`;
      router.push(newPath);
      setIsProfileOpen(false);
      setLanguage(newLang);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsProfileOpen(false);
      router.push(`/${language}/login`);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const currentLangSegment = language
    ? `/${language}`
    : pathname.startsWith('/da/')
    ? '/da'
    : '/en';
  const currentRoute = pathname.replace(currentLangSegment, '').replace('//', '/');
  const cleanCurrentRoute = currentRoute.startsWith('//')
    ? currentRoute.substring(1)
    : currentRoute;

  useEffect(() => {
    const activeModule = modules.find(
      (m) =>
        m.subModules?.some((sub) => cleanCurrentRoute.startsWith(sub.path)) ||
        (m.path && cleanCurrentRoute.startsWith(m.path) && m.subModules)
    );
    setOpenMenu(activeModule ? activeModule.nameKey : null);
    // Luk sidebar på mobil ved ruteskift
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [cleanCurrentRoute]); // Opdaterer når ruten ændres
  // --- Slut på Client-side logik ---

  // === SIDEBAR JSX ===
  const Sidebar = () => (
    <aside
      className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } bg-white border-r flex flex-col shrink-0 transition-all duration-300 lg:block ${
        isSidebarOpen
          ? 'max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-30 max-lg:pt-12'
          : 'max-lg:hidden'
      }`}
    >
      <nav className="flex-1 mt-2 space-y-1 p-2 overflow-y-auto">
        {accessibleModules.map((module) => {
          const sidebarDict = dict.sidebar || {};
          if (!module.subModules) {
            const isActive = module.path && cleanCurrentRoute.startsWith(module.path);
            return (
              <Link
                key={module.nameKey}
                href={`/${lang}${module.path}`}
                className={`relative flex items-center p-2 rounded-lg transition-colors group cursor-pointer ${
                  !isSidebarOpen && 'justify-center'
                } ${
                  isActive
                    ? 'bg-black text-orange-500 font-bold text-sm'
                    : 'text-black hover:text-orange-500 text-xs'
                }`}
              >
                <module.icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive
                      ? 'text-orange-500'
                      : 'text-gray-600 group-hover:text-orange-500'
                  }`}
                />
                <span
                  className={`ml-3 whitespace-nowrap transition-opacity ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0'
                  } ${!isSidebarOpen && 'hidden'}`}
                >
                  {sidebarDict[module.nameKey] ?? module.nameKey}
                </span>
              </Link>
            );
          }
          const isParentActive = module.path ? cleanCurrentRoute.startsWith(module.path) : false;
          const isOpen = openMenu === module.nameKey;
          return (
            <div key={module.nameKey}>
              <button
                onClick={() => {
                  if (module.path) router.push(`/${lang}${module.path}`);
                  if (isSidebarOpen) {
                    setOpenMenu(isOpen ? null : module.nameKey);
                  }
                }}
                className={`relative flex items-center w-full p-2 rounded-lg transition-colors group cursor-pointer ${
                  !isSidebarOpen && 'justify-center'
                } ${
                  isParentActive || isOpen
                    ? 'bg-black text-orange-500 font-bold text-sm'
                    : 'text-black hover:text-orange-500 text-xs'
                }`}
              >
                <module.icon
                  className={`h-5 w-5 shrink-0 ${
                    isParentActive || isOpen
                      ? 'text-orange-500'
                      : 'text-gray-600 group-hover:text-orange-500'
                  }`}
                />
                <span
                  className={`ml-3 whitespace-nowrap transition-opacity ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0'
                  } ${!isSidebarOpen && 'hidden'}`}
                >
                  {sidebarDict[module.nameKey] ?? module.nameKey}
                </span>
                {isSidebarOpen && (
                  <ChevronDown
                    className={`ml-auto h-4 w-4 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>
              {isSidebarOpen && isOpen && (
                <div className="mt-1 ml-4 pl-2 border-l-2 border-gray-200">
                  {module.subModules!.map((subModule) => {
                    const isSubActive = cleanCurrentRoute.startsWith(subModule.path);
                    return (
                      <Link
                        key={subModule.nameKey}
                        href={`/${lang}${subModule.path}`}
                        className={`flex items-center w-full py-1.5 px-2 rounded-lg my-0.5 transition-colors cursor-pointer ${
                          isSubActive
                            ? 'bg-black text-orange-500 font-bold text-sm'
                            : 'text-black hover:text-orange-500 text-xs'
                        }`}
                      >
                        {sidebarDict[subModule.nameKey] ?? subModule.nameKey}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      {/* Footer fjernet */}
    </aside>
  );
  // === SLUT PÅ SIDEBAR JSX ===

  // === HEADER JSX (Uden Quick Access Bar) ===
  const Header = () => {
    const isDtlEmployee = user.role === UserRole.Developer || user.role === UserRole.Tester;
    const headerDict = dict.header || {};
    const langSelectorDict = headerDict.languageSelector || {};

    return (
      <div className="w-full bg-white flex-shrink-0 z-20 relative border-b">
        <div className="h-12 flex items-center justify-between px-2 sm:px-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded-full hover:bg-gray-100 cursor-pointer mr-2 sm:mr-3"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
            <img src="/images/logo.png" alt="DTL Logo" className="h-7 sm:h-8 w-auto" />
          </div>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-1 rounded-lg cursor-pointer"
            >
              <UserIcon className="h-7 w-7 sm:h-8 sm:w-8 bg-orange-500 text-white rounded-full p-1 sm:p-1.5" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 sm:w-64 bg-white rounded-lg shadow-xl border z-30">
                {/* Øverste sektion med brugerinfo */}
                <div className="p-3 border-b">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  {isDtlEmployee ? (
                    <>
                      <p className="text-xs text-gray-500">Down The Line</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-gray-500">{user.clubName ?? 'Ukendt Klub'}</p>
                      <p className="text-xs text-gray-500">
                        {user.clubFunction ?? user.role}
                      </p>
                    </>
                  )}
                </div>
                {/* Midtersektion (Settings, Language, Access Level) */}
                <div className="p-1.5">
                  <a
                    href="#"
                    className="flex items-center w-full text-left p-2 rounded-md hover:bg-gray-100 text-xs cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {headerDict.settings ?? 'Account Settings'}
                  </a>
                  <div className="my-1 border-t"></div>
                  <div className="flex items-center p-2 text-xs text-gray-400">
                    <Globe className="h-4 w-4 mr-2" />
                    {langSelectorDict.label ?? 'Language'}
                  </div>
                  <button
                    onClick={() => changeLanguage('da')}
                    className={`w-full text-left px-2 py-1 rounded-md text-xs cursor-pointer ${
                      lang === 'da' ? 'font-semibold text-orange-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    {langSelectorDict.danish ?? 'Dansk'}
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full text-left px-2 py-1 rounded-md text-xs cursor-pointer ${
                      lang === 'en' ? 'font-semibold text-orange-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    {langSelectorDict.english ?? 'English'}
                  </button>
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 px-2 text-center">
                      {headerDict.access_level_label ??
                        (lang === 'da' ? 'Adgangsniveau:' : 'Access Level:')}{' '}
                      {user.subscriptionLevel}
                    </p>
                  </div>
                </div>
                {/* Nederste sektion (Logout) */}
                <div className="border-t p-1.5">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left p-2 rounded-md bg-orange-500 text-white text-xs hover:bg-orange-600 font-bold cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {dict.dashboard?.logoutButton ?? 'Log Out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Quick Access Bar er ikke længere her */}
      </div>
    );
  };
  // === SLUT PÅ HEADER JSX ===

  // === LAYOUT STRUKTUR ===
  return (
    <div
      id="secure-layout-client-root"
      className="flex flex-col h-screen bg-gray-50 text-black overflow-hidden"
    >
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        <main className="flex-1 overflow-y-auto p-2 md:p-4">
          {children}
        </main>
      </div>
    </div>
  );
}