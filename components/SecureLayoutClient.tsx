// components/SecureLayoutClient.tsx
'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
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
  Layers,
  PenTool,
  ClipboardList,
  LayoutGrid
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

const modules = [
  { nameKey: 'dashboard', path: '/dashboard', icon: LayoutDashboard },
  {
    nameKey: 'the_turf',        
    icon: Layers,               
    path: '/trainer',           
    subModules: [
      { nameKey: 'session_planner', path: '/trainer/planner', icon: ClipboardList },
      { nameKey: 'dtl_studio', path: '/trainer/studio', icon: PenTool },
      { nameKey: 'exercise_catalog', path: '/trainer/library', icon: BookOpen },
    ],
  },
  { nameKey: 'club', path: '/calendar', icon: Calendar },
  { nameKey: 'players', path: '/profiles', icon: Users },
  { nameKey: 'video', path: '/analysis', icon: Users },
  { nameKey: 'scouting', path: '/scouting', icon: Shield },
  { nameKey: 'chat', path: '/comms', icon: Activity },
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
  const setLanguage = langContext?.setLanguage ?? (() => console.warn('setLanguage not available'));

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // --- Developer Tools State ---
  const [simulatedLevel, setSimulatedLevel] = useState<SubscriptionLevel>(user.subscriptionLevel);
  const [simulatedRole, setSimulatedRole] = useState<UserRole>(user.role);

  const isDtlEmployee = user.role === UserRole.Developer || user.role === UserRole.Tester;

  // --- ADGANGSKONTROL LOGIK ---
  const checkAccess = (role: UserRole, moduleKey: string) => {
    // Developers og Testers ser alt
    if (role === UserRole.Developer || role === UserRole.Tester) return true;

    switch (moduleKey) {
      case 'dashboard': 
        return true; // Alle har adgang til Dashboard (Styrehuset)
        
      case 'the_turf': 
        // Kun trænere og ledere har adgang til The Turf
        return [
          UserRole.HeadOfCoach, UserRole.Coach, UserRole.AssistantCoach,
          UserRole.KeeperCoach, UserRole.TransitionsCoach, UserRole.FitnessCoach,
          UserRole.IndividualCoach, UserRole.DefenseCoach, UserRole.AttackCoach, 
          UserRole.DeadBallCoach, UserRole.AcademyDirector, UserRole.YouthDevelopmentCoach
        ].includes(role);
        
      case 'club': 
        // Klub-admin, ejere og ledelse
        return [
          UserRole.ClubOwner, UserRole.ClubAdmin, UserRole.Management, 
          UserRole.AcademyDirector, UserRole.TeamLead
        ].includes(role);
        
      case 'players': 
        // Trænere, Scouts og Admin
        return [
          UserRole.HeadOfCoach, UserRole.Coach, UserRole.AssistantCoach, 
          UserRole.Scout, UserRole.AcademyDirector, UserRole.ClubAdmin,
          UserRole.YouthDevelopmentCoach
        ].includes(role);
        
      case 'video':
        // Trænere, Analytikere, Scouts og Spillere
        return [
          UserRole.HeadOfCoach, UserRole.Coach, UserRole.AssistantCoach,
          UserRole.Analyst, UserRole.Scout, UserRole.Player,
          UserRole.TransitionsCoach, UserRole.KeeperCoach
        ].includes(role);
        
      case 'scouting':
        // Kun Scouts og Ledelse
        return [
          UserRole.Scout, UserRole.HeadOfCoach, UserRole.AcademyDirector, 
          UserRole.ClubOwner, UserRole.ClubAdmin
        ].includes(role);
        
      case 'chat': 
        return true; // Alle har adgang til chat
        
      default: 
        return false;
    }
  };

  // Filtrer moduler baseret på den SIMULEREDE rolle
  const accessibleModules = modules.filter(m => checkAccess(simulatedRole, m.nameKey));

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
  };

  const handleRoleChange = (role: UserRole) => {
    setSimulatedRole(role);
    console.log("Simuleret rolle skiftet til:", role);
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

  const subGroups = [
    { title: 'Træner (Privat)', levels: ['Starter', 'Advance', 'Expert'] },
    { title: 'Klub (Bredde)', levels: ['Essential', 'Growth', 'Complete'] },
    { title: 'Akademi / Pro', levels: ['Performance', 'Elite', 'Enterprise'] }
  ];

  const roleGroups = [
    {
      title: 'Ledelse & Admin',
      roles: [UserRole.ClubOwner, UserRole.ClubAdmin, UserRole.Management, UserRole.AcademyDirector]
    },
    {
      title: 'Trænerstab (General)',
      roles: [UserRole.HeadOfCoach, UserRole.YouthDevelopmentCoach, UserRole.Coach, UserRole.AssistantCoach]
    },
    {
      title: 'Specialister',
      roles: [UserRole.KeeperCoach, UserRole.TransitionsCoach, UserRole.IndividualCoach, UserRole.DefenseCoach, UserRole.AttackCoach, UserRole.DeadBallCoach]
    },
    {
      title: 'Performance & Sundhed',
      roles: [UserRole.FitnessCoach, UserRole.Physio]
    },
    {
      title: 'Analyse & Scouting',
      roles: [UserRole.Analyst, UserRole.Scout]
    },
    {
      title: 'Spillere & Hold',
      roles: [UserRole.Player, UserRole.Parent, UserRole.TeamLead, UserRole.ExternalPlayer]
    },
    {
      title: 'Teknisk',
      roles: [UserRole.Developer, UserRole.Tester, UserRole.CustomRole]
    }
  ];

  const Sidebar = () => (
    <aside
      className={`${
        isSidebarOpen ? 'w-64 lg:w-52 2xl:w-64' : 'w-20'
      } bg-white border-r flex flex-col shrink-0 transition-all duration-300 lg:block ${
        isSidebarOpen
          ? 'max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-30 max-lg:pt-12'
          : 'max-lg:hidden'
      }`}
    >
      <nav className="flex-1 mt-2 space-y-1 p-2 overflow-y-auto custom-scrollbar">
        {accessibleModules.map((module) => {
          const sidebarDict = dict.sidebar || {};
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
                  className={`ml-3 whitespace-nowrap transition-opacity text-xs 2xl:text-sm ${
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
                  className={`ml-3 whitespace-nowrap transition-opacity text-xs 2xl:text-sm ${
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
                            ? 'bg-black text-orange-500 font-bold'
                            : 'text-black hover:text-orange-500'
                        } 
                        text-[11px] 2xl:text-xs
                        `}
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
    </aside>
  );

  const Header = () => {
    const headerDict = dict.header || {};
    const langSelectorDict = headerDict.languageSelector || {};

    const isDashboardRoute = cleanCurrentRoute === '/dashboard';
    const canUseCanvas = ['Elite', 'Enterprise'].includes(simulatedLevel) || [UserRole.Tester, UserRole.Developer].includes(simulatedRole);
    
    const currentView = searchParams.get('view') === 'canvas' ? 'canvas' : 'grid';

    const handleViewChange = (view: 'grid' | 'canvas') => {
        const currentParams = new URLSearchParams(searchParams.toString());
        if (view === 'grid') {
            currentParams.delete('view');
        } else {
            currentParams.set('view', 'canvas');
        }
        const newSearch = currentParams.toString();
        router.push(pathname + (newSearch ? `?${newSearch}` : ''));
    };

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

          {isDashboardRoute && (
            <div className="flex items-end gap-0.5 mr-auto ml-20"> 
              <button
                  onClick={() => handleViewChange('grid')}
                  className={`flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold transition-colors border border-transparent 
                      ${currentView === 'grid' 
                        ? 'text-orange-600' 
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
              >
                  <LayoutGrid className="w-4 h-4" />
                  Grid
              </button>
              
              <button
                  onClick={() => canUseCanvas && handleViewChange('canvas')}
                  disabled={!canUseCanvas}
                  title={!canUseCanvas ? (lang === 'da' ? 'Canvas kræver Elite eller Enterprise adgang' : 'Canvas requires Elite or Enterprise access') : ''}
                  className={`flex items-center gap-1 px-1 py-0.5 rounded-full text-xs font-semibold transition-colors border border-transparent
                      ${currentView === 'canvas' && canUseCanvas
                        ? 'text-orange-600' 
                        : 'text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
              >
                  <Layers className="w-4 h-4" />
                  Canvas
              </button>
            </div>
          )}

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-1 rounded-lg cursor-pointer"
            >
              <UserIcon className="h-7 w-7 sm:h-8 sm:w-8 bg-orange-500 text-white rounded-full p-1 sm:p-1.5" />
            </button>
            {isProfileOpen && (
              <div 
                className={`
                  absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-30 overflow-hidden 
                  ${isDtlEmployee ? 'w-[30rem]' : 'w-64'}
                `}
              >
                
                {/* User Info Header */}
                <div className="p-3 border-b border-gray-100">
                  <p className="font-semibold text-sm truncate text-black">{user.name}</p>
                  {isDtlEmployee ? (
                    <>
                      <p className="text-xs text-gray-500">Down The Line</p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-xs font-bold text-orange-500 capitalize">{simulatedRole.replace(/_/g, ' ')}</span>
                         {simulatedRole !== user.role && <span className="text-[9px] bg-gray-100 px-1.5 rounded text-gray-500">(Simuleret)</span>}
                      </div>
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
                
                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                  
                  <div className="p-1.5">
                    <a href="#" className="flex items-center w-full text-left p-2 rounded-md hover:bg-gray-100 text-xs cursor-pointer text-black font-medium">
                      <Settings className="h-4 w-4 mr-2 text-gray-400" />
                      {headerDict.settings ?? 'Account Settings'}
                    </a>
                  </div>
                  
                  <div className="my-1 border-t"></div>
                  
                  {/* --- DEVELOPER TOOLS (ORGANISED) --- */}
                  {(isDtlEmployee || true) && (
                    <div className="bg-white">
                       <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center">
                          <Wrench className="w-3 h-3 mr-2 text-orange-500" /> 
                          <span className="text-[10px] uppercase font-bold text-black tracking-wider">Developer Tools</span>
                       </div>
                       
                       {/* 1. ABONNEMENTER */}
                       <div className="p-3">
                          <div className="text-[10px] font-bold text-black mb-2 uppercase tracking-wider">Abonnement</div>
                          <div className="space-y-2">
                            {subGroups.map((group, idx) => (
                              <div key={idx}>
                                <p className="text-[9px] text-gray-500 mb-1 pl-1">{group.title}</p>
                                <div className="grid grid-cols-3 gap-1">
                                  {group.levels.map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => handleLevelChange(level as SubscriptionLevel)}
                                        className={`text-[10px] py-1 px-1 rounded border transition-all font-medium
                                          ${
                                            simulatedLevel === level 
                                              ? 'bg-orange-500 border-orange-500 text-white shadow-sm' 
                                              : 'bg-white border-gray-200 text-black hover:border-black'
                                          }`}
                                    >
                                        {level}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                       </div>

                       <div className="border-t border-gray-100"></div>

                       {/* 2. ROLLER */}
                       <div className="p-3">
                          <div className="text-[10px] font-bold text-black mb-2 uppercase tracking-wider flex items-center">
                             <Shield className="w-3 h-3 mr-1" /> Roller
                          </div>
                          <div className="space-y-3">
                             {roleGroups.map((group, idx) => (
                                <div key={idx}>
                                   <p className="text-[9px] text-gray-500 mb-1 pl-1 border-l-2 border-orange-500 leading-none">{group.title}</p>
                                   <div className="grid grid-cols-2 gap-1">
                                      {group.roles.map((role) => (
                                        <button
                                           key={role}
                                           onClick={() => handleRoleChange(role)}
                                           className={`text-[10px] py-1.5 px-2 rounded border transition-all text-left truncate
                                              ${
                                                simulatedRole === role
                                                  ? 'bg-orange-500 border-orange-500 text-white font-bold shadow-sm' 
                                                  : 'bg-white border-gray-200 text-black hover:border-black'
                                              }`}
                                           title={role.replace(/_/g, ' ')}
                                        >
                                           {role.replace(/_/g, ' ')}
                                        </button>
                                      ))}
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="my-1 border-t"></div>

                  {/* Language Selector */}
                  <div className="p-1.5">
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
                </div>

                {/* Footer: Log Out */}
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
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-0">
          {children}
        </main>
      </div>
    </div>
  );
}