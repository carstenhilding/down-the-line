// components/library/DrillDetailModal.tsx
"use client";

import React, { useState } from 'react';
import { 
  X, Play, Clock, Users, Ruler, Activity, 
  MapPin, Target, CheckCircle2, 
  Share2, Printer, Edit3, User, Globe,
  ArrowUpRight, ArrowDownRight, Layers, Box, Shield, 
  Image as ImageIcon, ChevronLeft, ChevronRight, Circle
} from 'lucide-react';
import { DrillAsset } from '@/lib/server/libraryData';
import Image from 'next/image';

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

export default function DrillDetailModal({ drill, isOpen, onClose, onEdit, lang }: DrillDetailModalProps) {
  // State til karrusel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !drill) return null;

  const hasYoutube = drill.mediaType === 'youtube' && drill.youtubeUrl;
  const hasVideo = hasYoutube || drill.videoUrl;
  
  // LOGIK: Saml alle billeder i ét array. 
  // Hvis 'imageUrls' findes (fremtidig funktion), bruger vi dem. Ellers bruger vi thumbnail.
  const images = (drill as any).imageUrls && (drill as any).imageUrls.length > 0
      ? (drill as any).imageUrls
      : (drill.thumbnailUrl ? [drill.thumbnailUrl] : ['/images/grass-texture-seamless.jpg']);

  const showSlider = images.length > 1;

  // Navigation handlers
  const nextImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  // Helpers til styling
  const labelClass = "text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1.5 block";
  
  const getLoadColor = (load: string | undefined) => {
      if (!load) return 'bg-neutral-100 text-neutral-500 border-neutral-200';
      if (load.includes('Low')) return 'bg-green-50 text-green-700 border-green-200';
      if (load.includes('Moderate')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-0 md:p-6 animate-in fade-in duration-200" onClick={onClose}>
      
      {/* CARD CONTAINER */}
      <div 
        className="bg-white w-full h-full md:h-[90vh] md:max-w-6xl md:rounded-2xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* LUK KNAP */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 p-2 bg-neutral-900/50 hover:bg-neutral-900 text-white rounded-full backdrop-blur-md transition-all border border-white/10"
        >
            <X size={20} />
        </button>

        {/* --- VENSTRE KOLONNE: MEDIA STACK (SCROLLABLE) --- */}
        <div className="w-full md:w-[55%] bg-black flex flex-col overflow-y-auto custom-scrollbar border-r border-neutral-800">
            
            {/* 1. BILLEDE SLIDER (Altid øverst) */}
            <div className={`relative w-full bg-neutral-900 flex items-center justify-center shrink-0 group ${hasVideo ? 'min-h-[50%]' : 'h-full'}`}>
                 
                 <img 
                    src={images[currentImageIndex]} 
                    alt={drill.title} 
                    className="w-full h-full object-contain max-h-[80vh] animate-in fade-in duration-300"
                 />

                 {/* CAROUSEL CONTROLS (Kun hvis > 1 billede) */}
                 {showSlider && (
                     <>
                        {/* Venstre Pil */}
                        <button 
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-orange-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {/* Højre Pil */}
                        <button 
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-orange-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight size={20} />
                        </button>

                        {/* Indikator Prikker */}
                        <div className="absolute bottom-4 flex gap-2">
                            {images.map((_: any, idx: number) => (
                                <div 
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-orange-500 scale-110' : 'bg-white/30'}`}
                                />
                            ))}
                        </div>
                     </>
                 )}
            </div>

            {/* 2. VIDEO (Nedenunder - hvis den findes) */}
            {hasVideo && (
                <div className="relative w-full shrink-0 border-t-4 border-neutral-800 bg-black">
                    {/* Video Container */}
                    <div className="aspect-video w-full relative">
                        {hasYoutube ? (
                            <iframe 
                                className="w-full h-full absolute inset-0"
                                src={`https://www.youtube.com/embed/${getYoutubeId(drill.youtubeUrl!)}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1`} 
                                allow="autoplay; encrypted-media; fullscreen"
                            ></iframe>
                        ) : (
                            <video 
                                src={drill.videoUrl!} 
                                className="w-full h-full object-contain bg-black" 
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

        {/* --- HØJRE KOLONNE: DATA & INFO --- */}
        <div className="flex-1 bg-white flex flex-col h-full overflow-hidden relative">
            
            {/* HEADER SECTION */}
            <div className="p-6 border-b border-neutral-100 bg-white shrink-0">
                
                {/* Top Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-neutral-900 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-neutral-900">
                        {drill.mainCategory}
                    </span>
                    {drill.subCategory && (
                        <span className="bg-white text-neutral-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-neutral-200">
                            {drill.subCategory}
                        </span>
                    )}
                    <span className={`${getLoadColor(drill.physicalLoad)} text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border flex items-center gap-1`}>
                        <Activity size={10} /> {drill.physicalLoad?.split('–')[1] || 'Unknown'}
                    </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 uppercase leading-none mb-4 tracking-tight">
                    {drill.title}
                </h2>
                
                {/* INFO GRID */}
                <div className="grid grid-cols-3 gap-y-3 gap-x-2 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-neutral-400 uppercase">Tid</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                            <Clock size={12} className="text-orange-500" />
                            {drill.durationMin} min
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-neutral-400 uppercase">Spillere</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                            <Users size={12} className="text-orange-500" />
                            {drill.minPlayers}-{drill.maxPlayers}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-neutral-400 uppercase">Bane</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                            <Ruler size={12} className="text-orange-500" />
                            {drill.pitchSize?.width}x{drill.pitchSize?.length}m
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-neutral-400 uppercase">Arbejde/Pause</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                            <Activity size={12} className="text-orange-500" />
                            {drill.workDuration || '-'} / {drill.restDuration || '-'}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-neutral-400 uppercase">Alder</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                            <User size={12} className="text-orange-500" />
                            {drill.ageGroups && drill.ageGroups.length > 0 ? drill.ageGroups[0] : '-'}
                        </div>
                    </div>
                     <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-neutral-400 uppercase">Keeper</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                            <Shield size={12} className={drill.goalKeeper ? "text-green-500" : "text-neutral-300"} />
                            {drill.goalKeeper ? 'Ja' : 'Nej'}
                        </div>
                    </div>
                </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                
                {/* 1. BESKRIVELSE */}
                <div>
                    <span className={labelClass}>Beskrivelse</span>
                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                        {drill.description || "Ingen beskrivelse tilgængelig."}
                    </p>
                </div>

                 {/* 2. TEMAER (Hvis udfyldt) */}
                 {(drill.primaryTheme || drill.secondaryTheme) && (
                    <div className="flex gap-4">
                        {drill.primaryTheme && (
                            <div className="flex-1">
                                <span className={labelClass}>Primært Tema</span>
                                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 bg-orange-50 px-2 py-1.5 rounded border border-orange-100">
                                    <Target size={12} className="text-orange-500" />
                                    {drill.primaryTheme}
                                </div>
                            </div>
                        )}
                         {drill.secondaryTheme && (
                            <div className="flex-1">
                                <span className={labelClass}>Sekundært Tema</span>
                                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 bg-neutral-50 px-2 py-1.5 rounded border border-neutral-100">
                                    <Layers size={12} className="text-neutral-400" />
                                    {drill.secondaryTheme}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. COACHING POINTS & INSTRUKTION */}
                <div className="space-y-4">
                     {drill.coachingPoints?.keyPoints && drill.coachingPoints.keyPoints.length > 0 && (
                        <div>
                             <span className={`${labelClass} text-orange-600`}>Coaching Points</span>
                             <ul className="space-y-2">
                                {drill.coachingPoints.keyPoints.filter(p => p).map((point, idx) => (
                                    <li key={idx} className="flex gap-2.5 text-sm text-neutral-800 bg-white group">
                                        <div className="mt-1 min-w-[16px]">
                                            <CheckCircle2 size={16} className="text-orange-500 fill-orange-50" />
                                        </div>
                                        <span className="leading-snug font-medium">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {drill.coachingPoints?.instruction && (
                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1 block">Træner Instruktion</span>
                                <p className="text-xs text-neutral-600 italic leading-relaxed">"{drill.coachingPoints.instruction}"</p>
                            </div>
                        )}
                        {drill.stopFreeze && (
                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1 block">Stop / Frys Momenter</span>
                                <p className="text-xs text-neutral-600 italic leading-relaxed">"{drill.stopFreeze}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. PROGRESSION / REGRESSION */}
                {( (drill.progression && drill.progression.length > 0 && drill.progression[0]) || (drill.regression && drill.regression.length > 0 && drill.regression[0]) ) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                         {drill.progression && drill.progression[0] && (
                             <div>
                                 <span className={`${labelClass} text-neutral-900 flex items-center gap-1`}><ArrowUpRight size={12} /> Progression (Sværere)</span>
                                 <ul className="list-disc list-inside space-y-1">
                                    {drill.progression.filter(p=>p).map((p, i) => (
                                        <li key={i} className="text-xs text-neutral-700 font-medium">{p}</li>
                                    ))}
                                 </ul>
                             </div>
                         )}
                         {drill.regression && drill.regression[0] && (
                             <div>
                                 <span className={`${labelClass} text-neutral-500 flex items-center gap-1`}><ArrowDownRight size={12} /> Regression (Lettere)</span>
                                 <ul className="list-disc list-inside space-y-1">
                                    {drill.regression.filter(r=>r).map((r, i) => (
                                        <li key={i} className="text-xs text-neutral-600">{r}</li>
                                    ))}
                                 </ul>
                             </div>
                         )}
                    </div>
                )}

                {/* 5. MATERIALER & TAGS */}
                <div className="pt-2 border-t border-neutral-100">
                     <div className="flex flex-wrap gap-x-8 gap-y-4">
                         {drill.materials && drill.materials.length > 0 && (
                            <div>
                                 <span className={labelClass}>Materialer</span>
                                 <div className="flex flex-wrap gap-2">
                                     {drill.materials.map((mat, idx) => (
                                         <span key={idx} className="text-[10px] bg-white border border-neutral-200 px-2 py-1 rounded text-neutral-700 font-bold uppercase flex items-center gap-1 shadow-sm">
                                             <Box size={10} className="text-neutral-400"/> {mat.count} {mat.name}
                                         </span>
                                     ))}
                                 </div>
                            </div>
                         )}
                         
                         {drill.tags && drill.tags.length > 0 && (
                            <div>
                                 <span className={labelClass}>Tags</span>
                                 <div className="flex flex-wrap gap-1.5">
                                     {drill.tags.map((tag, idx) => (
                                         <span key={idx} className="text-[10px] text-neutral-500 px-2 py-0.5 rounded-full font-medium bg-neutral-100">
                                             #{tag}
                                         </span>
                                     ))}
                                 </div>
                            </div>
                        )}
                     </div>
                </div>

                {/* AUTHOR INFO */}
                <div className="pt-4 mt-4 border-t border-dashed border-neutral-200 flex items-center justify-between text-[10px] text-neutral-400">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                            {drill.authorName ? drill.authorName.charAt(0) : 'D'}
                        </div>
                        <span>Oprettet af <span className="text-neutral-600 font-bold">{drill.authorName || 'DTL Coach'}</span></span>
                    </div>
                    <span>{drill.accessLevel} Library</span>
                </div>

            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-between items-center shrink-0 md:rounded-br-2xl">
                <div className="flex items-center gap-2">
                    <button className="p-2 text-neutral-400 hover:text-orange-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-neutral-200 hover:shadow-sm" title="Del">
                        <Share2 size={16} />
                    </button>
                    <button className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-neutral-200 hover:shadow-sm" title="Print PDF">
                        <Printer size={16} />
                    </button>
                </div>

                {onEdit && (
                    <button 
                        onClick={() => { onClose(); onEdit(drill); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-lg hover:-translate-y-0.5"
                    >
                        <Edit3 size={14} /> Rediger
                    </button>
                )}
            </div>

        </div>

      </div>
    </div>
  );
}