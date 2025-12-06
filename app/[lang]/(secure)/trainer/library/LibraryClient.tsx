// app/[lang]/(secure)/trainer/library/LibraryClient.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { 
  Search, Plus, LayoutTemplate, 
  Globe, Shield, Users, User, 
  Zap, Clock, Play, Loader2, Trash2, 
  SlidersHorizontal, Check
} from 'lucide-react';
import { DrillAsset, DRILL_TAGS, DRILL_CATEGORIES, FourCornerTag } from '@/lib/server/libraryData';
import { DTLUser, UserRole } from '@/lib/server/data';
import CreateDrillModal from '@/components/library/CreateDrillModal';
import { getDrills, deleteDrill } from '@/lib/services/libraryService';
import { useUser } from '@/components/UserContext';

interface LibraryClientProps {
  dict: any; 
  lang: 'da' | 'en';
  user: DTLUser; 
}

type TabType = 'Global' | 'Club' | 'Team' | 'Personal';

export default function LibraryClient({ dict, lang, user: serverUser }: LibraryClientProps) {
  const t = useMemo(() => dict.library || {}, [dict]);
  const { user } = useUser(); 
  const currentUser = user || serverUser;

  // State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('Global');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); 
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [assets, setAssets] = useState<DrillAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Data fetching
  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const levelToFetch = debouncedSearch.length > 0 ? 'All' : activeTab;
      const data = await getDrills(levelToFetch, currentUser.id, currentUser.clubId, currentUser.teamId);
      setAssets(data);
    } catch (error) {
      console.error("Kunne ikke hente øvelser:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, debouncedSearch, currentUser.id, currentUser.clubId, currentUser.teamId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Click outside filter
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterRef]);

  const handleDelete = async (e: React.MouseEvent, assetId: string) => {
    e.stopPropagation();
    if (!window.confirm(lang === 'da' ? "Slet øvelse? Det kan ikke fortrydes." : "Delete drill? Cannot be undone.")) return;

    setIsDeleting(assetId);
    const result = await deleteDrill(assetId);
    if (result.success) {
        setAssets(prev => prev.filter(a => a.id !== assetId));
    } else {
        alert("Fejl ved sletning.");
    }
    setIsDeleting(null);
  };

  const canDeleteDrill = (asset: DrillAsset) => {
    if (currentUser.role === UserRole.Developer) return true;
    if (asset.accessLevel === 'Global') return false;
    if (asset.authorId === currentUser.id) return true;
    if (asset.accessLevel === 'Club' && asset.clubId === currentUser.clubId) {
        return [UserRole.ClubAdmin, UserRole.AcademyDirector, UserRole.HeadOfCoach].includes(currentUser.role);
    }
    return false;
  };

  const toggleTag = (tag: string) => {
      setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
        if (debouncedSearch.length === 0) {
            if (asset.accessLevel !== activeTab) return false;
        }

        const langMatch = asset.language ? asset.language === lang : true;
        const searchMatch = asset.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        let categoryMatch = selectedCategory === 'all';
        if (selectedCategory !== 'all') {
            categoryMatch = asset.mainCategory === selectedCategory;
        }

        let tagsMatch = true;
        if (selectedTags.length > 0) {
            if (asset.tags) {
                tagsMatch = selectedTags.some(tag => asset.tags?.includes(tag as FourCornerTag));
            } else {
                tagsMatch = false;
            }
        }

        return langMatch && searchMatch && categoryMatch && tagsMatch;
    });
  }, [assets, lang, searchQuery, debouncedSearch, selectedCategory, selectedTags, activeTab]);

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + selectedTags.length;

  const getSourceBadge = (level: string) => {
      switch(level) {
          case 'Global': return { label: 'GLOBAL', color: 'bg-orange-500 text-white' };
          case 'Club': return { label: 'CLUB', color: 'bg-neutral-900 text-white' };
          case 'Team': return { label: 'TEAM', color: 'bg-white text-neutral-900 border border-neutral-900' };
          case 'Personal': return { label: 'MY', color: 'bg-neutral-900 text-orange-500 border border-orange-500/30' };
          default: return null;
      }
  };

  const getIntensityColor = (load: string | undefined) => {
      if (!load) return 'bg-neutral-400';
      if (load.includes('Low')) return 'bg-green-500 shadow-green-500/50';
      if (load.includes('Moderate')) return 'bg-yellow-400 shadow-yellow-400/50';
      return 'bg-red-600 shadow-red-600/50';
  };

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] text-neutral-900 overflow-hidden relative">
      
      {/* --- STICKY TOOLBAR --- */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 md:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 shadow-sm">
        
        {/* Left: Navigation Tabs */}
        <div className={`flex items-center gap-4 w-full md:w-auto overflow-x-auto no-scrollbar transition-opacity ${searchQuery.length > 0 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex bg-neutral-100 rounded-lg p-1 shrink-0">
                {[
                    { id: 'Global', label: 'DTL Global', icon: Globe },
                    { id: 'Club', label: 'Club Library', icon: Shield },
                    { id: 'Team', label: 'Team Library', icon: Users },
                    { id: 'Personal', label: 'Personal Library', icon: User },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                            activeTab === tab.id 
                            ? 'bg-white text-orange-600 shadow-sm ring-1 ring-neutral-200' 
                            : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50'
                        }`}
                    >
                        <tab.icon size={12} />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto">
            
            {/* Search */}
            <div className="relative flex-1 md:w-56 group">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${searchQuery.length > 0 ? 'text-orange-500' : 'text-neutral-400'}`} size={14} />
                <input 
                    type="text" 
                    placeholder={t.searchPlaceholder ?? 'Søg efter øvelser...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 bg-neutral-50 border rounded-lg text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 transition-all placeholder:text-neutral-400 ${searchQuery.length > 0 ? 'border-orange-500 ring-orange-500' : 'border-neutral-200 focus:border-orange-500 focus:ring-orange-500'}`}
                />
            </div>

            {/* Filter Button */}
            <div className="relative" ref={filterRef}>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs font-bold uppercase tracking-wide ${isFilterOpen || activeFiltersCount > 0 ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white border-neutral-200 text-neutral-500 hover:border-orange-500 hover:text-orange-600'}`}
                >
                    <SlidersHorizontal size={14} />
                    <span className="hidden sm:inline">Filter</span>
                    {activeFiltersCount > 0 && (
                        <span className="bg-orange-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">{activeFiltersCount}</span>
                    )}
                </button>

                {/* Filter Popover */}
                {isFilterOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-neutral-200 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Filtre</span>
                            {(activeFiltersCount > 0) && (
                                <button onClick={() => { setSelectedCategory('all'); setSelectedTags([]); }} className="text-[10px] text-orange-500 hover:text-orange-600 font-medium">Nulstil</button>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase mb-2 block">Kategori</label>
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1.5 text-xs text-neutral-900 focus:border-orange-500 outline-none">
                                <option value="all">Alle Kategorier</option>
                                {Object.keys(DRILL_CATEGORIES).map(cat => (
                                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase mb-2 block">Tags</label>
                            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                                {['Teknisk', 'Taktisk', 'Fysisk', 'Mentalt'].map(corner => (
                                    <button key={corner} onClick={() => toggleTag(corner)} className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors flex items-center gap-1 ${selectedTags.includes(corner) ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-neutral-200 text-neutral-500 hover:border-orange-300'}`}>{selectedTags.includes(corner) && <Check size={10} />}{corner}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Button */}
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-black hover:bg-neutral-900 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group hover:-translate-y-1"
            >
                <Plus size={16} strokeWidth={3} className="text-orange-500 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">{t.createBtn ?? 'Create'}</span>
            </button>
        </div>
      </div>

      {/* --- GRID CONTENT --- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
        
        {/* Global Search Indicator */}
        {debouncedSearch.length > 0 && !isLoading && (
            <div className="mb-4 flex items-center gap-2 px-1 animate-in fade-in slide-in-from-top-2">
                <span className="text-[10px] font-bold uppercase text-neutral-400">Resultater for:</span>
                <span className="text-sm font-black text-neutral-900">"{debouncedSearch}"</span>
                <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full ml-auto">
                    {filteredAssets.length} fundet i alle biblioteker
                </span>
            </div>
        )}

        {isLoading ? (
            <div className="flex h-full items-center justify-center flex-col gap-4">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                <p className="text-neutral-400 text-xs font-mono animate-pulse">
                    {debouncedSearch.length > 0 ? 'SØGER I ALLE BIBLIOTEKER...' : 'HENTER ØVELSER...'}
                </p>
            </div>
        ) : filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-20">
            {filteredAssets.map(asset => {
              const isHovered = hoveredAssetId === asset.id;
              const hasVideo = asset.mediaType === 'video' && asset.videoUrl;
              const hasYoutube = asset.mediaType === 'youtube' && asset.youtubeUrl;
              const isPlaceholder = asset.thumbnailUrl === '/images/tactical-analysis.jpeg';
              const bgImage = ( (hasVideo || hasYoutube) && isPlaceholder ) 
                  ? '/images/grass-texture-seamless.jpg' 
                  : (asset.thumbnailUrl || '/images/grass-texture-seamless.jpg');
              
              const sourceBadge = getSourceBadge(asset.accessLevel);
              const intensityColor = getIntensityColor(asset.physicalLoad);

              return (
                <div 
                    key={asset.id} 
                    className="group relative aspect-video bg-neutral-100 rounded-xl overflow-hidden cursor-pointer border border-neutral-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:z-10"
                    onMouseEnter={() => setHoveredAssetId(asset.id!)}
                    onMouseLeave={() => setHoveredAssetId(null)}
                >
                   {/* 1. MEDIA */}
                   {hasVideo && isHovered ? (
                       <video src={asset.videoUrl} autoPlay muted loop className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-500" />
                   ) : hasYoutube && isHovered ? (
                       <div className="absolute inset-0 bg-black">
                           <iframe className="w-full h-full pointer-events-none scale-[1.3]" src={`https://www.youtube.com/embed/${getYouTubeID(asset.youtubeUrl!)}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&loop=1&playlist=${getYouTubeID(asset.youtubeUrl!)}`} allow="autoplay; encrypted-media"></iframe>
                       </div>
                   ) : (
                       <img src={bgImage} alt={asset.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-100" onError={(e) => { e.currentTarget.src = '/images/grass-texture-seamless.jpg'; }} />
                   )}

                   {/* 2. OVERLAY */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>

                   {/* SOURCE BADGE (Kun ved Global Search) */}
                   {searchQuery.length > 0 && sourceBadge && (
                       <div className={`absolute top-3 left-3 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm z-20 ${sourceBadge.color}`}>
                           {sourceBadge.label}
                       </div>
                   )}

                   {/* 3. TOP CONTENT */}
                   
                   {/* Tid - Top Venstre (Kun ved hover) */}
                   <div className="absolute top-3 left-3 z-20">
                        <span className="text-[10px] font-bold text-white shadow-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Clock size={10} /> {asset.durationMin}m
                        </span>
                   </div>

                   {/* ACTIONS - Top Højre (Kun ved hover) */}
                   <div className="absolute top-3 right-3 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-[-5px] group-hover:translate-y-0">
                       
                       {/* Add Button */}
                       <button className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-neutral-900 hover:bg-orange-500 hover:text-white shadow-md transition-colors" title="Tilføj til session">
                           <Plus size={14} strokeWidth={3} />
                       </button>

                       {/* Delete Button */}
                       {canDeleteDrill(asset) && (
                           <button 
                               onClick={(e) => handleDelete(e, asset.id!)} 
                               className="w-6 h-6 bg-neutral-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors shadow-md"
                               title="Slet"
                           >
                               {isDeleting === asset.id ? <Loader2 size={10} className="animate-spin"/> : <Trash2 size={12} />}
                           </button>
                       )}
                   </div>

                   {/* VIDEO INDICATOR (Top Højre - Skjules ved hover for at give plads til Actions) */}
                   {(hasVideo || hasYoutube) && !isHovered && (
                       <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-white flex items-center gap-1 border border-white/10 shadow-sm"><Play size={8} fill="currentColor" /> VIDEO</div>
                   )}

                   {/* 5. BOTTOM CONTENT (Titel + Intensitet) */}
                   <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end gap-2">
                        {/* Titel: UPPERCASE */}
                        <h3 className="text-sm font-black text-white uppercase leading-tight line-clamp-2 text-shadow-lg">
                            {asset.title}
                        </h3>
                        
                        {/* Intensitet: Nederst til højre */}
                        <div className={`w-3 h-3 shrink-0 rounded-full border border-white/20 shadow-lg ${intensityColor} mb-1`} title={asset.physicalLoad || 'Intensitet'}></div>
                   </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-neutral-400">
             <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6"><Search size={48} className="opacity-20 text-neutral-500" /></div>
             <h3 className="text-xl font-bold text-neutral-900 mb-2">{t.emptyState?.title ?? 'Ingen øvelser fundet'}</h3>
             <p className="text-sm max-w-xs text-center leading-relaxed opacity-80 text-neutral-500">{t.emptyState?.desc ?? 'Prøv at ændre dine filtre eller opret en ny øvelse for at komme i gang.'}</p>
             {activeTab === 'Personal' && searchQuery.length === 0 && (
                <button onClick={() => setIsCreateModalOpen(true)} className="mt-8 px-8 py-3 bg-orange-500 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20 hover:-translate-y-1">{t.createBtn || 'Opret Øvelse'}</button>
             )}
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      {isCreateModalOpen && (
        <CreateDrillModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          lang={lang}
          dict={dict}
          onSuccess={fetchAssets} 
        />
      )}
    </div>
  );
}