// app/[lang]/(secure)/trainer/studio/DTLStudioClient.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  Save, 
  MousePointer2, 
  Circle, 
  MoveHorizontal, 
  Square, 
  Type, 
  Undo, 
  Redo, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Plus,
  Layers
} from 'lucide-react';
import { SubscriptionLevel, UserRole } from '@/lib/server/data';

interface DTLStudioClientProps {
  dict: any;
  lang: 'da' | 'en';
  accessLevel: SubscriptionLevel;
}

type ToolType = 'select' | 'player' | 'ball' | 'arrow' | 'rect' | 'text';

export default function DTLStudioClient({ dict, lang, accessLevel }: DTLStudioClientProps) {
  const t = dict.trainer_page || {};
  
  // State til værktøjer og afspilning
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(1);
  const totalFrames = 5; // Simuleret antal keyframes

  // Hjælpefunktion til værktøjsknapper
  const ToolButton = ({ tool, icon: Icon, label }: { tool: ToolType, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTool(tool)}
      className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all group relative ${
        activeTool === tool 
          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
      }`}
      title={label}
    >
      <Icon size={20} strokeWidth={activeTool === tool ? 2.5 : 2} />
      <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 absolute left-12 bg-zinc-800 px-2 py-1 rounded text-white whitespace-nowrap z-50 transition-opacity pointer-events-none">
        {label}
      </span>
    </button>
  );

  return (
    // KIOSK MODE CONTAINER: Dækker hele skærmen (z-50) og bruger mørkt tema
    <div className="fixed inset-0 z-50 bg-zinc-950 text-white flex flex-col overflow-hidden font-sans">
      
      {/* --- TOP BAR --- */}
      <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50 backdrop-blur-sm">
        
        {/* Venstre: Titel & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-black">
               DS
             </div>
             <div>
               <h1 className="text-sm font-bold tracking-wide text-zinc-100">DTL Studio</h1>
               <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Pro Edition</p>
             </div>
          </div>
          <div className="h-6 w-px bg-zinc-800 mx-2"></div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
             <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
             <span>Auto-saved</span>
          </div>
        </div>

        {/* Midt: Filnavn (Redigerbart) */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
           <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
              <span className="text-sm text-zinc-300 font-medium">Nyt Opspil Fase 1</span>
           </div>
        </div>

        {/* Højre: Handlinger */}
        <div className="flex items-center gap-3">
           <div className="flex items-center bg-zinc-900 rounded-lg p-1 border border-zinc-800">
              <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors" title="Undo (Ctrl+Z)">
                 <Undo size={16} />
              </button>
              <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors" title="Redo (Ctrl+Y)">
                 <Redo size={16} />
              </button>
           </div>
           
           <button className="flex items-center gap-2 bg-zinc-100 text-black px-4 py-2 rounded-lg hover:bg-white transition-colors text-sm font-bold">
              <Save size={16} />
              Gem
           </button>
           
           {/* Exit Knap -> Tilbage til Planner */}
           <Link href={`/${lang}/trainer/planner`} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
              <X size={24} />
           </Link>
        </div>
      </div>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* TOOLBAR (Venstre) */}
        <div className="w-16 border-r border-zinc-800 bg-zinc-900/30 flex flex-col items-center py-4 gap-2 z-10">
           <ToolButton tool="select" icon={MousePointer2} label="Vælg (V)" />
           <div className="w-8 h-px bg-zinc-800 my-1"></div>
           <ToolButton tool="player" icon={({size, ...props}: any) => (
             // Custom ikon for spiller (cirkel med prik)
             <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
             </svg>
           )} label="Spiller (P)" />
           <ToolButton tool="ball" icon={({size, ...props}: any) => (
              <Circle size={size} {...props} />
           )} label="Bold (B)" />
           <div className="w-8 h-px bg-zinc-800 my-1"></div>
           <ToolButton tool="arrow" icon={MoveHorizontal} label="Pil (A)" />
           <ToolButton tool="rect" icon={Square} label="Zone (R)" />
           <ToolButton tool="text" icon={Type} label="Tekst (T)" />
        </div>

        {/* CANVAS AREA (Midten) */}
        <div className="flex-1 bg-zinc-950 relative overflow-hidden flex items-center justify-center">
           
           {/* Baggrund: Fodboldbane (Mørk/Taktisk stil) */}
           <div className="relative w-[90%] h-[85%] border-2 border-zinc-700 rounded-xl overflow-hidden bg-[#1a1a1a] shadow-2xl">
              {/* Midterlinje */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-zinc-700/50 -translate-x-1/2"></div>
              {/* Midtercirkel */}
              <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-zinc-700/50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              {/* Straffesparksfelter */}
              <div className="absolute top-1/4 bottom-1/4 left-0 w-32 border-r-2 border-y-2 border-zinc-700/50"></div>
              <div className="absolute top-1/4 bottom-1/4 right-0 w-32 border-l-2 border-y-2 border-zinc-700/50"></div>
              
              {/* Placeholder Tekst */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <p className="text-zinc-800 font-bold text-4xl uppercase tracking-[1em] opacity-50">
                    DTL Studio
                 </p>
              </div>
           </div>

           {/* Zoom Controls (Flydende bund-højre) */}
           <div className="absolute bottom-8 right-8 bg-zinc-900 border border-zinc-800 p-1 rounded-lg flex gap-1 shadow-xl">
              <button className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 rounded">-</button>
              <span className="w-12 flex items-center justify-center text-xs font-mono text-zinc-300">100%</span>
              <button className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 rounded">+</button>
           </div>

        </div>

        {/* PROPERTIES PANEL (Højre - Skjult for nu for at give plads, men pladsholder) */}
        {/* <div className="w-64 border-l border-zinc-800 bg-zinc-900/30"></div> */}

      </div>

      {/* --- ANIMATION TIMELINE (Bund) --- */}
      <div className="h-48 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex flex-col">
         
         {/* Timeline Controls */}
         <div className="h-10 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900">
            <div className="flex items-center gap-2">
               <button className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><SkipBack size={16} /></button>
               <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 bg-orange-500 text-black hover:bg-orange-400 rounded transition-colors"
               >
                  {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
               </button>
               <button className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><SkipForward size={16} /></button>
               <div className="w-px h-4 bg-zinc-700 mx-2"></div>
               <span className="text-xs font-mono text-orange-500">00:0{currentFrame}:00</span>
            </div>
            
            <div className="flex items-center gap-2">
               <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-medium transition-colors border border-zinc-700">
                  <Plus size={14} /> Ny Frame
               </button>
               <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-medium transition-colors border border-zinc-700">
                  <Layers size={14} /> Lag
               </button>
            </div>
         </div>

         {/* Timeline Tracks */}
         <div className="flex-1 overflow-x-auto p-4">
             <div className="flex gap-1 min-w-max">
                {/* Frame Indicators */}
                {[...Array(10)].map((_, i) => {
                   const isCurrent = i + 1 === currentFrame;
                   return (
                     <div 
                        key={i} 
                        onClick={() => setCurrentFrame(i + 1)}
                        className={`
                           w-24 h-24 rounded-lg border-2 cursor-pointer relative group transition-all
                           ${isCurrent ? 'border-orange-500 bg-zinc-800' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'}
                        `}
                     >
                        <div className="absolute top-1 left-2 text-[10px] text-zinc-500 font-mono">
                           {i + 1}
                        </div>
                        {/* Preview indhold (fiktivt) */}
                        <div className="absolute inset-4 border border-dashed border-zinc-800 rounded opacity-50 flex items-center justify-center">
                           {i === 0 && <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>}
                           {i === 1 && <div className="w-2 h-2 bg-zinc-600 rounded-full translate-x-2"></div>}
                           {i > 1 && <span className="text-[8px] text-zinc-700">Empty</span>}
                        </div>
                     </div>
                   )
                })}
                
                {/* Add Frame Placeholder */}
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 cursor-pointer transition-colors">
                   <Plus size={24} />
                </div>
             </div>
         </div>

      </div>

    </div>
  );
}