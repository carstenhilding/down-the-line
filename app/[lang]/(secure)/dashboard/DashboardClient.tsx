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
  Calendar as CalendarIcon, 
  Star,
  Target,
  GitPullRequestArrowIcon,
  LayoutGrid, 
  View, 
  PlusCircle, 
  StickyNote,       
  Package,          
  Zap,              
  Calendar,         
  X,                
} from 'lucide-react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'; 
import { Resizable, ResizeCallbackData } from 'react-resizable'; 
import { Responsive, WidthProvider } from 'react-grid-layout';
import Link from 'next/link';
import { UserRole, SubscriptionLevel } from '@/lib/server/data';

// --- RETTELSE: Importer onAuthStateChanged ---
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import { getDashboardLayout, saveDashboardLayout, CanvasCardPersist, DashboardSettings, CanvasState } from '@/lib/server/dashboard';

// Importerer de komponenter, vi har flyttet
import AiReadinessWidget from '@/components/dashboard/widgets/AiReadinessWidget';
import CalendarWidget from '@/components/dashboard/widgets/CalendarWidget'; 
import MessageWidget from '@/components/dashboard/widgets/MessageWidget'; 
import ActivityWidget from '@/components/dashboard/widgets/ActivityWidget';
import { SmartWidget } from '@/components/dashboard/widgets/SmartWidget';

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

// OPGAVE 4: CanvasCard udvides nu fra den persistente type
type CanvasCard = CanvasCardPersist & {
  ref: React.RefObject<HTMLDivElement | null>; 
  isEditing?: boolean; 
  titleRef?: HTMLInputElement | null; 
  textRef?: HTMLTextAreaElement | null; 
  isNew?: boolean; // <-- ÆNDRING 1 (Opgave 5.3): Tilføjet for fade-in
};

// --- START: KOMPONENTER TIL LAYOUT ---

// 1. Quick Access Bar (Uændret)
const QuickAccessBar = ({ t, accessLevel, lang }: { t: any; accessLevel: SubscriptionLevel, lang: 'da' | 'en' }) => {
    const isPremium = ['Expert', 'Complete', 'Elite', 'Enterprise'].includes(accessLevel);
    const buttonClass = "flex items-center justify-between p-2 sm:p-3 text-xs sm:text-sm bg-black text-white transition duration-200 shadow-xl rounded-lg border-2 border-black group hover:-translate-y-1 hover:shadow-2xl";
    const ICON_SIZE_CLASS = "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-3";

    return (
        <div className="flex flex-wrap gap-4 md:gap-4 mb-4">
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
const ViewModeToggle = ({ 
  activeTool, 
  handleActiveToolChange, 
  canUseCanvas, 
  isDraggable,
  onAddWidget,
  onSaveLayout, 
  t 
}: { 
  activeTool: 'grid' | 'canvas' | 'add';
  handleActiveToolChange: (tool: 'grid' | 'canvas' | 'add') => void; 
  canUseCanvas: boolean;
  isDraggable: boolean;
  onAddWidget: (type: CanvasCard['type']) => void; 
  onSaveLayout: () => Promise<void>;
  t: any 
}) => {
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); 

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
  
  const handleAddCanvasItemClick = (type: CanvasCard['type']) => {
    onAddWidget(type); 
    setIsDropdownOpen(false); 
  };

  const handleAddGridItemClick = () => {
    handleActiveToolChange('add'); 
    setIsDropdownOpen(false); 
  };

  const showCanvasOptions = activeTool === 'canvas' && canUseCanvas;
  const showGridOptions = (activeTool === 'grid' || activeTool === 'add') && isDraggable;
  const showMenuOptions = showCanvasOptions || showGridOptions;

  return (
    <div className="flex items-center justify-between mb-4">
        
        {/* Venstre side: Toggles */}
        <div className="flex items-center space-x-2">
            <button 
                onClick={() => handleActiveToolChange('grid')} 
                className={`${toggleBaseClass} ${
                  (activeTool === 'grid' || activeTool === 'add') ? activeClass : inactiveClass
                }`}
            >
                <LayoutGrid className="h-4 w-4" />
                Grid
            </button>
            
            {canUseCanvas && (
                <button 
                    onClick={() => handleActiveToolChange('canvas')} 
                    className={`${toggleBaseClass} ${activeTool === 'canvas' ? activeClass : inactiveClass}`}
                >
                    <View className="h-4 w-4" />
                    Canvas
                </button>
            )}
        </div>

        {/* Højre side: Knapper */}
        <div className="flex items-center gap-2">
            
            <div ref={dropdownRef} className="relative"> 
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

              {isDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border z-10 p-1.5 space-y-1"> 
                      
                      {showCanvasOptions && (
                          <>
                              <button 
                                  onClick={() => handleAddCanvasItemClick('note')}
                                  className="flex items-center w-full text-left px-2 py-1.5 text-xs text-gray-800 rounded-md hover:bg-orange-500 hover:text-white group"
                              >
                                  <StickyNote className="h-4 w-4 mr-3 text-gray-500 group-hover:text-white" />
                                  {t.addNote ?? 'Tilføj Note'}
                              </button>
                              <button 
                                  onClick={() => handleAddCanvasItemClick('ai_readiness')}
                                  className="flex items-center w-full text-left px-2 py-1.5 text-xs text-gray-800 rounded-md hover:bg-orange-500 hover:text-white group"
                              >
                                  <Zap className="h-4 w-4 mr-3 text-gray-500 group-hover:text-white" />
                                  {t.addAiReadiness ?? 'Tilføj AI Readiness'}
                              </button>
                              <button 
                                  onClick={() => handleAddCanvasItemClick('weekly_calendar')}
                                  className="flex items-center w-full text-left px-2 py-1.5 text-xs text-gray-800 rounded-md hover:bg-orange-500 hover:text-white group"
                              >
                                  <Calendar className="h-4 w-4 mr-3 text-gray-500 group-hover:text-white" />
                                  {t.addWeeklyCalendar ?? 'Tilføj Ugekalender'}
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
                                  {t.addGridWidget ?? 'Tilføj Widget (Grid)'}
                              </button>
                          </>
                      )}

                      {!showMenuOptions && (
                           <p className="p-2 text-xs text-center text-gray-500">Ingen handlinger tilgængelige her.</p>
                      )}
                      
                  </div>
              )}
            </div>


            {isDraggable && activeTool === 'canvas' && ( // Vis kun Save Layout i Canvas-mode
                <button 
                    onClick={onSaveLayout} 
                    className={`${actionButtonBaseClass} bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:border-orange-600`}
                >
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
  
  const zoomControlRef = useRef<HTMLDivElement>(null); 
  const canvasRef = useRef<HTMLDivElement>(null); 
  const touchStartDist = useRef<number | null>(null); 
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null); 
  
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 }); 
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  
  const isDraggingCanvasRef = useRef(isDraggingCanvas);
  useEffect(() => {
    isDraggingCanvasRef.current = isDraggingCanvas;
  }, [isDraggingCanvas]);
  
  const dragStartPoint = useRef({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState(1); 
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3.0;
  const SCALE_STEP = 0.05; 

  const defaultInitialLayout: CanvasCardPersist[] = useMemo(() => ([
    {
      id: 'card-1',
      type: 'note',
      content: {
        title: 'Note',
        text: '' 
      },
      defaultPosition: { x: 40, y: 40 },
      size: { w: 256, h: 192 }, 
    },
    {
      id: 'card-2',
      type: 'ai_readiness', 
      content: null, 
      defaultPosition: { x: 350, y: 100 },
      size: { w: 320, h: 288 }, 
    }
  ]), []);

  const [canvasCards, setCanvasCards] = useState<CanvasCard[]>([]);
  const [isLoadingLayout, setIsLoadingLayout] = useState(true); 

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

  const intelligentGrid: GridItem[] = [
    { id: 'ai-readiness', priority: 'high', type: 'ai_readiness', data: {}, },
    { id: 'weekly-calendar', priority: 'medium', type: 'weekly_calendar', data: {}, },
    { id: 'messages', priority: 'medium', type: 'message', data: { title: 'Ny ulæst besked (Forældregruppe U19)', snippet: 'Hej Træner, angående kørsel til weekendens kamp...', },},
    { id: 'activity-feed', priority: 'low', type: 'activity', data: { feed: dashboardData.activityFeed, },},
  ];

  // Render-funktion
  const renderGridItem = (item: GridItem) => {
    switch (item.type as 'ai_readiness' | 'weekly_calendar' | 'message' | 'activity') {
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

  const layouts = {
    lg: [
      { i: 'ai-readiness',     x: 0, y: 0, w: 3, h: 2, minW: 1, maxW: 4, minH: 1 }, 
      { i: 'weekly-calendar',  x: 3, y: 0, w: 6, h: 2, minW: 4, maxW: 8, minH: 1 }, 
      { i: 'messages',         x: 9, y: 0, w: 3, h: 2, minW: 2, maxW: 4, minH: 1 }, 
      { i: 'activity-feed',    x: 0, y: 3, w: 12, h: 2, minW: 4, maxW: 12, minH: 2 }, 
    ],
    sm: [
      { i: 'ai-readiness',     x: 0, y: 0, w: 3, h: 2, minH: 2 },
      { i: 'messages',         x: 3, y: 0, w: 3, h: 2, minH: 2 },
      { i: 'weekly-calendar',  x: 0, y: 3, w: 6, h: 2, minH: 2 },
      { i: 'activity-feed',    x: 0, y: 6, w: 6, h: 2, minH: 2 },
    ],
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
        <div key={item.id} className="h-full">
            {renderGridItem(item)}
        </div>
    ));
  }, [intelligentGrid, t, lang, accessLevel]); 
  
  // --- CANVAS FUNKTIONER ---
  
  // *** AUTOSAVE FUNKTION (RETTET) ***
  const autosaveCanvasLayout = useCallback(async (cardsToSave: CanvasCard[], toolToSave: 'grid' | 'canvas' | 'add') => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid || 'dtl-dev-123'; 
    
    const layoutToSave: CanvasCardPersist[] = cardsToSave.map(card => ({
      id: card.id,
      type: card.type,
      content: card.type === 'note' ? card.content : null, 
      defaultPosition: card.defaultPosition,
      size: card.size,
    }));
    
    const settingsToSave: DashboardSettings = {
        cards: layoutToSave,
        activeTool: toolToSave,
        // RETTELSE: Gemmer den aktuelle zoom og position
        canvasState: { zoom: canvasScale, position: canvasPosition } 
    };
    
    await saveDashboardLayout(userId, settingsToSave);
  // RETTELSE: Tilføjet dependencies, så zoom/pan gemmes korrekt.
  }, [canvasScale, canvasPosition]); 

  // OPGAVE 4: Ny funktion der gemmer activeTool
  const handleActiveToolChange = (tool: 'grid' | 'canvas' | 'add') => {
    setActiveTool(tool); 
    autosaveCanvasLayout(canvasCards, tool);
  };


  // ==================================================================
  // ### DEN ENDELIGE RETTELSE ER HER ###
  // Denne funktion venter nu på, at Firebase Auth er klar.
  // ==================================================================
  useEffect(() => {
    const auth = getAuth();
    
    // Sætter en listener op, der fyrer, når Firebase kender login-statussen
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      
      // Bestem hvilket UserID der skal bruges
      let userId_to_load: string;
      if (user) {
        // Bruger er logget ind (f.eks. Super Admin)
        userId_to_load = user.uid;
      } else {
        // Bruger er ikke logget ind (eller er ved at logge ud)
        // Vi falder tilbage til mock-ID'et for udvikling
        userId_to_load = 'dtl-dev-123';
      }

      // 1. HENT GEMTE DATA med det korrekte ID
      const savedSettings = await getDashboardLayout(userId_to_load);
      
      let initialLayout: CanvasCardPersist[];
      let initialTool: 'grid' | 'canvas' | 'add';
      let initialZoom = 1;
      let initialPosition = { x: 0, y: 0 };

      // 2. BESLUT HVILKET LAYOUT DER SKAL VISES
      if (savedSettings) {
          if (savedSettings.cards && savedSettings.cards.length > 0) {
              initialLayout = savedSettings.cards;
              initialTool = savedSettings.activeTool || 'canvas'; 
          } else {
              initialLayout = defaultInitialLayout;
              initialTool = 'grid'; 
          }
          // Tjek for gemt zoom/pan
          if (savedSettings.canvasState) {
              initialZoom = savedSettings.canvasState.zoom;
              initialPosition = savedSettings.canvasState.position;
          }
      } else {
           initialLayout = defaultInitialLayout;
           initialTool = 'grid'; 
      }

      // 3. FORBERED KORTENE TIL RENDERING
      const cardsWithRefs: CanvasCard[] = initialLayout.map(card => ({
        ...card,
        ref: React.createRef<HTMLDivElement>(),
        isEditing: false, 
        isNew: false, 
      }));

      // 4. OPDATER STATE OG VIS SIDEN
      setCanvasCards(cardsWithRefs);
      setActiveTool(initialTool);
      setCanvasScale(initialZoom);
      setCanvasPosition(initialPosition);

      setIsLoadingLayout(false); // Fjerner loading-skærmen
    
    }); // <--- DENNE MANGLENDE PARENTES VAR FEJLEN

    // Ryd op i listeneren, når komponenten forsvinder
    return () => unsubscribe();
    
  // Kører kun én gang, når komponenten mounter
  }, [defaultInitialLayout]); 

  const renderCanvasCardContent = (card: CanvasCard) => {
    switch (card.type) {
      case 'ai_readiness':
        return <AiReadinessWidget userData={{ subscriptionLevel: accessLevel }} lang={lang} />;
      case 'weekly_calendar':
        return <CalendarWidget translations={t} lang={lang} />;
      case 'note':
      default:
        return (
          <p className="text-sm text-gray-600 mt-2">
            {card.content?.text ?? '...'}
          </p>
        );
    }
  };

  const widgetTypes: CanvasCard['type'][] = ['note', 'ai_readiness', 'weekly_calendar'];

  // *** `addCardToCanvas` (Uændret) ***
  const addCardToCanvas = (newType: CanvasCard['type']) => {
    const newX = 40 + (canvasCards.length % 5) * 50; 
    const newY = 40 + (canvasCards.length % 5) * 50;
    
    let newSize = { w: 256, h: 192 }; 
    let newContent: { title: string, text: string } | null = null; 

    if (newType === 'note') {
        newSize = { w: 256, h: 192 };
        newContent = { title: 'Note', text: '' }; 
    } else if (newType === 'ai_readiness') {
      newSize = { w: 320, h: 288 }; 
      newContent = null; 
    } else if (newType === 'weekly_calendar') {
      newSize = { w: 400, h: 300 }; 
      newContent = null;
    }

    // Opret det nye kort
    const newCardId = `card-${Date.now()}`;
    const newCard: CanvasCard = {
        id: newCardId,
        type: newType,
        content: newContent,
        defaultPosition: { x: newX, y: newY },
        size: newSize,
        ref: React.createRef<HTMLDivElement>(), 
        isEditing: newType === 'note' ? true : false, 
        isNew: true, // Markér som ny
    };

    // Tilføj kortet til state (stadig usynligt)
    setCanvasCards(prevCards => {
        const newCards = [...prevCards, newCard];
        autosaveCanvasLayout(newCards, activeTool); // Autosave
        return newCards;
    });

    // Tving React til at "male" kortet som usynligt FØRST,
    // og fjern derefter 'isNew' flaget for at starte CSS transition (fade-in).
    setTimeout(() => {
        setCanvasCards(prevCards => 
            prevCards.map(card => 
                card.id === newCardId ? { ...card, isNew: false } : card
            )
        );
    }, 50); // 50ms forsinkelse er nok til at CSS kan nå at se 'opacity-0'
  };

  const handleCardStop = (cardId: string, e: DraggableEvent, data: DraggableData) => {
    setCanvasCards(prevCards => {
        const newCards = prevCards.map(card => 
            card.id === cardId 
                ? { ...card, defaultPosition: { x: data.x, y: data.y } } 
                : card
        );
        autosaveCanvasLayout(newCards, activeTool); 
        return newCards;
    });
  };

  const handleDeleteCard = (cardId: string) => {
    setCanvasCards(prevCards => {
        const newCards = prevCards.filter(card => card.id !== cardId);
        autosaveCanvasLayout(newCards, activeTool); 
        return newCards;
    });
  };

  const handleCardResize = (cardId: string, e: React.SyntheticEvent, data: ResizeCallbackData) => {
    const { size } = data;
    const isResizeStop = (e.type === 'mouseup' || e.type === 'touchend' || e.type === 'mouseleave');
    
    setCanvasCards(prevCards => {
        const newCards = prevCards.map(card =>
            card.id === cardId
                ? { ...card, size: { w: size.width, h: size.height } }
                : card
        );
        
        if (isResizeStop) {
            autosaveCanvasLayout(newCards, activeTool); 
        }
        
        return newCards;
    });
  };
  
  const handleEditCard = (cardId: string, editing: boolean) => {
    setCanvasCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId 
          ? { ...card, isEditing: editing } 
          : card
      )
    );
  };

  const handleSaveCardContent = (
    cardId: string, 
    newTitle: string, 
    newText: string
  ) => {
    setCanvasCards(prevCards => {
        const newCards = prevCards.map(card => 
            card.id === cardId && card.type === 'note'
                ? { 
                    ...card, 
                    content: { title: newTitle, text: newText }, 
                    isEditing: false 
                } 
                : card
        );
        autosaveCanvasLayout(newCards, activeTool); 
        return newCards;
    });
  };

  const handleSaveLayout = async () => {
    await autosaveCanvasLayout(canvasCards, activeTool);
    alert('Layout Gemt!'); 
  };
  
  const getDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const getCenter = (touches: React.TouchList) => {
    if (touches.length === 0) return null;
    if (touches.length === 1) return { x: touches[0].clientX, y: touches[0].clientY };
    
    return {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  // --- MOUSE PAN LOGIC (Uændret) ---
  const handleMouseUp = useCallback(() => {
    setIsDraggingCanvas(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingCanvasRef.current) return; 
    
    const dx = e.clientX - dragStartPoint.current.x;
    const dy = e.clientY - dragStartPoint.current.y;
    setCanvasPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
    dragStartPoint.current = { x: e.clientX, y: e.clientY }; 
    e.preventDefault();
  }, []); 

  useEffect(() => {
    if (activeTool !== 'canvas' || !canUseCanvas) return;
    const onMove = (e: MouseEvent) => handleMouseMove(e as unknown as React.MouseEvent);
    const onUp = () => handleMouseUp();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [activeTool, canUseCanvas, handleMouseMove, handleMouseUp]); 
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && 
        !e.target.closest('.canvas-handle') && 
        !e.target.closest('.canvas-delete-btn') &&
        !e.target.closest('.react-resizable-handle') 
    ) {
        setIsDraggingCanvas(true);
        dragStartPoint.current = { x: e.clientX, y: e.clientY }; 
        e.preventDefault();
    }
  }, []);
  
  // --- TOUCH/GESTURE LOGIC (Uændret) ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.target instanceof HTMLElement && (
      e.target.closest('.canvas-handle') || 
      e.target.closest('.canvas-delete-btn') ||
      e.target.closest('.react-resizable-handle') 
    )) {
        return;
    }
    if (e.touches.length === 2) {
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
    } else if (isDraggingCanvasRef.current && e.touches.length === 1) { // Bruger ref
        const dx = e.touches[0].clientX - dragStartPoint.current.x; 
        const dy = e.touches[0].clientY - dragStartPoint.current.y; 
        setCanvasPosition(prev => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }));
        dragStartPoint.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; 
    }
  }, [canvasScale, MIN_SCALE, MAX_SCALE]); 

  const handleTouchEnd = useCallback(() => {
    touchStartDist.current = null;
    lastTouchCenter.current = null;
    setIsDraggingCanvas(false);
  }, []);
  
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
        if (e.target instanceof HTMLElement && e.target.closest('.react-resizable-handle')) {
          return;
        }
        if (e.target === canvasElement || canvasElement.contains(e.target as Node)) {
            e.preventDefault();
            e.stopPropagation();
            handleTouchMove(e as unknown as React.TouchEvent<HTMLDivElement>);
        };
    };

    canvasElement.addEventListener('wheel', onWheel, { passive: false });
    canvasElement.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      canvasElement.removeEventListener('wheel', onWheel);
      canvasElement.removeEventListener('touchmove', onTouchMove);
    };
  }, [activeTool, canvasRef, handleWheel, handleTouchMove]); 
  
  
  // OPGAVE 4: Viser loading, mens layout indlæses (RETTELSE)
  if (isLoadingLayout) {
    return (
      <div className="flex justify-center items-center h-[500px] text-gray-500 text-lg">
        {lang === 'da' ? 'Indlæser dit personlige dashboard...' : 'Loading your personal dashboard...'}
      </div>
    );
  }

  // Selve return-statement (OPDATERET)
  return (
    <> 
      <div className="mb-4">
        <QuickAccessBar t={t} accessLevel={accessLevel} lang={lang} />
      </div>
      
      <div className="mb-4">
        <ViewModeToggle 
          activeTool={activeTool}
          handleActiveToolChange={handleActiveToolChange} 
          canUseCanvas={canUseCanvas}
          isDraggable={isDraggable}
          onAddWidget={addCardToCanvas}
          onSaveLayout={handleSaveLayout} 
          t={t} 
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

      {/* FLYTBAR ZOOM KONTROL UI */}
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
            
            {/* *** ÆNDRING 3 (Opgave 5.3): Canvas kort løkke med "Fade-in" *** */}
            {canvasCards.map((card) => {
              
              const title = card.type === 'note' ? (card.content?.title || (lang === 'da' ? 'Note' : 'Note')) : 
                            card.type === 'ai_readiness' ? 'AI Readiness' : 
                            card.type === 'weekly_calendar' ? 'Ugekalender' : 'Widget';

              const innerContentStyle = { width: '100%', height: '100%' };

              return (
                <Draggable 
                  key={card.id}
                  nodeRef={card.ref} 
                  handle=".canvas-handle" 
                  defaultPosition={card.defaultPosition}
                  scale={canvasScale} 
                  onStop={(e, data) => handleCardStop(card.id, e, data)}
                  cancel=".react-resizable-handle, .canvas-delete-btn" 
                >
                  <div
                    ref={card.ref}
                    style={{
                      position: 'absolute',
                      width: card.size.w,
                      height: card.size.h,
                    }}
                    // *** Tilføjet fade-in logik ***
                    className={`relative group transition-opacity duration-300 ease-in-out ${
                        card.isNew ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <Resizable
                      width={card.size.w}
                      height={card.size.h}
                      onResizeStop={(e, data) => handleCardResize(card.id, e, data)}
                      onResize={(e, data) => handleCardResize(card.id, e, data)} 
                      onResizeStart={(e) => {
                          e.stopPropagation(); 
                      }} 
                      resizeHandles={['se']} 
                      minConstraints={[150, 100]}
                    >
                      <div className="w-full h-full overflow-hidden" style={innerContentStyle}>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleDeleteCard(card.id);
                          }}
                          className="canvas-delete-btn absolute top-2 right-2 z-10 p-1 bg-white rounded-full text-black shadow-md transition-all
                                     opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white"
                          aria-label="Slet kort"
                        >
                          <X className="w-3 h-3" strokeWidth={3} />
                        </button>

                        {/* Selve kort-indholdet (Uændret fra Opgave 5.1) */}
                        {card.type === 'note' ? (
                          <div 
                            className="canvas-handle h-full w-full bg-yellow-200 shadow-lg p-4 flex flex-col text-black transform -rotate-1 cursor-move [font-family:var(--font-permanent-marker),cursive]"
                            onDoubleClick={(e) => {
                                e.stopPropagation(); 
                                handleEditCard(card.id, true);
                            }}
                          >
                            {card.isEditing ? (
                              <>
                                <input
                                    type="text"
                                    ref={el => { if (el) card.titleRef = el; }} 
                                    defaultValue={title}
                                    className="[font-family:var(--font-permanent-marker),cursive] w-full text-black text-lg p-1 bg-transparent border-b border-yellow-400 focus:outline-none focus:border-orange-500" 
                                    placeholder={lang === 'da' ? 'Note Titel' : 'Note Title'}
                                    onKeyDown={(e) => { 
                                        if (e.key === 'Enter') handleSaveCardContent(card.id, (e.target as HTMLInputElement).value, card.content?.text ?? '');
                                    }}
                                    autoFocus
                                    onDoubleClick={(e) => e.stopPropagation()} 
                                    onClick={(e) => e.stopPropagation()} 
                                    onMouseDown={(e) => e.stopPropagation()} 
                                />
                                <textarea
                                    ref={el => { if (el) card.textRef = el; }}
                                    defaultValue={card.content?.text ?? ''}
                                    className="[font-family:var(--font-permanent-marker),cursive] w-full h-full flex-1 text-sm text-gray-800 p-1 bg-transparent resize-none focus:outline-none mt-2" 
                                    placeholder={lang === 'da' ? 'Note Titel' : 'Note Title'}
                                    onDoubleClick={(e) => e.stopPropagation()} 
                                    onClick={(e) => e.stopPropagation()} 
                                    onMouseDown={(e) => e.stopPropagation()} 
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        handleSaveCardContent(
                                            card.id, 
                                            card.titleRef?.value ?? card.content?.title ?? '',
                                            card.textRef?.value ?? card.content?.text ?? ''
                                        );
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()} 
                                    className="mt-2 px-3 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 z-20 self-end"
                                >
                                    {t.saveNoteButton ?? 'Udfør'} 
                                </button>
                              </>
                            ) : (
                              <>
                                <h3 className="text-black text-lg p-1">{title}</h3>
                                <p className="text-sm text-gray-800 mt-2 p-1 whitespace-pre-wrap"> 
                                  {card.content?.text}
                                </p>
                              </>
                            )}
                          </div>
                        ) : (
                            <div className="h-full w-full shadow-lg rounded-xl canvas-handle cursor-move">
                                {card.type === 'ai_readiness' && (
                                    <AiReadinessWidget userData={{ subscriptionLevel: accessLevel }} lang={lang} />
                                )}
                                {card.type === 'weekly_calendar' && (
                                    <CalendarWidget translations={t} lang={lang} />
                                )}
                            </div>
                        )}
                        {/* Slut på kort-indhold */}

                      </div>
                    </Resizable>
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