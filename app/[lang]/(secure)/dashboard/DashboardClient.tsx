'use client';

// Imports
import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import {
  Users,
  AlertTriangle,
  MessageSquare,
  Activity,
  ArrowRight,
  Video,
  User as UserIcon,
  Calendar as CalendarIcon, // <-- FEJLEN VAR HER: Denne linje er nu gen-indsat
  Star,
  Target,
  GitPullRequestArrowIcon,
  LayoutGrid, 
  View, 
  PlusCircle, 
  StickyNote,       
  Package,          
  Zap,              
  Calendar,         // <-- Denne er til dropdown-menuen
} from 'lucide-react';
// NY IMPORT: Draggable til at flytte widgets på Canvas
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'; // Importer DraggableEvent og Data
import { Responsive, WidthProvider } from 'react-grid-layout';
import Link from 'next/link';
import { UserRole, SubscriptionLevel } from '@/lib/server/data';

// Importerer de komponenter, vi har flyttet
import AiReadinessWidget from '@/components/dashboard/widgets/AiReadinessWidget';
import CalendarWidget from '@/components/dashboard/widgets/CalendarWidget'; // 7-dages kalender
import MessageWidget from '@/components/dashboard/widgets/MessageWidget';
import ActivityWidget from '@/components/dashboard/widgets/ActivityWidget';
// NY IMPORT: SmartWidget for at kunne bruge widgets på lærredet
import { SmartWidget } from '@/components/dashboard/widgets/SmartWidget';

// *** VORES RETTELSE ER HER ***
// Tilføj disse to linjer for at aktivere resize-håndtag og basis-styling
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

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

// ### KORREKTION: ref-typen er nu ren og ikke nullable ###
type CanvasCard = {
  id: string;
  // OPDATERET: Sørger for at 'weekly_calendar' er en valid type
  type: 'note' | 'ai_readiness' | 'weekly_calendar'; // Typer af kort
  content?: { // Valgfrit, bruges kun til 'note'
    title: string;
    text: string;
  };
  defaultPosition: { x: number; y: number };
  size: { w: number; h: number }; // Størrelse på kortet
  ref: React.RefObject<HTMLDivElement | null>; // Tillader null som værdi
};

// --- START: KOMPONENTER TIL LAYOUT ---

// 1. Quick Access Bar (Uændret, men 'CalendarIcon' virker nu)
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

// 2. View Mode Toggle Bar (RETTET: Dropdown-position tilbage til under)
const ViewModeToggle = ({ 
  activeTool, 
  setActiveTool, 
  canUseCanvas, 
  isDraggable,
  onAddWidget
}: { 
  activeTool: 'grid' | 'canvas' | 'add';
  setActiveTool: (tool: 'grid' | 'canvas' | 'add') => void;
  canUseCanvas: boolean;
  isDraggable: boolean;
  onAddWidget: (type: CanvasCard['type']) => void; 
}) => {
  
  // --- State og Ref til at styre dropdown ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); 

  // --- useEffect til at lukke menuen ved klik udenfor ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false); 
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 

  const toggleBaseClass = "flex items-center justify-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-colors";
  const activeClass = "text-orange-500";
  const inactiveClass = "text-gray-500 hover:text-black";
  const actionButtonBaseClass = "flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors border";
  
  // Handler til Canvas-knapper
  const handleAddCanvasItemClick = (type: CanvasCard['type']) => {
    onAddWidget(type); 
    setIsDropdownOpen(false); 
  };

  // Handler til Grid-knap
  const handleAddGridItemClick = () => {
    setActiveTool('add'); 
    setIsDropdownOpen(false); 
  };

  // Beregn om menuen har indhold
  const showCanvasOptions = activeTool === 'canvas' && canUseCanvas;
  const showGridOptions = (activeTool === 'grid' || activeTool === 'add') && isDraggable;
  const showMenuOptions = showCanvasOptions || showGridOptions;

  return (
    <div className="flex items-center justify-between mb-4">
        
        {/* Venstre side: Toggles */}
        <div className="flex items-center space-x-2">
            <button 
                onClick={() => setActiveTool('grid')}
                className={`${toggleBaseClass} ${
                  (activeTool === 'grid' || activeTool === 'add') ? activeClass : inactiveClass
                }`}
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
        </div>

        {/* Højre side: Knapper */}
        <div className="flex items-center gap-2">
            
            <div ref={dropdownRef} className="relative"> {/* relative er vigtig for dropdown-positionering */}
              {(isDraggable || activeTool === 'canvas') && (
                  <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                      className={`${toggleBaseClass} ${
                        isDropdownOpen || activeTool === 'add' ? activeClass : inactiveClass
                      }`}
                  >
                      <PlusCircle className="h-4 w-4" />
                      Widget
                  </button>
              )}

              {/* OPDATERET Dropdown Menu (Position ændret tilbage til under) */}
              {isDropdownOpen && (
                  // OPDATERET: 'right-full top-0 mr-2' er ændret til 'right-0 top-full mt-2'
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border z-10 p-1.5 space-y-1"> 
                      
                      {showCanvasOptions && (
                          <>
                              <button 
                                  onClick={() => handleAddCanvasItemClick('note')}
                                  className="flex items-center w-full text-left px-2 py-1.5 text-xs text-gray-800 rounded-md hover:bg-orange-500 hover:text-white group"
                              >
                                  <StickyNote className="h-4 w-4 mr-3 text-gray-500 group-hover:text-white" />
                                  Tilføj Note
                              </button>
                              <button 
                                  onClick={() => handleAddCanvasItemClick('ai_readiness')}
                                  className="flex items-center w-full text-left px-2 py-1.5 text-xs text-gray-800 rounded-md hover:bg-orange-500 hover:text-white group"
                              >
                                  <Zap className="h-4 w-4 mr-3 text-gray-500 group-hover:text-white" />
                                  Tilføj AI Readiness
                              </button>
                              <button 
                                  onClick={() => handleAddCanvasItemClick('weekly_calendar')}
                                  className="flex items-center w-full text-left px-2 py-1.5 text-xs text-gray-800 rounded-md hover:bg-orange-500 hover:text-white group"
                              >
                                  <Calendar className="h-4 w-4 mr-3 text-gray-500 group-hover:text-white" />
                                  Tilføj Ugekalender
                              </button>
                          </>
                      )}

                      {showGridOptions && (
                          <>
                              <button 
                                  onClick={handleAddGridItemClick} 
                                  className="flex items-center w-full text-left px-2 py-1.5 text-xs text-gray-800 rounded-md hover:bg-orange-500 hover:text-white group"
                              >
                                  <Package className="h-4 w-4 mr-3 text-gray-500 group-hover:text-white" />
                                  Tilføj Widget (Grid)
                              </button>
                          </>
                      )}

                      {!showMenuOptions && (
                           <p className="p-2 text-xs text-center text-gray-500">Ingen handlinger tilgængelige her.</p>
                      )}
                      
                  </div>
              )}
            </div>


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
  
  // *** CANVAS STATES OG REFS ***
  const zoomControlRef = useRef<HTMLDivElement>(null); 
  const canvasRef = useRef<HTMLDivElement>(null); 
  const touchStartDist = useRef<number | null>(null); 
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null); 
  
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 }); 
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const dragStartPoint = useRef({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState(1); 
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3.0;
  const SCALE_STEP = 0.05; 

  // ### OPDATERET STATE: Nu med widget-typer ###
  const [canvasCards, setCanvasCards] = useState<CanvasCard[]>([
    {
      id: 'card-1',
      type: 'note',
      content: {
        title: 'Øvelses-Kort (Kort 1)',
        text: 'Dette er det første kort. Prøv at flytte mig.'
      },
      defaultPosition: { x: 40, y: 40 },
      size: { w: 256, h: 192 }, // w-64, h-48
      ref: React.createRef<HTMLDivElement>() // KORREKTION: fjerner 'null'
    },
    {
      id: 'card-2',
      type: 'ai_readiness', // Dette er nu en rigtig widget
      defaultPosition: { x: 350, y: 100 },
      size: { w: 320, h: 288 }, // ### KORREKTION: Øget højde til h-72 (288px) ###
      ref: React.createRef<HTMLDivElement>() // KORREKTION: fjerner 'null'
    }
  ]);
  // ### SLUT PÅ OPDATERET STATE ###


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

  // --- LAYOUTS TIL 12-KOLONNER / 100px RÆKKER ---
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
        // className="h-full" er TILFØJET for at fylde den nye faste celle-højde
        <div key={item.id} className="h-full">
            {renderGridItem(item)}
        </div>
    ));
  }, [intelligentGrid, t, lang, accessLevel]); 
  
  // --- CANVAS FUNKTIONER ---

  // ### KORREKTION: fjerner 'noPadding' fra komponent-kald ###
  const renderCanvasCardContent = (card: CanvasCard) => {
    switch (card.type) {
      case 'ai_readiness':
        // Fejlen var her: noPadding er fjernet
        return <AiReadinessWidget userData={{ subscriptionLevel: accessLevel }} lang={lang} />;
      case 'weekly_calendar':
        // Fejlen var her: noPadding er fjernet
        return <CalendarWidget translations={t} lang={lang} />;
      case 'note':
      default:
        // Standard note-indhold
        return (
          <p className="text-sm text-gray-600 mt-2">
            {card.content?.text ?? '...'}
          </p>
        );
    }
  };

  // ### OPDATERET: TILFØJER NYE KORTTYPER ###
  const widgetTypes: CanvasCard['type'][] = ['note', 'ai_readiness', 'weekly_calendar'];

  // --- OPDATERET addCardToCanvas ---
  // Tager nu imod en specifik type fra dropdown-menuen
  const addCardToCanvas = (newType: CanvasCard['type']) => {
    const newX = 40 + (canvasCards.length % 5) * 50; 
    const newY = 40 + (canvasCards.length % 5) * 50;
    
    let newSize = { w: 256, h: 192 }; // Standardstørrelse (note)
    let newContent = { title: 'Nyt Kort', text: 'Dette er et nyt kort...' };

    if (newType === 'ai_readiness') {
      newSize = { w: 320, h: 288 }; // ### KORREKTION: Øget højde
      newContent.title = 'AI Readiness';
    } else if (newType === 'weekly_calendar') {
      newSize = { w: 400, h: 300 }; // w-100
      newContent.title = 'Ugekalender';
    }
    // Hvis newType er 'note', bruges standard-størrelsen og -indholdet

    setCanvasCards(prevCards => [
      ...prevCards,
      {
        id: `card-${Date.now()}`,
        type: newType,
        content: newContent,
        defaultPosition: { x: newX, y: newY },
        size: newSize,
        ref: React.createRef<HTMLDivElement>() // KORREKTION: fjerner 'null'
      }
    ]);
  };

  // FUNKTION TIL AT GEMME KORTPOSITION (Uændret)
  const handleCardStop = (cardId: string, e: DraggableEvent, data: DraggableData) => {
    setCanvasCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId 
          ? { ...card, defaultPosition: { x: data.x, y: data.y } } // Opdater positionen i state
          : card
      )
    );
  };
  
  // getDistance (Uændret)
  const getDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // getCenter (Uændret)
  const getCenter = (touches: React.TouchList) => {
    if (touches.length === 0) return null;
    if (touches.length === 1) return { x: touches[0].clientX, y: touches[0].clientY };
    
    return {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  // --- 1. MOUSE PAN LOGIC (Uændret) ---
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && !e.target.closest('.canvas-handle')) {
        setIsDraggingCanvas(true);
        dragStartPoint.current = { x: e.clientX, y: e.clientY }; 
        e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingCanvas) return;
    const dx = e.clientX - dragStartPoint.current.x;
    const dy = e.clientY - dragStartPoint.current.y;
    setCanvasPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
    dragStartPoint.current = { x: e.clientX, y: e.clientY }; 
    e.preventDefault();
  }, [isDraggingCanvas]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingCanvas(false);
  }, []);
  
  // --- 2. TOUCH/GESTURE LOGIC (Uændret) ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('.canvas-handle')) {
        return;
    }
    if (e.touches.length === 2) {
        // To fingre: Starter zoom
        const distance = getDistance(e.touches)!;
        touchStartDist.current = distance;
        lastTouchCenter.current = getCenter(e.touches);
        setIsDraggingCanvas(false); 
    } else if (e.touches.length === 1) {
        setIsDraggingCanvas(true);
        dragStartPoint.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; 
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist.current !== null) {
        const newDistance = getDistance(e.touches)!;
        const scaleChange = newDistance / touchStartDist.current;
        const scaleDelta = (scaleChange - 1); 
        const newScaleRaw = canvasScale + scaleDelta;
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScaleRaw));
        setCanvasScale(parseFloat(newScale.toFixed(2)));
        touchStartDist.current = newDistance;
    } else if (isDraggingCanvas && e.touches.length === 1) {
        // --- RETTELSE FRA DIT SCREENSHOT ---
        const dx = e.touches[0].clientX - dragStartPoint.current.x; // <-- RETTET
        const dy = e.touches[0].clientY - dragStartPoint.current.y; // <-- RETTET
        setCanvasPosition(prev => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }));
        dragStartPoint.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; // <-- RETTET
        // --- SLUT PÅ RETTELSE ---
    }
  }, [canvasScale, MIN_SCALE, MAX_SCALE, isDraggingCanvas, SCALE_STEP]); 

  const handleTouchEnd = useCallback(() => {
    touchStartDist.current = null;
    lastTouchCenter.current = null;
    setIsDraggingCanvas(false);
  }, []);
  
  // --- 3. MOUSE/TOUCHPAD SCROLL ZOOM LOGIC (Uændret) ---
  const handleWheel = useCallback((e: React.WheelEvent) => {
    let delta = -e.deltaY / 1000; 
    if (Math.abs(e.deltaY) < 10) {
        delta = -e.deltaY / 100;
    }
    setCanvasScale(prevScale => {
        let newScale = prevScale + delta;
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
        return parseFloat(newScale.toFixed(2));
    });
  }, [MIN_SCALE, MAX_SCALE]);

  // --- WINDOW LISTENERS (Uændret) ---
  useEffect(() => {
    if (activeTool !== 'canvas' || !canUseCanvas) return;
    const mouseMove = (e: MouseEvent) => handleMouseMove(e as unknown as React.MouseEvent);
    const mouseUp = handleMouseUp;
    if (isDraggingCanvas) {
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    } else {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, [isDraggingCanvas, activeTool, canUseCanvas, handleMouseMove, handleMouseUp]);
  
  // *** ROBUST SCROLL/TOUCH-LOCK EFFECT (Uændret) ***
  useEffect(() => {
    if (activeTool !== 'canvas' || !canvasRef.current) return;
    const canvasElement = canvasRef.current;
    
    const onWheel = (e: WheelEvent) => {
        if (e.target === canvasElement || canvasElement.contains(e.target as Node)) {
            e.preventDefault();
            e.stopPropagation();
            handleWheel(e as unknown as React.WheelEvent);
        }
    };
    const onTouchMove = (e: TouchEvent) => {
        if (e.target === canvasElement || canvasElement.contains(e.target as Node)) {
            e.preventDefault();
            e.stopPropagation();
            handleTouchMove(e as unknown as React.TouchEvent<HTMLDivElement>);
        }
    };

    canvasElement.addEventListener('wheel', onWheel, { passive: false });
    canvasElement.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      canvasElement.removeEventListener('wheel', onWheel);
      canvasElement.removeEventListener('touchmove', onTouchMove);
    };
  }, [activeTool, canvasRef, handleWheel, handleTouchMove]); 
  
  
  // Selve return-statement (OPDATERET)
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
          onAddWidget={addCardToCanvas} // <-- Sender den opdaterede funktion ind
        />
      </div>
      
      {(activeTool === 'grid' || activeTool === 'add') && (
        <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 200 }}
            cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }} 
            rowHeight={100}
            isDraggable={isDraggable}
            isResizable={isDraggable}
            margin={[16, 16]} 
          >
            {gridElements}
          </ResponsiveGridLayout>
      )}

      {/* FLYTBAR ZOOM KONTROL UI (Uændret) */}
      {activeTool === 'canvas' && canUseCanvas && (
        <Draggable 
            nodeRef={zoomControlRef} 
            handle=".zoom-control" 
            bounds="body" 
        >
            <div 
                ref={zoomControlRef} 
                className="fixed bottom-4 left-4 z-50 cursor-grab" 
            >
                <div className="zoom-control flex flex-col items-center space-y-2 bg-white/20 backdrop-blur-sm p-1.5 rounded-xl shadow-lg border border-white/30 cursor-move">
                    <div className="text-xs font-semibold text-white px-2 py-1 rounded select-none">
                        Zoom: {Math.round(canvasScale * 100)}%
                    </div>
                </div>
            </div>
        </Draggable>
      )}

      {activeTool === 'canvas' && canUseCanvas && (
        <div 
          ref={canvasRef} 
          className="relative w-full h-[800px] bg-gray-100 rounded-lg touch-none border border-gray-300 overflow-hidden" 
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart} 
          onTouchEnd={handleTouchEnd}     
          style={{ cursor: isDraggingCanvas ? 'grabbing' : 'grab' }}
        >

          {/* Canvas Indhold: Transformeres for Pan og Zoom */}
          <div
            className="absolute inset-0 origin-top-left transition-transform duration-50"
            style={{ transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${canvasScale})` }}
          >
            {/* ### KORREKTION HER: Fjerner .filter() og implementerer "kort-på-kort" løsning ### */}
            {canvasCards.map((card) => {
              
              // Bestemmer om SmartWidget skal have padding
              const hasPadding = card.type === 'note';
              const title = card.type === 'note' ? card.content?.title : 
                            card.type === 'ai_readiness' ? 'AI Readiness' : 
                            card.type === 'weekly_calendar' ? 'Ugekalender' : 'Widget';

              return (
                <Draggable 
                  key={card.id}
                  nodeRef={card.ref} // Nu er card.ref garanteret at være en RefObject<HTMLDivElement>
                  handle=".canvas-handle" 
                  defaultPosition={card.defaultPosition}
                  scale={canvasScale} 
                  onStop={(e, data) => handleCardStop(card.id, e, data)}
                >
                  <div 
                    ref={card.ref} 
                    style={{ 
                      width: `${card.size.w}px`, 
                      height: `${card.size.h}px`,
                      // Vi skal bruge 'absolute' for at Draggable kan placere kortet
                      position: 'absolute' 
                    }}
                  > 
                    {/* ### KORREKTION: Betinget rendering af SmartWidget ### */}
                    {card.type === 'note' ? (
                      // Hvis det er en 'note', pak den ind i SmartWidget
                      <SmartWidget className="h-full w-full shadow-lg" noPadding={!hasPadding}>
                        <div className="canvas-handle cursor-move mb-2 p-1 -m-1 rounded-t-lg bg-gray-100 border-b border-gray-200">
                          <h3 className="font-semibold text-black text-sm">{title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {card.content?.text ?? '...'}
                        </p>
                      </SmartWidget>
                    ) : (
                      // For 'ai_readiness' og 'weekly_calendar', render dem direkte
                      // Vi tilføjer manuelt et håndtag (via .canvas-handle) og skygge
                      <div className="h-full w-full shadow-lg rounded-xl canvas-handle cursor-move">
                        {card.type === 'ai_readiness' && (
                          <AiReadinessWidget userData={{ subscriptionLevel: accessLevel }} lang={lang} />
                        )}
                        {card.type === 'weekly_calendar' && (
                          <CalendarWidget translations={t} lang={lang} />
                        )}
                      </div>
                    )}
                  </div>
                </Draggable>
              );
            })}
            {/* ### SLUT PÅ MAP ### */}

          </div>
        </div>
      )}
    </>
  );
}