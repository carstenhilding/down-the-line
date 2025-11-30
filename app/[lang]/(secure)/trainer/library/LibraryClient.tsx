// app/[lang]/(secure)/trainer/library/LibraryClient.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, Filter, Plus, LayoutTemplate, 
  Globe, Shield, Users, User, 
  Zap, Activity, Clock, 
  Play, CheckCircle2, Loader2, Trash2
} from 'lucide-react';
import { DrillAsset, FourCornerTag } from '@/lib/server/libraryData';
import { DTLUser, UserRole } from '@/lib/server/data';
import CreateDrillModal from '@/components/library/CreateDrillModal';
import { getDrills, deleteDrill } from '@/lib/services/libraryService';
// NY: Vi lytter til den simulerede bruger
import { useUser } from '@/components/UserContext';

interface LibraryClientProps {
  dict: any; 
  lang: 'da' | 'en';
  user: DTLUser; // Denne er den oprindelige server-bruger (bruges til fallback)
}

type TabType = 'Global' | 'Club' | 'Personal';

export default function LibraryClient({ dict, lang, user: serverUser }: LibraryClientProps) {
  const t = useMemo(() => dict.library || {}, [dict]);
  
  // NY: Vi bruger brugeren fra context (som opdateres ved simulering)
  const { user } = useUser(); 
  // Hvis context ikke er klar (sker sjældent), bruger vi serverUser
  const currentUser = user || serverUser;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('Personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  
  const [assets, setAssets] = useState<DrillAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getDrills(activeTab, currentUser.id, currentUser.clubId);
      setAssets(data);
    } catch (error) {
      console.error("Kunne ikke hente øvelser:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentUser.id, currentUser.clubId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // --- RETTIGHEDS-TJEK (Prioriteret rækkefølge) ---
  const canDeleteDrill = (asset: DrillAsset) => {
    // 1. REGEL: DTL Global er KUN for Developers.
    //    Uanset hvem der har lavet det, må ingen andre slette her.
    if (asset.accessLevel === 'Global') {
        return currentUser.role === UserRole.Developer;
    }

    // 2. REGEL: Eget kort (Personal/Club)
    //    Hvis du har lavet det, må du slette det (medmindre det er låst i Global)
    if (asset.authorId === currentUser.id) {
        return true;
    }

    // 3. REGEL: Klub Ledelse
    //    Ledelsen må rydde op i andres kort, hvis de ligger i Klub-kataloget
    if (asset.accessLevel === 'Club' && asset.clubId === currentUser.clubId) {
        const powerRoles = [
            UserRole.ClubAdmin,
            UserRole.AcademyDirector,
            UserRole.HeadOfCoach,
            UserRole.YouthDevelopmentCoach,
            UserRole.Developer
        ];
        return powerRoles.includes(currentUser.role);
    }

    return false;
  };

  const handleDelete = async (e: React.MouseEvent, assetId: string) => {
    e.stopPropagation();
    
    if (!window.confirm(lang === 'da' ? "Er du sikker på, at du vil slette denne øvelse? Dette kan ikke fortrydes." : "Are you sure you want to delete this drill?")) {
        return;
    }

    setIsDeleting(assetId);
    const result = await deleteDrill(assetId);
    
    if (result.success) {
        setAssets(prev => prev.filter(a => a.id !== assetId));
    } else {
        alert("Fejl ved sletning.");
    }
    setIsDeleting(null);
  };

  const getTagColor = (tag: FourCornerTag) => {
    switch(tag) {
      case 'Teknisk': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Taktisk': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Fysisk': return 'bg-red-100 text-red-700 border-red-200';
      case 'Mentalt': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchTag = selectedTag === 'all';
    if (selectedTag !== 'all' && asset.tags && asset.tags.includes(selectedTag as FourCornerTag)) {
        matchTag = true;
    } else if (selectedTag !== 'all' && !asset.tags) {
        matchTag = false;
    }

    return matchSearch && matchTag;
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
              {t.subtitle ?? 'Asset Management'} • {assets.length} Assets
            </p>
          </div>
          
          <div className="flex gap-2">
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
            { id: 'Personal', label: t.tabs?.personal ?? 'Personal', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
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
        
        {isLoading ? (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        ) : filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {filteredAssets.map(asset => (
              <div key={asset.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative h-[320px]">
                
                {/* Thumbnail */}
                <div className="h-40 bg-slate-100 relative overflow-hidden shrink-0">
                   <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                        style={{ backgroundImage: `url(${asset.thumbnailUrl || '/images/tactical-analysis.jpeg'})` }}>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                   
                   {asset.isVerified && (
                     <div className="absolute top-3 left-3 bg-blue-500 text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                       <CheckCircle2 size={10} /> {t.card?.verified ?? 'Verified'}
                     </div>
                   )}

                   {/* Slet Knap (Viser kun hvis canDeleteDrill er true) */}
                   {canDeleteDrill(asset) && (
                       <button 
                         onClick={(e) => handleDelete(e, asset.id!)}
                         className="absolute top-3 right-3 bg-white/90 hover:bg-red-500 text-slate-500 hover:text-white p-1.5 rounded-full shadow-sm transition-colors z-10"
                         title="Slet øvelse"
                         disabled={isDeleting === asset.id}
                       >
                          {isDeleting === asset.id ? <Loader2 size={12} className="animate-spin"/> : <Trash2 size={12} />}
                       </button>
                   )}

                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                        <Play size={20} className="text-white fill-current ml-1" />
                      </div>
                   </div>

                   <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                      <div>
                        <p className="text-[9px] opacity-90 font-bold uppercase tracking-wider mb-0.5 bg-black/30 px-1.5 rounded w-fit backdrop-blur-sm">{asset.phase}</p>
                        <h3 className="text-sm font-bold leading-tight line-clamp-2 text-shadow-sm">{asset.title}</h3>
                      </div>
                   </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                   <div className="flex flex-wrap gap-1.5 content-start h-14 overflow-hidden">
                      {asset.tags && asset.tags.length > 0 ? asset.tags.map(tag => (
                        <span key={tag} className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getTagColor(tag)}`}>
                          {tag}
                        </span>
                      )) : <span className="text-[10px] text-slate-400 italic">Ingen tags</span>}
                   </div>

                   <div className="flex items-center gap-4 text-slate-500 border-t border-slate-100 pt-3 mt-2">
                      <div className="flex items-center gap-1.5">
                         <Clock size={14} className="text-orange-500" />
                         <span className="text-[11px] font-bold">{asset.durationMin}m</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <Users size={14} className="text-blue-500" />
                         <span className="text-[11px] font-bold">{asset.minPlayers}-{asset.maxPlayers}</span>
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto" title={asset.physicalLoad}>
                         <Activity size={14} className={`${asset.physicalLoad && asset.physicalLoad.includes('Anaerob') ? 'text-red-500' : 'text-green-500'}`} />
                         <span className="text-[11px] font-bold truncate max-w-[60px]">{asset.physicalLoad ? asset.physicalLoad.split(' ')[0] : '-'}</span>
                      </div>
                   </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex justify-between items-center shrink-0">
                   <span className="text-[10px] font-medium text-slate-400 truncate max-w-[120px]">
                     {t.card?.by ?? 'By'}: <span className="text-slate-600 font-bold">{asset.authorName}</span>
                   </span>
                   {asset.pitchSize && (
                     <span className="text-[9px] font-mono text-slate-400">
                       {asset.pitchSize.width}x{asset.pitchSize.length}m
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
             <p className="text-sm font-bold">{t.emptyState?.title ?? 'Ingen øvelser fundet'}</p>
             <p className="text-xs mt-1">{t.emptyState?.desc ?? 'Prøv at ændre dine filtre eller opret en ny.'}</p>
             {activeTab === 'Personal' && (
                <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 text-orange-500 font-bold text-xs hover:underline">
                    Opret din første øvelse her
                </button>
             )}
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      <CreateDrillModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        lang={lang}
        dict={dict}
        onSuccess={fetchAssets} 
      />
    </div>
  );
}