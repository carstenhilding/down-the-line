// app/[lang]/(secure)/dashboard/DashboardClient.tsx (Fuldt refaktoreret)

'use client';

// Imports
import React, { useMemo, useState } from 'react';
import {
  Users,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Activity,
  ArrowRight,
  Video,
  User as UserIcon,
  Calendar as CalendarIcon,
  Star,
  Target,
  GitPullRequestArrowIcon,
  LayoutGrid, 
  View, 
  PlusCircle, 
} from 'lucide-react';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import Link from 'next/link';
import { UserRole, SubscriptionLevel } from '@/lib/server/data';

// --- NYE WIDGET IMPORTS ---
// Importerer de komponenter, vi lige har oprettet og flyttet
import ReadinessAlertWidget from '@/components/dashboard/widgets/ReadinessAlertWidget';
import CalendarWidget from '@/components/dashboard/widgets/CalendarWidget';
import MessageWidget from '@/components/dashboard/widgets/MessageWidget';
import ActivityWidget from '@/components/dashboard/widgets/ActivityWidget';
// --- SLUT NYE IMPORTS ---


// --- TYPE DEFINITIONER (Uændret) ---
interface SecureTranslations {
  dashboard: any;
  lang?: 'da' | 'en';
  // ... andre nøgler ...
}

interface DashboardData {
  activityFeed: string[];
  teamReadiness: { score: number; status: string };
}

interface DashboardProps {
  dict: SecureTranslations;
  dashboardData: DashboardData;
  accessLevel: SubscriptionLevel;
  userRole: UserRole;
}

type GridItem = {
  id: string;
  priority: 'high' | 'medium' | 'low';
  type: 'readiness_alert' | 'calendar' | 'message' | 'activity';
  data: any;
  gridSpan: number;
};

// --- START: KOMPONENTER TIL LAYOUT ---

// 1. Quick Access Bar (Uændret)
const QuickAccessBar = ({ t, accessLevel, lang }: { t: any; accessLevel: SubscriptionLevel, lang: 'da' | 'en' }) => {
    const isPremium = ['Expert', 'Complete', 'Elite', 'Enterprise'].includes(accessLevel);
    const buttonClass = "flex items-center justify-between p-2 sm:p-3 text-xs sm:text-sm bg-black text-white transition duration-200 shadow-xl rounded-lg border-2 border-black group hover:-translate-y-1 hover:shadow-2xl";
    const trainingTitle = lang === 'da' ? 'Opret Session' : 'Create Session';
    const drillTitle = lang === 'da' ? 'Opret Øvelse' : 'Create Drill';
    const readinessTitle = t.readiness ?? 'Readiness';
    const analysisTitle = 'Video Analysis';
    const ICON_SIZE_CLASS = "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-3";

    return (
        <div className="flex flex-wrap gap-4 md:gap-4 mb-4">
            {/* 1. Create Session (Altid synlig) */}
            <Link href="/trainer/new"
                  className={buttonClass + " w-full md:w-[calc(50%-8px)] lg:w-[calc(33.33%-10.66px)] xl:w-[calc(25%-12px)]"}>
                <div className='flex items-center'>
                    <CalendarIcon className={ICON_SIZE_CLASS + " text-orange-500 shrink-0"} />
                </div>
                <div className='flex flex-col flex-1 items-center justify-center text-center'>
                    <span className='font-bold text-xs sm:text-sm'>{t.createSessionTitle ?? 'Ny Træningsplan'}</span>
                    <span className='text-[10px] text-gray-400'>{t.sessionPlannerSubtitle ?? 'Træning Planlægning'}</span>
                </div>
                <div className={ICON_SIZE_CLASS}></div>
            </Link>
          
            {/* 2. Create Drill (Altid synlig) */}
            <Link href="/trainer/new?mode=exercise"
                  className={buttonClass + " w-full md:w-[calc(50%-8px)] lg:w-[calc(33.33%-10.66px)] xl:w-[calc(25%-12px)]"}>
                <div className='flex items-center'>
                    <GitPullRequestArrowIcon className={ICON_SIZE_CLASS + " text-orange-500 shrink-0"} />
                </div>
                <div className='flex flex-col flex-1 items-center justify-center text-center'>
                    <span className='font-bold text-xs sm:text-sm'>{t.createDrillTitle ?? 'Ny Øvelse'}</span>
                    <span className='text-[10px] text-gray-400'>{t.dtlStudioSubtitle ?? 'DTL Studio'}</span>
                </div>
                <div className={ICON_SIZE_CLASS}></div>
            </Link>
          
            {/* 3. Readiness / Player (Premium) */}
            {isPremium && (
                <Link href="/analysis"
                      className={buttonClass + " hidden lg:flex w-full lg:w-[calc(33.33%-10.66px)] xl:w-[calc(25%-12px)]"}>
                    <div className='flex items-center'>
                        <UserIcon className={ICON_SIZE_CLASS + " text-orange-500 shrink-0"} />
                    </div>
                    <div className='flex flex-col flex-1 items-center justify-center text-center'>
                        <span className='font-bold text-xs sm:text-sm'>{t.readinessTitle ?? 'Readiness'}</span>
                        <span className='text-[10px] text-gray-400'>{t.playerSubtitle ?? 'Spiller'}</span>
                    </div>
                    <div className={ICON_SIZE_CLASS}></div>
                </Link>
            )}

            {/* 4. Video Analysis (Premium) */}
            {isPremium && (
                 <Link href="/analysis"
                       className={buttonClass + " hidden xl:flex w-full xl:w-[calc(25%-12px)]"}>
                    <div className='flex items-center'>
                        <Video className={ICON_SIZE_CLASS + " text-orange-500 shrink-0"} />
                    </div>
                    <div className='flex flex-col flex-1 items-center justify-center text-center'>
                        <span className='font-bold text-xs sm:text-sm'>{t.videoAnalysisTitle ?? 'Video Analysis'}</span>
                        <span className='text-[10px] text-gray-400'>{t.analysisRoomSubtitle ?? 'Analysis Room'}</span>
                    </div>
                    <div className={ICON_SIZE_CLASS}></div>
                </Link>
            )}
        </div>
    );
};

// --- WIDGET-KOMPONENTER ER NU FJERNET HERFRA ---


// 2. View Mode Toggle Bar (Uændret)
const ViewModeToggle = ({ activeTool, setActiveTool, canUseCanvas, isDraggable }: { 
  activeTool: 'grid' | 'canvas' | 'add';
  setActiveTool: (tool: 'grid' | 'canvas' | 'add') => void;
  canUseCanvas: boolean;
  isDraggable: boolean;
}) => {
  
  const toggleBaseClass = "flex items-center justify-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-colors";
  const activeClass = "text-orange-500";
  const inactiveClass = "text-gray-500 hover:text-black";
  const actionButtonBaseClass = "flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors border";
  
  return (
    <div className="flex items-center justify-between mb-4">
        
        {/* Venstre side: Toggles */}
        <div className="flex items-center space-x-2">
            <button 
                onClick={() => setActiveTool('grid')}
                className={`${toggleBaseClass} ${activeTool === 'grid' ? activeClass : inactiveClass}`}
            >
                <LayoutGrid className="h-4 w-4" />
                Grid
            </button>
            
            {canUseCanvas && (
                <button 
                    onClick={() => setActiveTool('canvas')}
                    className={`${toggleBaseClass} ${activeTool === 'canvas' ? activeClass : inactiveClass}`}
                >
                    <View className="h-4 w-4" />
                    Canvas
                </button>
            )}

            {isDraggable && (
                <button 
                    onClick={() => setActiveTool('add')}
                    className={`${toggleBaseClass} ${activeTool === 'add' ? activeClass : inactiveClass}`}
                >
                    <PlusCircle className="h-4 w-4" />
                    Add Widget
                </button>
            )}
        </div>

        {/* Højre side: Knap */}
        <div className="flex items-center gap-2">
            {isDraggable && (
                <button className={`${actionButtonBaseClass} bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:border-orange-600`}>
                    Save Layout
                </button>
            )}
        </div>
    </div>
  );
};
// === SLUT PÅ TOGGLE BAR ===


export default function DashboardClient({
  dict,
  dashboardData,
  accessLevel,
  userRole,
}: DashboardProps) {
  const t = useMemo(() => dict.dashboard || {}, [dict]);
  const lang = useMemo(() => dict.lang as 'da' | 'en', [dict.lang]);

  const [activeTool, setActiveTool] = useState<'grid' | 'canvas' | 'add'>('grid');
  
  // Adgangslogik (Uændret)
  const canUseCanvas = useMemo(() => 
    ['Elite', 'Enterprise'].includes(accessLevel) ||
    [UserRole.Tester, UserRole.Developer].includes(userRole),
    [accessLevel, userRole]
  );

  const isStaticGrid = useMemo(() => 
    ['Starter', 'Advanced', 'Essential'].includes(accessLevel),
    [accessLevel]
  );
  const isDraggable = !isStaticGrid;

  // Data (Uændret)
  const intelligentGrid: GridItem[] = [
    {
      id: 'alert-01',
      priority: 'high',
      type: 'readiness_alert',
      data: {
        title: 'Advarsel: Høj Skadesrisiko (AI Modul)',
        description: `3 spillere (P. Jensen, M. Hansen, L. Nielsen) har høj risiko.`,
      },
      gridSpan: 1,
    },
    {
      id: 'cal-01',
      priority: 'medium',
      type: 'calendar',
      data: {
        title: 'Næste Event: Træning (U19)',
        time: 'I dag kl. 17:00 - 18:30',
        focus: 'Højt Genpres (fra Curriculum)',
        link: '/trainer/new',
      },
      gridSpan: 1,
    },
    {
      id: 'msg-01',
      priority: 'medium',
      type: 'message',
      data: {
        title: 'Ny ulæst besked (Forældregruppe U19)',
        snippet: 'Hej Træner, angående kørsel til weekendens kamp...',
      },
      gridSpan: 1,
    },
    {
      id: 'act-01',
      priority: 'low',
      type: 'activity',
      data: {
        feed: dashboardData.activityFeed,
      },
      gridSpan: 2,
    },
  ];

  // --- OPDATERET RENDER-FUNKTION ---
  // Denne funktion kalder nu de importerede komponenter
  const renderGridItem = (item: GridItem) => {
    switch (item.type) {
      case 'readiness_alert':
        return <ReadinessAlertWidget t={t} item={item} />;
      case 'calendar':
        return <CalendarWidget t={t} item={item} />;
      case 'message':
        return <MessageWidget t={t} item={item} />;
      case 'activity':
        return <ActivityWidget t={t} item={item} />;
      default:
        return null; // Bør ikke ske
    }
  };
  // --- SLUT OPDATERING ---

  const defaultLayout = intelligentGrid.map((item, index) => ({
    i: item.id,
    x: index % 4,
    y: Math.floor(index / 4),
    w: item.gridSpan || 1,
    h: 1,
    minW: 1,
    maxW: 4,
  }));

  const gridElements = useMemo(() => {
    return intelligentGrid.map(item => (
        <div key={item.id} data-grid={{ w: item.gridSpan || 1, h: 1, minW: 1, maxW: 4, x: 0, y: 0 }}>
            {renderGridItem(item)}
        </div>
    ));
  }, [intelligentGrid, t]);

  // Selve return-statement (Uændret)
  return (
    <div className="space-y-4">
      {/* 1. FAST: Quick Access Bar */}
      <QuickAccessBar t={t} accessLevel={accessLevel} lang={lang} />
      
      {/* 2. OPDATERET: View Mode Toggle Bar */}
      <ViewModeToggle 
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        canUseCanvas={canUseCanvas}
        isDraggable={isDraggable}
      />
      
      {/* 3. Betinget rendering af Grid eller Canvas */}
      {(activeTool === 'grid' || activeTool === 'add') && (
        <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: defaultLayout, md: defaultLayout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
            rowHeight={300}
            isDraggable={isDraggable}
            isResizable={isDraggable}
            margin={[16, 16]} 
          >
            {gridElements}
          </ResponsiveGridLayout>
      )}

      {activeTool === 'canvas' && canUseCanvas && (
        <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <p className="text-gray-500 font-semibold">
                Canvas View (Pro Feature) - Her vil det frie lærred (Miro-style) blive vist.
            </p>
        </div>
      )}
    </div>
  );
}