// app/[lang]/(secure)/trainer/library/LibraryClient.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { 
  Search, Plus, Globe, Shield, Users, User, 
  Clock, Play, Loader2, Trash2, 
  SlidersHorizontal, ChevronDown, X
} from 'lucide-react';
import { DrillAsset, DRILL_TAGS, DRILL_CATEGORIES, FourCornerTag, MainCategory, PhysicalLoadType } from '@/lib/server/libraryData';
import { DTLUser, UserRole } from '@/lib/server/data';
import CreateDrillModal from '@/components/library/CreateDrillModal';
import DrillDetailModal from '@/components/library/DrillDetailModal';
import { getDrills, deleteDrill } from '@/lib/services/libraryService';
import { useUser } from '@/components/UserContext';

interface LibraryClientProps {
  dict: any; 
  lang: 'da' | 'en';
  user: DTLUser; 
}

type TabType = 'Global' | 'Club' | 'Team' | 'Personal';

const AGE_GROUPS = [
    { label: 'U5-U8', values: ['U5+', 'U6+', 'U7+', 'U8+'] },
    { label: 'U9-U12', values: ['U9+', 'U10+', 'U11+', 'U12+'] },
    { label: 'U13-U16', values: ['U13+', 'U14+', 'U15+', 'U16+'] },
    { label: 'U17+', values: ['U17+', 'U18+', 'Senior'] }
];

const PLAYER_INTERVALS = [
    { label: '1-4', value: '1-4', min: 1, max: 4 },
    { label: '5-9', value: '5-9', min: 5, max: 9 },
    { label: '10-14', value: '10-14', min: 10, max: 14 },
    { label: '15-20', value: '15-20', min: 15, max: 20 },
    { label: '21+', value: '21+', min: 21, max: 99 }
];

const INTENSITY_GROUPS: Record<string, PhysicalLoadType[]> = {
    green: ['Aerobic – Low Intensity'],
    yellow: ['Aerobic – Moderate Intensity'],
    red: [
        'Aerobic – High Intensity',
        'Anaerobic – Sprint',
        'Anaerobic – Sprint Endurance',
        'Anaerobic – Production',
        'Anaerobic – Tolerance'
    ]
};

export default function LibraryClient({ dict, lang, user: serverUser }: LibraryClientProps) {
  const t = useMemo(() => dict.library || {}, [dict]);
  const categoriesTrans = useMemo(() => dict.categories || {}, [dict]);
  
  const { user } = useUser(); 
  const currentUser = user || serverUser;

  // --- STATES ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState<DrillAsset | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>('Global');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // --- TOP FILTERS (Single Select Hierarchy) ---
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  
  // --- BOTTOM FILTERS (Multi Select Independent) ---
  const [filterMultiTopics, setFilterMultiTopics] = useState<string[]>([]);
  const [activeFilterCorner, setActiveFilterCorner] = useState<FourCornerTag>('Technical');

  // --- OTHER FILTERS ---
  const [filterAge, setFilterAge] = useState<string[]>([]);
  const [filterPlayerCount, setFilterPlayerCount] = useState<string>('all'); 
  const [filterGK, setFilterGK] = useState<'any' | 'yes' | 'no'>('any');
  const [filterIntensity, setFilterIntensity] = useState<string[]>([]);
  const [expandedIntensityColor, setExpandedIntensityColor] = useState<string | null>(null);

  const [assets, setAssets] = useState<DrillAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null);
  
  const filterRef = useRef<HTMLDivElement>(null);
  const filterContentRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
      // Når hovedkategori ændres i toppen, nulstilles top-emnet
      setFilterTopic('all'); 
  }, [filterCategory]);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (
            filterRef.current && 
            !filterRef.current.contains(event.target as Node) &&
            filterContentRef.current &&
            !filterContentRef.current.contains(event.target as Node)
        ) {
            setIsFilterOpen(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HANDLERS ---
  const handleDelete = async (e: React.MouseEvent, assetId: string) => {
    e.stopPropagation();
    if (!window.confirm(lang === 'da' ? "Slet øvelse? Det kan ikke fortrydes." : "Delete drill? Cannot be undone.")) return;

    setIsDeleting(assetId);
    const result = await deleteDrill(assetId);
    if (result.success) {
        setAssets(prev => prev.filter(a => a.id !== assetId));
        if (selectedDrill?.id === assetId) setSelectedDrill(null);
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

  const toggleAgeGroup = (ageValues: string[]) => {
      const allSelected = ageValues.every(val => filterAge.includes(val));
      if (allSelected) {
          setFilterAge(prev => prev.filter(val => !ageValues.includes(val)));
      } else {
          setFilterAge(prev => [...Array.from(new Set([...prev, ...ageValues]))]);
      }
  };

  const toggleGK = (value: 'yes' | 'no') => {
      if (filterGK === value) {
          setFilterGK('any');
      } else {
          setFilterGK(value);
      }
  };

  const toggleIntensityColor = (color: string) => {
      if (expandedIntensityColor === color) {
          setExpandedIntensityColor(null);
      } else {
          setExpandedIntensityColor(color);
      }
  };

  const toggleSpecificLoad = (load: string) => {
      setFilterIntensity(prev => prev.includes(load) ? prev.filter(l => l !== load) : [...prev, load]);
  };

  // Uafhængig toggle for bund-panelet (Multi-select)
  const toggleMultiTopic = (subCat: string) => {
      setFilterMultiTopics(prev => 
          prev.includes(subCat) 
              ? prev.filter(t => t !== subCat) 
              : [...prev, subCat]
      );
  };

  const resetFilters = () => {
      setFilterCategory('all');
      setFilterTopic('all');
      setFilterMultiTopics([]); // Nulstil multi-select
      setFilterAge([]);
      setFilterPlayerCount('all');
      setFilterGK('any');
      setFilterIntensity([]);
      setExpandedIntensityColor(null);
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
        if (debouncedSearch.length === 0) {
            if (asset.accessLevel !== activeTab) return false;
        }

        const langMatch = asset.language ? asset.language === lang : true;
        if (!langMatch) return false;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchTitle = asset.title.toLowerCase().includes(q);
            const matchSub = asset.subCategory?.toLowerCase().includes(q);
            const matchTags = asset.tags?.some(tag => tag.toLowerCase().includes(q));

            if (!matchTitle && !matchSub && !matchTags) return false;
        }
        
        // Top Filter Logic
        if (filterCategory !== 'all' && asset.mainCategory !== filterCategory) return false;
        if (filterTopic !== 'all' && asset.subCategory !== filterTopic) return false;

        // Bottom Filter Logic (Multi-select)
        if (filterMultiTopics.length > 0) {
            // Hvis øvelsen ikke har et subCategory, eller subCategory ikke er i listen af valgte, så fjern den
            if (!asset.subCategory || !filterMultiTopics.includes(asset.subCategory)) return false;
        }

        if (filterAge.length > 0) {
            const hasAge = asset.ageGroups?.some(age => filterAge.includes(age));
            if (!hasAge) return false;
        }

        if (filterPlayerCount !== 'all') {
            const interval = PLAYER_INTERVALS.find(i => i.value === filterPlayerCount);
            if (interval) {
                const assetMin = asset.minPlayers || 0;
                const assetMax = asset.maxPlayers || 99;
                if (!(assetMin <= interval.max && assetMax >= interval.min)) {
                    return false;
                }
            }
        }

        if (filterGK !== 'any') {
            const requiresGK = asset.goalKeeper === true;
            if (filterGK === 'yes' && !requiresGK) return false;
            if (filterGK === 'no' && requiresGK) return false;
        }

        if (filterIntensity.length > 0) {
            if (!asset.physicalLoad) return false;
            if (!filterIntensity.includes(asset.physicalLoad)) return false;
        }

        return true;
    });
  }, [assets, lang, searchQuery, debouncedSearch, filterCategory, filterTopic, filterMultiTopics, filterAge, filterPlayerCount, filterGK, filterIntensity, activeTab]);

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const activeFiltersCount = (filterCategory !== 'all' ? 1 : 0) + 
                             (filterTopic !== 'all' ? 1 : 0) + 
                             (filterMultiTopics.length > 0 ? 1 : 0) + // Tæller som 1 aktivt filter uanset antal valg
                             (filterAge.length > 0 ? 1 : 0) +
                             (filterPlayerCount !== 'all' ? 1 : 0) +
                             (filterGK !== 'any' ? 1 : 0) + 
                             (filterIntensity.length > 0 ? 1 : 0);


  const getSourceBadge = (level: string) => {
      switch(level) {
          case 'Global': return { label: 'GLOBAL', color: 'bg-orange-500 text-white' };
          case 'Club': return { label: 'CLUB', color: 'bg-neutral-900 text-white' };
          case 'Team': return { label: 'TEAM', color: 'bg-white text-neutral-900 border border-neutral-900' };
          case 'Personal': return { label: 'MY', color: 'bg-neutral-900 text-orange-500 border border-orange-500/30' };
          default: return null;
      }
  };

  const getIntensityColorClass = (load: string | undefined) => {
      if (!load) return 'bg-neutral-400';
      if (load.includes('Low')) return 'bg-green-500 shadow-green-500/50';
      if (load.includes('Moderate')) return 'bg-yellow-400 shadow-yellow-400/50';
      return 'bg-red-600 shadow-red-600/50';
  };

  const translateLoad = (val: string) => t.val_load?.[val] || val;
  const translateMainCat = (cat: string) => categoriesTrans.main?.[cat] || cat;
  const translateSubCat = (sub: string) => t.val_sub?.[sub] || sub;
  const translateTag = (tag: string) => t.val_tags?.[tag] || tag;

  // --- STYLES (High Density) ---
  const labelStyle = "text-[9px] font-bold text-neutral-500 uppercase mb-1 block tracking-tight";
  const selectStyle = "text-[9px] w-full bg-neutral-50 border border-neutral-200 rounded py-1 px-2 font-bold text-neutral-900 focus:border-orange-500 outline-none appearance-none h-7 transition-colors truncate";
  
  const getBtnStyle = (isActive: boolean) => 
    `px-2 py-1 rounded-md text-[9px] font-bold border transition-all flex items-center justify-center gap-1.5 min-h-[28px] ${
        isActive 
        ? 'bg-white border-orange-500 text-orange-500 shadow-sm' 
        : 'bg-white border-neutral-200 text-neutral-500 hover:border-orange-500 hover:text-orange-600'
    }`;

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] text-neutral-900 relative">
      
      {/* --- HEADER / TOOLBAR (RESPONSIVE: COMPACT LAPTOP / SPACIOUS DESKTOP) --- */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-2 py-1.5 2xl:px-3 2xl:py-2 flex flex-col md:flex-row items-center justify-between gap-2 2xl:gap-3 shrink-0 shadow-sm isolate overflow-visible transition-all duration-300">
        
        {/* Left: Navigation Tabs */}
        <div className={`flex items-center w-full md:w-auto overflow-x-auto no-scrollbar transition-opacity duration-200 ${searchQuery.length > 0 && window.innerWidth < 768 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex bg-neutral-100 rounded-md 2xl:rounded-lg p-0.5 2xl:p-1 shrink-0 w-full md:w-auto justify-between md:justify-start gap-0.5 2xl:gap-1">
                {[
                    { id: 'Global', label: t.lbl_vis_global || 'Global', icon: Globe },
                    { id: 'Club', label: t.lbl_vis_club || 'Club', icon: Shield },
                    { id: 'Team', label: t.lbl_vis_team || 'Team', icon: Users },
                    { id: 'Personal', label: t.lbl_vis_personal || 'My Drills', icon: User },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`
                            flex-1 md:flex-none flex items-center justify-center gap-1.5 2xl:gap-2 
                            px-2.5 py-1 2xl:px-3 2xl:py-1.5 
                            rounded 2xl:rounded-md 
                            text-[10px] 2xl:text-xs font-bold uppercase tracking-wider 
                            transition-all whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'bg-white text-orange-600 shadow-sm ring-1 ring-neutral-200' 
                                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50'
                            }
                        `}
                    >
                        <tab.icon className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Right: Actions (Search + Filter + Create) */}
        <div className="flex items-center gap-1.5 2xl:gap-2 w-full md:w-auto relative z-50 justify-end">
            
            {/* Search Input (Responsive Width) */}
            <div className="relative flex-1 md:flex-none md:w-36 lg:w-48 2xl:w-64 group transition-all duration-300">
                <Search className={`absolute left-2.5 2xl:left-3 top-1/2 -translate-y-1/2 transition-colors w-3 h-3 2xl:w-3.5 2xl:h-3.5 ${searchQuery.length > 0 ? 'text-orange-500' : 'text-neutral-400'}`} />
                <input 
                    type="text" 
                    placeholder={t.searchPlaceholder ?? 'Search...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`
                        w-full 
                        pl-7 pr-2 py-1 2xl:pl-9 2xl:pr-3 2xl:py-1.5 
                        bg-neutral-50 border rounded-md 2xl:rounded-lg 
                        text-[10px] 2xl:text-xs font-bold text-neutral-900 
                        focus:outline-none focus:ring-1 transition-all placeholder:text-neutral-400 
                        ${searchQuery.length > 0 ? 'border-orange-500 ring-orange-500' : 'border-neutral-200 focus:border-orange-500 focus:ring-orange-500'}
                    `}
                />
            </div>

            {/* ADVANCED FILTER BUTTON */}
            <div className={`relative ${isFilterOpen ? 'z-40' : ''}`} ref={filterRef}>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`
                        flex items-center gap-1.5 2xl:gap-2 
                        px-2.5 py-1 2xl:px-3 2xl:py-1.5 
                        rounded-md 2xl:rounded-lg border transition-all 
                        text-[10px] 2xl:text-xs font-bold uppercase tracking-wide whitespace-nowrap 
                        ${isFilterOpen || activeFiltersCount > 0 ? 'bg-black border-black text-white' : 'bg-white border-neutral-200 text-neutral-500 hover:border-orange-500 hover:text-orange-600'}
                    `}
                >
                    <SlidersHorizontal className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" color={isFilterOpen || activeFiltersCount > 0 ? '#f97316' : 'currentColor'} />
                    <span className="hidden sm:inline">{t.mod_btn_filter || 'Filter'}</span>
                    {activeFiltersCount > 0 && (
                        <span className="bg-orange-500 text-white text-[9px] w-3.5 h-3.5 2xl:w-4 2xl:h-4 flex items-center justify-center rounded-full ml-0.5">{activeFiltersCount}</span>
                    )}
                </button>

                {/* MEGA FILTER POPOVER */}
                {isFilterOpen && (
                    <div className="absolute top-full right-0 mt-2 w-[90vw] sm:w-[400px] md:w-[620px] bg-white border border-neutral-200 rounded-xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 overflow-hidden flex flex-col max-h-[85vh]">
                        
                        <div className="p-4 flex flex-col md:flex-row gap-4 h-full overflow-hidden" ref={filterContentRef}>
                            <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1 min-w-[200px]">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="col-span-1">
                                        <label className={labelStyle}>{t.lbl_main_category || 'Kategori'}</label>
                                        <div className="relative">
                                            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={selectStyle}>
                                                <option value="all">{t.lbl_all_categories || 'Alle'}</option>
                                                {Object.keys(DRILL_CATEGORIES).map(cat => (
                                                    <option key={cat} value={cat}>{translateMainCat(cat)}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label className={labelStyle}>{t.lbl_sub_category || 'Emne'}</label>
                                        <div className="relative">
                                            <select 
                                                value={filterTopic} 
                                                onChange={(e) => setFilterTopic(e.target.value)} 
                                                disabled={filterCategory === 'all'}
                                                className={`${selectStyle} ${filterCategory === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <option value="all">{t.lbl_all || 'Alle'}</option>
                                                {filterCategory !== 'all' && DRILL_CATEGORIES[filterCategory as MainCategory]?.map((sub: string) => (
                                                    <option key={sub} value={sub}>{translateSubCat(sub)}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="col-span-2 mt-1">
                                        <label className={labelStyle}>{t.lbl_players || 'Spillere'}</label>
                                        <div className="relative">
                                            <select value={filterPlayerCount} onChange={(e) => setFilterPlayerCount(e.target.value)} className={selectStyle}>
                                                <option value="all">{t.lbl_all || 'Alle'}</option>
                                                {PLAYER_INTERVALS.map(interval => (
                                                    <option key={interval.value} value={interval.value}>{interval.label}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-neutral-100"></div>

                                <div className="space-y-3">
                                    <div>
                                        <label className={labelStyle}>{t.lbl_age || 'Aldersgrupper'}</label>
                                        <div className="flex flex-wrap gap-1">
                                            {AGE_GROUPS.map((group) => {
                                                const isSelected = group.values.every(v => filterAge.includes(v));
                                                return (
                                                    <button 
                                                        key={group.label}
                                                        onClick={() => toggleAgeGroup(group.values)}
                                                        className={getBtnStyle(isSelected)}
                                                    >
                                                        {group.label}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelStyle}>{t.lbl_goalkeeper || 'Keeper'}</label>
                                        <div className="flex gap-2">
                                            <button onClick={() => toggleGK('yes')} className={getBtnStyle(filterGK === 'yes')}>{t.lbl_yes || 'JA'}</button>
                                            <button onClick={() => toggleGK('no')} className={getBtnStyle(filterGK === 'no')}>{t.lbl_no || 'NEJ'}</button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelStyle}>{t.lbl_physical_load || 'Fysisk Belastning'}</label>
                                        <div className="flex flex-wrap gap-1">
                                            <button onClick={() => toggleIntensityColor('green')} className={getBtnStyle(expandedIntensityColor === 'green' || INTENSITY_GROUPS.green.some(l => filterIntensity.includes(l)))}>
                                                <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div> {t.int_low || 'Lav'}
                                            </button>
                                            <button onClick={() => toggleIntensityColor('yellow')} className={getBtnStyle(expandedIntensityColor === 'yellow' || INTENSITY_GROUPS.yellow.some(l => filterIntensity.includes(l)))}>
                                                <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5"></div> {t.int_medium || 'Middel'}
                                            </button>
                                            <button onClick={() => toggleIntensityColor('red')} className={getBtnStyle(expandedIntensityColor === 'red' || INTENSITY_GROUPS.red.some(l => filterIntensity.includes(l)))}>
                                                <div className="w-2 h-2 rounded-full bg-red-600 mr-1.5"></div> {t.int_high || 'Høj'}
                                            </button>
                                        </div>
                                        
                                        {expandedIntensityColor && (
                                            <div className="mt-1.5 p-1.5 bg-neutral-50 rounded border border-neutral-100 animate-in slide-in-from-top-1 w-full">
                                                <div className="flex flex-wrap gap-1">
                                                    {INTENSITY_GROUPS[expandedIntensityColor].map(loadType => {
                                                        const isSelected = filterIntensity.includes(loadType);
                                                        return (
                                                            <button key={loadType} onClick={() => toggleSpecificLoad(loadType)} className={getBtnStyle(isSelected)}>{translateLoad(loadType)}</button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:flex flex-1 flex-col bg-neutral-50 rounded-lg border border-neutral-100 overflow-hidden min-w-[240px]">
                                <div className="flex border-b border-neutral-100 bg-white">
                                    {['Technical', 'Tactical', 'Physical', 'Mental'].map(corner => (
                                        <button
                                            key={corner}
                                            onClick={() => setActiveFilterCorner(corner as FourCornerTag)}
                                            className={`flex-1 py-1.5 text-[8px] font-bold uppercase transition-all ${activeFilterCorner === corner ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/50' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'}`}
                                        >
                                            {translateTag(corner)}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                                    {DRILL_TAGS[activeFilterCorner] ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {Object.keys(DRILL_TAGS[activeFilterCorner]).map((subCat) => {
                                                // Nu bruger vi multi-select arrayet
                                                const isSelected = filterMultiTopics.includes(subCat);
                                                return (
                                                    <button key={subCat} onClick={() => toggleMultiTopic(subCat)} className={getBtnStyle(isSelected)}>{translateSubCat(subCat)}</button>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-[9px] text-neutral-400 italic text-center mt-10">Ingen emner fundet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-2 border-t border-neutral-100 flex justify-between items-center bg-white shrink-0">
                            <div className="flex gap-3 items-center">
                                <button onClick={resetFilters} className="text-[9px] text-neutral-400 hover:text-orange-500 font-bold uppercase tracking-wide flex items-center gap-1 transition-colors">
                                    <X size={10} /> {t.mod_btn_cancel || 'Nulstil'}
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-medium text-neutral-400">{filteredAssets.length} {t.results_found || 'resultater'}</span>
                                <button onClick={() => setIsFilterOpen(false)} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wide transition-colors">{t.btn_show_results || 'Vis'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Button */}
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-black hover:bg-neutral-900 text-white px-2.5 py-1 2xl:px-4 2xl:py-1.5 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-1.5 2xl:gap-2 group relative z-10 whitespace-nowrap"
            >
                <Plus className="w-3 h-3 2xl:w-4 2xl:h-4 text-orange-500 group-hover:scale-110 transition-transform" strokeWidth={3} />
                <span className="hidden sm:inline text-[10px] 2xl:text-xs font-black uppercase tracking-wider">{t.createBtn ?? 'Create'}</span>
            </button>
        </div>
      </div>

      {/* --- GRID CONTENT (HIGH DENSITY) --- */}
      <div className="flex-1 overflow-y-auto p-2 lg:p-2 custom-scrollbar">
        
        {debouncedSearch.length > 0 && !isLoading && (
            <div className="mb-2 flex items-center gap-2 px-1 animate-in fade-in slide-in-from-top-2">
                <span className="text-[10px] font-bold uppercase text-neutral-400">Resultater:</span>
                <span className="text-xs font-black text-neutral-900">"{debouncedSearch}"</span>
                <span className="text-[9px] font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full ml-auto">
                    {filteredAssets.length} fundet
                </span>
            </div>
        )}

        {isLoading ? (
            <div className="flex h-full items-center justify-center flex-col gap-3">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                <p className="text-neutral-400 text-[10px] font-mono animate-pulse uppercase tracking-wider">
                    {debouncedSearch.length > 0 ? 'Searching...' : 'Loading Drills...'}
                </p>
            </div>
        ) : filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3 pb-20">
            {filteredAssets.map(asset => {
              const isHovered = hoveredAssetId === asset.id;
              const hasVideo = asset.mediaType === 'video' && asset.videoUrl;
              const hasYoutube = asset.mediaType === 'youtube' && asset.youtubeUrl;
              const isPlaceholder = asset.thumbnailUrl === '/images/tactical-analysis.jpeg';
              const bgImage = ( (hasVideo || hasYoutube) && isPlaceholder ) 
                  ? '/images/grass-texture-seamless.jpg' 
                  : (asset.thumbnailUrl || '/images/grass-texture-seamless.jpg');
              
              const sourceBadge = getSourceBadge(asset.accessLevel);
              const intensityColor = getIntensityColorClass(asset.physicalLoad);

              return (
                <div 
                    key={asset.id} 
                    className="group relative aspect-video bg-neutral-100 rounded-lg overflow-hidden cursor-pointer border border-neutral-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:z-10"
                    onMouseEnter={() => setHoveredAssetId(asset.id!)}
                    onMouseLeave={() => setHoveredAssetId(null)}
                    onClick={() => setSelectedDrill(asset)}
                >
                   {/* MEDIA */}
                   {hasVideo && isHovered ? (
                       <video src={asset.videoUrl} autoPlay muted loop className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-500" />
                   ) : hasYoutube && isHovered ? (
                       <div className="absolute inset-0 bg-black">
                           <iframe className="w-full h-full pointer-events-none scale-[1.3]" src={`https://www.youtube.com/embed/${getYouTubeID(asset.youtubeUrl!)}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&loop=1&playlist=${getYouTubeID(asset.youtubeUrl!)}`} allow="autoplay; encrypted-media"></iframe>
                       </div>
                   ) : (
                       <img src={bgImage} alt={asset.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-100" onError={(e) => { e.currentTarget.src = '/images/grass-texture-seamless.jpg'; }} />
                   )}

                   {/* OVERLAY */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>

                   {/* BADGES */}
                   <div className="absolute top-2 left-2 z-20 flex flex-col items-start gap-1">
                        {searchQuery.length > 0 && sourceBadge && (
                            <div className={`text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm ${sourceBadge.color}`}>
                                {sourceBadge.label}
                            </div>
                        )}
                        <span className="text-[9px] font-bold text-white shadow-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Clock size={10} /> {asset.durationMin}m
                        </span>
                   </div>

                   {/* ACTIONS (Hover) */}
                   <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-30 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-[-5px] group-hover:translate-y-0">
                       <button 
                           onClick={(e) => { e.stopPropagation(); }} 
                           className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-neutral-900 hover:bg-orange-500 hover:text-white shadow-md transition-colors" 
                           title="Add"
                       >
                           <Plus size={12} strokeWidth={3} />
                       </button>
                       {canDeleteDrill(asset) && (
                           <button 
                               onClick={(e) => handleDelete(e, asset.id!)} 
                               className="w-5 h-5 bg-neutral-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors shadow-md"
                           >
                               {isDeleting === asset.id ? <Loader2 size={10} className="animate-spin"/> : <Trash2 size={10} />}
                           </button>
                       )}
                   </div>

                   {/* VIDEO INDICATOR */}
                   {(hasVideo || hasYoutube) && !isHovered && (
                       <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold text-white flex items-center gap-1 border border-white/10 shadow-sm"><Play size={6} fill="currentColor" /></div>
                   )}

                   {/* BOTTOM INFO */}
                   <div className="absolute bottom-0 left-0 right-0 p-2.5 flex justify-between items-end gap-2">
                        <h3 className="text-[10px] sm:text-[11px] font-black text-white uppercase leading-tight line-clamp-2 text-shadow-lg">
                            {asset.title}
                        </h3>
                        <div className={`w-2.5 h-2.5 shrink-0 rounded-full border border-white/20 shadow-lg ${intensityColor} mb-0.5`} title={asset.physicalLoad || 'Intensitet'}></div>
                   </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-neutral-400">
             <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4"><Search size={32} className="opacity-20 text-neutral-500" /></div>
             <p className="text-xs font-bold text-neutral-500 opacity-60">Ingen øvelser fundet.</p>
             {activeTab === 'Personal' && searchQuery.length === 0 && (
                <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg hover:-translate-y-0.5">{t.createBtn || 'Opret'}</button>
             )}
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      {isCreateModalOpen && (
        <CreateDrillModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          lang={lang}
          dict={dict}
          onSuccess={fetchAssets} 
        />
      )}

      <DrillDetailModal 
          drill={selectedDrill} 
          isOpen={!!selectedDrill} 
          onClose={() => setSelectedDrill(null)} 
          lang={lang}
      />
    </div>
  );
}