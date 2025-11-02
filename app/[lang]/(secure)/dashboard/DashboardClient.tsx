// app/[lang]/(secure)/dashboard/DashboardClient.tsx (Implementerer 12-kolonne grid og 100px rowHeight)

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
import { Responsive, WidthProvider } from 'react-grid-layout';
import Link from 'next/link';
import { UserRole, SubscriptionLevel } from '@/lib/server/data';

// Importerer de komponenter, vi har flyttet
import AiReadinessWidget from '@/components/dashboard/widgets/AiReadinessWidget';
import CalendarWidget from '@/components/dashboard/widgets/CalendarWidget'; // 7-dages kalender
import MessageWidget from '@/components/dashboard/widgets/MessageWidget';
import ActivityWidget from '@/components/dashboard/widgets/ActivityWidget';

// Opretter den "rigtige" ResponsiveGridLayout
const ResponsiveGridLayout = WidthProvider(Responsive);

// --- TYPE DEFINITIONER ---
interface SecureTranslations {
  dashboard: any;
  lang?: 'da' | 'en';
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
  type: 'ai_readiness' | 'weekly_calendar' | 'message' | 'activity';
  data: any;
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
      id: 'ai-readiness',
      priority: 'high',
      type: 'ai_readiness',
      data: {}, 
    },
    {
      id: 'weekly-calendar',
      priority: 'medium',
      type: 'weekly_calendar',
      data: {}, 
    },
    {
      id: 'messages',
      priority: 'medium',
      type: 'message',
      data: {
        title: 'Ny ulæst besked (Forældregruppe U19)',
        snippet: 'Hej Træner, angående kørsel til weekendens kamp...',
      },
    },
    {
      id: 'activity-feed',
      priority: 'low',
      type: 'activity',
      data: {
        feed: dashboardData.activityFeed,
      },
    },
  ];

  // Render-funktion (Uændret)
  const renderGridItem = (item: GridItem) => {
    switch (item.type) {
      case 'ai_readiness':
        return <AiReadinessWidget userData={{ subscriptionLevel: accessLevel }} lang={lang} />;
      case 'weekly_calendar':
        return <CalendarWidget translations={t} lang={lang} />;
      case 'message':
        return <MessageWidget t={t} item={item} />;
      case 'activity':
        return <ActivityWidget t={t} item={item} />;
      default:
        return null;
    }
  };

  // --- OPDATERET: LAYOUTS TIL 12-KOLONNER / 100px RÆKKER ---
  const layouts = {
    // lg & md (12 kolonner grid): Asymmetrisk layout
    lg: [
      { i: 'ai-readiness',     x: 0, y: 0, w: 3, h: 2, minW: 1, maxW: 4, minH: 1 }, // 25% bred, 300px høj
      { i: 'weekly-calendar',  x: 3, y: 0, w: 6, h: 2, minW: 4, maxW: 8, minH: 1 }, // 50% bred, 300px høj
      { i: 'messages',         x: 9, y: 0, w: 3, h: 2, minW: 2, maxW: 4, minH: 1 }, // 25% bred, 300px høj
      { i: 'activity-feed',    x: 0, y: 3, w: 12, h: 2, minW: 4, maxW: 12, minH: 2 }, // 100% bred, 200px høj
    ],
    // sm (6 kolonner grid): 
    sm: [
      { i: 'ai-readiness',     x: 0, y: 0, w: 3, h: 2, minH: 2 },
      { i: 'messages',         x: 3, y: 0, w: 3, h: 2, minH: 2 },
      { i: 'weekly-calendar',  x: 0, y: 3, w: 6, h: 2, minH: 2 },
      { i: 'activity-feed',    x: 0, y: 6, w: 6, h: 2, minH: 2 },
    ],
    // xs (4 kolonner grid): Stabler pænt
    xs: [
      { i: 'ai-readiness',     x: 0, y: 0, w: 4, h: 2, minH: 2 },
      { i: 'weekly-calendar',  x: 0, y: 3, w: 4, h: 2, minH: 2 },
      { i: 'messages',         x: 0, y: 6, w: 4, h: 2, minH: 2 },
      { i: 'activity-feed',    x: 0, y: 9, w: 4, h: 2, minH: 2 },
    ]
  } as { [key: string]: ReactGridLayout.Layout[] }; 
  
  layouts.md = layouts.lg;
  layouts.xxs = layouts.xs;


  const gridElements = useMemo(() => {
    return intelligentGrid.map(item => (
        // RETTET: className="h-full" er TILFØJET for at fylde den nye faste celle-højde
        <div key={item.id} className="h-full">
            {renderGridItem(item)}
        </div>
    ));
  }, [intelligentGrid, t, lang, accessLevel]); 

  // Selve return-statement (Uændret)
  return (
    <> 
      <div className="mb-4">
        <QuickAccessBar t={t} accessLevel={accessLevel} lang={lang} />
      </div>
      
      <div className="mb-4">
        <ViewModeToggle 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          canUseCanvas={canUseCanvas}
          isDraggable={isDraggable}
        />
      </div>
      
      {(activeTool === 'grid' || activeTool === 'add') && (
        <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            // RETTET: cols er nu 12-baseret
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }} // xxs ændret til 2
            // RETTET: rowHeight er nu 100
            rowHeight={100}
            // autoSize er fjernet for at få et fast, rent grid
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
    </>
  );
}