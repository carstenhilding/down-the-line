// app/[lang]/(secure)/dashboard/DashboardClient.tsx (FINAL KORREKTION: Mindre Mellemrum i Quick Access)

'use client';

// Imports: Holdt minimalistisk
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

} from 'lucide-react';
import React, { useMemo } from 'react';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'; // Placeholder for dynamisk gitter
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

// NYT: Definer typer for det flytbare gitter
type GridItem = {
  id: string;
  priority: 'high' | 'medium' | 'low';
  type: 'readiness_alert' | 'calendar' | 'message' | 'activity';
  data: any;
  gridSpan: number;
};

// --- START: KOMPONENTER TIL LAYOUT ---
// 1. Minimalistisk Quick Access Bar (KORREKTION: Mindre Mellemrum)

const QuickAccessBar = ({ t, accessLevel, lang }: { t: any; accessLevel: SubscriptionLevel, lang: 'da' | 'en' }) => {
    const isPremium = ['Expert', 'Complete', 'Elite', 'Enterprise'].includes(accessLevel);

    // Styling forbliver ensartet
    const buttonClass = "flex items-center justify-between p-2 sm:p-3 text-xs sm:text-sm bg-black text-white transition duration-200 shadow-xl rounded-lg border-2 border-black group hover:-translate-y-1 hover:shadow-2xl";

    // Forkortede termer (som aftalt)
    const trainingTitle = lang === 'da' ? 'Opret Session' : 'Create Session';
    const sessionSub = 'Session Planner';
    const drillTitle = lang === 'da' ? 'Opret Øvelse' : 'Create Drill';
    const readinessTitle = t.readiness ?? 'Readiness';
    const analysisTitle = 'Video Analysis';

    // Definerer størrelsen på ikonet + margen, som dummy-elementet skal matche
    const ICON_SIZE_CLASS = "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-3";

    return (
        // KORREKTION: Bruger flex-wrap og lader den responsive beregning styre pladsen
        <div className="flex flex-wrap gap-4 md:gap-4 mb-6 md:mb-8">
       
            {/* 1. Create Session (Altid synlig) */}
            {/* KORREKTION: Justeret beregningen for at fjerne overflødig margen */}
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
            {/* KORREKTION: Justeret beregningen for at fjerne overflødig margen */}
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
          
            {/* 3. Readiness / Player (Prioritet 3) */}
            {/* KORREKTION: Justeret beregningen for at fjerne overflødig margen */}
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

            {/* 4. Video Analysis (Prioritet 4) */}
            {/* KORREKTION: Justeret beregningen for at fjerne overflødig margen */}
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

// Generel Widget-Ramme (med minimalistisk kant) - Uændret
const SmartWidget = ({
  children,
  priority = 'low',
  className = '',
}: {
  children: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  className?: string;
}) => {
  let borderStyle = 'border-gray-200';
  let color = 'text-black';

  if (priority === 'high') {
    // Høj Prioritet: Solid Orange Kant (Alarm)
    borderStyle = 'border-orange-500 ring-2 ring-orange-500/20';
    color = 'text-orange-500';
  } else if (priority === 'medium') {

    // Mellem Prioritet: Subtil Sort Kant (Ulæst/Næste Skridt)
    borderStyle = 'border-black';
  }

  return (
    <div
      className={`bg-white p-4 md:p-6 rounded-xl shadow-md border transition-all duration-300 ${borderStyle} ${className}`}
    >
        <div className={color}>
            {children}
        </div>
    </div>
  );
};

// 2. AI Readiness Widget (Høj Prioritet - Orange Fokus) - Uændret
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

// 3. Kalender Widget (Mellem Prioritet - Sort Ikon) - Uændret
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

// 4. Kommunikations Widget (Mellem Prioritet - Sort Ikon) - Uændret
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

// 5. Seneste Aktivitet Widget (Lav Prioritet) - Uændret
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

// --- SLUT: KOMPONENTER TIL LAYOUT ---
export default function DashboardClient({
  dict,
  dashboardData,
  accessLevel,
  userRole,
}: DashboardProps) {
  const t = useMemo(() => dict.dashboard || {}, [dict]);
  const lang = useMemo(() => dict.lang as 'da' | 'en', [dict.lang]);

  // Simulerer det flytbare gitter
  const intelligentGrid: GridItem[] = [

    // Højeste prioritet (AI)
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

    // Mellem prioritet (Kalender og Beskeder)
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

    // Lav prioritet (Aktivitetsfeed)
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

  // Definerer standardlayoutet (Dette skal normalt hentes fra databasen)
  const defaultLayout = intelligentGrid.map((item, index) => ({
    i: item.id,
    x: index % 4,
    y: Math.floor(index / 4),
    w: item.gridSpan || 1, // Bruger gridSpan som standardbredde
    h: 1, // Standardhøjde, justeres senere baseret på indhold
    minW: 1,
    maxW: 4,
  }));

  // Vi skal bruge et useMemo til at generere widgets' elementer, så de kan bruges i gitteret
  const gridElements = useMemo(() => {
    return intelligentGrid.map(item => (
        // Data-grid-holder er nødvendig for at placere elementer i RGL
        <div key={item.id} data-grid={{ w: item.gridSpan || 1, h: 1, minW: 1, maxW: 4, x: 0, y: 0 }}>
            {renderGridItem(item)}
        </div>
    ));
  }, [intelligentGrid, t]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 1. FAST: Quick Access Bar i toppen */}
      <QuickAccessBar t={t} accessLevel={accessLevel} lang={lang} />
      {/* 2. FLYTBAR: Det Smarte Gitter (Client Component) */}
      <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: defaultLayout, md: defaultLayout }} // Bruger standardlayout for alle breakpoints
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
          rowHeight={300} // Højden af en række i pixels (justeres senere)
          isDraggable={true}
          isResizable={true}
          margin={[24, 24]} // Gitterets indre margen (matchende gap-4/6)
        >
          {gridElements}
        </ResponsiveGridLayout>
    </div>
  );
}