// components/library/DrillDetailModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, Play, Clock, Users, Ruler, Activity, 
  MapPin, Target, Shield, CheckCircle2, 
  Share2, Printer, Edit3, MonitorPlay
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
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export default function DrillDetailModal({ drill, isOpen, onClose, onEdit, lang }: DrillDetailModalProps) {
  if (!isOpen || !drill) return null;

  // Keyframes animation for smooth entry
  // Vi bruger "animate-in zoom-in-95" fra Tailwind (standard i Next.js config)

  const isVideo = drill.mediaType === 'video' || drill.mediaType === 'youtube';
  const hasYoutube = drill.mediaType === 'youtube' && drill.youtubeUrl;
  
  // Helpers til styling (Matcher CreateDrillModal)
  const labelClass = "text-[9px] font-black text-neutral-500 uppercase tracking-wider mb-1 block";
  const badgeClass = "px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1.5";
  
  // Funktion til at oversætte Load til farve (samme logik som i Create)
  const getLoadColor = (load: string | undefined) => {
      if (!load) return 'bg-gray-100 text-gray-500 border-gray-200';
      if (load.includes('Low')) return 'bg-green-50 text-green-700 border-green-200';
      if (load.includes('Moderate')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200" onClick={onClose}>
      
      {/* CARD CONTAINER */}
      <div 
        className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-5xl md:rounded-2xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* LUK KNAP (Desktop: Udenfor / Mobil: Indenfor) */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black text-white rounded-full backdrop-blur-md transition-all"
        >
            <X size={20} />
        </button>

        {/* --- VENSTRE KOLONNE: MEDIA (NETFLIX STYLE) --- */}
        <div className="w-full md:w-[60%] bg-black relative flex items-center justify-center min-h-[300px] md:min-h-full group">
            {hasYoutube ? (
                 <iframe 
                    className="w-full h-full absolute inset-0"
                    src={`https://www.youtube.com/embed/${getYoutubeId(drill.youtubeUrl!)}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0`} 
                    allow="autoplay; encrypted-media; fullscreen"
                 ></iframe>
            ) : drill.videoUrl ? (
                 <video 
                    src={drill.videoUrl} 
                    className="w-full h-full object-contain" 
                    controls 
                    autoPlay 
                    loop 
                 />
            ) : (
                 <div className="relative w-full h-full">
                     <img 
                        src={drill.thumbnailUrl || '/images/grass-texture-seamless.jpg'} 
                        alt={drill.title} 
                        className="w-full h-full object-cover opacity-90"
                     />
                     {/* Overlay Gradient i bunden af billedet */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden"></div>
                 </div>
            )}
        </div>

        {/* --- HØJRE KOLONNE: DATA & INFO --- */}
        <div className="flex-1 bg-white flex flex-col h-full overflow-hidden relative">
            
            {/* HEADER */}
            <div className="p-5 md:p-6 border-b border-neutral-100 bg-white shrink-0">
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        {drill.mainCategory}
                    </span>
                    {drill.subCategory && (
                        <span className="bg-neutral-100 text-neutral-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-neutral-200">
                            {drill.subCategory}
                        </span>
                    )}
                    {/* Load Badge */}
                    <span className={`${getLoadColor(drill.physicalLoad)} text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border flex items-center gap-1`}>
                        <Activity size={10} /> {drill.physicalLoad?.split('–')[1] || 'Unknown'}
                    </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 uppercase leading-tight mb-2">
                    {drill.title}
                </h2>
                
                {/* Stats Row */}
                <div className="flex items-center gap-4 text-neutral-500 text-xs font-medium">
                    <div className="flex items-center gap-1.5" title="Varighed">
                        <Clock size={14} className="text-orange-500" />
                        <span>{drill.durationMin} min</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Spillere">
                        <Users size={14} className="text-orange-500" />
                        <span>{drill.minPlayers}-{drill.maxPlayers} spillere</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Banestørrelse">
                        <Ruler size={14} className="text-orange-500" />
                        <span>{drill.pitchSize?.width}x{drill.pitchSize?.length}m</span>
                    </div>
                </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 custom-scrollbar">
                
                {/* 1. Beskrivelse */}
                {drill.description && (
                    <div>
                        <span className={labelClass}>Beskrivelse</span>
                        <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                            {drill.description}
                        </p>
                    </div>
                )}

                {/* 2. Coaching Points (Interaktiv Liste) */}
                {drill.coachingPoints?.keyPoints && drill.coachingPoints.keyPoints.length > 0 && (
                    <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                        <span className={`${labelClass} text-orange-800 mb-3`}>Coaching Points</span>
                        <ul className="space-y-2">
                            {drill.coachingPoints.keyPoints.map((point, idx) => (
                                <li key={idx} className="flex gap-2 text-sm text-neutral-800">
                                    <div className="mt-0.5 min-w-[16px]">
                                        <CheckCircle2 size={14} className="text-orange-500" />
                                    </div>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                        {drill.coachingPoints.instruction && (
                             <div className="mt-4 pt-3 border-t border-orange-200/50">
                                 <span className="text-[10px] font-bold text-orange-700 uppercase block mb-1">Instruktion:</span>
                                 <p className="text-xs text-neutral-600 italic">"{drill.coachingPoints.instruction}"</p>
                             </div>
                        )}
                    </div>
                )}

                {/* 3. Materialer & Opstilling */}
                {drill.materials && drill.materials.length > 0 && (
                    <div>
                         <span className={labelClass}>Materialer</span>
                         <div className="flex flex-wrap gap-2">
                             {drill.materials.map((mat, idx) => (
                                 <span key={idx} className="text-xs bg-neutral-50 border border-neutral-200 px-2 py-1 rounded text-neutral-700 font-medium">
                                     {mat.count}x {mat.name}
                                 </span>
                             ))}
                         </div>
                    </div>
                )}

                 {/* 4. Tags */}
                 {drill.tags && drill.tags.length > 0 && (
                    <div>
                         <span className={labelClass}>Tags</span>
                         <div className="flex flex-wrap gap-1.5">
                             {drill.tags.map((tag, idx) => (
                                 <span key={idx} className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                     #{tag}
                                 </span>
                             ))}
                         </div>
                    </div>
                )}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-between items-center shrink-0 md:rounded-br-2xl">
                <div className="flex items-center gap-2">
                    <button className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors" title="Del">
                        <Share2 size={18} />
                    </button>
                    <button className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors" title="Print PDF">
                        <Printer size={18} />
                    </button>
                </div>

                {onEdit && (
                    <button 
                        onClick={() => { onClose(); onEdit(drill); }}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md"
                    >
                        <Edit3 size={14} /> Rediger Øvelse
                    </button>
                )}
            </div>

        </div>

      </div>
    </div>
  );
}