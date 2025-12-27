// components/library/DrillDetailModal.tsx
"use client";

import React, { useState } from 'react';
import { 
  X, Clock, Users, Ruler,
  Target, Share2, Printer, 
  Edit3, User, Shield, Box, Copy,
  ChevronLeft, ChevronRight, Globe,
  AlertCircle, TrendingUp, TrendingDown,
  Shirt, Goal, LayoutTemplate, ShieldCheck,
  Activity, CalendarPlus
} from 'lucide-react';
import { DrillAsset } from '@/lib/server/libraryData';
import { useUser } from '@/components/UserContext';

interface DrillDetailModalProps {
  drill: DrillAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (drill: DrillAsset) => void;
  onAddToSession?: (drill: DrillAsset) => void;
  lang: 'da' | 'en';
}

const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Helper til farveklasser
const getTeamBadgeStyle = (color: string) => {
    return 'bg-white border-neutral-200 text-neutral-900';
};

export default function DrillDetailModal({ drill, isOpen, onClose, onEdit, onAddToSession, lang }: DrillDetailModalProps) {
  const { user } = useUser();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !drill) return null;

  // --- RETTIGHEDS LOGIK ---
  const userRole = user?.role?.toLowerCase();
  const isDeveloper = userRole === 'developer' || userRole === 'admin'; 
  const isAuthor = user?.id === drill.authorId;
  const isGlobal = drill.accessLevel === 'Global';

  const canEdit = isDeveloper || (isAuthor && !isGlobal);

  // Medie Logik
  const hasYoutube = drill.mediaType === 'youtube' && drill.youtubeUrl;
  const hasVideo = drill.mediaType === 'video' && drill.videoUrl;
  const showVideoSection = hasYoutube || hasVideo;
  
  const images = (drill as any).imageUrls && (drill as any).imageUrls.length > 0
      ? (drill as any).imageUrls
      : (drill.thumbnailUrl ? [drill.thumbnailUrl] : ['/images/grass-texture-seamless.jpg']);

  const showSlider = images.length > 1;

  const nextImage = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % images.length); };
  const prevImage = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length); };
  
  // --- STYLING ---
  const cardBaseClass = "bg-white border border-neutral-200 rounded-lg p-5 shadow-sm mb-4";
  const sectionHeaderClass = "text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-1.5";
  const subLabelClass = "text-[9px] font-black text-neutral-500 uppercase tracking-wider block mb-1.5";

  // NYT "CREATE DRILL" STYLE (White Box / Orange Border)
  // Containeren er nu bare en wrapper uden baggrund/border
  const paramBoxClass = "flex flex-col items-center justify-end h-full";
  
  // Label: Sort, fed, uppercase, placeret over boksen
  const boxLabelClass = "text-[9px] font-black text-black uppercase tracking-wider mb-1 text-center w-full truncate";
  
  // Værdi: Hvid baggrund, tynd orange kant, centreret tekst
  const boxValueContainerClass = "w-full bg-white border border-orange-500 rounded-lg h-8 flex items-center justify-center shadow-sm";
  const boxValueClass = "text-xs font-bold text-neutral-900 text-center leading-none truncate";

  // Intensitet Cirkel
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

        {/* --- VENSTRE KOLONNE: MEDIA --- */}
        <div className="w-full md:w-1/2 bg-black flex flex-col relative group overflow-hidden border-r border-neutral-800">
            <div className="flex-1 flex flex-col h-full">
                <div className={`relative w-full bg-black flex items-center justify-center ${showVideoSection ? 'h-1/2 border-b border-neutral-800' : 'h-full'}`}>
                      <div className="absolute inset-0 overflow-hidden opacity-20 blur-3xl pointer-events-none">
                         <img src={images[currentImageIndex]} className="w-full h-full object-cover" />
                      </div>
                      <img 
                        src={images[currentImageIndex]} 
                        alt={drill.title} 
                        className="relative z-10 w-full h-full object-contain p-4"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      {showSlider && (
                          <>
                             <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-orange-500 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-white/10 shadow-lg z-20"><ChevronLeft size={20} /></button>
                             <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-orange-500 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-white/10 shadow-lg z-20"><ChevronRight size={20} /></button>
                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 bg-black/40 rounded-full backdrop-blur-md border border-white/10 z-20">
                                 {images.map((_: any, idx: number) => (
                                     <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-orange-500 w-4' : 'bg-white/50'}`} />
                                 ))}
                             </div>
                          </>
                      )}
                </div>
                {showVideoSection && (
                    <div className="relative w-full h-1/2 bg-black flex items-center justify-center">
                        <div className="w-full h-full">
                            {hasYoutube ? (
                                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${getYoutubeId(drill.youtubeUrl!)}?autoplay=0&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1`} allow="autoplay; encrypted-media; fullscreen"></iframe>
                            ) : (
                                <video src={drill.videoUrl!} className="w-full h-full object-contain" controls loop muted playsInline />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* --- HØJRE KOLONNE: DATA & INFO --- */}
        <div className="w-full md:w-1/2 bg-[#F8FAFC] flex flex-col h-full overflow-hidden border-l border-white/50">
            
            {/* HEADER AREA */}
            <div className="px-6 pt-6 pb-2 bg-white/80 backdrop-blur-sm border-b border-neutral-200 shrink-0 z-10 sticky top-0">
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

                {/* KATEGORI */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-neutral-900 text-[10px] font-black uppercase tracking-widest bg-white px-3 py-1 rounded border-[3px] border-orange-500">
                        {drill.mainCategory}
                    </span>
                    {drill.subCategory && (
                        <span className="text-neutral-400 text-[10px] font-black uppercase tracking-widest bg-white px-3 py-1 rounded border-[3px] border-orange-500">
                            {drill.subCategory}
                        </span>
                    )}
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 uppercase leading-none tracking-tight mb-4">
                    {drill.title}
                </h2>

                {/* --- 6 DATA BOKSE --- */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                    
                    {/* 1. Age Group */}
                    <div className={paramBoxClass}>
                        <label className={boxLabelClass}>AGE GROUP</label>
                        <div className={boxValueContainerClass}>
                            <span className={boxValueClass}>{drill.ageGroups && drill.ageGroups.length > 0 ? drill.ageGroups[0] : '-'}</span>
                        </div>
                    </div>

                    {/* 2. Players */}
                    <div className={paramBoxClass}>
                        <label className={boxLabelClass}>PLAYERS</label>
                        <div className={boxValueContainerClass}>
                            <span className={boxValueClass}>{drill.minPlayers || 0} - {drill.maxPlayers || 0}</span>
                        </div>
                    </div>

                    {/* 3. Pitch */}
                    <div className={paramBoxClass}>
                        <label className={boxLabelClass}>PITCH (M)</label>
                        <div className={boxValueContainerClass}>
                            <span className={boxValueClass}>{drill.pitchSize ? `${drill.pitchSize.width} x ${drill.pitchSize.length}` : '-'}</span>
                        </div>
                    </div>

                    {/* 4. Time */}
                    <div className={paramBoxClass}>
                        <label className={boxLabelClass}>TIME (MIN)</label>
                        <div className={boxValueContainerClass}>
                            <span className={boxValueClass}>{drill.durationMin || 0}</span>
                        </div>
                    </div>

                    {/* 5. Work/Rest */}
                    <div className={paramBoxClass}>
                        <label className={boxLabelClass}>WORK/REST</label>
                        <div className={boxValueContainerClass}>
                            <span className={boxValueClass}>{drill.workDuration || 0}' / {drill.restDuration || 0}'</span>
                        </div>
                    </div>

                    {/* 6. GK */}
                    <div className={paramBoxClass}>
                        <label className={boxLabelClass}>GOAL KEEPER</label>
                        <div className={boxValueContainerClass}>
                            <span className={boxValueClass}>{drill.goalKeeper ? 'YES' : 'NO'}</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-neutral-50/50">
                
                {/* 1. BESKRIVELSE */}
                <div className={cardBaseClass}>
                    <span className={sectionHeaderClass}><LayoutTemplate size={12} className="text-orange-500"/> Beskrivelse</span>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium whitespace-pre-wrap">
                        {drill.description || "Ingen beskrivelse tilgængelig."}
                    </p>
                    
                    {(drill.primaryTheme || drill.secondaryTheme) && (
                        <div className="mt-4 pt-3 border-t border-neutral-100">
                             <span className={subLabelClass}>Fokusområder</span>
                             <div className="flex flex-wrap gap-2">
                                {drill.primaryTheme && (
                                    <span className="text-xs font-bold text-white bg-neutral-900 px-3 py-1 rounded shadow-sm">
                                        {drill.primaryTheme}
                                    </span>
                                )}
                                {drill.secondaryTheme && (
                                    <span className="text-xs font-bold text-neutral-700 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded">
                                        {drill.secondaryTheme}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. PROGRESSION & REGRESSION */}
                {( (drill.progression && drill.progression[0]) || (drill.regression && drill.regression[0]) ) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {drill.progression && drill.progression[0] && (
                            <div className={`${cardBaseClass} bg-green-50/30 border-green-100 mb-0`}>
                                <div className="flex items-center gap-2 mb-2">
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
                            <div className={`${cardBaseClass} bg-blue-50/30 border-blue-100 mb-0`}>
                                <div className="flex items-center gap-2 mb-2">
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

                {/* 3. COACHING POINTS */}
                <div className={`${cardBaseClass} border-l-4 border-l-orange-500`}>
                    <span className={sectionHeaderClass}><Target size={12} className="text-orange-500"/> Trænerens Fokus</span>
                    
                    {drill.coachingPoints?.instruction && (
                        <div className="mb-4 bg-orange-50 p-3 rounded-lg border border-orange-100">
                            <span className={subLabelClass}>Instruktion</span>
                            <p className="text-sm text-neutral-800 italic font-medium leading-relaxed">"{drill.coachingPoints.instruction}"</p>
                        </div>
                    )}

                    {drill.coachingPoints?.keyPoints && drill.coachingPoints.keyPoints.length > 0 && (
                        <div>
                             <span className={subLabelClass}>Nøglepunkter</span>
                             <div className="space-y-2">
                                {drill.coachingPoints.keyPoints.filter(p => p).map((point, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{idx + 1}</div>
                                        <span className="text-sm text-neutral-700 font-medium pt-0.5">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. REGLER & STOP/FRYS */}
                {( (drill.rules && drill.rules.some(r=>r)) || drill.stopFreeze ) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {drill.rules && drill.rules.some(r => r) && (
                            <div className={`${cardBaseClass} mb-0`}>
                                <span className={sectionHeaderClass}><ShieldCheck size={12}/> Regler</span>
                                <ul className="space-y-1.5">
                                    {drill.rules.filter(r => r).map((rule, i) => (
                                        <li key={i} className="text-xs text-neutral-600 font-medium flex gap-2">
                                            <span className="text-neutral-300">•</span> {rule}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {drill.stopFreeze && (
                            <div className={`${cardBaseClass} bg-orange-50/30 border-orange-100 mb-0`}>
                                <span className={sectionHeaderClass}><AlertCircle size={12} className="text-orange-500"/> Stop / Frys</span>
                                <p className="text-xs text-orange-900 font-medium">{drill.stopFreeze}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 5. OPSÆTNING & MATERIALER */}
                <div className="grid grid-cols-1 gap-4 mb-12">
                    {drill.setup && drill.setup.length > 0 && (
                        <div className={cardBaseClass}>
                             <span className={sectionHeaderClass}><Shirt size={12} className="text-orange-500"/> Holdopstilling</span>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {drill.setup.map((team, idx) => (
                                    <div key={idx} className={`rounded-lg border p-3 flex items-center justify-between shadow-sm ${getTeamBadgeStyle(team.color)}`}>
                                        <div>
                                            <span className="text-[9px] font-black uppercase opacity-70 block mb-1">{team.name || `Hold ${idx+1}`}</span>
                                            <span className="text-xs font-bold opacity-80 uppercase">{team.color}</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-xl font-black leading-none">{team.playerCount}</span>
                                            <span className="text-[8px] font-bold uppercase opacity-60">Spillere</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {drill.materials && drill.materials.length > 0 && (
                        <div className={cardBaseClass}>
                            <span className={sectionHeaderClass}><Box size={12} className="text-orange-500"/> Materialer</span>
                            <div className="flex flex-wrap gap-2">
                                {drill.materials.map((mat, idx) => (
                                    <div key={idx} className="bg-neutral-50 border border-neutral-200 rounded-lg p-2 pl-3 pr-4 flex items-center gap-3 shadow-sm">
                                        <span className="bg-neutral-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">{mat.count}</span>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-neutral-900 uppercase">{(mat as any).name === 'eq_balls' ? 'Bolde' : (mat as any).name === 'eq_cones' ? 'Kegler' : (mat as any).name === 'eq_bibs' ? 'Veste' : mat.name}</span>
                                            {mat.details && <span className="text-[9px] text-neutral-400">{mat.details}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-4 border-t border-neutral-200 bg-white flex justify-between items-center shrink-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                
                {/* VENSTRE: Tools (Del, Print, Kopier) */}
                <div className="flex items-center gap-2">
                    <button className="p-2.5 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all border border-transparent hover:border-orange-100" title="Del">
                        <Share2 size={18} />
                    </button>
                    <button className="p-2.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-all border border-transparent hover:border-neutral-200" title="Print">
                        <Printer size={18} />
                    </button>
                    <button 
                        className="p-2.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100" 
                        title="Kopier til mit bibliotek"
                        onClick={() => alert("Kopier funktion kommer i næste opdatering")}
                    >
                        <Copy size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {/* REDIGER KNAP */}
                    {canEdit && (
                        <button 
                            onClick={() => { 
                                if (onEdit) { onClose(); onEdit(drill); } 
                                else { alert("Fejl: 'onEdit' funktionen er ikke sendt med fra biblioteket."); } 
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-black transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-orange-500/20"
                        >
                            <Edit3 size={14} /> 
                            <span className="hidden md:inline">Rediger</span>
                        </button>
                    )}

                    {/* Access Level Badge */}
                    <div className="flex items-center gap-1.5 text-neutral-300 border-l border-neutral-100 pl-4 h-full" title="Tilgængelighed">
                        {drill.accessLevel === 'Global' && <Globe size={12} />}
                        {drill.accessLevel === 'Club' && <Shield size={12} />}
                        {drill.accessLevel === 'Personal' && <User size={12} />}
                        <span className="text-[9px] font-bold uppercase tracking-wider">{drill.accessLevel}</span>
                    </div>

                    {/* NY KNAP: + SESSION PLANNER */}
                    <button 
                        onClick={() => {
                            if(onAddToSession) {
                                onAddToSession(drill);
                                onClose();
                            } else {
                                alert("Tilføj til session: Kommer snart!");
                            }
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-orange-600 transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-orange-500/30"
                    >
                        <CalendarPlus size={14} /> 
                        <span className="hidden md:inline">+ Session Planner</span>
                        <span className="md:hidden">+ Session</span>
                    </button>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}