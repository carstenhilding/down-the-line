// components/SecureLayoutClient.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  Wrench,
  Layers,  // Ikon til "The Turf" og Canvas view
  PenTool, // Ikon til DTL Studio
  ClipboardList, // Ikon til Session Planner
  LayoutGrid // Ikon til Grid view
} from 'lucide-react';
import { UserRole, DTLUser, SubscriptionLevel } from '@/lib/server/data';
import { useLanguage } from './LanguageContext';
import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';

interface SecureTranslations {
  header: any;
  sidebar: any;
  dashboard: any;
  trainer_page?: any;
  trainer?: any;
}

interface SecureLayoutClientProps {
  children: ReactNode;
  user: DTLUser;
  dict: SecureTranslations;
  lang: 'da' | 'en';
  initialPathname: string;
}

// OPDATERET: Modul-struktur med "The Turf"
const modules = [
  { nameKey: 'dashboard', path: '/dashboard', icon: LayoutDashboard, role: 'tester' },
  {
    // DETTE ER DET NYE HOVEDMODUL-NAV: "THE TURF"
    nameKey: 'the_turf',        // Nøgle bruges til at finde teksten i JSON-filen
    icon: Layers,               // Ikonet der vises i sidebaren
    role: 'tester',
    path: '/trainer',           // Ruten, hvor DTL Dashboard (med 3 niveauer) ligger
    subModules: [
      { nameKey: 'session_planner', path: '/trainer/planner', icon: ClipboardList }, // Træningsplan
      { nameKey: 'dtl_studio', path: '/trainer/studio', icon: PenTool },           // DTL Studio
      { nameKey: 'exercise_catalog', path: '/trainer/library', icon: BookOpen },   // Øvelseskatalog
    ],
  },
  { nameKey: 'club', path: '/calendar', icon: Calendar, role: 'developer' },
  { nameKey: 'players', path: '/profiles', icon: Users, role: 'developer' },
  { nameKey: 'video', path: '/analysis', icon: Users, role: 'developer' },
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
  const searchParams = useSearchParams();
  const langContext = useLanguage();
  const language = langContext?.language ?? lang;
  const setLanguage =
    langContext?.setLanguage ?? (() => console.warn('setLanguage not available'));

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [simulatedLevel, setSimulatedLevel] = useState<SubscriptionLevel>(user.subscriptionLevel);

  const accessibleModules = modules.filter(
    (m) =>
      user.role === UserRole.Developer ||
      (user.role === UserRole.Tester && m.role !== UserRole.Developer)
  );

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

  const handleLevelChange = (level: SubscriptionLevel) => {
    setSimulatedLevel(level);
    // Her kunne man evt. gemme valget i en cookie eller context, så det huskes på tværs af sider
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
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [cleanCurrentRoute]);

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
          // Tjekker om hovedmodulet eller et undermodul er aktivt
          const isParentActive = module.path 
             ? cleanCurrentRoute.startsWith(module.path) 
             : module.subModules?.some(sub => cleanCurrentRoute.startsWith(sub.path));
             
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
                        {/* Evt. vis ikon for undermodul her hvis ønsket */}
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
    </aside>
  );

  const Header = () => {
    const isDtlEmployee = user.role === UserRole.Developer || user.role === UserRole.Tester;
    const headerDict = dict.header || {};
    const langSelectorDict = headerDict.languageSelector || {};

    // LOGIK FOR VIEW TOGGLE
    const isDashboardRoute = cleanCurrentRoute === '/dashboard';
    const canUseCanvas = ['Elite', 'Enterprise'].includes(user.subscriptionLevel) || [UserRole.Tester, UserRole.Developer].includes(user.role);
    
    // Bestemmer aktuel visning fra søgeparametre
    const currentView = searchParams.get('view') === 'canvas' ? 'canvas' : 'grid';

    const handleViewChange = (view: 'grid' | 'canvas') => {
        const currentParams = new URLSearchParams(searchParams.toString());
        
        if (view === 'grid') {
            currentParams.delete('view');
        } else {
            currentParams.set('view', 'canvas');
        }

        const newSearch = currentParams.toString();
        
        // Pusher til router med nye søgeparametre
        router.push(pathname + (newSearch ? `?${newSearch}` : ''));
    };
    // SLUT LOGIK FOR VIEW TOGGLE

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

          {/* SEKTION TIL VIEW TOGGLE */}
          {isDashboardRoute && (
            // OPDATERET: gap-0.5 for minimal afstand + items-end for at rykke ned
            <div className="flex items-end gap-0.5 mr-auto ml-20"> 
              {/* Grid Button */}
              <button
                  onClick={() => handleViewChange('grid')}
                  // OPDATERET: Ingen kant eller baggrund i aktiv tilstand
                  className={`flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold transition-colors border border-transparent 
                      ${currentView === 'grid' 
                        ? 'text-orange-600' // Aktiv: Kun orange tekst
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
              >
                  <LayoutGrid className="w-4 h-4" />
                  Grid
              </button>
              
              {/* Canvas Button */}
              <button
                  onClick={() => canUseCanvas && handleViewChange('canvas')}
                  disabled={!canUseCanvas}
                  title={!canUseCanvas ? (lang === 'da' ? 'Canvas kræver Elite eller Enterprise adgang' : 'Canvas requires Elite or Enterprise access') : ''}
                  // OPDATERET: Ingen kant eller baggrund i aktiv tilstand
                  className={`flex items-center gap-1 px-1 py-0.5 rounded-full text-xs font-semibold transition-colors border border-transparent
                      ${currentView === 'canvas' && canUseCanvas
                        ? 'text-orange-600' // Aktiv: Kun orange tekst
                        : 'text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
              >
                  <Layers className="w-4 h-4" />
                  Canvas
              </button>
            </div>
          )}
          {/* SLUT SEKTION TIL VIEW TOGGLE */}

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-1 rounded-lg cursor-pointer"
            >
              <UserIcon className="h-7 w-7 sm:h-8 sm:w-8 bg-orange-500 text-white rounded-full p-1 sm:p-1.5" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 sm:w-64 bg-white rounded-lg shadow-xl border z-30">
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
                <div className="p-1.5">
                  <a
                    href="#"
                    className="flex items-center w-full text-left p-2 rounded-md hover:bg-gray-100 text-xs cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {headerDict.settings ?? 'Account Settings'}
                  </a>
                  <div className="my-1 border-t"></div>
                  
                  {/* DEVELOPER TOOLS */}
                  {(isDtlEmployee || true) && (
                    <div className="mb-2 pb-2 border-b border-gray-100">
                       <div className="px-2 py-1 text-[10px] uppercase text-gray-400 font-bold flex items-center">
                          <Wrench className="w-3 h-3 mr-1" /> Developer Tools
                       </div>
                       <div className="px-2 grid grid-cols-3 gap-1 mt-1">
                          {(['Starter', 'Expert', 'Elite'] as SubscriptionLevel[]).map((level) => (
                             <button
                                key={level}
                                onClick={() => handleLevelChange(level)}
                                className={`text-[10px] py-1 px-1 rounded border transition-colors 
                                   ${
                                     simulatedLevel === level 
                                       ? 'bg-orange-500 border-orange-500 text-white font-bold' 
                                       : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                   }`}
                             >
                                {level}
                             </button>
                          ))}
                       </div>
                    </div>
                  )}
                  {/* END DEVELOPER TOOLS */}

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
                      <span className="font-medium text-gray-600">{simulatedLevel}</span>
                    </p>
                  </div>
                </div>
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
      </div>
    );
  };

  return (
    <div
      id="secure-layout-client-root"
      className="flex flex-col h-full bg-gray-50 text-black overflow-hidden"
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