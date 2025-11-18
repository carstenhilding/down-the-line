// app/[lang]/(secure)/trainer/planner/SessionPlannerClient.tsx
"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SubscriptionLevel, UserRole } from '@/lib/server/data';
import { 
  Maximize, 
  Columns, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Settings,
  Plus,
  StickyNote,
  Type,
  MousePointer2,
  Trash2,
  Move,
  X,
  Play,
  Activity,
  GripVertical
} from 'lucide-react';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import Link from 'next/link';
import "react-resizable/css/styles.css";

// --- TYPER ---
type CardType = 'drill' | 'note' | 'text';

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
  intensity?: 'low' | 'medium' | 'high';
  ref: React.RefObject<HTMLDivElement | null>;
}

// NYT: Type for elementer på tidslinjen
interface TimelineItem {
    id: string;
    cardId: string; // Reference til det originale kort
    title: string;
    duration: number;
    type: CardType;
}

interface SessionPlannerClientProps {
  dict: any; 
  plannerData: any;
  accessLevel: SubscriptionLevel;
  userRole: UserRole;
  lang: 'da' | 'en';
}

export default function SessionPlannerClient({ 
  dict, 
  plannerData, 
  accessLevel, 
  userRole, 
  lang 
}: SessionPlannerClientProps) {
  const t = dict.trainer_page || {};
  
  // --- UI STATE ---
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(true);

  // --- CANVAS STATE ---
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const [cards, setCards] = useState<PlannerCard[]>([
    { 
        id: 'intro-1', 
        type: 'note', 
        title: 'Husk', 
        content: 'Fokus på hurtigt genpres i dag!', 
        x: 100, 
        y: 100, 
        w: 200, 
        h: 150, 
        color: 'bg-yellow-100',
        ref: React.createRef<HTMLDivElement>() 
    }
  ]);

  // --- TIMELINE STATE (NYT) ---
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isDraggingCard, setIsDraggingCard] = useState(false); // For at vise drop-zone effekt
  const timelineRef = useRef<HTMLDivElement>(null);

  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const dragStartPoint = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- HELPERS ---
  const getSelectedCard = () => cards.find(c => c.id === selectedCardId);

  // Beregn total tid på tidslinjen
  const totalDuration = timelineItems.reduce((acc, item) => acc + item.duration, 0);

  // --- CANVAS LOGIK ---

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) { 
        e.preventDefault();
        const delta = -e.deltaY / 1000;
        setScale(prev => Math.min(Math.max(0.2, prev + delta), 3));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
        setIsDraggingCanvas(true);
        setSelectedCardId(null);
        dragStartPoint.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
        setPosition({
            x: e.clientX - dragStartPoint.current.x,
            y: e.clientY - dragStartPoint.current.y
        });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  const addCard = (type: CardType) => {
    const newCard: PlannerCard = {
        id: `card-${Date.now()}`,
        type,
        title: type === 'drill' ? 'Ny Øvelse' : 'Ny Note',
        content: '',
        x: -position.x + 100 + (cards.length * 20), 
        y: -position.y + 100 + (cards.length * 20),
        w: type === 'drill' ? 300 : 200,
        h: type === 'drill' ? 200 : 150,
        color: type === 'note' ? 'bg-yellow-100' : 'bg-white',
        duration: 15,
        intensity: 'medium',
        ref: React.createRef<HTMLDivElement>()
    };
    setCards([...cards, newCard]);
    setSelectedCardId(newCard.id);
    if (!isRightPanelOpen) setIsRightPanelOpen(true);
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    if (selectedCardId === id) setSelectedCardId(null);
    // Fjern også fra tidslinjen hvis den findes der? (Valgfrit - her beholder vi den)
  };

  const updateCard = (id: string, updates: Partial<PlannerCard>) => {
    setCards(cards.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // --- TIMELINE LOGIK (NYT) ---

  // Tjek om et kort slippes over tidslinjen
  const checkTimelineDrop = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent, card: PlannerCard) => {
     if (!timelineRef.current || !isBottomPanelOpen) return;

     const timelineRect = timelineRef.current.getBoundingClientRect();
     
     // Hent musens position (håndterer både mus og touch)
     let clientY;
     if ('changedTouches' in e) {
         clientY = e.changedTouches[0].clientY;
     } else {
         clientY = (e as MouseEvent).clientY;
     }

     // Hvis musen er inden for tidslinjens Y-koordinater
     if (clientY > timelineRect.top && clientY < timelineRect.bottom) {
         addToTimeline(card);
     }
  };

  const addToTimeline = (card: PlannerCard) => {
      // Kun øvelser kan tilføjes (ikke noter)
      if (card.type !== 'drill') return;

      const newItem: TimelineItem = {
          id: `tl-${Date.now()}`,
          cardId: card.id,
          title: card.title,
          duration: card.duration || 15,
          type: card.type
      };
      
      setTimelineItems(prev => [...prev, newItem]);
  };

  const removeFromTimeline = (itemId: string) => {
      setTimelineItems(prev => prev.filter(item => item.id !== itemId));
  };


  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 overflow-hidden">
      
      {/* --- HOVEDOMRÅDE --- */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* ZONE 1: INFINITE CANVAS */}
        <div 
            ref={canvasRef}
            className={`flex-1 relative bg-gray-100 overflow-hidden ${isDraggingCanvas ? 'cursor-grabbing' : 'cursor-default'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            
            {/* Grid Baggrund */}
            <div 
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#a1a1aa 1px, transparent 1px)',
                    backgroundSize: `${20 * scale}px ${20 * scale}px`, 
                    backgroundPosition: `${position.x}px ${position.y}px`
                }}
            />
            
            {/* Canvas Indhold */}
            <div 
                className="absolute top-0 left-0 origin-top-left will-change-transform"
                style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
            >
                {cards.map(card => {
                    const isSelected = card.id === selectedCardId;
                    return (
                        <Draggable
                            key={card.id}
                            nodeRef={card.ref} 
                            position={{ x: card.x, y: card.y }}
                            onStart={() => {
                                setSelectedCardId(card.id);
                                setIsDraggingCard(true); // Aktiver drop-zone highlight
                            }}
                            onStop={(e, data) => {
                                updateCard(card.id, { x: data.x, y: data.y });
                                setIsDraggingCard(false); // Deaktiver drop-zone highlight
                                checkTimelineDrop(e, card); // Tjek om den landede på tidslinjen
                            }}
                            scale={scale}
                            handle=".drag-handle"
                        >
                            <div 
                                ref={card.ref} 
                                className={`absolute transition-shadow duration-200 ${isSelected ? 'z-50' : 'z-10'}`}
                                style={{ width: card.w, height: card.h }}
                                onMouseDown={(e) => { e.stopPropagation(); setSelectedCardId(card.id); }}
                            >
                                <Resizable
                                    width={card.w}
                                    height={card.h}
                                    onResize={(e, data) => updateCard(card.id, { w: data.size.width, h: data.size.height })}
                                    resizeHandles={['se']}
                                >
                                    <div className={`w-full h-full rounded-lg shadow-lg flex flex-col overflow-hidden group ${card.color} ${isSelected ? 'ring-2 ring-orange-500 shadow-xl' : 'border border-gray-200'}`}>
                                        
                                        {/* Card Header */}
                                        <div className={`drag-handle h-8 flex items-center justify-between px-2 cursor-move ${isSelected ? 'bg-orange-100' : 'bg-black/5'}`}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-700 uppercase truncate max-w-[120px]">
                                                    {card.title}
                                                </span>
                                                {card.type === 'drill' && (
                                                    <span className="text-[10px] bg-white/50 px-1.5 rounded text-gray-500">
                                                        {card.duration} min
                                                    </span>
                                                )}
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); removeCard(card.id); }}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>

                                        {/* Card Content */}
                                        <div className="flex-1 p-3 relative">
                                            {card.type === 'drill' ? (
                                                <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded bg-gray-50/50">
                                                    <Move size={24} className="mb-2" />
                                                    <span className="text-xs">Tegn Øvelse Her</span>
                                                </div>
                                            ) : (
                                                <textarea 
                                                    className="w-full h-full bg-transparent resize-none outline-none text-sm font-medium text-gray-800 placeholder-gray-400"
                                                    placeholder="Skriv note..."
                                                    value={card.content}
                                                    onChange={(e) => updateCard(card.id, { content: e.target.value })}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                />
                                            )}
                                            {isSelected && <div className="absolute inset-0 pointer-events-none border border-orange-500/20 rounded-lg"></div>}
                                        </div>

                                    </div>
                                </Resizable>
                            </div>
                        </Draggable>
                    );
                })}
            </div>

            {/* Toolbar */}
            <div className="absolute top-4 left-4 bg-white p-1.5 rounded-xl shadow-xl border border-gray-200 flex flex-col gap-2 z-20">
                 <button onClick={() => addCard('drill')} className="p-2 rounded-lg hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-colors" title="Tilføj Øvelse">
                    <Plus size={20} />
                 </button>
                 <button onClick={() => addCard('note')} className="p-2 rounded-lg hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-colors" title="Tilføj Note">
                    <StickyNote size={20} />
                 </button>
                 <div className="h-px bg-gray-200 my-1"></div>
                 <div className="p-2 text-xs font-bold text-center text-gray-400">
                    {Math.round(scale * 100)}%
                 </div>
            </div>

        </div>

        {/* Toggle Knap */}
        <button 
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 p-1 rounded-l-md shadow-sm hover:bg-gray-50 transition-transform"
            style={{ right: isRightPanelOpen ? '320px' : '0' }}
        >
            {isRightPanelOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* ZONE 2: SMART PANEL */}
        <div 
            className={`bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
                isRightPanelOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full opacity-0 overflow-hidden'
            }`}
        >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 h-14">
                <h3 className="font-bold text-sm uppercase tracking-wide text-gray-700 flex items-center gap-2">
                    {selectedCardId ? (
                        <>
                           <Settings size={14} className="text-orange-500" /> 
                           Rediger {getSelectedCard()?.type === 'drill' ? 'Øvelse' : 'Kort'}
                        </>
                    ) : (
                        <>
                           <Activity size={14} className="text-gray-400" />
                           {t.context_panel ?? 'Kontekst & Overblik'}
                        </>
                    )}
                </h3>
                {selectedCardId && (
                    <button onClick={() => setSelectedCardId(null)} className="text-gray-400 hover:text-black">
                        <X size={16} />
                    </button>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {selectedCardId && getSelectedCard() ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Titel</label>
                            <input 
                                type="text" 
                                value={getSelectedCard()?.title}
                                onChange={(e) => updateCard(selectedCardId, { title: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            />
                        </div>

                        {getSelectedCard()?.type === 'drill' && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Varighed (min)</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="range" min="5" max="60" step="5"
                                            value={getSelectedCard()?.duration || 15}
                                            onChange={(e) => updateCard(selectedCardId, { duration: parseInt(e.target.value) })}
                                            className="flex-1 accent-orange-500"
                                        />
                                        <span className="text-sm font-bold w-8 text-right">{getSelectedCard()?.duration}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Intensitet</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['low', 'medium', 'high'] as const).map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => updateCard(selectedCardId, { intensity: level })}
                                                className={`py-1.5 text-xs font-medium rounded border capitalize ${
                                                    getSelectedCard()?.intensity === level 
                                                    ? 'bg-orange-50 border-orange-500 text-orange-700' 
                                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <Link href={`/${lang}/trainer/studio`} className="flex items-center justify-center gap-2 w-full py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                                        <Play size={16} className="text-orange-500" />
                                        Åben i DTL Studio
                                    </Link>
                                </div>
                            </>
                        )}
                        {getSelectedCard()?.type === 'note' && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Farve</label>
                                <div className="flex gap-3">
                                    {[
                                        { name: 'Gul', class: 'bg-yellow-100' },
                                        { name: 'Blå', class: 'bg-blue-100' },
                                        { name: 'Grøn', class: 'bg-green-100' },
                                        { name: 'Hvid', class: 'bg-white' },
                                    ].map(c => (
                                        <button
                                            key={c.name}
                                            onClick={() => updateCard(selectedCardId, { color: c.class })}
                                            className={`w-8 h-8 rounded-full border shadow-sm ${c.class} ${getSelectedCard()?.color === c.class ? 'ring-2 ring-offset-1 ring-black' : ''}`}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-gray-500 uppercase">Ugens Fokus</h4>
                                <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Uge 42</span>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                                <p className="text-sm font-semibold text-orange-900">{plannerData.curriculumFocus.theme}</p>
                                <p className="text-xs text-orange-700 mt-1">{plannerData.curriculumFocus.subTheme}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-gray-500 uppercase flex justify-between">
                                Dagens Trup 
                                <span className="text-black">{plannerData.teamRoster.filter((p: any) => p.available).length} / {plannerData.teamRoster.length}</span>
                            </h4>
                            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                                {plannerData.teamRoster.map((player: any, idx: number) => (
                                    <div key={idx} className="p-2 flex items-center justify-between text-sm">
                                        <span className={!player.available ? "text-gray-400 line-through decoration-red-500" : "text-gray-800"}>
                                            {player.name}
                                        </span>
                                        {!player.available && (
                                            <span className="text-[10px] text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded">{player.status}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* ZONE 3: PERSISTENT TIMELINE (NU FUNKTIONEL!) */}
      <div 
        ref={timelineRef}
        className={`bg-white border-t border-gray-200 transition-all duration-300 ease-in-out flex flex-col relative ${
          isBottomPanelOpen ? 'h-48' : 'h-10'
        } ${isDraggingCard ? 'ring-2 ring-orange-500 bg-orange-50/30' : ''}`} // Visuel drop-zone indikation
      >
          <div 
            className="h-10 bg-gray-50 border-b border-gray-200 px-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
          >
              <div className="flex items-center gap-3">
                  <Clock size={16} className="text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Tidslinje & Flow</span>
                  <span className={`text-xs ml-2 ${totalDuration > 90 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                      Planlagt: {totalDuration} / 90 min
                  </span>
              </div>
              {isBottomPanelOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
          </div>

          <div className="flex-1 relative p-4 overflow-x-auto">
              {isBottomPanelOpen && (
                  <div className="flex gap-2 h-full items-center">
                      
                      {/* Start: Tidslinje Items */}
                      {timelineItems.length === 0 && !isDraggingCard ? (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                              Træk øvelser herned for at bygge din plan
                          </div>
                      ) : (
                          timelineItems.map((item, idx) => (
                              <div key={item.id} className="w-48 h-full bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col relative group shrink-0 hover:border-orange-300 transition-colors">
                                  {/* Timeline Item Header */}
                                  <div className="h-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between px-2">
                                      <span className="text-[10px] font-bold text-gray-500 uppercase">Del {idx + 1}</span>
                                      <button onClick={() => removeFromTimeline(item.id)} className="text-gray-400 hover:text-red-500">
                                          <X size={12} />
                                      </button>
                                  </div>
                                  {/* Timeline Item Content */}
                                  <div className="flex-1 p-2 flex flex-col justify-center items-center text-center">
                                      <span className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</span>
                                      <span className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-0.5 rounded-full">
                                          {item.duration} min
                                      </span>
                                  </div>
                                  
                                  {/* Drag Handle for Reordering (Fremtidig feature) */}
                                  <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab text-gray-300">
                                      <GripVertical size={12} />
                                  </div>
                              </div>
                          ))
                      )}
                      
                  </div>
              )}
          </div>
          
          {/* Drop Overlay (Vises når man dragger en øvelse) */}
          {isDraggingCard && isBottomPanelOpen && (
              <div className="absolute inset-0 bg-orange-500/10 pointer-events-none flex items-center justify-center z-20">
                  <div className="bg-white px-4 py-2 rounded-full shadow-lg text-orange-600 font-bold text-sm animate-bounce">
                      Slip for at tilføje til tidslinje
                  </div>
              </div>
          )}
      </div>

    </div>
  );
}