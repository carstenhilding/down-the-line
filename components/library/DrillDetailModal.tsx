// components/library/DrillDetailModal.tsx
"use client";

import React, { useState } from 'react';
import { 
  X, Clock, Users, Ruler,
  Target, CheckCircle2, Share2, Printer, 
  Edit3, User, Shield, Box, Copy,
  ChevronLeft, ChevronRight, Globe, Layers,
  ListChecks, AlertCircle, TrendingUp, TrendingDown,
  Shirt, Goal, GraduationCap
} from 'lucide-react';
import { DrillAsset } from '@/lib/server/libraryData';

interface DrillDetailModalProps {
  drill: DrillAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (drill: DrillAsset) => void;
  lang: 'da' | 'en';
}

const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Helper til farveklasser (Team Colors) - Subtil stil
const getTeamBadgeStyle = (color: string) => {
    switch(color) {
        case 'orange': return 'bg-orange-100 text-orange-700 border-orange-200'; 
        case 'red': return 'bg-red-100 text-red-700 border-red-200'; 
        case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200'; 
        case 'green': return 'bg-green-100 text-green-700 border-green-200'; 
        case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200'; 
        case 'white': return 'bg-white text-neutral-900 border-neutral-200'; 
        case 'black': return 'bg-neutral-900 text-white border-neutral-900'; 
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

export default function DrillDetailModal({ drill, isOpen, onClose, onEdit, lang }: DrillDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !drill) return null;

  // Medie Logik
  const hasYoutube = drill.mediaType === 'youtube' && drill.youtubeUrl;
  const hasVideo = drill.mediaType === 'video' && drill.videoUrl;
  const showVideoSection = hasYoutube || hasVideo;
  
  // Saml billeder (thumbnail + galleri)
  const images = (drill as any).imageUrls && (drill as any).imageUrls.length > 0
      ? (drill as any).imageUrls
      : (drill.thumbnailUrl ? [drill.thumbnailUrl] : ['/images/grass-texture-seamless.jpg']);

  const showSlider = images.length > 1;

  // Navigering
  const nextImage = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % images.length); };
  const prevImage = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length); };
  
  // Styling Helpers
  const sectionTitleClass = "text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-1.5";
  const cardBaseClass = "bg-white border border-neutral-100 rounded-xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow duration-300";

  // Intensitet Cirkel Helper
  const getIntensityCircleClass = (load: string | undefined) => {
      if (!load) return 'bg-neutral-200 border-neutral-300';
      if (load.includes('Low')) return 'bg-green-500 border-green-600 shadow-[0_0_10px_rgba(34,197,94,0.4)]'; 
      if (load.includes('Moderate')) return 'bg-yellow-400 border-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.4)]'; 
      return 'bg-red-500 border-red-600 shadow-[0_0_10px_rgba(239,68,68,0.4)]'; 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-6 animate-in fade-in duration-300" onClick={onClose}>
      
      {/* CARD CONTAINER */}
      <div 
        className="bg-[#F8FAFC] w-full h-full md:h-[90vh] md:max-w-7xl md:rounded-3xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* LUK KNAP */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all border border-white/10 group shadow-lg"
        >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* --- VENSTRE KOLONNE: MEDIA (Cinematic & Ensartet) --- */}
        <div className="w-full md:w-1/2 bg-black flex flex-col relative group overflow-hidden border-r border-neutral-800">
            
            <div className="flex-1 flex flex-col h-full">
                
                {/* 1. BILLEDE GALLERI */}
                <div className={`relative w-full bg-black flex items-center justify-center ${showVideoSection ? 'h-1/2 border-b border-neutral-800' : 'h-full'}`}>
                     
                     {/* Baggrunds-blur effekt */}
                     <div className="absolute inset-0 overflow-hidden opacity-20 blur-3xl pointer-events-none">
                        <img src={images[currentImageIndex]} className="w-full h-full object-cover" />
                     </div>

                     <img 
                        src={images[currentImageIndex]} 
                        alt={drill.title} 
                        className="relative z-10 w-full h-full object-contain"
                     />

                     {/* SLIDER CONTROLS */}
                     {showSlider && (
                         <>
                            <button 
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-orange-500 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-white/10 shadow-lg z-20"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button 
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-orange-500 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-white/10 shadow-lg z-20"
                            >
                                <ChevronRight size={20} />
                            </button>

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 bg-black/40 rounded-full backdrop-blur-md border border-white/10 z-20">
                                {images.map((_: any, idx: number) => (
                                    <div 
                                        key={idx}
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-orange-500 w-4' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                         </>
                     )}
                </div>

                {/* 2. VIDEO (Hvis den findes) */}
                {showVideoSection && (
                    <div className="relative w-full h-1/2 bg-black flex items-center justify-center">
                        <div className="w-full h-full">
                            {hasYoutube ? (
                                <iframe 
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${getYoutubeId(drill.youtubeUrl!)}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1`} 
                                    allow="autoplay; encrypted-media; fullscreen"
                                ></iframe>
                            ) : (
                                <video 
                                    src={drill.videoUrl!} 
                                    className="w-full h-full object-contain" 
                                    controls 
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* --- HØJRE KOLONNE: CONTENT --- */}
        <div className="w-full md:w-1/2 bg-[#F8FAFC] flex flex-col h-full overflow-hidden border-l border-white/50">
            
            {/* HEADER AREA */}
            <div className="px-6 pt-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-neutral-100 shrink-0 z-10 sticky top-0">
                
                {/* 1. INTENSITET (Top Venstre) */}
                <div className="flex items-center gap-2.5 mb-4">
                    <div className={`w-3 h-3 rounded-full border ${getIntensityCircleClass(drill.physicalLoad)}`} />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-neutral-900 uppercase tracking-widest leading-none">
                            {drill.physicalLoad?.split('–')[0] || 'AEROBIC'}
                        </span>
                        <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wide leading-none mt-0.5">
                            {drill.physicalLoad?.split('–')[1] || 'MODERATE INTENSITY'}
                        </span>
                    </div>
                </div>

                {/* 2. TAGS */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-orange-600 text-[10px] font-black uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                        {drill.mainCategory}
                    </span>
                    {drill.subCategory && (
                        <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest border border-neutral-200 px-2 py-0.5 rounded">
                            {drill.subCategory}
                        </span>
                    )}
                </div>

                {/* 3. TITEL */}
                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 uppercase leading-none tracking-tight mb-4">
                    {drill.title}
                </h2>

                {/* 4. QUICK STATS */}
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-sm">
                        <Clock size={12} className="text-orange-500" />
                        <span className="text-[10px] font-bold text-neutral-900">{drill.durationMin} min</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-sm">
                        <Users size={12} className="text-orange-500" />
                        <span className="text-[10px] font-bold text-neutral-900">{drill.minPlayers}-{drill.maxPlayers} spillere</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-sm">
                        <Ruler size={12} className="text-orange-500" />
                        <span className="text-[10px] font-bold text-neutral-900">{drill.pitchSize?.width}x{drill.pitchSize?.length}m</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-sm border ${drill.goalKeeper ? 'bg-green-50 border-green-200 text-green-800' : 'bg-neutral-50 border-neutral-200 text-neutral-500'}`}>
                        <Goal size={12} />
                        <span className="text-[10px] font-bold">{drill.goalKeeper ? 'Målmand' : 'Ingen GK'}</span>
                    </div>
                </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                
                {/* 1. BESKRIVELSE */}
                <div>
                    <span className={sectionTitleClass}>Beskrivelse</span>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                        {drill.description || "Ingen beskrivelse tilgængelig."}
                    </p>
                </div>

                {/* 2. COACHING & RULES */}
                <div className="grid grid-cols-1 gap-4">
                    {drill.coachingPoints?.keyPoints && drill.coachingPoints.keyPoints.length > 0 && (
                        <div className={`${cardBaseClass} border-l-4 border-l-orange-500`}>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-orange-50">
                                <ListChecks size={14} className="text-orange-500" />
                                <span className="text-[10px] font-black text-orange-900 uppercase tracking-wider">Coaching Points</span>
                            </div>
                            <ul className="space-y-3">
                                {drill.coachingPoints.keyPoints.filter(p => p).map((point, idx) => (
                                    <li key={idx} className="flex gap-3 text-xs text-neutral-800 group items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                                        <span className="leading-relaxed font-medium">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {(drill.coachingPoints?.instruction || drill.stopFreeze) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {drill.coachingPoints?.instruction && (
                                <div className={cardBaseClass}>
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase mb-2 block flex items-center gap-1">
                                        <GraduationCap size={10} /> Trænerens Rolle
                                    </span>
                                    <p className="text-xs text-neutral-700 italic font-medium leading-relaxed">
                                        "{drill.coachingPoints.instruction}"
                                    </p>
                                </div>
                            )}
                            {drill.stopFreeze && (
                                <div className={`${cardBaseClass} bg-orange-50/50 border-orange-100`}>
                                    <span className="text-[9px] font-bold text-orange-400 uppercase mb-2 block flex items-center gap-1">
                                        <AlertCircle size={10} /> Stop / Frys
                                    </span>
                                    <p className="text-xs text-orange-900 font-medium leading-relaxed">
                                        {drill.stopFreeze}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. PROGRESSION / REGRESSION */}
                {( (drill.progression && drill.progression[0]) || (drill.regression && drill.regression[0]) ) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {drill.progression && drill.progression[0] && (
                             <div className={`${cardBaseClass} border-l-4 border-l-green-500 bg-green-50/30`}>
                                 <div className="flex items-center gap-2 mb-3">
                                     <TrendingUp size={14} className="text-green-600" />
                                     <span className="text-[10px] font-black text-green-800 uppercase tracking-wider">Progression</span>
                                 </div>
                                 <ul className="space-y-2">
                                    {drill.progression.filter(p=>p).map((p, i) => (
                                        <li key={i} className="text-xs text-neutral-700 font-medium flex gap-2 items-start">
                                            <span className="text-green-600 font-bold text-[10px] mt-0.5">+</span> {p}
                                        </li>
                                    ))}
                                 </ul>
                             </div>
                         )}
                         {drill.regression && drill.regression[0] && (
                             <div className={`${cardBaseClass} border-l-4 border-l-blue-500 bg-blue-50/30`}>
                                 <div className="flex items-center gap-2 mb-3">
                                     <TrendingDown size={14} className="text-blue-600" />
                                     <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider">Regression</span>
                                 </div>
                                 <ul className="space-y-2">
                                    {drill.regression.filter(r=>r).map((r, i) => (
                                        <li key={i} className="text-xs text-neutral-700 font-medium flex gap-2 items-start">
                                            <span className="text-blue-600 font-bold text-[10px] mt-0.5">-</span> {r}
                                        </li>
                                    ))}
                                 </ul>
                             </div>
                         )}
                    </div>
                )}

                {/* 4. SETUP GRID */}
                <div>
                    <span className={sectionTitleClass}>Opsætning</span>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        
                        {/* Hold */}
                        {drill.setup?.map((team, idx) => (
                            <div key={idx} className={`rounded-lg border p-3 flex flex-col justify-between shadow-sm ${getTeamBadgeStyle(team.color)}`}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[9px] font-black uppercase opacity-70">Hold {idx + 1}</span>
                                    <Shirt size={12} className="opacity-50" />
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-black">{team.playerCount}</span>
                                    <span className="text-[10px] font-bold opacity-80">Spillere</span>
                                </div>
                            </div>
                        ))}

                        {/* Materialer */}
                        {drill.materials?.map((mat, idx) => (
                            <div key={`mat-${idx}`} className="bg-white border border-neutral-200 rounded-lg p-3 flex flex-col justify-between shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[9px] font-black text-neutral-400 uppercase">Udstyr</span>
                                    <Box size={12} className="text-neutral-300" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="bg-neutral-100 text-neutral-900 text-xs font-bold px-1.5 rounded">{mat.count}</span>
                                    <span className="text-xs font-bold text-neutral-700 truncate">{mat.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. TEMAER */}
                {(drill.primaryTheme || drill.secondaryTheme) && (
                    <div>
                        <span className={sectionTitleClass}>Tema Fokus</span>
                        <div className="flex flex-wrap gap-2">
                            {drill.primaryTheme && (
                                <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg">
                                    <Target size={12} className="text-orange-500" />
                                    <span className="text-xs font-bold text-orange-900">{drill.primaryTheme}</span>
                                </div>
                            )}
                            {drill.secondaryTheme && (
                                <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-100 px-3 py-1.5 rounded-lg">
                                    <Layers size={12} className="text-neutral-400" />
                                    <span className="text-xs font-bold text-neutral-700">{drill.secondaryTheme}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="h-4"></div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-4 border-t border-neutral-100 bg-white flex justify-between items-center shrink-0 z-20">
                <div className="flex items-center gap-2">
                    <button className="p-2.5 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all border border-transparent hover:border-orange-100" title="Del">
                        <Share2 size={18} />
                    </button>
                    <button className="p-2.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-all border border-transparent hover:border-neutral-200" title="Print">
                        <Printer size={18} />
                    </button>
                    <button 
                        className="p-2.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 group relative" 
                        title="Kopier til mit bibliotek"
                        onClick={() => alert("Kopier funktion kommer i næste opdatering")}
                    >
                        <Copy size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {onEdit && (
                        <button 
                            onClick={() => { onClose(); onEdit(drill); }}
                            className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-black transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-orange-500/20"
                        >
                            <Edit3 size={14} /> 
                            <span className="hidden md:inline">Rediger Øvelse</span>
                            <span className="md:hidden">Rediger</span>
                        </button>
                    )}

                    {/* Access Level Badge (Diskret i højre hjørne) */}
                    <div className="flex items-center gap-1.5 text-neutral-300 border-l border-neutral-100 pl-4 h-full" title="Tilgængelighed">
                        {drill.accessLevel === 'Global' && <Globe size={12} />}
                        {drill.accessLevel === 'Club' && <Shield size={12} />}
                        {drill.accessLevel === 'Personal' && <User size={12} />}
                        <span className="text-[9px] font-bold uppercase tracking-wider">{drill.accessLevel}</span>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}