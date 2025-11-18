'use client';

// Imports
import React, { useMemo, useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Image as ImageIcon,
  Save,
  RefreshCcw,
  Share2,
  Trash2,
} from 'lucide-react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Link from 'next/link';
import { UserRole, SubscriptionLevel } from '@/lib/server/data';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getDashboardLayout,
  saveDashboardLayout,
  CanvasCardPersist,
  DashboardSettings,
  CanvasState,
  CanvasBackground,
  NoteColor,
  NoteFont,
  Connection,
  ConnectionPointId,
  Point
} from '@/lib/server/dashboard';

import AiReadinessWidget from '@/components/dashboard/widgets/AiReadinessWidget';
import CalendarWidget from '@/components/dashboard/widgets/CalendarWidget';
import MessageWidget from '@/components/dashboard/widgets/MessageWidget';
import ActivityWidget from '@/components/dashboard/widgets/ActivityWidget';
import { SmartWidget } from '@/components/dashboard/widgets/SmartWidget';
import CanvasToolbar from '@/components/dashboard/CanvasToolbar';
import ConnectionArrow, { getSvgPath_defaultLogic, CURVE_OFFSET } from '@/components/dashboard/ConnectionArrow';
import ConnectionHandle from '@/components/dashboard/ConnectionHandle';
// RETTELSE: Importerer den omdøbte fil
import PitchBackground from '@/components/dashboard/PitchBackground_FIX';


import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

// ==================================================================
// ### TYPER OG INTERFACES ###
// ==================================================================

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

type CanvasCard = Omit<CanvasCardPersist, 'content'> & {
  ref: React.RefObject<HTMLDivElement | null>;
  isEditing?: boolean;
  titleRef?: HTMLInputElement | null;
  textRef?: HTMLTextAreaElement | null;
  isNew?: boolean;
  content: {
    title: string;
    text: string;
    color: NoteColor;
    font: NoteFont;
  } | null;
};

// --- Hjælpefunktioner ---

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

function getPointsDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function getCardAnchorPoints(card: CanvasCard): Record<ConnectionPointId, Point> {
  const { x, y } = card.defaultPosition;
  const { w, h } = card.size;
  return {
    top: { x: x + w / 2, y: y },
    right: { x: x + w, y: y + h / 2 },
    bottom: { x: x + w / 2, y: y + h },
    left: { x: x, y: y + h / 2 },
  };
};

function getOptimalConnection(fromCard: CanvasCard, toCard: CanvasCard): { start: Point, end: Point, fromPoint: ConnectionPointId, toPoint: ConnectionPointId } {
  const fromPoints = getCardAnchorPoints(fromCard);
  const toPoints = getCardAnchorPoints(toCard);

  let minDistance = Infinity;
  let bestStart = fromPoints.right;
  let bestEnd = toPoints.left;
  let bestFromKey: ConnectionPointId = 'right';
  let bestToKey: ConnectionPointId = 'left';

  (Object.keys(fromPoints) as ConnectionPointId[]).forEach(fromKey => {
    (Object.keys(toPoints) as ConnectionPointId[]).forEach(toKey => {
      const distance = getPointsDistance(fromPoints[fromKey], toPoints[toKey]);
      if (distance < minDistance) {
        minDistance = distance;
        bestStart = fromPoints[fromKey];
        bestEnd = toPoints[toKey];
        bestFromKey = fromKey;
        bestToKey = toKey;
      }
    });
  });

  return { start: bestStart, end: bestEnd, fromPoint: bestFromKey, toPoint: bestToKey };
}

const getCardPointPosition = (card: CanvasCard, pointId: ConnectionPointId): Point => {
  return getCardAnchorPoints(card)[pointId];
};


// --- START: SUB-KOMPONENTER (Flyttet ud) ---

const QuickAccessBar = ({ t, accessLevel, lang }: { t: any; accessLevel: SubscriptionLevel, lang: 'da' | 'en' }) => {
  const isPremium = ['Expert', 'Complete', 'Elite', 'Enterprise'].includes(accessLevel);
  const buttonClass = "flex items-center justify-between p-2 sm:p-3 text-xs sm:text-sm bg-black text-white transition duration-200 shadow-xl rounded-lg border-2 border-black group hover:-translate-y-1 hover:shadow-2xl";
  const ICON_SIZE_CLASS = "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-3";

  return (
    <div className="flex flex-wrap gap-4 md:gap-4 mb-4">
      <Link href={`/${lang}/trainer/planner`}
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


const WidgetModal = ({
  t,
  onClose,
  onAddWidget,
  currentCards,
}: {
  t: any;
  onClose: () => void;
  onAddWidget: (type: CanvasCardPersist['type']) => void;
  currentCards: CanvasCard[];
}) => {

  const availableWidgets: { type: CanvasCardPersist['type']; name: string; icon: React.ElementType }[] = [
    { type: 'ai_readiness', name: t.addAiReadiness, icon: Zap },
    { type: 'weekly_calendar', name: t.addWeeklyCalendar, icon: Calendar },
  ];

  const addedWidgetTypes = useMemo(() =>
    new Set(currentCards.map(card => card.type)),
    [currentCards]
  );

  return (
    <div
      className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-base font-semibold text-black">{t.addWidgetTitle ?? 'Tilføj Widget'}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2 space-y-1">
          {availableWidgets.map((widget) => {
            const isAdded = addedWidgetTypes.has(widget.type);

            return (
              <button
                key={widget.type}
                onClick={() => {
                  if (!isAdded) {
                    onAddWidget(widget.type);
                    onClose();
                  }
                }}
                disabled={isAdded}
                className="flex items-center w-full p-2 rounded-lg transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed
                            hover:bg-gray-50"
              >
                <span className={`font-medium text-sm ${isAdded ? 'text-gray-400' : 'text-black'}`}>
                  {widget.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ConnectionPoint = ({
  cardId,
  pointId,
  position,
  onMouseDown,
  onMouseUp
}: {
  cardId: string;
  pointId: ConnectionPointId;
  position: string;
  onMouseDown: (e: React.MouseEvent, cardId: string, pointId: ConnectionPointId) => void;
  onMouseUp: (e: React.MouseEvent, cardId: string, pointId: ConnectionPointId) => void;
}) => (
  <div
    onMouseDown={(e) => {
      e.stopPropagation();
      onMouseDown(e, cardId, pointId);
    }}
    onMouseUp={(e) => {
      e.stopPropagation();
      onMouseUp(e, cardId, pointId);
    }}
    data-cardid={cardId}
    data-pointid={pointId}
    className={`connection-point absolute w-3 h-3 bg-white border-2 border-orange-500 rounded-full cursor-pointer z-20
            ${position} pointer-events-auto`}
  />
);


// ==================================================================
// ### HOVEDKOMPONENT: DashboardClient ###
// ==================================================================
export default function DashboardClient({
  dict,
  dashboardData,
  accessLevel,
  userRole,
}: DashboardProps) {
  const t = useMemo(() => dict.dashboard || {}, [dict]);
  const lang = useMemo(() => (dict.lang as 'da' | 'en') || 'da', [dict.lang]);
  const searchParams = useSearchParams();

  const [activeTool, setActiveTool] = useState<'grid' | 'canvas' | 'add'>('grid');

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

  const defaultInitialLayout: CanvasCard[] = useMemo(() => ([
    {
      id: 'card-1',
      type: 'note',
      content: {
        title: 'Note',
        text: '',
        color: 'yellow',
        font: 'marker'
      },
      defaultPosition: { x: 40, y: 40 },
      size: { w: 256, h: 192 },
      ref: React.createRef<HTMLDivElement>()
    },
    {
      id: 'card-2',
      type: 'ai_readiness',
      content: null,
      defaultPosition: { x: 350, y: 100 },
      size: { w: 320, h: 288 },
      ref: React.createRef<HTMLDivElement>()
    }
  ]), []);

  const [canvasCards, setCanvasCards] = useState<CanvasCard[]>([]);
  const [isLoadingLayout, setIsLoadingLayout] = useState(true);

  const [canvasBackground, setCanvasBackground] = useState<CanvasBackground>('default');

  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);

  const [isConnecting, setIsConnecting] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [tempArrow, setTempArrow] = useState<{
    fromId: string;
    fromPoint: ConnectionPointId;
    end: { x: number, y: number }
  } | null>(null);

  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);


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
    { id: 'messages', priority: 'medium', type: 'message', data: { title: 'Ny ulæst besked (Forældregruppe U19)', snippet: 'Hej Træner, angående kørsel til weekendens kamp...', }, },
    { id: 'activity-feed', priority: 'low', type: 'activity', data: { feed: dashboardData.activityFeed, }, },
  ];

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
      { i: 'ai-readiness', x: 0, y: 0, w: 3, h: 2, minW: 1, maxW: 4, minH: 1 },
      { i: 'weekly-calendar', x: 3, y: 0, w: 6, h: 2, minW: 4, maxW: 8, minH: 1 },
      { i: 'messages', x: 9, y: 0, w: 3, h: 2, minW: 2, maxW: 4, minH: 1 },
      { i: 'activity-feed', x: 0, y: 3, w: 12, h: 2, minW: 4, maxW: 12, minH: 2 },
    ],
    sm: [
      { i: 'ai-readiness', x: 0, y: 0, w: 3, h: 2, minH: 2 },
      { i: 'messages', x: 3, y: 0, w: 3, h: 2, minH: 2 },
      { i: 'weekly-calendar', x: 0, y: 3, w: 6, h: 2, minH: 2 },
      { i: 'activity-feed', x: 0, y: 6, w: 6, h: 2, minH: 2 },
    ],
    xs: [
      { i: 'ai-readiness', x: 0, y: 0, w: 4, h: 2, minH: 2 },
      { i: 'weekly-calendar', x: 0, y: 3, w: 4, h: 2, minH: 2 },
      { i: 'messages', x: 0, y: 6, w: 4, h: 2, minH: 2 },
      { i: 'activity-feed', x: 0, y: 9, w: 4, h: 2, minH: 2 },
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

  const autosaveCanvasLayout = useCallback(async (
    cardsToSave: CanvasCard[],
    toolToSave: 'grid' | 'canvas' | 'add',
    bgToSave?: CanvasBackground,
    scaleToSave?: number,
    posToSave?: { x: number, y: number },
    connectionsToSave?: Connection[]
  ) => {
    if (isLoadingLayout) return;

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
      canvasState: {
        zoom: scaleToSave ?? canvasScale,
        position: posToSave ?? canvasPosition,
        background: bgToSave ?? canvasBackground
      },
      connections: connectionsToSave ?? connections
    };

    await saveDashboardLayout(userId, settingsToSave);
  }, [canvasScale, canvasPosition, canvasBackground, connections, isLoadingLayout]);


  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      let userId_to_load: string;
      if (user) {
        userId_to_load = user.uid;
      } else {
        userId_to_load = 'dtl-dev-123';
      }

      const savedSettings = await getDashboardLayout(userId_to_load);

      let initialLayout: CanvasCardPersist[];
      let initialTool: 'grid' | 'canvas' | 'add';
      let initialZoom = 1;
      let initialPosition = { x: 0, y: 0 };
      let initialBackground: CanvasBackground = 'default';
      let initialConnections: Connection[] = [];

      if (savedSettings) {
        if (savedSettings.cards && savedSettings.cards.length > 0) {
          initialLayout = savedSettings.cards;
          initialTool = savedSettings.activeTool || 'grid';
        } else {
          initialLayout = defaultInitialLayout;
          initialTool = 'grid';
        }

        if (savedSettings.canvasState) {
          initialZoom = savedSettings.canvasState.zoom;
          initialPosition = savedSettings.canvasState.position;
          if (savedSettings.canvasState.background) {
            initialBackground = savedSettings.canvasState.background;
          }
        }
        if (savedSettings.connections) {
          initialConnections = savedSettings.connections;
        }
      } else {
        initialLayout = defaultInitialLayout;
        initialTool = 'grid';
      }

      const cardsWithRefs: CanvasCard[] = initialLayout.map(card => {
        const defaultNoteContent = {
          title: 'Note',
          text: '',
          color: 'yellow' as NoteColor,
          font: 'marker' as NoteFont
        };

        return {
          ...card,
          ref: React.createRef<HTMLDivElement>(),
          isEditing: false,
          isNew: false,
          content: card.type === 'note'
            ? { ...defaultNoteContent, ...(card.content as CanvasCard['content']) }
            : null,
        };
      });

      setCanvasCards(cardsWithRefs);

      const viewParam = searchParams.get('view');
      if (viewParam === 'canvas') {
        setActiveTool('canvas');
      } else if (viewParam === 'grid') {
        setActiveTool('grid');
      } else {
        setActiveTool(initialTool);
      }

      setCanvasScale(initialZoom);
      setCanvasPosition(initialPosition);
      setCanvasBackground(initialBackground);
      setConnections(initialConnections);

      setIsLoadingLayout(false);

    });

    return () => unsubscribe();

  }, [defaultInitialLayout, searchParams]);


  useEffect(() => {
    if (isLoadingLayout) return;

    const viewParam = searchParams.get('view');
    const newTool = viewParam === 'canvas' ? 'canvas' : 'grid';

    if (newTool !== activeTool) {
      setActiveTool(newTool);
      autosaveCanvasLayout(canvasCards, newTool, canvasBackground, canvasScale, canvasPosition, connections);
    }
  }, [searchParams, activeTool, autosaveCanvasLayout, canvasCards, canvasBackground, canvasScale, canvasPosition, connections, isLoadingLayout]);


  const addCardToCanvas = (
    newType: CanvasCardPersist['type'],
    options?: { color?: NoteColor, font?: NoteFont }
  ) => {
    const newX = 40 + (canvasCards.length % 5) * 50;
    const newY = 40 + (canvasCards.length % 5) * 50;

    let newSize = { w: 256, h: 192 };
    let newContent: CanvasCard['content'] = null;
    if (newType === 'note') {
      newSize = { w: 256, h: 192 };
      newContent = {
        title: 'Note',
        text: '',
        color: options?.color || 'yellow',
        font: options?.font || 'marker'
      };
    } else if (newType === 'ai_readiness') {
      newSize = { w: 320, h: 288 };
      newContent = null;
    } else if (newType === 'weekly_calendar') {
      newSize = { w: 400, h: 300 };
      newContent = null;
    }
    const newCardId = `card-${Date.now()}`;
    const newCard: CanvasCard = {
      id: newCardId,
      type: newType,
      content: newContent,
      defaultPosition: { x: newX, y: newY },
      size: newSize,
      ref: React.createRef<HTMLDivElement>(),
      isEditing: newType === 'note' ? true : false,
      isNew: true,
    };

    setCanvasCards(prevCards => {
      const newCards = [...prevCards, newCard];
      autosaveCanvasLayout(newCards, activeTool, canvasBackground, canvasScale, canvasPosition, connections);
      return newCards;
    });

    setTimeout(() => {
      setCanvasCards(prevCards =>
        prevCards.map(card =>
          card.id === newCardId ? { ...card, isNew: false } : card
        )
      );
    }, 50);
  };

  const handleCardStop = (cardId: string, e: DraggableEvent, data: DraggableData) => {
    setCanvasCards(prevCards => {
      const newCards = prevCards.map(card =>
        card.id === cardId
          ? { ...card, defaultPosition: { x: data.x, y: data.y } }
          : card
      );
      autosaveCanvasLayout(newCards, activeTool, canvasBackground, canvasScale, canvasPosition, connections);
      return newCards;
    });
  };

  const handleDeleteCard = (cardId: string) => {
    setCanvasCards(prevCards => {
      const newCards = prevCards.filter(card => card.id !== cardId);
      const newConnections = connections.filter(c => c.fromId !== cardId && c.toId !== cardId);
      setConnections(newConnections);
      autosaveCanvasLayout(newCards, activeTool, canvasBackground, canvasScale, canvasPosition, newConnections);
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
        autosaveCanvasLayout(newCards, activeTool, canvasBackground, canvasScale, canvasPosition, connections);
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
        card.id === cardId && card.type === 'note' && card.content
          ? {
            ...card,
            content: {
              ...card.content,
              title: newTitle,
              text: newText
            },
            isEditing: false
          }
          : card
      );
      autosaveCanvasLayout(newCards, activeTool, canvasBackground, canvasScale, canvasPosition, connections);
      return newCards;
    });
  };

  const handleToggleNoteFont = (cardId: string) => {
    setCanvasCards(prevCards => {
      const newCards = prevCards.map(card => {
        if (card.id === cardId && card.type === 'note' && card.content) {
          const newFont: NoteFont = card.content.font === 'marker' ? 'sans' : 'marker';
          return {
            ...card,
            content: {
              ...card.content,
              font: newFont,
            }
          };
        }
        return card;
      });

      autosaveCanvasLayout(newCards, activeTool, canvasBackground, canvasScale, canvasPosition, connections);
      return newCards;
    });
  };


  const handleSaveLayout = useCallback(async () => {
    await autosaveCanvasLayout(canvasCards, activeTool, canvasBackground, canvasScale, canvasPosition, connections);
    alert('Layout Gemt!');
  }, [autosaveCanvasLayout, canvasCards, activeTool, canvasBackground, canvasScale, canvasPosition, connections]);

  const handleChangeBackground = useCallback((newBackground: CanvasBackground) => {
    setCanvasBackground(newBackground);
    autosaveCanvasLayout(canvasCards, activeTool, newBackground, canvasScale, canvasPosition, connections);
  }, [canvasCards, activeTool, canvasScale, canvasPosition, autosaveCanvasLayout, connections]);

  // --- HANDLERE TIL FORBINDELSER ---
  const handleToggleConnections = () => {
    setIsConnecting(prev => !prev);
    setTempArrow(null);
    setSelectedConnectionId(null);
  };

  const handleClearConnections = () => {
    setConnections([]);
    autosaveCanvasLayout(canvasCards, activeTool, canvasBackground, canvasScale, canvasPosition, []);
  };

  const handleConnectionStart = useCallback((e: React.MouseEvent, fromId: string, fromPoint: ConnectionPointId) => {
    e.preventDefault();
    e.stopPropagation();

    const card = canvasCards.find(c => c.id === fromId);
    if (!card) return;

    const startPos = getCardPointPosition(card, fromPoint);

    setTempArrow({
      fromId: fromId,
      fromPoint: fromPoint,
      end: { x: startPos.x, y: startPos.y }
    });
  }, [canvasCards]);

  const handleConnectionEnd = useCallback((e: React.MouseEvent, toId: string, toPoint: ConnectionPointId) => {
    e.preventDefault();
    e.stopPropagation();

    if (tempArrow && tempArrow.fromId !== toId) {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        fromId: tempArrow.fromId,
        toId: toId,
        fromPoint: tempArrow.fromPoint,
        toPoint: toPoint,
        controlPoints: null,
      };

      const newConnections = [...connections, newConnection];
      setConnections(newConnections);
      autosaveCanvasLayout(canvasCards, activeTool, canvasBackground, canvasScale, canvasPosition, newConnections);
    }

    setTempArrow(null);
  }, [tempArrow, connections, canvasCards, activeTool, canvasBackground, canvasScale, canvasPosition, autosaveCanvasLayout]);


  const handleConnectionDrag = useCallback((
    e: DraggableEvent,
    data: DraggableData,
    connId: string,
    handleId: 'c1' | 'c2'
  ) => {
    setConnections(prevConnections =>
      prevConnections.map(conn => {
        if (conn.id === connId) {
          const fromCard = canvasCards.find(c => c.id === conn.fromId);
          const toCard = canvasCards.find(c => c.id === conn.toId);
          if (!fromCard || !toCard) return conn;

          const start = getCardPointPosition(fromCard, conn.fromPoint);
          const end = getCardPointPosition(toCard, conn.toPoint);

          let { c1, c2 } = conn.controlPoints
            ? conn.controlPoints
            : getSvgPath_defaultLogic(start, end, conn.fromPoint, conn.toPoint);

          const newPoint = { x: data.x, y: data.y };
          if (handleId === 'c1') {
            c1 = newPoint;
          } else {
            c2 = newPoint;
          }

          return { ...conn, controlPoints: { c1, c2 } };
        }
        return conn;
      })
    );
  }, [canvasCards]);

  const handleConnectionDragStop = useCallback((
    e: DraggableEvent,
    data: DraggableData,
    connId: string,
    handleId: 'c1' | 'c2'
  ) => {

    const newConnections = connections.map(conn => {
      if (conn.id === connId) {
        const fromCard = canvasCards.find(c => c.id === conn.fromId);
        const toCard = canvasCards.find(c => c.id === conn.toId);
        if (!fromCard || !toCard) return conn;

        const start = getCardPointPosition(fromCard, conn.fromPoint);
        const end = getCardPointPosition(toCard, conn.toPoint);

        let { c1, c2 } = conn.controlPoints
          ? conn.controlPoints
          : getSvgPath_defaultLogic(start, end, conn.fromPoint, conn.toPoint);

        const newPoint = { x: data.x, y: data.y };
        if (handleId === 'c1') {
          c1 = newPoint;
        } else {
          c2 = newPoint;
        }

        return { ...conn, controlPoints: { c1, c2 } };
      }
      return conn;
    });

    setConnections(newConnections);
    autosaveCanvasLayout(canvasCards, activeTool, canvasBackground, canvasScale, canvasPosition, newConnections);

  }, [autosaveCanvasLayout, canvasCards, activeTool, canvasBackground, canvasScale, canvasPosition, connections]);


  // --- MUSE-HANDLERE ---

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (isDraggingCanvasRef.current) {
      setIsDraggingCanvas(false);
      autosaveCanvasLayout(canvasCards, activeTool, canvasBackground, canvasScale, canvasPosition, connections);
    }

    if (tempArrow) {
      const target = e.target as HTMLElement;
      const targetIsConnectionPoint = target.closest('.connection-point');

      if (!targetIsConnectionPoint) {
        setTempArrow(null);
      }
    }
  }, [autosaveCanvasLayout, canvasCards, activeTool, canvasBackground, canvasScale, canvasPosition, connections, tempArrow]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDraggingCanvasRef.current) {
      const dx = e.clientX - dragStartPoint.current.x;
      const dy = e.clientY - dragStartPoint.current.y;
      setCanvasPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      dragStartPoint.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
      return;
    }

    if (tempArrow && canvasRef.current) {
      e.preventDefault();
      e.stopPropagation();

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - canvasRect.left - canvasPosition.x) / canvasScale;
      const mouseY = (e.clientY - canvasRect.top - canvasPosition.y) / canvasScale;

      setTempArrow(prev => prev ? ({ ...prev, end: { x: mouseX, y: mouseY } }) : null);
    }
  }, [canvasScale, canvasPosition, tempArrow]);

  useEffect(() => {
    if (activeTool !== 'canvas' || !canUseCanvas) return;

    const onMove = (e: MouseEvent) => handleMouseMove(e as unknown as React.MouseEvent);

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
    };
  }, [activeTool, canUseCanvas, handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setSelectedConnectionId(null);

    if (isConnecting) return;

    if (e.target instanceof HTMLElement &&
      e.target.closest('.canvas-handle') === null &&
      e.target.closest('.canvas-delete-btn') === null &&
      e.target.closest('.react-resizable-handle') === null &&
      e.target.closest('.connection-point') === null
    ) {
      setIsDraggingCanvas(true);
      dragStartPoint.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  }, [isConnecting]);

  // --- TOUCH/GESTURE LOGIC ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isConnecting || e.target instanceof HTMLElement && (
      e.target.closest('.canvas-handle') ||
      e.target.closest('.canvas-delete-btn') ||
      e.target.closest('.react-resizable-handle') ||
      e.target.closest('.connection-point')
    )) {
      return;
    }

    if (e.touches.length === 2) {
      const distance = getDistance(e.touches);
      if (distance) {
        touchStartDist.current = distance;
        lastTouchCenter.current = getCenter(e.touches);
        setIsDraggingCanvas(false);
      }
    } else if (e.touches.length === 1 && e.touches[0]) {
      setIsDraggingCanvas(true);
      dragStartPoint.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, [isConnecting]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist.current !== null) {
      e.preventDefault();
      const newDistance = getDistance(e.touches);
      if (!newDistance) return;

      const scaleChange = newDistance / touchStartDist.current;
      const scaleDelta = (scaleChange - 1);
      const newScaleRaw = canvasScale + scaleDelta;
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScaleRaw));
      setCanvasScale(parseFloat(newScale.toFixed(2)));
      touchStartDist.current = newDistance;
      return;
    }

    if (isDraggingCanvasRef.current && e.touches.length === 1 && e.touches[0]) {
      e.preventDefault();
      const dx = e.touches[0].clientX - dragStartPoint.current.x;
      const dy = e.touches[0].clientY - dragStartPoint.current.y;
      setCanvasPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      dragStartPoint.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return;
    }
  }, [canvasScale, MIN_SCALE, MAX_SCALE]);

  const handleTouchEnd = useCallback(() => {
    touchStartDist.current = null;
    lastTouchCenter.current = null;
    if (isDraggingCanvasRef.current) {
      setIsDraggingCanvas(false);
      autosaveCanvasLayout(canvasCards, activeTool, canvasBackground, canvasScale, canvasPosition, connections);
    }
  }, [autosaveCanvasLayout, canvasCards, activeTool, canvasBackground, canvasScale, canvasPosition, connections]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    let delta = -e.deltaY / 1000;
    if (Math.abs(e.deltaY) < 10) {
      delta = -e.deltaY / 100;
    }
    setCanvasScale(prevScale => {
      let newScale = prevScale + delta;
      newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

      autosaveCanvasLayout(canvasCards, activeTool, canvasBackground, newScale, canvasPosition, connections);

      return parseFloat(newScale.toFixed(2));
    });
  }, [MIN_SCALE, MAX_SCALE, autosaveCanvasLayout, canvasCards, activeTool, canvasBackground, canvasPosition, connections]);


  // KODE TIL ZOOM-FUNKTION (den du valgte)
  useEffect(() => {
    if (activeTool !== 'canvas' || !canUseCanvas) return;
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const onWheel = (e: WheelEvent) => {
      if (e.target === canvasElement || canvasElement.contains(e.target as Node)) {
        e.preventDefault();
        e.stopPropagation();
        handleWheel(e as unknown as React.WheelEvent);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      handleTouchMove(e as unknown as React.TouchEvent<HTMLDivElement>);
    };

    canvasElement.addEventListener('wheel', onWheel, { passive: false });
    canvasElement.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      canvasElement.removeEventListener('wheel', onWheel);
      canvasElement.removeEventListener('touchmove', onTouchMove);
    };
  }, [activeTool, canUseCanvas, handleWheel, handleTouchMove]);


  const canvasBgClass = useMemo(() => {
    if (canvasBackground === 'dots') return 'canvas-bg-dots';
    if (canvasBackground === 'week') return 'canvas-bg-week';
    if (canvasBackground === 'pitch') return 'canvas-bg-pitch';
    return 'canvas-bg-default';
  }, [canvasBackground]);


  if (isLoadingLayout) {
    return (
      <div className="flex justify-center items-center h-[800px] text-gray-500 text-lg">
        {lang === 'da' ? 'Indlæser dit personlige dashboard...' : 'Loading your personal dashboard...'}
      </div>
    );
  }

  // Selve return-statement
  return (
    <>
      {isWidgetModalOpen && (
        <WidgetModal
          t={t}
          onClose={() => setIsWidgetModalOpen(false)}
          onAddWidget={addCardToCanvas}
          currentCards={canvasCards}
        />
      )}

      {/* Denne div er den, der skabte det UDENFORS-hul. Vi fjerner mb-4. */}
      <div>
        <QuickAccessBar t={t} accessLevel={accessLevel} lang={lang} />
      </div>

      {/* ViewModeToggle er nu i headeren */}

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

      {activeTool === 'canvas' && canUseCanvas && (
        <div
          ref={canvasRef}
          className={`relative w-full h-[800px] rounded-lg touch-none border border-gray-300 overflow-hidden ${canvasBgClass}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseUp={handleMouseUp}
          style={{ cursor: isConnecting ? 'crosshair' : (isDraggingCanvas ? 'grabbing' : 'grab') }}
        >

          {/* === RETTELSE 1: Wrapper for græsset (z-0) === */}
          {canvasBackground === 'pitch' && (
            <div className="absolute inset-0 z-0">
              <Suspense fallback={null}>
                <PitchBackground position={canvasPosition} scale={canvasScale} />
              </Suspense>
            </div>
          )}

          {/* === RETTELSE 2: Wrapper for Toolbar (z-20) === */}
          <div className="absolute z-20 top-1 left-1">
            <CanvasToolbar
              onAddWidget={addCardToCanvas}
              onOpenWidgetModal={() => setIsWidgetModalOpen(true)}
              onChangeBackground={handleChangeBackground}
              onSaveLayout={handleSaveLayout}
              onToggleConnections={handleToggleConnections}
              onClearConnections={handleClearConnections}
              isConnecting={isConnecting}
              t={t}
            />
          </div>

          {/* Canvas Indhold (Kort og Pile) ligger ovenpå (z-10) */}
          <div
            className="absolute inset-0 origin-top-left transition-transform duration-50"
            style={{
              transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${canvasScale})`,
              backgroundColor: canvasBackground === 'pitch' ? 'transparent' : '',
              zIndex: 10
            }}
          >

            {/* SVG LAG TIL PILE (z-index 10) */}
            <svg
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
              style={{
                overflow: 'visible',
                zIndex: 10,
                pointerEvents: 'none'
              }}
            >
              <defs>
                <marker
                  id="arrowhead-default"
                  markerWidth="8" markerHeight="6"
                  refX="8" refY="3"
                  orient="auto" markerUnits="strokeWidth"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#f97316" />
                </marker>
                <marker
                  id="arrowhead-selected"
                  markerWidth="8" markerHeight="6"
                  refX="8" refY="3"
                  orient="auto" markerUnits="strokeWidth"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#000000" />
                </marker>
              </defs>

              {/* Tegn gemte forbindelser */}
              {connections.map(conn => {
                const fromCard = canvasCards.find(c => c.id === conn.fromId);
                const toCard = canvasCards.find(c => c.id === conn.toId);
                if (!fromCard || !toCard) return null;

                const start = getCardPointPosition(fromCard, conn.fromPoint);
                const end = getCardPointPosition(toCard, conn.toPoint);
                const isSelected = selectedConnectionId === conn.id;

                return (
                  <ConnectionArrow
                    key={conn.id}
                    start={start}
                    end={end}
                    fromPoint={conn.fromPoint}
                    toPoint={conn.toPoint}
                    controlPoints={conn.controlPoints}
                    isSelected={isSelected}
                    isConnecting={isConnecting}
                    onClick={(e) => {
                      if (isConnecting) return;
                      (e.currentTarget as SVGGElement).style.pointerEvents = isSelected ? 'auto' : 'none';
                      e.stopPropagation();
                      setSelectedConnectionId(conn.id);
                    }}
                  />
                );
              })}

              {/* Tegn midlertidig pil, der følger musen */}
              {tempArrow && (() => {
                const fromCard = canvasCards.find(c => c.id === tempArrow.fromId);
                if (!fromCard) return null;

                const start = getCardPointPosition(fromCard, tempArrow.fromPoint);

                return (
                  <ConnectionArrow
                    start={start}
                    end={tempArrow.end}
                    fromPoint={tempArrow.fromPoint}
                    toPoint={null}
                    isTemporary={true}
                  />
                );
              })()}

              {/* Tegn justeringshåndtag */}
              {selectedConnectionId && !isConnecting && (() => {
                const conn = connections.find(c => c.id === selectedConnectionId);
                if (!conn) return null;

                const fromCard = canvasCards.find(c => c.id === conn.fromId);
                const toCard = canvasCards.find(c => c.id === conn.toId);
                if (!fromCard || !toCard) return null;

                const start = getCardPointPosition(fromCard, conn.fromPoint);
                const end = getCardPointPosition(toCard, conn.toPoint);

                let c1: Point, c2: Point;

                if (conn.controlPoints) {
                  c1 = conn.controlPoints.c1;
                  c2 = conn.controlPoints.c2;
                } else {
                  const { c1: defaultC1, c2: defaultC2 } = getSvgPath_defaultLogic(start, end, conn.fromPoint, conn.toPoint);
                  c1 = defaultC1;
                  c2 = defaultC2;
                }

                return (
                  <>
                    <ConnectionHandle
                      position={c1}
                      scale={canvasScale}
                      onDrag={(e, data) => handleConnectionDrag(e, data, conn.id, 'c1')}
                      onStop={(e, data) => handleConnectionDragStop(e, data, conn.id, 'c1')}
                    />
                    <ConnectionHandle
                      position={c2}
                      scale={canvasScale}
                      onDrag={(e, data) => handleConnectionDrag(e, data, conn.id, 'c2')}
                      onStop={(e, data) => handleConnectionDragStop(e, data, conn.id, 'c2')}
                    />
                  </>
                );
              })()}
            </svg>
            {/* --- SLUT PÅ SVG LAG --- */}


            {canvasCards.map((card) => {

              const title = (card.type === 'note' && card.content) ? card.content.title :
                card.type === 'ai_readiness' ? 'AI Readiness' :
                  card.type === 'weekly_calendar' ? 'Ugekalender' : 'Widget';

              const innerContentStyle = { width: '100%', height: '100%' };

              const noteBgClass = card.type === 'note' ? `note-bg-${card.content?.color || 'yellow'}` : 'bg-white';
              const noteFontClass = card.type === 'note' ? `note-font-${card.content?.font || 'marker'}` : '';

              return (
                <Draggable
                  key={card.id}
                  nodeRef={card.ref}
                  handle=".canvas-handle"
                  defaultPosition={card.defaultPosition}
                  scale={canvasScale}
                  onStop={(e, data) => handleCardStop(card.id, e, data)}
                  cancel=".react-resizable-handle, .canvas-delete-btn, .connection-point"
                  disabled={isConnecting}
                >
                  <div
                    ref={card.ref}
                    style={{
                      position: 'absolute',
                      width: card.size.w,
                      height: card.size.h,
                      zIndex: 1,
                    }}
                    className={`relative group transition-opacity duration-300 ease-in-out ${
                      card.isNew ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    {isConnecting && (
                      <>
                        <ConnectionPoint cardId={card.id} pointId="left" position="top-1/2 -translate-y-1/2 -left-1.5" onMouseDown={handleConnectionStart} onMouseUp={(e) => handleConnectionEnd(e, card.id, 'left')} />
                        <ConnectionPoint cardId={card.id} pointId="right" position="top-1/2 -translate-y-1/2 -right-1.5" onMouseDown={handleConnectionStart} onMouseUp={(e) => handleConnectionEnd(e, card.id, 'right')} />
                        <ConnectionPoint cardId={card.id} pointId="top" position="left-1/2 -translate-x-1/2 -top-1.5" onMouseDown={handleConnectionStart} onMouseUp={(e) => handleConnectionEnd(e, card.id, 'top')} />
                        <ConnectionPoint cardId={card.id} pointId="bottom" position="left-1/2 -translate-x-1/2 -bottom-1.5" onMouseDown={handleConnectionStart} onMouseUp={(e) => handleConnectionEnd(e, card.id, 'bottom')} />
                      </>
                    )}

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

                        {card.type === 'note' && card.content ? (
                          <div
                            className={`canvas-handle h-full w-full shadow-lg p-4 flex flex-col text-black transform -rotate-1 cursor-move
                                        ${noteBgClass} ${noteFontClass}`}
                            onDoubleClick={(e) => {
                              if (isConnecting) return;
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
                                  className={`${noteFontClass} w-full text-black text-lg p-1 bg-transparent border-b border-gray-500/30 focus:outline-none focus:border-orange-500`}
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
                                  defaultValue={card.content.text}
                                  className={`${noteFontClass} w-full h-full flex-1 text-sm text-gray-800 p-1 bg-transparent resize-none focus:outline-none mt-2`}
                                  placeholder={lang === 'da' ? 'Note Tekst' : 'Note Text'}
                                  onDoubleClick={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseDown={(e) => e.stopPropagation()}
                                />
                                <div className="flex justify-between items-center mt-2">
                                  <button
                                    title={t.toggleFont ?? 'Skift Skrifttype'}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleNoteFont(card.id);
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="p-1.5 text-black rounded hover:bg-black/10 z-20"
                                  >
                                    <RefreshCcw className="w-4 h-4" />
                                  </button>
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
                                    className="px-3 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 z-20 self-end"
                                  >
                                    {t.saveNoteButton ?? 'Udfør'}
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <h3 className="text-black text-lg p-1">{title}</h3>
                                <p className="text-sm text-gray-800 mt-2 p-1 whitespace-pre-wrap">
                                  {card.content.text}
                                </p>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="h-full w-full shadow-lg rounded-xl canvas-handle cursor-move">
                            {card.type === 'ai_readiness' && (
                              <AiReadinessWidget userData={{ subscriptionLevel: accessLevel }} lang={lang} />
                            )}
                            {card.empty_widget && ( // Antager vi har en 'empty_widget' type
                              <div className="p-4">
                                <h3 className="font-semibold">{card.content?.title}</h3>
                                <p className="text-sm text-gray-600">{card.content?.text}</p>
                              </div>
                            )}
                            {card.type === 'weekly_calendar' && (
                              <CalendarWidget translations={t} lang={lang} />
                            )}
                          </div>
                        )}
                      </div>
                    </Resizable>
                  </div>
                </Draggable>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}