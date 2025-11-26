// app/[lang]/(secure)/trainer/library/LibraryClient.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, LayoutTemplate, 
  Globe, Shield, Users, User, 
  Zap, Activity, Clock, 
  Play, CheckCircle2
} from 'lucide-react';
import { DrillAsset, FourCornerTag } from '@/lib/server/libraryData';
import { DTLUser } from '@/lib/server/data';
// Import af modalen (nu virker stien!)
import CreateDrillModal from '@/components/library/CreateDrillModal';

interface LibraryClientProps {
  dict: any; 
  lang: 'da' | 'en';
  user: DTLUser;
}

// --- MOCK DATA (RETTET: Alle objekter har nu coachingPoints) ---
const MOCK_ASSETS: DrillAsset[] = [
  {
    id: 'd1',
    title: 'Klopp-inspireret Genpres (Zone 3)',
    thumbnailUrl: '/images/tactical-analysis.jpeg',
    accessLevel: 'Global', 
    author: { id: 'dtl1', name: 'DTL Pro Team', role: 'Expert' },
    version: 'v2.1',
    ageGroups: ['U15', 'U17', 'U19'],
    durationMin: 20,
    minPlayers: 8,
    maxPlayers: 16,
    pitchSize: { width: 30, length: 40 },
    areaPerPlayer: 75, 
    intensity: 'Anaerob (RPE 8-10)',
    tags: ['Taktisk', 'Fysisk'],
    phase: 'Erobringsspil',
    coachingPoints: { before: [], during: [], after: [] }, // Denne var her allerede
    isVerified: true
  },
  {
    id: 'd2',
    title: 'Standard Opvarmning: Pasningstrekant',
    thumbnailUrl: '/images/session-planning.jpeg',
    accessLevel: 'Club', 
    author: { id: 'hc1', name: 'Sportschefen', role: 'Head of Coaching' },
    version: 'v1.0',
    ageGroups: ['U10', 'U11', 'U12', 'U13'],
    durationMin: 15,
    minPlayers: 6,
    maxPlayers: 12,
    pitchSize: { width: 20, length: 20 },
    areaPerPlayer: 40,
    intensity: 'Aerob (RPE 4-7)',
    tags: ['Teknisk', 'Mentalt'],
    phase: 'Opvarmning',
    coachingPoints: { before: [], during: [], after: [] }, // TILFØJET HER
    isVerified: true
  },
  {
    id: 'd3',
    title: 'Afslutning i feltet - Variant B',
    thumbnailUrl: '/images/grass-texture-seamless.jpg',
    accessLevel: 'Personal', 
    author: { id: 'me', name: 'Mig Selv', role: 'Coach' },
    version: 'v1.0',
    ageGroups: ['U14'],
    durationMin: 15,
    minPlayers: 4,
    maxPlayers: 8,
    pitchSize: { width: 40, length: 44 },
    intensity: 'Aerob (RPE 4-7)',
    tags: ['Teknisk'],
    phase: 'Afslutningsspil',
    coachingPoints: { before: [], during: [], after: [] }, // TILFØJET HER
    isVerified: false
  }
];

export default function LibraryClient({ dict, lang, user }: LibraryClientProps) {
  const t = useMemo(() => dict.library || {}, [dict]);

  // State til at styre modalen
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'Global' | 'Club' | 'Team' | 'Personal'>('Global');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const getTagColor = (tag: FourCornerTag) => {
    switch(tag) {
      case 'Teknisk': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Taktisk': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Fysisk': return 'bg-red-100 text-red-700 border-red-200';
      case 'Mentalt': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredAssets = MOCK_ASSETS.filter(asset => {
    const matchTab = asset.accessLevel === activeTab;
    const matchSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchTag = selectedTag === 'all';
    if (selectedTag !== 'all' && asset.tags.includes(selectedTag as FourCornerTag)) matchTag = true;

    return matchTab && matchSearch && matchTag;
  });

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* --- HEADER --- */}
      <div className="px-6 py-5 border-b border-slate-200 bg-white flex flex-col gap-4 shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <LayoutTemplate className="text-orange-500" /> {t.title ?? 'Library'}
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-1">
              {t.subtitle ?? 'Asset Management'} • {MOCK_ASSETS.length} Assets
            </p>
          </div>
          
          <div className="flex gap-2">
             {/* KNAP DER ÅBNER MODALEN */}
             <button 
               onClick={() => setIsCreateModalOpen(true)}
               className="bg-black hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all"
             >
               <Plus size={14} /> {t.createBtn ?? 'Create'}
             </button>
          </div>
        </div>

        {/* --- NAVIGATION --- */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {[
            { id: 'Global', label: t.tabs?.global ?? 'Global', icon: Globe },
            { id: 'Club', label: t.tabs?.club ?? 'Club', icon: Shield },
            { id: 'Team', label: t.tabs?.team ?? 'Team', icon: Users },
            { id: 'Personal', label: t.tabs?.personal ?? 'Personal', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all
                ${activeTab === tab.id 
                  ? 'bg-white text-orange-600 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}
              `}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- FILTRE --- */}
      <div className="px-6 py-3 border-b border-slate-200 bg-white flex gap-3 items-center overflow-x-auto custom-scrollbar shrink-0">
        <div className="relative w-64 shrink-0">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
           <input 
             type="text" 
             placeholder={t.searchPlaceholder ?? 'Search...'}
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
           />
        </div>
        
        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        <div className="flex gap-1.5">
           {[
             { key: 'all', label: t.filters?.all ?? 'All' },
             { key: 'Teknisk', label: t.filters?.technical ?? 'Technical' },
             { key: 'Taktisk', label: t.filters?.tactical ?? 'Tactical' },
             { key: 'Fysisk', label: t.filters?.physical ?? 'Physical' },
             { key: 'Mentalt', label: t.filters?.mental ?? 'Mental' },
           ].map((filter) => (
             <button 
               key={filter.key}
               onClick={() => setSelectedTag(filter.key)}
               className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap
                 ${selectedTag === filter.key 
                   ? 'bg-slate-900 text-white border-slate-900' 
                   : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}
               `}
             >
               {filter.label}
             </button>
           ))}
        </div>
      </div>

      {/* --- GRID CONTENT --- */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map(asset => (
              <div key={asset.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative">
                
                {/* Thumbnail */}
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                   <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${asset.thumbnailUrl})` }}></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                   
                   {asset.isVerified && (
                     <div className="absolute top-3 right-3 bg-blue-500 text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                       <CheckCircle2 size={10} /> {t.card?.verified ?? 'Verified'}
                     </div>
                   )}

                   <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-mono px-2 py-1 rounded-md border border-white/10">
                     {asset.version}
                   </div>

                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                        <Play size={20} className="text-white fill-current ml-1" />
                      </div>
                   </div>

                   <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                      <div>
                        <p className="text-[10px] opacity-90 font-medium uppercase tracking-wider mb-0.5">{asset.phase}</p>
                        <h3 className="text-sm font-bold leading-tight line-clamp-2 shadow-sm">{asset.title}</h3>
                      </div>
                   </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col gap-3">
                   <div className="flex flex-wrap gap-1.5">
                      {asset.tags.map(tag => (
                        <span key={tag} className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getTagColor(tag)}`}>
                          {tag}
                        </span>
                      ))}
                   </div>

                   <div className="flex items-center gap-4 text-slate-500 border-t border-slate-100 pt-3 mt-auto">
                      <div className="flex items-center gap-1.5">
                         <Clock size={14} className="text-orange-500" />
                         <span className="text-[11px] font-bold">{asset.durationMin}m</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <Users size={14} className="text-blue-500" />
                         <span className="text-[11px] font-bold">{asset.minPlayers}-{asset.maxPlayers}</span>
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto">
                         <Activity size={14} className={`${asset.intensity.includes('Anaerob') ? 'text-red-500' : 'text-green-500'}`} />
                         <span className="text-[11px] font-bold">{asset.intensity.split(' ')[0]}</span>
                      </div>
                   </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex justify-between items-center">
                   <span className="text-[10px] font-medium text-slate-400">
                     {t.card?.by ?? 'By'}: <span className="text-slate-600 font-bold">{asset.author.name}</span>
                   </span>
                   {asset.areaPerPlayer && asset.areaPerPlayer < 80 && (
                     <span className="text-[9px] font-bold text-orange-600 flex items-center gap-1 bg-orange-50 px-1.5 py-0.5 rounded">
                       <Zap size={10} /> {t.card?.highIntensity ?? 'High Int.'}
                     </span>
                   )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search size={32} className="opacity-50" />
             </div>
             <p className="text-sm font-bold">{t.emptyState?.title ?? 'No assets'}</p>
             <p className="text-xs mt-1">{t.emptyState?.desc ?? 'Try searching again'}</p>
          </div>
        )}
      </div>

      {/* --- MODALEN INDSÆTTES HER --- */}
      <CreateDrillModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        lang={lang}
      />
    </div>
  );
}