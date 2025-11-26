// app/[lang]/(secure)/trainer/planner/SessionPlannerClient.tsx
"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SubscriptionLevel, UserRole } from '@/lib/server/data';
import { 
  Clock, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Settings, Plus, StickyNote, Trash2, Move, X, Play, 
  Activity, LayoutTemplate, Share2, Search, CheckCircle2,
  MoreHorizontal, Sparkles, Users, Zap, Save, Edit3,
  Dumbbell, UserCog, AlertCircle, Timer, Check, Filter, UserX,
  CalendarDays, Menu, PanelRightClose, PanelRightOpen, Target
} from 'lucide-react';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import Link from 'next/link';
import "react-resizable/css/styles.css";
// HUSK: Importér updateSession også!
import { createSession, getUserSessions, updateSession } from '@/lib/services/sessionService';
import { useUser } from '@/components/UserContext'; 

// --- TYPER ---
type CardType = 'drill' | 'note';
type Intensity = 'low' | 'medium' | 'high';
type Phase = 'Opvarmning' | 'Fase 1' | 'Fase 2' | 'Afslutning' | 'Erobring';
type PlayerStatus = 'ready' | 'injured' | 'absent' | 'limited' | 'gym' | 'individual';

interface Session {
    id: string;
    day: string;
    time: string;
    team: string;
    type: string;
    status: 'draft' | 'ready' | 'completed';
    theme: string;
    exercises?: TimelineItem[];
}

interface PlannerCard {
  id: string;
  type: CardType;
  title: string;
  content?: string; 
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string; 
  duration?: number; 
  intensity?: Intensity;
  phase?: Phase;
  tags?: string[];
  ref: React.RefObject<HTMLDivElement | null>;
}

interface TimelineItem {
    id: string;
    cardId: string;
    title: string;
    duration: number;
    type: CardType;
    intensity: Intensity;
}

interface Connection {
    id: string;
    fromId: string;
    toId: string;
}

interface SessionPlannerClientProps {
  dict: any; 
  plannerData: any;
  accessLevel: SubscriptionLevel;
  userRole: UserRole;
  lang: 'da' | 'en';
}

// --- UTILS ---
const getCurvePath = (start: {x: number, y: number}, end: {x: number, y: number}) => {
    const midX = (start.x + end.x) / 2;
    return `M${start.x},${start.y} C${midX},${start.y} ${midX},${end.y} ${end.x},${end.y}`;
};

const getIntensityColor = (intensity: Intensity) => {
    switch(intensity) {
        case 'low': return 'bg-emerald-500';
        case 'medium': return 'bg-yellow-500';
        case 'high': return 'bg-red-500';
        default: return 'bg-gray-400';
    }
};

// --- SUB-KOMPONENTER ---
const MiniPitchCSS = () => (
    <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-white relative overflow-hidden rounded-lg">
            <div className="absolute inset-2 border border-slate-200 rounded-sm"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200 -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-10 h-10 border border-slate-200 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-slate-800 rounded-full shadow-sm opacity-80"></div>
            <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-slate-800 rounded-full shadow-sm opacity-80"></div>
            <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-orange-500 rounded-full shadow-sm"></div>
        </div>
    </div>
);

// Modal
const DrillModal = ({ card, isOpen, onClose, onSave, lang }: any) => {
    if (!isOpen || !card) return null;
    const [formData, setFormData] = useState({ ...card });
    const handleChange = (field: string, value: any) => { setFormData((prev:any) => ({ ...prev, [field]: value })); };
    const handleSave = () => { onSave(card.id, formData); onClose(); };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-zinc-100 flex justify-between items-center bg-white">
                    <h3 className="text-xs font-bold text-black uppercase tracking-wide flex items-center gap-2">
                        {card.type === 'drill' ? <LayoutTemplate size={14} className="text-orange-500" /> : <StickyNote size={14} className="text-orange-500" />}
                        {card.type === 'drill' ? 'Rediger Øvelse' : 'Rediger Note'}
                    </h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-black transition-colors"><X size={16} /></button>
                </div>
                <div className="p-5 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Titel</label>
                        <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm font-semibold focus:ring-1 focus:ring-orange-500 outline-none transition-all text-black" autoFocus />
                    </div>
                    {card.type === 'drill' && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tid (min)</label>
                                    <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2">
                                        <Clock size={14} className="text-zinc-400"/>
                                        <input type="number" value={formData.duration} onChange={(e) => handleChange('duration', parseInt(e.target.value))} className="w-full bg-transparent text-sm font-mono outline-none text-black" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Intensitet</label>
                                    <select value={formData.intensity} onChange={(e) => handleChange('intensity', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm outline-none cursor-pointer text-black">
                                        <option value="low">Lav</option>
                                        <option value="medium">Middel</option>
                                        <option value="high">Høj</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-2">
                                <Link href={`/${lang}/trainer/studio`} className="flex items-center justify-center gap-2 w-full py-2.5 bg-black text-white rounded-lg hover:bg-zinc-800 transition-all shadow-sm text-xs font-bold uppercase tracking-wider group">
                                    <Play size={12} className="fill-current group-hover:text-orange-500 transition-colors" /> Åben DTL Studio
                                </Link>
                            </div>
                        </>
                    )}
                </div>
                <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-2">
                    <button onClick={onClose} className="px-3 py-1.5 text-xs font-bold text-zinc-500 hover:text-black transition-colors">Annuller</button>
                    <button onClick={handleSave} className="px-4 py-1.5 bg-orange-500 text-white rounded-md text-xs font-bold shadow-sm hover:bg-orange-600 transition-all flex items-center gap-2">
                        <Save size={12} /> Gem
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function SessionPlannerClient({ dict, plannerData, accessLevel, userRole, lang }: SessionPlannerClientProps) {
  const t = dict.trainer_page || {};
  const { user } = useUser();
  
  // UI STATE
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'library' | 'ai'>('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  // GRID BAGGRUND & KORT STØRRELSE STATE
  const [baseGridSize, setBaseGridSize] = useState(40); // Standard 40px

  // SESSION MANAGEMENT
  const [weeklySessions, setWeeklySessions] = useState<Session[]>([
      { id: 'new', day: 'I dag', time: '17:00', team: 'U19', type: 'Fodbold', status: 'draft', theme: 'Nyt Pas' }
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>('new');
  const currentSession = weeklySessions.find(s => s.id === activeSessionId) || weeklySessions[0];

  // CANVAS STATE
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // DATA
  const [cards, setCards] = useState<PlannerCard[]>([
    { 
        id: 'drill-1', type: 'drill', title: 'Rondo: Fase 2', content: '', 
        x: 150, y: 100, w: 180, h: 130, color: 'bg-white', 
        duration: 15, intensity: 'medium', phase: 'Fase 2', tags: ['Possession'],
        ref: React.createRef<HTMLDivElement>() 
    }
  ]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartPoint = useRef({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);

  // --- INDLÆS DATA FRA DATABASE ---
  useEffect(() => {
    async function loadUserSessions() {
        const userId = user?.id || 'dtl-dev-123';
        const sessions = await getUserSessions(userId);

        if (sessions && sessions.length > 0) {
            const mappedSessions: Session[] = sessions.map(s => ({
                id: s.id || 'unknown',
                day: new Date(s.date).toLocaleDateString('da-DK', { weekday: 'long' }),
                time: new Date(s.date).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }),
                team: 'U19', 
                type: 'Fodbold',
                status: 'ready',
                theme: s.title || 'Uden navn',
                exercises: s.exercises 
            }));

            // Behold 'new' session i listen for at kunne oprette nye
            setWeeklySessions([
                { id: 'new', day: 'Ny', time: '--:--', team: 'Nyt Pas', type: 'Draft', status: 'draft', theme: 'Opret Nyt Pas' },
                ...mappedSessions
            ]);
            
            // Hvis vi har hentet sessioner, vælg den første rigtige
            if (mappedSessions.length > 0) {
                setActiveSessionId(mappedSessions[0].id);
                if (mappedSessions[0].exercises) {
                    setTimelineItems(mappedSessions[0].exercises);
                }
            }
        }
    }

    loadUserSessions();
  }, [user?.id]);

  // RESPONSIV HANDLER
  useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth < 1024) { 
              setIsRightPanelOpen(false);
          } else {
              setIsRightPanelOpen(true);
          }
          if (window.innerWidth <= 1280) {
              setBaseGridSize(20);
          } else {
              setBaseGridSize(40);
          }
      };
      handleResize();
      if (window.innerWidth <= 1280) {
          setCards(prevCards => prevCards.map(c => ({ ...c, w: 180, h: 130 })));
      }
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  // MOCK DEMO TRUP
  const demoSquad: { name: string; pos: string; status: PlayerStatus; avatar: string; restriction?: string; reason?: string; }[] = [
      { name: 'Fassare Hedo', pos: 'ANG', status: 'ready', avatar: 'FH' },
      { name: 'Rosmise Tioss', pos: 'MID', status: 'ready', avatar: 'RT' },
      { name: 'Mikkel Hansen', pos: 'FOR', status: 'limited', restriction: 'Max 30m', avatar: 'MH' },
      { name: 'Oscar Berg', pos: 'MÅL', status: 'injured', reason: 'Knæ', avatar: 'OB' },
      { name: 'Mads Jensen', pos: 'DEF', status: 'absent', reason: 'Afbud', avatar: 'MJ' },
      { name: 'Liam Jensen', pos: 'KAN', status: 'gym', reason: 'Styrke', avatar: 'LJ' },
      { name: 'Noah Vester', pos: 'MID', status: 'individual', reason: 'Teknik', avatar: 'NV' },
      { name: 'William K', pos: 'FOR', status: 'ready', avatar: 'WK' },
  ];

  // HELPERS
  const getSelectedCard = () => cards.find(c => c.id === selectedCardId);
  const getEditingCard = () => cards.find(c => c.id === editingCardId) || null;
  const totalDuration = timelineItems.reduce((acc, item) => acc + item.duration, 0);
  const getCardAnchor = (cardId: string, side: 'left' | 'right') => {
      const card = cards.find(c => c.id === cardId);
      if (!card) return { x: 0, y: 0 };
      if (side === 'left') return { x: card.x, y: card.y + card.h / 2 };
      return { x: card.x + card.w, y: card.y + card.h / 2 };
  };

  // HANDLERS
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); const delta = -e.deltaY / 1000; setScale(prev => Math.min(Math.max(0.5, prev + delta), 2)); }
  }, []);
  useEffect(() => { const c = canvasRef.current; if(!c) return; c.addEventListener('wheel', handleWheel, {passive:false}); return ()=>c.removeEventListener('wheel',handleWheel);}, [handleWheel]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) { setIsDraggingCanvas(true); setSelectedCardId(null); dragStartPoint.current = { x: e.clientX - position.x, y: e.clientY - position.y }; }
  };
  const handleMouseMove = (e: React.MouseEvent) => { if (isDraggingCanvas) { setPosition({ x: e.clientX - dragStartPoint.current.x, y: e.clientY - dragStartPoint.current.y }); } };
  const handleMouseUp = () => { setIsDraggingCanvas(false); };

  // ACTIONS
  const openEditModal = (cardId: string) => { setEditingCardId(cardId); setModalOpen(true); };
  const addCard = (type: CardType, data?: any) => {
    const isSmall = window.innerWidth <= 1280;
    const newWidth = isSmall ? 180 : 220;
    const newHeight = isSmall ? 130 : 160;

    const newCard: PlannerCard = {
        id: `card-${Date.now()}`, type, title: data?.title || (type === 'drill' ? 'Ny Øvelse' : 'Note'), content: '', 
        x: -position.x + 200, y: -position.y + 150, 
        w: newWidth, h: newHeight, 
        color: type === 'note' ? 'bg-yellow-100' : 'bg-white', duration: 15, intensity: 'medium', tags: [], ref: React.createRef<HTMLDivElement>()
    };
    setCards([...cards, newCard]); setTimeout(() => { setEditingCardId(newCard.id); setModalOpen(true); }, 50);
  };
  const removeCard = (id: string) => { setCards(cards.filter(c => c.id !== id)); setConnections(connections.filter(c => c.fromId !== id && c.toId !== id)); };
  const updateCard = (id: string, updates: Partial<PlannerCard>) => { setCards(cards.map(c => c.id === id ? { ...c, ...updates } : c)); };

  // --- DROP LOGIK ---
  const checkTimelineDrop = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent, card: PlannerCard) => {
     if (!timelineRef.current || !isBottomPanelOpen) return;
     
     let clientX, clientY;
     if ('changedTouches' in e && e.changedTouches.length > 0) {
         clientX = e.changedTouches[0].clientX;
         clientY = e.changedTouches[0].clientY;
     } else if ('clientX' in e) {
         clientX = (e as MouseEvent).clientX;
         clientY = (e as MouseEvent).clientY;
     } else {
         return;
     }

     const elementsUnder = document.elementsFromPoint(clientX, clientY);
     const isOverTimeline = elementsUnder.some(el => 
         el === timelineRef.current || timelineRef.current?.contains(el)
     );

     if (isOverTimeline) { 
         addToTimeline(card); 
     }
  };

  const addToTimeline = (card: PlannerCard) => {
      if (card.type !== 'drill') return;
      const newItem: TimelineItem = { 
          id: `tl-${Date.now()}`, 
          cardId: card.id, 
          title: card.title, 
          duration: card.duration || 15, 
          type: card.type, 
          intensity: card.intensity || 'medium' 
      };
      setTimelineItems(prev => [...prev, newItem]);
  };

  const removeFromTimeline = (itemId: string) => { setTimelineItems(prev => prev.filter(item => item.id !== itemId)); };

  // --- SKIFT SESSION & OPRET NY ---
  const switchSession = (sessionId: string) => { 
      if (sessionId === 'new') {
          // Nulstil til en tom "Ny Session"
          setActiveSessionId('new');
          setTimelineItems([]);
      } else {
          // Skift til en eksisterende session
          setActiveSessionId(sessionId);
          const selectedSession = weeklySessions.find(s => s.id === sessionId);
          if (selectedSession && selectedSession.exercises) {
              setTimelineItems(selectedSession.exercises);
          } else {
              setTimelineItems([]);
          }
      }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100dvh-55px)] lg:h-[calc(100dvh-55px)] 2xl:h-[calc(100dvh-80px)] bg-[#F2F4F7] text-black font-sans overflow-hidden p-2 lg:p-[2px] lg:gap-[2px] 2xl:p-4 2xl:gap-4 relative">
      
      <DrillModal isOpen={modalOpen} onClose={() => setModalOpen(false)} card={getEditingCard()} onSave={updateCard} lang={lang} />

      {/* --- VENSTRE KOLONNE --- */}
      <div className="flex-1 flex flex-col gap-2 lg:gap-[2px] 2xl:gap-3 min-w-0 h-full">
        
        {/* 1. CANVAS */}
        <div className="flex-1 relative rounded-xl lg:rounded-lg 2xl:rounded-2xl border border-slate-200 shadow-sm bg-white z-10">
            
            {/* MOBILE MENU */}
            <div className="absolute top-4 right-4 z-40 lg:hidden">
                 <button onClick={() => setIsRightPanelOpen(!isRightPanelOpen)} className="p-2 bg-white rounded-lg shadow-md border border-slate-100 text-slate-600"><Menu size={20} /></button>
            </div>

            {/* Canvas Area */}
            <div 
                ref={canvasRef} 
                className={`
                    w-full h-full relative bg-white rounded-2xl lg:rounded-lg 2xl:rounded-2xl 
                    ${isDraggingCanvas ? 'cursor-grabbing' : 'cursor-default'} 
                    pt-0
                    ${isDraggingCard ? 'z-30 overflow-visible' : 'z-10 overflow-hidden'}
                `} 
                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
            >
                <div className="absolute inset-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: `linear-gradient(#94A3B8 1px, transparent 1px), linear-gradient(90deg, #94A3B8 1px, transparent 1px)`, backgroundSize: `${baseGridSize * scale}px ${baseGridSize * scale}px`, backgroundPosition: `${position.x}px ${position.y}px` }} />
                <div className="absolute top-0 left-0 origin-top-left will-change-transform" style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}>
                    <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none" style={{ zIndex: 0 }}>
                        {connections.map(conn => {
                            const from = cards.find(c => c.id === conn.fromId);
                            const to = cards.find(c => c.id === conn.toId);
                            if(!from || !to) return null;
                            return <path key={conn.id} d={getCurvePath(getCardAnchor(conn.fromId, 'right'), getCardAnchor(conn.toId, 'left'))} fill="none" stroke="#CBD5E1" strokeWidth="2" />;
                        })}
                    </svg>
                    {cards.map(card => {
                        const isSelected = card.id === selectedCardId;
                        return (
                            <Draggable 
                                key={card.id} 
                                nodeRef={card.ref} 
                                position={{ x: card.x, y: card.y }} 
                                onStart={() => { setSelectedCardId(card.id); setIsDraggingCard(true); }} 
                                onStop={(e, data) => { 
                                    updateCard(card.id, { x: data.x, y: data.y }); 
                                    setIsDraggingCard(false); 
                                    checkTimelineDrop(e, card); 
                                }} 
                                scale={scale} 
                                handle=".drag-handle"
                            >
                                <div ref={card.ref} className={`absolute transition-all duration-200 ${isSelected || isDraggingCard ? 'z-50 scale-[1.02]' : 'z-10 hover:z-20'}`} style={{ width: card.w, height: card.h }} onMouseDown={(e) => { e.stopPropagation(); setSelectedCardId(card.id); }} onDoubleClick={(e) => { e.stopPropagation(); openEditModal(card.id); }}>
                                    <Resizable width={card.w} height={card.h} onResize={(e, data) => updateCard(card.id, { w: data.size.width, h: data.size.height })} resizeHandles={['se']}>
                                        <div className={`w-full h-full flex flex-col bg-white rounded-xl overflow-hidden ${isSelected ? 'shadow-2xl ring-2 ring-orange-500' : 'shadow-md border border-slate-200 hover:shadow-lg'} ${card.type === 'note' ? 'bg-yellow-50' : ''}`}>
                                            <div className={`drag-handle h-9 flex items-center justify-between px-3 cursor-move ${card.type === 'drill' ? 'bg-white border-b border-slate-100' : 'bg-yellow-100/50'}`}>
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    {card.type === 'drill' ? <div className="w-5 h-5 rounded bg-slate-50 flex items-center justify-center text-slate-500 shrink-0"><LayoutTemplate size={12} /></div> : <StickyNote size={14} className="text-yellow-600" />}
                                                    <span className="text-[11px] font-bold text-slate-800 truncate">{card.title}</span>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={(e) => { e.stopPropagation(); openEditModal(card.id); }} className="text-slate-400 hover:text-black"><Edit3 size={12} /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); removeCard(card.id); }} className="text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                                                </div>
                                            </div>
                                            <div className="flex-1 relative p-1.5">
                                                {card.type === 'drill' ? <div className="w-full h-full bg-slate-50/30 rounded-lg overflow-hidden relative group border border-slate-100"><MiniPitchCSS /></div> : <textarea className="w-full h-full bg-transparent resize-none outline-none text-sm text-slate-800 font-medium font-marker leading-relaxed p-1" value={card.content} onChange={(e) => updateCard(card.id, { content: e.target.value })} onMouseDown={(e) => e.stopPropagation()} />}
                                            </div>
                                        </div>
                                    </Resizable>
                                </div>
                            </Draggable>
                        );
                    })}
                </div>
                
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
                     <div className="origin-top-left transition-transform duration-300 scale-75 2xl:scale-100">
                         <div className="bg-white p-1.5 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-1">
                            <button onClick={() => addCard('drill')} className="p-2 rounded-lg hover:bg-orange-50 text-slate-500 hover:text-orange-600 transition-colors" title="Ny Øvelse"><LayoutTemplate size={20} /></button>
                            <button onClick={() => addCard('note')} className="p-2 rounded-lg hover:bg-yellow-50 text-slate-500 hover:text-yellow-600 transition-colors" title="Ny Note"><StickyNote size={20} /></button>
                         </div>
                         <div className="bg-white px-2 py-1 rounded-lg shadow-md border border-slate-200 text-[10px] font-bold text-slate-400 text-center mt-2">{Math.round(scale * 100)}%</div>
                     </div>
                </div>
            </div>
        </div>

        {/* 2. TIMELINE - NYT VISUELT DESIGN */}
        <div 
            ref={timelineRef} 
            className={`
                shrink-0 w-full bg-white rounded-xl lg:rounded-lg 2xl:rounded-2xl border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden relative transition-all duration-300 
                ${isDraggingCard ? 'z-0' : 'z-20'}
                ${isBottomPanelOpen ? 'h-32 2xl:h-44' : 'h-10 2xl:h-12'} 
        `}>
             {/* HEADER / CONTROLS */}
             <div className="h-10 border-b border-slate-100 px-4 flex items-center justify-between bg-white z-10">
                
                {/* Venstre: Play Controls */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
                        className="text-xs font-bold text-slate-800 flex items-center gap-2 hover:text-orange-500 transition-colors"
                    >
                        {isBottomPanelOpen ? <ChevronDown size={16}/> : <ChevronUp size={16}/>}
                        <span className="uppercase tracking-wider">Persistent Timeline</span>
                    </button>
                    
                    {isBottomPanelOpen && (
                        <div className="flex items-center gap-2 ml-4 border-l border-slate-200 pl-4">
                            <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600"><Clock size={16} /></button>
                            <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600"><Play size={16} className="fill-current" /></button>
                        </div>
                    )}
                </div>

                {/* Højre: Total Tid */}
                <div className="flex items-center gap-3">
                    <div className="text-xs font-mono text-slate-500">
                        Total: <span className="text-slate-900 font-bold">{totalDuration}</span> / 90 min
                    </div>
                    <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: `${Math.min((totalDuration/90)*100, 100)}%` }}></div>
                    </div>
                </div>
             </div>

             {/* TRACK AREA */}
             <div className="flex-1 relative bg-[#FAFAFA] overflow-x-auto overflow-y-hidden flex items-end pb-8 custom-scrollbar">
                 
                 {/* Tidslinje Baggrund (Lineal) */}
                 <div className="absolute bottom-0 left-0 w-full h-8 border-t border-slate-300 flex items-center px-4 select-none pointer-events-none">
                     {[0, 15, 30, 45, 60, 75, 90, 105, 120].map((time, i) => (
                         <div key={i} className="absolute bottom-0 h-full border-l border-slate-300/50 flex flex-col justify-end pb-1" style={{ left: `${(i * 100) + 20}px` }}>
                             <span className="text-[10px] font-mono text-slate-400 pl-1">{time}:00</span>
                             <div className="h-2 w-px bg-slate-400"></div>
                         </div>
                     ))}
                     <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-orange-500/20 z-0"></div>
                 </div>

                 {/* DROP ZONE & ITEMS */}
                 {isBottomPanelOpen && (
                    timelineItems.length === 0 
                    ? <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm font-bold uppercase tracking-widest border-2 border-dashed border-slate-200 m-4 rounded-xl">
                        {isDraggingCard ? 'Slip for at tilføje til tidslinjen' : 'Træk dine øvelser herned'}
                      </div> 
                    : <div className="flex gap-1 px-4 z-10 h-[80%] items-center">
                        {timelineItems.map((item, idx) => (
                            <div 
                                key={item.id} 
                                style={{ width: Math.max(item.duration * 6, 100) + 'px' }} 
                                className="h-full bg-white rounded-lg shadow-sm border border-slate-200 relative group hover:shadow-md hover:border-orange-400 transition-all cursor-pointer flex flex-col overflow-hidden shrink-0"
                            >
                                {/* Miniature Billede */}
                                <div className="flex-1 bg-slate-100 relative p-1">
                                    <MiniPitchCSS />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                                </div>
                                
                                {/* Footer */}
                                <div className="h-6 bg-white border-t border-slate-100 flex items-center justify-between px-2">
                                    <span className="text-[9px] font-bold text-slate-700 truncate max-w-[70%]">{item.title}</span>
                                    <span className={`text-[8px] font-bold px-1 rounded ${item.intensity === 'high' ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'}`}>{item.duration}m</span>
                                </div>

                                {/* Slet knap */}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); removeFromTimeline(item.id); }} 
                                    className="absolute top-1 right-1 bg-white/90 text-slate-400 hover:text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))}
                        
                        {/* Add Ghost Card */}
                        <div className="h-[80%] border-2 border-dashed border-slate-200 rounded-lg w-24 flex items-center justify-center text-slate-300 shrink-0 ml-2">
                            <Plus size={20} />
                        </div>
                      </div>
                 )}
             </div>
        </div>
      </div>

      {/* --- HØJRE KOLONNE (Sidebar) --- */}
      <div 
        className={`
            fixed inset-y-0 right-0 z-50 bg-white/95 backdrop-blur-2xl shadow-2xl transition-all duration-300 ease-in-out
            lg:relative lg:shadow-none lg:bg-transparent lg:z-auto lg:flex lg:flex-col lg:h-full
            
            w-[85vw] sm:w-[360px] 
            lg:w-[260px] 2xl:w-[360px]

            ${isRightPanelOpen 
                ? 'translate-x-0' 
                : 'translate-x-full lg:translate-x-0 lg:!w-0 lg:overflow-hidden'
            }
        `}
      >
            <button onClick={() => setIsRightPanelOpen(false)} className="absolute top-3 right-3 p-2 rounded-full bg-slate-100 text-slate-500 lg:hidden z-50"><X size={20} /></button>
            
            <div className="flex-1 bg-white/95 backdrop-blur-2xl rounded-2xl lg:rounded-lg 2xl:rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative h-full w-full">
                <div className="h-10 border-b border-slate-100 flex items-center px-2 gap-1 bg-white">
                     <button onClick={() => setActiveTab('overview')} className={`flex-1 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'overview' ? 'bg-slate-100 text-black' : 'text-slate-400 hover:bg-slate-50'}`}>Info</button>
                     <button onClick={() => setActiveTab('library')} className={`flex-1 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'library' ? 'bg-slate-100 text-orange-600' : 'text-slate-400 hover:bg-slate-50'}`}>Byg</button>
                     <button onClick={() => setActiveTab('ai')} className={`flex-1 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-lg transition-all ${activeTab === 'ai' ? 'bg-slate-100 text-orange-600' : 'text-slate-400 hover:bg-slate-50'}`}>AI</button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 2xl:p-3 space-y-2 2xl:space-y-3 custom-scrollbar bg-white">
                    {activeTab === 'overview' && (
                        <div className="space-y-2 2xl:space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                             
                             {/* PERIODISERING WIDGET */}
                             <div className="rounded-xl overflow-hidden shadow-md bg-slate-900 text-white relative group p-2 2xl:p-4">
                                 <div className="relative z-10">
                                     <div className="flex justify-between items-center mb-2 2xl:mb-3">
                                         <h4 className="text-[10px] 2xl:text-xs font-extrabold uppercase tracking-wide 2xl:tracking-widest text-white truncate pr-2">
                                             PERIODISERING - {currentSession.team.toUpperCase()}
                                         </h4>
                                     </div>
                                     
                                     <div className="space-y-2 2xl:space-y-3">
                                         <div>
                                             <div className="flex justify-between items-center mb-1">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase">Primær</span>
                                                <span className="text-[10px] 2xl:text-[14px] font-bold text-white">Uge 42</span>
                                             </div>
                                             <p className="text-[10px] 2xl:text-sm font-bold text-white leading-tight">{currentSession.theme}</p>
                                         </div>
                                         <div>
                                             <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Sekundær</span>
                                             <p className="text-[10px] 2xl:text-xs font-medium text-slate-300 leading-tight">Defensiv Omstilling</p>
                                         </div>
                                     </div>
                                 </div>
                                 
                                 {/* Watermark Icon */}
                                 <div className="absolute right-[-10px] bottom-[-10px] text-orange-500 opacity-20 pointer-events-none">
                                     <Target size={100} />
                                 </div>
                             </div>
                             
                             {/* UGEPLAN */}
                             <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
                                 <div className="flex justify-between items-center px-3 py-2 bg-slate-50 border-b border-slate-100 shrink-0">
                                     <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Ugeplan</h4>
                                     <CalendarDays size={12} className="text-slate-400" />
                                 </div>
                                 <div className="overflow-y-auto custom-scrollbar max-h-[200px]">
                                    {weeklySessions.map((session) => (
                                        <div key={session.id} onClick={() => switchSession(session.id)} className={`flex items-center justify-between px-3 py-2 border-b border-slate-50 transition-colors cursor-pointer group last:border-b-0 ${activeSessionId === session.id ? 'bg-orange-50/50' : 'hover:bg-slate-50'}`}>
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold uppercase ${activeSessionId === session.id ? 'text-orange-600' : 'text-slate-700'}`}>{session.day}</span>
                                                    <span className="text-[9px] text-slate-400">{session.time}</span>
                                                </div>
                                                <span className="text-[10px] font-medium text-slate-600">{session.team}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {session.status === 'completed' && <CheckCircle2 size={12} className="text-green-500" />}
                                                {session.status === 'ready' && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                                                {session.status === 'draft' && <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => switchSession('new')} className="w-full py-1.5 text-[9px] text-slate-400 hover:text-orange-500 font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 hover:bg-slate-50"><Plus size={10} /> Opret Session</button>
                                 </div>
                             </div>

                             {/* TRUP STATUS */}
                             <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
                                 <div className="flex justify-between items-center px-3 py-2 bg-slate-50 border-b border-slate-100 shrink-0">
                                     <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Trup (18/22)</h4>
                                     <Filter size={12} className="text-slate-400 hover:text-black cursor-pointer" />
                                 </div>
                                 <div className="overflow-y-auto custom-scrollbar max-h-[240px]">
                                     {demoSquad.map((p, i) => (
                                         <div key={i} className="flex items-center justify-between px-2.5 h-12 border-b border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer last:border-b-0">
                                             <div className="flex items-center gap-2">
                                                 <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold bg-white border border-slate-200 text-slate-600 relative shrink-0">
                                                     {p.avatar}
                                                     <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white ${p.status === 'ready' ? 'bg-green-500' : (p.status === 'injured' || p.status === 'absent') ? 'bg-red-500' : p.status === 'limited' ? 'bg-yellow-400' : 'bg-purple-500'}`}></div>
                                                 </div>
                                                 <div className="flex flex-col">
                                                     <span className={`text-[10px] 2xl:text-[11px] font-bold leading-tight ${(p.status === 'injured' || p.status === 'absent') ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{p.name}</span>
                                                     <span className="text-[9px] text-slate-400 font-medium">{p.pos}</span>
                                                 </div>
                                             </div>
                                             <div>
                                                 {p.status === 'ready' && <div className="opacity-0 group-hover:opacity-100 transition-opacity"><Check size={12} className="text-slate-300" /></div>}
                                                 {(p.status === 'injured' || p.status === 'absent') && <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{p.status === 'injured' ? <AlertCircle size={10} className="text-red-500" /> : <UserX size={10} className="text-red-500" />}<span className="text-[9px] font-bold text-slate-500">{p.reason}</span></div>}
                                                 {p.status === 'limited' && <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"><Timer size={10} className="text-yellow-500" /><span className="text-[9px] font-bold text-slate-500">{p.restriction}</span></div>}
                                                 {p.status === 'gym' && <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"><Dumbbell size={10} className="text-purple-500" /><span className="text-[9px] font-bold text-slate-500">{p.reason}</span></div>}
                                                 {p.status === 'individual' && <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"><UserCog size={10} className="text-purple-500" /><span className="text-[9px] font-bold text-slate-500">{p.reason}</span></div>}
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                        </div>
                    )}
                    {activeTab !== 'overview' && <div className="text-center text-slate-400 text-xs py-10">Modul indhold kommer her...</div>}
                </div>

                {/* OPDATERET BUNDPANEL MED KORREKT GEM-LOGIK */}
                <div className="p-2 border-t border-slate-100 bg-white/50">
                    <button 
                        onClick={async () => {
                            const sessionData = {
                                userId: user?.id || 'dtl-dev-123', 
                                title: currentSession?.theme || 'Nyt Pas',
                                date: new Date(),
                                duration: totalDuration,
                                theme: currentSession?.theme || 'Generelt',
                                intensity: 'medium' as 'medium', 
                                exercises: timelineItems 
                            };

                            if (activeSessionId === 'new' || activeSessionId.startsWith('s')) {
                                // Opret ny session
                                const result = await createSession(sessionData);
                                if (result.success) {
                                    alert(`Succes! Session oprettet med ID: ${result.id}`);
                                    window.location.reload();
                                } else {
                                    alert("Der opstod en fejl ved oprettelse.");
                                }
                            } else {
                                // Opdater eksisterende
                                const result = await updateSession(activeSessionId, sessionData);
                                if (result.success) {
                                    alert("Session opdateret succesfuldt!");
                                    window.location.reload();
                                } else {
                                    alert("Der opstod en fejl ved opdatering.");
                                }
                            }
                        }}
                        className="w-full py-3 bg-black text-orange-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 transition-all shadow-lg hover:shadow-orange-500/20 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                    >
                        <CheckCircle2 size={14} /> {activeSessionId === 'new' || activeSessionId.startsWith('s') ? 'Gem Ny Session' : 'Opdater Session'}
                    </button>
                </div>
            </div>
      </div>
      
      {/* BACKDROP (Mobile only) */}
      {isRightPanelOpen && (
        <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsRightPanelOpen(false)}
        ></div>
      )}
      
      <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .custom-scrollbar::-webkit-scrollbar { width: 3px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
      `}</style>
    </div>
  );
}