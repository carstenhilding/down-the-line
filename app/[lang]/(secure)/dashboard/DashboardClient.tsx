// app/[lang]/(secure)/dashboard/DashboardClient.tsx (KORREKTION: Ultra-diskret toggle-bar)

'use client';

// Imports (uændret)
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
} from 'lucide-react';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import Link from 'next/link';
import { UserRole, SubscriptionLevel } from '@/lib/server/data';

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

// 1. Quick Access Bar (Uændret, bruger mb-4)
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

// Widget-komponenter (Uændrede)
const SmartWidget = ({ children, priority = 'low', className = '' }: { children: React.ReactNode; priority?: 'high' | 'medium' | 'low'; className?: string; }) => {
  let borderStyle = 'border-gray-200';
  let color = 'text-black';
  if (priority === 'high') {
    borderStyle = 'border-orange-500 ring-2 ring-orange-500/20';
    color = 'text-orange-500';
  } else if (priority === 'medium') {
    borderStyle = 'border-black';
  }
  return (
    <div className={`bg-white p-4 md:p-6 rounded-xl shadow-md border transition-all duration-300 ${borderStyle} ${className}`}>
        <div className={color}>
            {children}
        </div>
    </div>
  );
};

const ReadinessAlertWidget = ({ t, item }: { t: any; item: GridItem }) => (
  <SmartWidget priority={item.priority} className="h-full">
    <div className="flex items-start">
      <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 mr-3 md:mr-4 shrink-0 text-orange-500" />
      <div>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          {item.data.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-700 mt-1">
          {item.data.description}
        </p>
        <button className="mt-3 text-sm font-semibold text-orange-500 hover:text-black flex items-center">
          {t.view_details ?? 'Se detaljer'}
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  </SmartWidget>
);

const CalendarWidget = ({ t, item }: { t: any; item: GridItem }) => (
  <SmartWidget priority={item.priority} className="h-full">
    <div className="flex">
      <Calendar className="w-6 h-6 md:w-8 md:h-8 text-black mr-3 md:mr-4 shrink-0" />
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          {item.data.title}
        </h3>
        <p className="text-sm text-gray-700 mt-1">{item.data.time}</p>
        <p className="text-sm text-gray-700 mt-1">
          {t.focus ?? 'Fokus'}:{' '}
          <span className="font-medium text-black">{item.data.focus}</span>
        </p>
        <Link
          href={item.data.link}
          className="mt-3 text-sm font-semibold text-orange-500 hover:text-black flex items-center"
        >
          {t.view_session_plan ?? 'Se træningspas'}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  </SmartWidget>
);

const MessageWidget = ({ t, item }: { t: any; item: GridItem }) => (
  <SmartWidget priority={item.priority} className="h-full">
    <div className="flex">
      <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-black mr-3 md:mr-4 shrink-0" />
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          {item.data.title}
        </h3>
        <p className="text-sm text-gray-700 mt-1 italic">
          "{item.data.snippet}..."
        </p>
        <Link
          href="/comms"
          className="mt-3 text-sm font-semibold text-orange-500 hover:text-black flex items-center"
        >
          {t.go_to_chat ?? 'Gå til chat'}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  </SmartWidget>
);

const ActivityWidget = ({ t, item }: { t: any; item: GridItem }) => (
  <SmartWidget priority={item.priority} className="h-full">
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center">
      <Activity className="w-5 h-5 mr-2 text-black" />
      {t.recentActivityTitle ?? 'Seneste Aktivitet'}
    </h3>
    <ul className="space-y-1.5">
      {item.data.feed?.map((activity: string, index: number) => (
        <li
          key={index}
          className="text-xs sm:text-sm text-gray-700 border-b border-gray-100 pb-1.5 last:border-b-0"
        >
          {activity}
        </li>
      ))}
      {(!item.data.feed || item.data.feed.length === 0) && (
        <p className="text-xs sm:text-sm text-gray-500">
          {t.activityPlaceholder ?? 'Ingen aktivitet fundet.'}
        </p>
      )}
    </ul>
  </SmartWidget>
);


// === START: OPDATERET View Mode Toggle Bar (ULTRA-DISKRET) ===
const ViewModeToggle = ({ viewMode, setViewMode, canUseCanvas }: { 
  viewMode: 'grid' | 'canvas';
  setViewMode: (mode: 'grid' | 'canvas') => void;
  canUseCanvas: boolean;
}) => {
  
  // KORREKTION: Mindre padding (px-2 py-1) og text-xs for diskret look
  const toggleBaseClass = "flex items-center justify-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-colors";
  
  // Aktiv knap (sort baggrund)
  const activeClass = "bg-black text-white";
  
  // KORREKTION: Inaktiv knap er nu grå tekst (diskret) og bliver orange ved hover
  const inactiveClass = "text-gray-500 hover:text-orange-500";

  // KORREKTION: Action-knapper er også gjort mindre (py-1)
  const actionButtonBaseClass = "flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors border";
  
  return (
    // Bruger mb-4 (16px), som er den samme som QuickAccessBar
    <div className="flex items-center justify-between mb-4">
        
        {/* Venstre side: Toggles (ligner nu tekst-links) */}
        <div className="flex items-center space-x-2">
            <button 
                onClick={() => setViewMode('grid')}
                className={`${toggleBaseClass} ${viewMode === 'grid' ? activeClass : inactiveClass}`}
            >
                <LayoutGrid className="h-4 w-4" />
                Grid
            </button>
            
            {canUseCanvas && (
                <button 
                    onClick={() => setViewMode('canvas')}
                    className={`${toggleBaseClass} ${viewMode === 'canvas' ? activeClass : inactiveClass}`}
                >
                    <View className="h-4 w-4" />
                    Canvas
                </button>
            )}
        </div>

        {/* Højre side: Knapper (mindre og tyndere) */}
        <div className="flex items-center gap-2">
            <button className={`${actionButtonBaseClass} bg-white text-black border-black hover:text-orange-500 hover:border-orange-500`}>
                + Add Widget
            </button>
            
            <button className={`${actionButtonBaseClass} bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:border-orange-600`}>
                Save Layout
            </button>
        </div>
    </div>
  );
};
// === SLUT: OPDATERET View Mode Toggle Bar ===


export default function DashboardClient({
  dict,
  dashboardData,
  accessLevel,
  userRole,
}: DashboardProps) {
  const t = useMemo(() => dict.dashboard || {}, [dict]);
  const lang = useMemo(() => dict.lang as 'da' | 'en', [dict.lang]);

  const [viewMode, setViewMode] = useState<'grid' | 'canvas'>('grid');
  
  const canUseCanvas = useMemo(() => 
    ['Expert', 'Complete', 'Performance', 'Elite', 'Enterprise'].includes(accessLevel),
    [accessLevel]
  );

  // Data og rendering af widgets (Uændret)
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
        return null;
    }
  };

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

  // Selve return-statement (Uændret, bruger space-y-4)
  return (
    <div className="space-y-4">
      {/* 1. FAST: Quick Access Bar */}
      <QuickAccessBar t={t} accessLevel={accessLevel} lang={lang} />
      
      {/* 2. OPDATERET: Den nye, ultra-diskrete View Mode Toggle Bar */}
      <ViewModeToggle 
        viewMode={viewMode}
        setViewMode={setViewMode}
        canUseCanvas={canUseCanvas}
      />
      
      {/* 3. Betinget rendering af Grid eller Canvas */}
      
      {/* 3.A. GRID VIEW */}
      {viewMode === 'grid' && (
        <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: defaultLayout, md: defaultLayout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
            rowHeight={300}
            isDraggable={true}
            isResizable={true}
            margin={[16, 16]} 
          >
            {gridElements}
          </ResponsiveGridLayout>
      )}

      {/* 3.B. CANVAS VIEW (Pladsholder) */}
      {viewMode === 'canvas' && (
        <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <p className="text-gray-500 font-semibold">
                Canvas View (Pro Feature) - Her vil det frie lærred (Miro-style) blive vist.
            </p>
        </div>
      )}
    </div>
  );