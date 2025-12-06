// components/library/CreateDrillModal.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, Save, Upload, Activity, Users, Target, Plus, Trash2, Shirt, 
  Cone, Image as ImageIcon, Video, Youtube, Link as LinkIcon, 
  Minus, Trophy, TrendingUp, TrendingDown, PackagePlus, Calculator,
  Megaphone, PauseOctagon, ListChecks, ChevronRight, BarChart3,
  Brain, Zap, User, TrafficCone, GitPullRequestArrow, Dumbbell, Lock, Info,
  Ruler, Shield, Globe, User as UserIcon, Star, Check, PenTool, LayoutTemplate,
  Loader2, Play, MonitorPlay, RefreshCw, Edit2, Film, MousePointer2, ArrowRight,
  Monitor, Maximize2, Move, Globe2
} from 'lucide-react';
import { 
    DrillAsset, 
    PhysicalLoadType, 
    FourCornerTag, 
    TeamSetup, 
    DRILL_CATEGORIES, 
    MainCategory, 
    MaterialItem, 
    GamePhase,
    DRILL_TAGS 
} from '@/lib/server/libraryData';
import { createDrill } from '@/lib/services/libraryService';
import { uploadFile } from '@/lib/services/storageService';
import { useUser } from '@/components/UserContext';
import imageCompression from 'browser-image-compression';
import { UserRole } from '@/lib/server/data';
import { secureI18n } from '@/i18n/secure';

interface CreateDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'da' | 'en';
  dict: any; 
  onSuccess?: () => void;
}

const AGE_OPTIONS = [
    'U5+', 'U6+', 'U7+', 'U8+', 'U9+', 'U10+', 'U11+', 'U12+', 
    'U13+', 'U14+', 'U15+', 'U16+', 'U17+', 'U18+'
];

const EQUIPMENT_KEYS = [
    'eq_balls', 'eq_cones', 'eq_bibs', 'eq_flatmarkers', 'eq_mannequin', 
    'eq_goal_small', 'eq_goal_large', 'eq_bands', 'eq_ladder', 'eq_hurdles', 'eq_poles'
];

const COLOR_ITEMS = ['eq_cones', 'eq_flatmarkers', 'eq_bibs'];

const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const isVideoUrl = (url: string) => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.mov') || url.includes('video');
};

interface LocalizedDrillData {
    title: string;
    description: string;
    rules: string[];
    coachingPoints: {
        instruction: string;
        keyPoints: string[];
    };
    stopFreeze: string;
    progression: string[];
    regression: string[];
    gamification: string;
}

const emptyLocalizedData: LocalizedDrillData = {
    title: '',
    description: '',
    rules: ['', '', ''],
    coachingPoints: { instruction: '', keyPoints: ['', '', ''] },
    stopFreeze: '',
    progression: [''],
    regression: [''],
    gamification: ''
};

export default function CreateDrillModal({ isOpen, onClose, lang, dict, onSuccess }: CreateDrillModalProps) {
  if (!isOpen) return null;
  const { user } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentLang, setCurrentLang] = useState<'da' | 'en'>(lang);
  const t = (secureI18n[currentLang]?.library || dict?.library || {}) as any;

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'practical' | 'data' | 'media'>('practical');
  const [activeModal, setActiveModal] = useState<'none' | 'studio' | 'upload' | 'youtube'>('none');

  const [localGallery, setLocalGallery] = useState<string[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [zoomedAsset, setZoomedAsset] = useState<string | null>(null);

  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState<MaterialItem>({ name: 'eq_balls', count: 1, details: '' });
  const [customMaterialName, setCustomMaterialName] = useState('');
  
  const [tempYoutubeLink, setTempYoutubeLink] = useState('');

  const [activeCorner, setActiveCorner] = useState<FourCornerTag>('Technical');
  const [activeSubCat, setActiveSubCat] = useState<string>(''); 

  const [teams, setTeams] = useState<TeamSetup[]>([
      { name: '', playerCount: 4, color: 'orange' },
      { name: '', playerCount: 4, color: 'white' }
  ]);

  const [textData, setTextData] = useState<{ da: LocalizedDrillData, en: LocalizedDrillData }>({
      da: { ...emptyLocalizedData },
      en: { ...emptyLocalizedData }
  });

  const [formData, setFormData] = useState<Partial<DrillAsset>>({
    mainCategory: 'technical', 
    subCategory: 'Passing',
    phase: '', 
    primaryTheme: '',
    secondaryTheme: '',
    durationMin: undefined,
    minPlayers: undefined,
    maxPlayers: undefined,
    workDuration: undefined,
    restDuration: undefined,
    pitchSize: { width: undefined as any, length: undefined as any },
    ageGroups: [],
    physicalLoad: 'Aerobic – Moderate Intensity',
    rpe: 5, 
    accessLevel: 'Personal', // Standard fallback, opdateres af useEffect
    tags: [],
    materials: [],
    mediaType: 'image', 
    gamification: '',
    goalKeeper: false,
    language: lang 
  });

  const isPremium = ['Complete', 'Elite', 'Enterprise'].includes(user?.subscriptionLevel || '');
  const isDtlEmployee = user?.role === UserRole.Developer; 

  // NYT: Hent sidst valgte bibliotek fra LocalStorage når modalen åbner
  useEffect(() => {
    const lastUsedLibrary = localStorage.getItem('DTL_LAST_LIBRARY_CHOICE');
    if (lastUsedLibrary && ['Global', 'Club', 'Team', 'Personal'].includes(lastUsedLibrary)) {
        // Hvis brugeren ikke har adgang til Global (kun developers), skal vi ikke sætte den, selvom den er gemt
        if (lastUsedLibrary === 'Global' && !isDtlEmployee) {
            setFormData(prev => ({ ...prev, accessLevel: 'Personal' }));
        } else {
            setFormData(prev => ({ ...prev, accessLevel: lastUsedLibrary as any }));
        }
    }
  }, [isDtlEmployee]);

  useEffect(() => {
      if (formData.thumbnailUrl && !localGallery.includes(formData.thumbnailUrl)) {
          setLocalGallery(prev => [...prev, formData.thumbnailUrl!]);
      }
  }, [formData.thumbnailUrl]);

  useEffect(() => {
     if (!DRILL_TAGS || !DRILL_TAGS[activeCorner]) return;
     const subCats = Object.keys(DRILL_TAGS[activeCorner]);
     if (!subCats.includes(activeSubCat)) {
         if (subCats.length > 0) setActiveSubCat(subCats[0]);
     }
  }, [activeCorner, activeSubCat]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
      setDraggedItemIndex(index);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
      (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
      setDraggedItemIndex(null);
      (e.target as HTMLElement).style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedItemIndex === null || draggedItemIndex === index) return;
      const newGallery = [...localGallery];
      const draggedItem = newGallery[draggedItemIndex];
      newGallery.splice(draggedItemIndex, 1);
      newGallery.splice(index, 0, draggedItem);
      setLocalGallery(newGallery);
      setDraggedItemIndex(index);
  };

  const translateVal = (value: string, type: 'sub' | 'load' | 'tag') => {
     if (currentLang === 'en') return value; 
     const activeDict = (secureI18n[currentLang]?.library || {}) as any; 
     if (type === 'sub' && activeDict.val_sub) return activeDict.val_sub[value] || value;
     if (type === 'load' && activeDict.val_load) return activeDict.val_load[value] || value;
     if (type === 'tag' && activeDict.val_tags) return activeDict.val_tags[value] || value;
     return value;
  };

  const getTrans = (type: 'main' | 'sub', key: string) => {
      const currentCats = (secureI18n[currentLang]?.categories?.main || {}) as any; 
      const map: Record<string, string> = {
          'general': currentCats.general || 'Generel',
          'warmup': currentCats.warmup || 'Opvarmning',
          'technical': currentCats.technical || 'Teknisk',
          'tactical': currentCats.tactical || 'Taktisk',
          'game_forms': currentCats.game_forms || 'Spilformer',
          'physical': currentCats.physical || 'Fysisk',
          'mental': currentCats.mental || 'Mental',
          'goalkeeper': currentCats.goalkeeper || 'Keepertræning',
          'set_pieces': currentCats.set_pieces || 'Standardsituationer'
      };
      return map[key] || key;
  };

  const handleMainCategoryChange = (newCategory: MainCategory) => {
      const subCategories = DRILL_CATEGORIES[newCategory];
      setFormData({
          ...formData,
          mainCategory: newCategory,
          subCategory: subCategories ? subCategories[0] : ''
      });
  };

  const updateText = (field: keyof LocalizedDrillData, value: any) => {
      setTextData(prev => ({
          ...prev,
          [currentLang]: {
              ...prev[currentLang],
              [field]: value
          }
      }));
  };

  const updateRule = (index: number, value: string) => {
      const newRules = [...textData[currentLang].rules];
      newRules[index] = value;
      updateText('rules', newRules);
  };
  const addRule = () => updateText('rules', [...textData[currentLang].rules, '']);
  const removeRule = (index: number) => updateText('rules', textData[currentLang].rules.filter((_, i) => i !== index));

  const updateKeyPoint = (index: number, value: string) => {
      const currentPoints = [...textData[currentLang].coachingPoints.keyPoints];
      currentPoints[index] = value;
      updateText('coachingPoints', { ...textData[currentLang].coachingPoints, keyPoints: currentPoints });
  };
  const addKeyPoint = () => {
      const currentPoints = [...textData[currentLang].coachingPoints.keyPoints, ''];
      updateText('coachingPoints', { ...textData[currentLang].coachingPoints, keyPoints: currentPoints });
  };
  const removeKeyPoint = (index: number) => {
      const currentPoints = textData[currentLang].coachingPoints.keyPoints.filter((_, i) => i !== index);
      updateText('coachingPoints', { ...textData[currentLang].coachingPoints, keyPoints: currentPoints });
  };
  const updateInstruction = (val: string) => {
      updateText('coachingPoints', { ...textData[currentLang].coachingPoints, instruction: val });
  };

  const updateProgression = (index: number, value: string) => {
      const newItems = [...textData[currentLang].progression];
      newItems[index] = value;
      updateText('progression', newItems);
  };
  const addProgression = () => updateText('progression', [...textData[currentLang].progression, '']);
  const removeProgression = (index: number) => updateText('progression', textData[currentLang].progression.filter((_, i) => i !== index));

  const updateRegression = (index: number, value: string) => {
      const newItems = [...textData[currentLang].regression];
      newItems[index] = value;
      updateText('regression', newItems);
  };
  const addRegression = () => updateText('regression', [...textData[currentLang].regression, '']);
  const removeRegression = (index: number) => updateText('regression', textData[currentLang].regression.filter((_, i) => i !== index));

  const handleAgeChange = (val: string) => { setFormData({ ...formData, ageGroups: [val] }); };

  const openMaterialModal = () => {
      setNewMaterial({ name: 'eq_balls', count: 1, details: '' });
      setCustomMaterialName('');
      setIsMaterialModalOpen(true);
  };
  const saveMaterialFromModal = () => {
      const finalName = newMaterial.name === 'eq_other' ? customMaterialName : newMaterial.name;
      if (!finalName.trim()) return;
      setFormData(prev => ({ ...prev, materials: [...(prev.materials || []), { ...newMaterial, name: finalName }] }));
      setIsMaterialModalOpen(false);
  };
  const removeMaterial = (index: number) => setFormData(prev => ({ ...prev, materials: (prev.materials || []).filter((_, i) => i !== index) }));

  const toggleDetailedTag = (tag: string) => {
      setFormData(prev => {
          const currentTags = prev.tags || [];
          if (currentTags.includes(tag)) {
              return { ...prev, tags: currentTags.filter(t => t !== tag) };
          } else {
              return { ...prev, tags: [...currentTags, tag] };
          }
      });
  };

  const getIntensityLevel = (load: PhysicalLoadType | undefined) => {
      if (!load) return 'yellow';
      if (load.includes('Low')) return 'green'; 
      if (load.includes('Moderate')) return 'yellow';
      return 'red'; 
  };

  const setIntensityByColor = (color: 'green' | 'yellow' | 'red') => {
      let newLoad: PhysicalLoadType = 'Aerobic – Moderate Intensity';
      let newRPE = 5;
      if (color === 'green') { newLoad = 'Aerobic – Low Intensity'; newRPE = 3; } 
      else if (color === 'yellow') { newLoad = 'Aerobic – Moderate Intensity'; newRPE = 6; } 
      else if (color === 'red') { newLoad = 'Aerobic – High Intensity'; newRPE = 9; }
      setFormData({ ...formData, physicalLoad: newLoad, rpe: newRPE });
  };

  const handleLoadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLoad = e.target.value as PhysicalLoadType;
      let newRPE = formData.rpe || 5;
      if (newLoad.includes('Low')) newRPE = 3;
      else if (newLoad.includes('Moderate')) newRPE = 6;
      else if (newLoad.includes('High')) newRPE = 8;
      else if (newLoad.includes('Anaerobic')) newRPE = 9; 
      if (newLoad.includes('Production') || newLoad.includes('Tolerance')) newRPE = 10; 
      setFormData({ ...formData, physicalLoad: newLoad, rpe: newRPE });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.mov')) {
        if (file.size > 50 * 1024 * 1024) return alert("Videoen er for stor (Max 50MB)");
        setIsUploading(true);
        try {
            const url = await uploadFile(file, 'drills/videos');
            if (url) {
                setFormData(prev => ({ ...prev, videoUrl: url, mediaType: 'video' }));
                setLocalGallery(prev => [...prev, url]); 
                setActiveModal('none'); 
            }
        } catch(e) { console.error(e); alert('Fejl ved upload af video'); }
        finally { setIsUploading(false); }
        return;
    }

    if (file.size > 5 * 1024 * 1024) return alert("Billedet er for stort (Max 5MB)");
    setIsUploading(true);
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const url = await uploadFile(compressedFile, 'drills/images');
      if (url) {
          setLocalGallery(prev => [...prev, url]);
          if (!formData.thumbnailUrl && formData.mediaType !== 'video') {
              setFormData(prev => ({ ...prev, thumbnailUrl: url, mediaType: 'image' }));
          }
          setActiveModal('none'); 
      }
    } catch (error) { console.error(error); alert("Fejl under upload."); } 
    finally { setIsUploading(false); }
  };

  const handleAddYoutube = () => {
      const id = getYouTubeID(tempYoutubeLink);
      if (id) {
          const thumb = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
          setFormData({ ...formData, youtubeUrl: tempYoutubeLink, mediaType: 'youtube', thumbnailUrl: thumb });
          setLocalGallery(prev => [...prev, thumb]);
          setActiveModal('none');
          setTempYoutubeLink('');
      } else { alert("Ugyldigt YouTube link"); }
  };

  const handleSetCover = (url: string) => {
      if (isVideoUrl(url)) { 
          setFormData(prev => ({ ...prev, videoUrl: url, mediaType: 'video' })); 
      } 
      else { 
          setFormData(prev => {
             if (prev.mediaType === 'video' || prev.videoUrl) {
                 return { ...prev, thumbnailUrl: url };
             }
             return { ...prev, thumbnailUrl: url, mediaType: 'image', videoUrl: undefined };
          });
      }
  };

  const handleDeleteMedia = (url: string) => {
      setLocalGallery(prev => prev.filter(i => i !== url));
      if (formData.thumbnailUrl === url) { setFormData(prev => ({ ...prev, thumbnailUrl: undefined })); }
      if (formData.videoUrl === url) { setFormData(prev => ({ ...prev, videoUrl: undefined })); }
  };

  const handleStudioAction = (action: 'create' | 'import-image' | 'import-animation') => {
      setActiveModal('none'); 
      if (action === 'create') {
          router.push(`/${currentLang}/trainer/studio`);
      } else if (action === 'import-image') {
          let mockUrl = "/images/tactical-analysis.jpeg"; 
          alert("Importing from Library...");
          setLocalGallery(prev => [...prev, mockUrl]);
          if (!formData.thumbnailUrl) { setFormData(prev => ({ ...prev, thumbnailUrl: mockUrl, mediaType: 'image' })); }
      } else if (action === 'import-animation') {
          let mockUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; 
          alert("Importing Animation...");
          setLocalGallery(prev => [...prev, mockUrl]);
          setFormData(prev => ({ ...prev, videoUrl: mockUrl, mediaType: 'video', thumbnailUrl: undefined }));
      }
  };
  
  const addTeam = () => setTeams([...teams, { name: '', playerCount: 2, color: 'black' }]);
  const removeTeam = (index: number) => setTeams(teams.filter((_, i) => i !== index));
  const updateTeam = (index: number, field: keyof TeamSetup, value: any) => {
      const newTeams = [...teams];
      newTeams[index] = { ...newTeams[index], [field]: value };
      setTeams(newTeams);
  };

  const calculatePitchData = () => {
    if (!formData.pitchSize?.width || !formData.pitchSize?.length || !formData.maxPlayers) return null;
    const area = formData.pitchSize.width * formData.pitchSize.length;
    const m2PerPlayer = Math.round(area / formData.maxPlayers);
    const maxScale = 300; 
    const percentage = Math.min((m2PerPlayer / maxScale) * 100, 100);
    let intensityHint = '';
    if (m2PerPlayer < 80) { intensityHint = t.hint_high_intensity || 'HØJ INTENSITET'; } 
    else if (m2PerPlayer > 150) { intensityHint = t.hint_endurance || 'UDHOLDENHED'; } 
    else { intensityHint = t.hint_moderate || 'MODERAT'; }
    return { m2PerPlayer, intensityHint, percentage };
  };

  const pitchData = calculatePitchData();

  const handleSave = async () => {
    const currentTitle = textData[currentLang].title;
    if (!currentTitle) return alert(t.ph_title || "Titel mangler!");

    setIsSaving(true);
    try {
      const currentText = textData[currentLang];
      const cleanProgression = (currentText.progression || []).filter(s => s.trim() !== '');
      const cleanRegression = (currentText.regression || []).filter(s => s.trim() !== '');
      const cleanKeyPoints = (currentText.coachingPoints?.keyPoints || []).filter(s => s.trim() !== '');
      
      const newDrill: DrillAsset = {
        ...formData as DrillAsset, 
        
        title: currentText.title,
        description: currentText.description,
        rules: currentText.rules,
        coachingPoints: {
            instruction: currentText.coachingPoints.instruction,
            keyPoints: cleanKeyPoints
        },
        stopFreeze: currentText.stopFreeze,
        progression: cleanProgression,
        regression: cleanRegression,
        gamification: currentText.gamification,

        authorId: user?.id || 'unknown',
        authorName: user?.name || 'Ukendt Træner',
        clubId: user?.clubId,
        teamId: user?.teamId,
        createdAt: new Date(),
        thumbnailUrl: formData.thumbnailUrl || '/images/tactical-analysis.jpeg', 
        mediaType: formData.mediaType || 'image',
        durationMin: formData.durationMin || 0,
        workDuration: formData.workDuration || 0,
        restDuration: formData.restDuration || 0,
        minPlayers: formData.minPlayers || 0,
        maxPlayers: formData.maxPlayers || 0,
        pitchSize: { width: formData.pitchSize?.width || 0, length: formData.pitchSize?.length || 0 },
        setup: teams,
        goalKeeper: formData.goalKeeper,
        language: currentLang 
      };
      
      const result = await createDrill(newDrill);
      
      if (result.success) { 
          // NYT: Gem det valgte bibliotek i localStorage
          if (formData.accessLevel) {
              localStorage.setItem('DTL_LAST_LIBRARY_CHOICE', formData.accessLevel);
          }

          if (onSuccess) onSuccess(); 
          if (isDtlEmployee) {
              const savedLang = currentLang === 'da' ? 'Dansk' : 'Engelsk';
              alert(`Øvelse gemt som ${savedLang}!\n\nDu kan nu skifte sprog i toppen, rette titlen/teksten og gemme igen for at oprette den anden version.`);
              setFormData(prev => ({ ...prev, id: undefined }));
          } else {
              onClose(); 
          }
      } else { 
          alert("Fejl ved gemning."); 
      }
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const getColorClass = (color: string) => {
      switch(color) {
          case 'orange': return 'bg-orange-500'; 
          case 'red': return 'bg-red-500'; case 'blue': return 'bg-blue-600'; case 'green': return 'bg-green-500'; case 'yellow': return 'bg-yellow-400'; case 'white': return 'bg-white border border-gray-300'; case 'black': return 'bg-black'; default: return 'bg-gray-400';
      }
  };

  const inputClass = "w-full px-2 py-1 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-neutral-400";
  const textareaClass = "w-full px-2 py-1.5 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-neutral-400 min-h-[60px] resize-y";
  const boxBaseClass = "bg-white border border-neutral-200 rounded-lg p-3 shadow-sm border-l-4";
  const boxClassBlack = `${boxBaseClass} border-l-neutral-900`; 
  const boxClassOrange = `${boxBaseClass} border-l-orange-500`;
  const paramBoxClass = "bg-white border border-neutral-200 rounded-lg p-1.5 flex flex-col items-center justify-center shadow-sm border-l-4 border-l-neutral-900";
  const boxLabelClass = "text-[9px] font-black text-neutral-800 uppercase tracking-wider mb-0.5 text-center w-full";
  const boxInputClass = "w-full text-center bg-neutral-50 border border-neutral-200 rounded text-xs py-0.5 px-1 text-neutral-900 font-bold focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-neutral-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const labelClass = "text-[9px] font-black text-neutral-800 uppercase tracking-wider block mb-0.5";
  const addBtnClass = "mt-2 flex items-center gap-1.5 text-[10px] font-medium text-orange-500 px-2 py-1 rounded-md hover:bg-orange-500 hover:text-white transition-all w-fit";

  const getCornerIcon = (corner: FourCornerTag, isActive: boolean) => {
      const iconClass = isActive ? "text-orange-500" : "text-neutral-400 group-hover:text-orange-500 transition-colors duration-200";
      switch(corner) {
          case 'Technical': return <TrafficCone size={20} className={iconClass} />;
          case 'Tactical': return <GitPullRequestArrow size={20} className={iconClass} />;
          case 'Physical': return <Dumbbell size={20} className={iconClass} />;
          case 'Mental': return <Brain size={20} className={iconClass} />;
      }
  };

  const intensity = getIntensityLevel(formData.physicalLoad);
  const txt = textData[currentLang];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh] border border-neutral-200 relative">
        
        {/* HEADER */}
        <div className="px-3 py-2 border-b border-neutral-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-2">
              <span className="bg-orange-500 w-1 h-4 rounded-sm"></span>
              <div>
                 <h2 className="text-sm font-black text-neutral-900 uppercase tracking-tight leading-none">
                   {t.create_drill_title || 'Opret Ny Øvelse'}
                 </h2>
                 <p className="text-[9px] text-neutral-400 font-medium">{t.subtitle || 'DTL Asset Management'}</p>
              </div>
          </div>

          {/* DEVELOPER LANGUAGE TOGGLE */}
          {isDtlEmployee && (
              <div className="flex items-center gap-2 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-200">
                  <Globe2 size={14} className="text-neutral-400" />
                  <span className="text-[9px] font-bold text-neutral-500 uppercase">Target:</span>
                  <div className="flex gap-1">
                      <button 
                          onClick={() => setCurrentLang('da')}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors ${currentLang === 'da' ? 'bg-red-500 text-white' : 'bg-white text-neutral-400 hover:text-neutral-900'}`}
                      >
                          DA
                      </button>
                      <button 
                          onClick={() => setCurrentLang('en')}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors ${currentLang === 'en' ? 'bg-blue-600 text-white' : 'bg-white text-neutral-400 hover:text-neutral-900'}`}
                      >
                          EN
                      </button>
                  </div>
              </div>
          )}

          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-full transition-colors"><X size={16} className="text-neutral-400 hover:text-neutral-900" /></button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 shrink-0">
            <button onClick={() => setActiveTab('practical')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'practical' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'}`}>{t.tab_practical || '1. Praktisk Info'}</button>
            <button onClick={() => setActiveTab('data')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'data' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'}`}>{t.tab_data || '2. Data & Analyse'}</button>
            <button onClick={() => setActiveTab('media')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'media' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'}`}>{t.tab_media || '3. Medier'}</button>
        </div>

        {/* CONTENT */}
        <div className="p-3 overflow-y-auto custom-scrollbar flex-1 bg-[#F8FAFC]">
          
          {/* FANE 1: PRAKTISK */}
          {activeTab === 'practical' && (
            <div className="space-y-3">
              
              {/* 1. TITEL & ALDER */}
              <div className={boxClassBlack}>
                  <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-3">
                          <label className={labelClass}>{t.lbl_title || 'ØVELSESNAVN *'}</label>
                          <input 
                            type="text" 
                            className={inputClass} 
                            placeholder={t.ph_title || "Navn på øvelsen..."} 
                            value={txt.title} 
                            onChange={e => updateText('title', e.target.value)} 
                            autoFocus 
                          />
                      </div>
                      <div className="col-span-1">
                          <label className={labelClass}>{t.lbl_age || 'ALDERSGRUPPE'}</label>
                          <select className={inputClass} value={formData.ageGroups?.[0] || ''} onChange={(e) => handleAgeChange(e.target.value)}>
                              <option value="">{t.lbl_choose || 'Vælg...'}</option>
                              {AGE_OPTIONS.map(age => <option key={age} value={age}>{age}</option>)}
                          </select>
                      </div>
                  </div>
              </div>

              {/* 2. BESKRIVELSE & REGLER */}
              <div className={boxClassOrange}>
                  <div>
                      <label className={labelClass}>{t.lbl_desc || 'BESKRIVELSE'}</label>
                      <textarea 
                        className={textareaClass} 
                        placeholder={t.ph_desc || "Kort beskrivelse..."} 
                        value={txt.description} 
                        onChange={e => updateText('description', e.target.value)} 
                      />
                  </div>
                  <div className="mt-2">
                      <label className={labelClass}>{t.lbl_rules || 'REGLER'}</label>
                      <div className="space-y-1.5">
                          {txt.rules.map((rule, idx) => (
                              <div key={idx} className="flex gap-1.5 items-center">
                                  <span className="text-[10px] font-bold text-neutral-400 w-3 text-right">{idx + 1}.</span>
                                  <input 
                                    type="text" 
                                    className={inputClass} 
                                    placeholder={`${t.ph_rule || 'Regel'} ${idx + 1}...`} 
                                    value={rule} 
                                    onChange={(e) => updateRule(idx, e.target.value)} 
                                  />
                                  {idx > 2 && <button onClick={() => removeRule(idx)} className="text-neutral-300 hover:text-red-500"><X size={14}/></button>}
                              </div>
                          ))}
                          <button onClick={addRule} className={`${addBtnClass} ml-5`}><Plus size={14} /> {t.btn_add_rule || 'Tilføj regel'}</button>
                      </div>
                  </div>
              </div>

              {/* 3. PARAMETRE (DE 5 BOKSE) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  <div className={paramBoxClass}>
                      <label className={boxLabelClass}>{t.lbl_time || 'TID (MIN)'}</label>
                      <input type="number" className={boxInputClass} value={formData.durationMin || ''} onChange={e => setFormData({...formData, durationMin: (parseInt(e.target.value) || undefined) as any})} placeholder="15" />
                  </div>
                  <div className={paramBoxClass}>
                      <label className={boxLabelClass}>{t.lbl_work_rest || 'ARBEJDE / PAUSE'}</label>
                      <div className="flex items-center justify-center gap-1 w-full">
                          <input type="number" className={boxInputClass} placeholder="4" value={formData.workDuration || ''} onChange={e => setFormData({...formData, workDuration: (parseInt(e.target.value) || undefined) as any})} />
                          <span className="text-neutral-300 text-lg font-light">/</span>
                          <input type="number" className={boxInputClass} placeholder="1" value={formData.restDuration || ''} onChange={e => setFormData({...formData, restDuration: (parseInt(e.target.value) || undefined) as any})} />
                      </div>
                  </div>
                  <div className={paramBoxClass}>
                      <label className={boxLabelClass}>{t.lbl_players || 'ANTAL SPILLERE'}</label>
                      <div className="flex items-center justify-center gap-1 w-full">
                          <input type="number" className={boxInputClass} placeholder="Min" value={formData.minPlayers || ''} onChange={e => setFormData({...formData, minPlayers: (parseInt(e.target.value) || undefined) as any})} />
                          <span className="text-neutral-300 text-lg font-light">-</span>
                          <input type="number" className={boxInputClass} placeholder="Max" value={formData.maxPlayers || ''} onChange={e => setFormData({...formData, maxPlayers: (parseInt(e.target.value) || undefined) as any})} />
                      </div>
                  </div>
                  <div className={paramBoxClass}>
                      <label className={boxLabelClass}>{t.lbl_pitch || 'BANESTØRRELSE (M)'}</label>
                      <div className="flex items-center justify-center gap-1 w-full">
                          <input type="number" className={boxInputClass} placeholder="30" value={formData.pitchSize?.width || ''} onChange={e => setFormData({...formData, pitchSize: { ...formData.pitchSize!, width: (parseInt(e.target.value) || undefined) as any }})} />
                          <span className="text-neutral-300 text-lg font-light">x</span>
                          <input type="number" className={boxInputClass} placeholder="40" value={formData.pitchSize?.length || ''} onChange={e => setFormData({...formData, pitchSize: { ...formData.pitchSize!, length: (parseInt(e.target.value) || undefined) as any }})} />
                      </div>
                  </div>
                  <div className={paramBoxClass}>
                      <label className={boxLabelClass}>{t.lbl_goalkeeper || 'MÅLMAND'}</label>
                      <div className="flex gap-1 w-full h-full items-center">
                          <button 
                              onClick={() => setFormData({ ...formData, goalKeeper: true })}
                              className={`flex-1 h-[22px] flex items-center justify-center rounded text-[9px] font-black transition-colors ${formData.goalKeeper ? 'bg-orange-500 text-white shadow-sm' : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'}`}
                          >
                              {t.lbl_yes || 'JA'}
                          </button>
                          <button 
                              onClick={() => setFormData({ ...formData, goalKeeper: false })}
                              className={`flex-1 h-[22px] flex items-center justify-center rounded text-[9px] font-black transition-colors ${formData.goalKeeper === false ? 'bg-neutral-900 text-white shadow-sm' : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'}`}
                          >
                              {t.lbl_no || 'NEJ'}
                          </button>
                      </div>
                  </div>
              </div>

              {/* 4. INSTRUKTION & FOKUS */}
              <div className={boxClassOrange}>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>{t.lbl_coach_instruction || 'TRÆNER INSTRUKTION'}</label>
                        <textarea 
                            className={textareaClass} 
                            placeholder={t.ph_instruction || "Hvad skal træneren sige/gøre?"} 
                            value={txt.coachingPoints.instruction} 
                            onChange={e => updateInstruction(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className={labelClass}>{t.lbl_stop_freeze || 'STOP / FRYS'}</label>
                        <textarea 
                            className={textareaClass} 
                            placeholder={t.ph_stop || "Hvornår stopper vi?"} 
                            value={txt.stopFreeze} 
                            onChange={e => updateText('stopFreeze', e.target.value)} 
                        />
                    </div>
                </div>
                <div className="mt-2">
                    <label className={labelClass}>{t.lbl_key_points || 'FOKUSPUNKTER'}</label>
                    <div className="space-y-1.5">
                       {txt.coachingPoints.keyPoints.map((point, idx) => (
                           <div key={idx} className="flex gap-1.5 items-center">
                               <span className="text-[10px] font-bold text-neutral-400 w-3 text-right">{idx + 1}.</span>
                               <input 
                                    type="text" 
                                    className={inputClass} 
                                    placeholder={`${t.ph_point || 'Punkt'} ${idx + 1}...`} 
                                    value={point} 
                                    onChange={(e) => updateKeyPoint(idx, e.target.value)} 
                               />
                               {idx > 2 && <button onClick={() => removeKeyPoint(idx)} className="text-neutral-300 hover:text-red-500"><X size={14}/></button>}
                           </div>
                       ))}
                       <button onClick={addKeyPoint} className={`${addBtnClass} ml-5`}><Plus size={14} /> {t.btn_add_point || 'Tilføj punkt'}</button>
                    </div>
                </div>
              </div>

              {/* 5. PROGRESSION */}
              <div className="grid grid-cols-2 gap-3">
                  <div className={boxClassOrange}>
                      <label className={`${labelClass} mb-2`}>{t.lbl_progression || 'PROGRESSION (SVÆRERE)'}</label>
                      <div className="space-y-1.5">
                          {txt.progression.map((item, idx) => (
                              <div key={`prog-${idx}`} className="flex gap-1.5 items-center">
                                  <span className="text-[10px] font-bold text-neutral-400 w-3 text-center">+</span>
                                  <input 
                                    type="text" 
                                    className={inputClass} 
                                    placeholder="..." 
                                    value={item} 
                                    onChange={(e) => updateProgression(idx, e.target.value)} 
                                  />
                                  {idx > 0 && <button onClick={() => removeProgression(idx)} className="text-neutral-300 hover:text-red-500"><X size={14}/></button>}
                              </div>
                          ))}
                          <button onClick={addProgression} className={`${addBtnClass} ml-5`}><Plus size={14} /> {t.mod_btn_add || 'Tilføj'}</button>
                      </div>
                  </div>
                  <div className={boxClassOrange}>
                      <label className={`${labelClass} text-neutral-500 mb-2`}>{t.lbl_regression || 'REGRESSION (LETTERE)'}</label>
                      <div className="space-y-1.5">
                          {txt.regression.map((item, idx) => (
                              <div key={`reg-${idx}`} className="flex gap-1.5 items-center">
                                  <span className="text-[10px] font-bold text-neutral-400 w-3 text-center">-</span>
                                  <input 
                                    type="text" 
                                    className={inputClass} 
                                    placeholder="..." 
                                    value={item} 
                                    onChange={(e) => updateRegression(idx, e.target.value)} 
                                  />
                                  {idx > 0 && <button onClick={() => removeRegression(idx)} className="text-neutral-300 hover:text-red-500"><X size={14}/></button>}
                              </div>
                          ))}
                          <button onClick={addRegression} className={`${addBtnClass} ml-5`}><Plus size={14} /> {t.mod_btn_add || 'Tilføj'}</button>
                      </div>
                  </div>
              </div>

              {/* 6. HOLD & MATERIALER */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className={`${boxClassBlack} md:col-span-2 h-full flex flex-col`}><label className={labelClass}>{t.lbl_teams || 'ANTAL HOLD'}</label><div className="space-y-2 flex-1">{teams.map((team, idx) => (<div key={idx} className="flex items-center gap-2 bg-neutral-50 p-1.5 rounded-lg border border-neutral-200"><div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${getColorClass(team.color)}`}><Shirt size={12} className={team.color === 'white' ? 'text-black' : 'text-white'} /></div><div className="flex-1"><input type="text" value={team.name} onChange={(e) => updateTeam(idx, 'name', e.target.value)} className="w-full bg-transparent text-xs font-bold text-neutral-800 focus:outline-none border-b border-transparent focus:border-orange-300 px-1" placeholder={t.ph_team || "Hold Navn"} /></div><div className="flex items-center gap-1"><span className="text-[9px] font-bold text-neutral-500 uppercase">{t.mod_mat_count || 'ANTAL'}:</span><input type="number" value={team.playerCount} onChange={(e) => updateTeam(idx, 'playerCount', parseInt(e.target.value) || 0)} className="w-8 text-center bg-white border border-neutral-200 rounded text-xs py-0.5 text-neutral-900 font-bold focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" onFocus={(e) => e.target.select()} /></div><div className="flex gap-1">{['orange', 'red', 'blue', 'green', 'yellow', 'white', 'black'].map(c => (<button key={c} onClick={() => updateTeam(idx, 'color', c as any)} className={`w-3 h-3 rounded-full border border-black/10 ${getColorClass(c)} ${team.color === c ? 'ring-1 ring-offset-1 ring-neutral-400' : ''}`} />))}</div><button onClick={() => removeTeam(idx)} className="ml-1 text-neutral-400 hover:text-red-500"><Trash2 size={12} /></button></div>))}</div><button onClick={addTeam} className={addBtnClass}><Plus size={14} /> {t.btn_add_team || 'Tilføj Hold'}</button></div>
                  <div className={`${boxClassBlack} h-full flex flex-col`}><div className="flex justify-between items-center mb-1"><label className={labelClass}>{t.lbl_materials || 'MATERIALER'}</label>{formData.materials && formData.materials.length > 0 && (<span className="text-[9px] text-neutral-400">{formData.materials.length}</span>)}</div><div className="flex-1 bg-white flex flex-col min-h-[60px]"><div className="overflow-y-auto custom-scrollbar flex-1 max-h-[160px]">{formData.materials && formData.materials.length > 0 ? (<div className="divide-y divide-neutral-100">{formData.materials.map((item, idx) => (<div key={idx} className="flex items-center justify-between py-0.5 group"><div className="flex items-center gap-2 min-w-0"><span className="text-[10px] font-bold text-neutral-400 w-4">{idx + 1}.</span><div className="truncate flex items-center gap-1"><span className="text-[10px] font-bold text-neutral-900">{(t as any)[item.name] || item.name}</span>{item.details && <span className="text-[9px] text-neutral-400 font-medium truncate">- {item.details}</span>}</div></div><div className="flex items-center gap-2 shrink-0"><span className="text-[10px] font-bold text-neutral-500">{item.count}</span><button onClick={() => removeMaterial(idx)} className="text-neutral-300 hover:text-red-500 transition-colors"><Trash2 size={10} /></button></div></div>))}</div>) : (<div className="h-full flex items-center justify-center text-[10px] text-neutral-300 italic">{t.no_materials || 'Ingen materialer'}</div>)}</div></div><button onClick={openMaterialModal} className={addBtnClass}><Plus size={14} /> {t.btn_add_material || 'Tilføj Materiale'}</button></div>
              </div>
            </div>
          )}

          {/* FANE 2: DATA */}
          {activeTab === 'data' && (
            <div className="space-y-3">
              <div className={boxClassBlack}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className={labelClass}>{t.lbl_primary_theme || 'PRIMÆRT TEMA'}</label><input type="text" className={inputClass} placeholder={t.ph_theme_primary || "Fx Defensiv Org..."} value={formData.primaryTheme || ''} onChange={e => setFormData({...formData, primaryTheme: e.target.value})} /></div>
                    <div><label className={labelClass}>{t.lbl_secondary_theme || 'SEKUNDÆRT TEMA'}</label><input type="text" className={inputClass} placeholder={t.ph_theme_secondary || "Fx Genpres..."} value={formData.secondaryTheme || ''} onChange={e => setFormData({...formData, secondaryTheme: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                   <div><label className={labelClass}>{t.lbl_main_category || 'KATEGORI'}</label><div className="relative"><select className={`${inputClass} appearance-none pr-6`} value={formData.mainCategory} onChange={e => handleMainCategoryChange(e.target.value as MainCategory)}>{Object.keys(DRILL_CATEGORIES).map(cat => (<option key={cat} value={cat}>{getTrans('main', cat)}</option>))}</select><ChevronRight size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 rotate-90" /></div></div>
                   <div><label className={labelClass}>{t.lbl_sub_category || 'EMNE'}</label><div className="relative"><select className={`${inputClass} appearance-none pr-6`} value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}>{formData.mainCategory && DRILL_CATEGORIES[formData.mainCategory as MainCategory] && DRILL_CATEGORIES[formData.mainCategory as MainCategory].map(sub => (<option key={sub} value={sub}>{translateVal(sub, 'sub')}</option>))}</select><ChevronRight size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 rotate-90" /></div></div>
                </div>
                <div className="mb-1">
                    <label className={labelClass}>{t.lbl_visibility || 'KATALOG'}</label>
                    <div className="flex gap-2 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                        {[{ id: 'Global', label: t.lbl_vis_global || 'DTL Global', icon: Globe, restricted: !isDtlEmployee }, { id: 'Club', label: t.lbl_vis_club || 'Club Library', icon: Shield, restricted: false }, { id: 'Team', label: t.lbl_vis_team || 'Team Library', icon: Users, restricted: false }, { id: 'Personal', label: t.lbl_vis_personal || 'Personal Library', icon: UserIcon, restricted: false }].map((option) => {
                            const isSelected = formData.accessLevel === option.id; 
                            const isRestricted = option.restricted;
                            
                            return (
                                <button 
                                    key={option.id} 
                                    onClick={() => !isRestricted && setFormData({ ...formData, accessLevel: option.id as any })} 
                                    disabled={isRestricted} 
                                    className={`
                                        relative flex-1 py-2 flex items-center justify-center rounded-lg border transition-all duration-200 group
                                        ${isSelected 
                                            ? 'bg-black border-black text-white shadow-md transform -translate-y-0.5' 
                                            : isRestricted 
                                                ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed' 
                                                : 'bg-white border-neutral-200 text-neutral-500 hover:border-orange-500'
                                        }
                                    `}
                                >
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <option.icon 
                                            size={20} 
                                            className={
                                                isSelected 
                                                    ? "text-orange-500" 
                                                    : isRestricted 
                                                        ? "text-gray-300" 
                                                        : "text-neutral-400 group-hover:text-orange-500 transition-colors duration-200"
                                            } 
                                        />
                                    </div>
                                    <span 
                                        className={`
                                            text-[11px] font-black uppercase tracking-wider transition-colors duration-200 w-full text-center
                                            ${isSelected 
                                                ? 'text-white' 
                                                : isRestricted 
                                                    ? 'text-gray-300' 
                                                    : 'text-neutral-500 group-hover:text-orange-500'
                                            }
                                        `}
                                    >
                                        {option.label}
                                    </span>
                                    {isRestricted && (<div className="absolute top-1 right-1"><Lock size={8} className="text-gray-300" /></div>)}
                                </button>
                            );
                        })}
                    </div>
                </div>
              </div>
              <div className={`grid gap-3 ${isPremium ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
                  <div className={boxClassOrange}>
                        <div className="flex items-center justify-between mb-1">
                            <label className={labelClass + " mb-0"}>{t.lbl_physical_load || 'FYSISK BELASTNING'}</label>
                            <div className="flex items-center gap-1.5"><button onClick={() => setIntensityByColor('green')} className={`w-3 h-3 rounded-full border transition-all ${intensity === 'green' ? 'bg-green-500 border-green-600 scale-125 shadow-sm' : 'bg-green-100 border-green-200 hover:bg-green-300'}`} title="Lav Intensitet" /><button onClick={() => setIntensityByColor('yellow')} className={`w-3 h-3 rounded-full border transition-all ${intensity === 'yellow' ? 'bg-yellow-400 border-yellow-500 scale-125 shadow-sm' : 'bg-yellow-100 border-yellow-200 hover:bg-yellow-200'}`} title="Middel Intensitet" /><button onClick={() => setIntensityByColor('red')} className={`w-3 h-3 rounded-full border transition-all ${intensity === 'red' ? 'bg-red-500 border-red-600 scale-125 shadow-sm' : 'bg-red-100 border-red-200 hover:bg-red-300'}`} title="Høj Intensitet" /></div>
                       </div>
                       <select className={inputClass} value={formData.physicalLoad} onChange={handleLoadChange}><option value="Aerobic – Low Intensity">{translateVal('Aerobic – Low Intensity', 'load')}</option><option value="Aerobic – Moderate Intensity">{translateVal('Aerobic – Moderate Intensity', 'load')}</option><option value="Aerobic – High Intensity">{translateVal('Aerobic – High Intensity', 'load')}</option><option value="Anaerobic – Sprint">{translateVal('Anaerobic – Sprint', 'load')}</option><option value="Anaerobic – Sprint Endurance">{translateVal('Anaerobic – Sprint Endurance', 'load')}</option><option value="Anaerobic – Production">{translateVal('Anaerobic – Production', 'load')}</option><option value="Anaerobic – Tolerance">{translateVal('Anaerobic – Tolerance', 'load')}</option></select>
                  </div>
                  {isPremium && (
                    <div className={boxClassOrange}>
                        <div className="relative h-full flex flex-col justify-start">
                                <div className="flex justify-between items-center mb-1"><div className="flex items-center gap-1"><label className={labelClass + " mb-0"}>{t.lbl_rpe || 'RPE (INTENSITET 1-10)'}</label><div className="group/info relative"><Info size={12} className="text-neutral-400 cursor-help hover:text-neutral-600" /><div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-60 bg-black text-white text-[9px] p-3 rounded-md shadow-xl opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-[100] leading-relaxed border border-orange-500"><p className="font-bold text-orange-500 mb-1.5 border-b border-white/20 pb-1">{t.rpe_info_title || 'RPE Skala (Borg)'}</p><ul className="space-y-1.5 text-white/90"><li><strong className="text-red-500">10:</strong> {t.rpe_10 || 'Maksimal indsats.'}</li><li><strong className="text-orange-500">9:</strong> {t.rpe_9 || 'En gentagelse mere.'}</li><li><strong className="text-orange-400">8:</strong> {t.rpe_8 || 'To gentagelser mere.'}</li><li><strong className="text-yellow-400">7:</strong> {t.rpe_7 || 'Tre gentagelser mere.'}</li><li><strong className="text-yellow-300">6:</strong> {t.rpe_6 || 'Relativt let.'}</li><li><strong className="text-green-400">1-5:</strong> {t.rpe_1_5 || 'Meget let.'}</li></ul></div></div></div><span className={`text-[10px] font-bold px-1.5 rounded ${(formData.rpe || 5) > 7 ? 'text-red-600 bg-red-50' : (formData.rpe || 5) > 4 ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50'}`}>{formData.rpe || 5}</span></div>
                                <input type="range" min="1" max="10" step="1" value={formData.rpe || 5} onChange={(e) => setFormData({...formData, rpe: parseInt(e.target.value)})} className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-orange-500 mt-auto mb-auto" />
                                <div className="flex justify-between text-[8px] text-neutral-400 font-medium mt-1"><span>{t.rpe_easy || 'Let'} (1)</span><span>{t.rpe_hard || 'Hård'} (10)</span></div>
                        </div>
                    </div>
                  )}
                  {isPremium && (
                      <div className="bg-black rounded-lg border border-white/20 p-3 flex flex-col justify-between relative h-full min-h-[80px] group transition-all duration-300 overflow-visible">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 to-transparent opacity-50 pointer-events-none overflow-hidden rounded-lg"></div>
                           <div className="flex justify-between items-center mb-1 relative z-10"><div className="flex items-center gap-1.5"><span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{t.lbl_smart_pitch || 'SMART PITCH'}</span><div className="group/info relative"><Info size={12} className="text-white cursor-help hover:text-orange-400 transition-colors" /><div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-black border border-orange-500 text-white text-[9px] p-2 rounded shadow-xl opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-[100]"><p className="font-bold text-orange-500 mb-1">{t.lbl_area_per_player || 'M² pr. spiller beregning'}</p><p className="text-white leading-relaxed">{t.tooltip_high || '< 80m² = Høj Intensitet (Genpres)'}<br/>{t.tooltip_mod || '80-150m² = Moderat / Teknisk'}<br/>{t.tooltip_end || '> 150m² = Udholdenhed (Stort rum)'}</p></div></div></div></div>
                           <div className="relative z-10 flex items-center justify-between h-full"><div className="flex items-baseline gap-1">{pitchData ? (<><span className="text-2xl font-black text-white tracking-tighter leading-none">{pitchData.m2PerPlayer}</span><span className="text-[8px] font-bold text-white uppercase">M²</span></>) : <span className="text-2xl font-black text-white/30 tracking-tighter leading-none">-</span>}</div><div className="flex flex-col items-end gap-1 w-2/3"><div className="text-[8px] font-bold uppercase tracking-wide text-right">{pitchData ? (<span className="text-white">{pitchData.intensityHint}</span>) : (<span className="text-white font-black tracking-tight">{t.msg_missing_pitch_data || 'MANGLER DATA'}</span>)}</div><div className="w-full h-1 bg-white/20 rounded-full relative overflow-hidden"><div className="h-full bg-orange-500 transition-all duration-500 ease-out relative z-10" style={{ width: `${pitchData ? pitchData.percentage : 0}%` }}></div></div></div></div>
                      </div>
                  )}
              </div>
              <div className={boxClassOrange}>
                <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><span className="text-[9px] font-black text-neutral-900 uppercase tracking-wider">{t.lbl_tags_header || 'ØVELSENS (TAGS)'}</span></div><span className="text-[9px] text-neutral-400 font-medium">{t.lbl_tags_select || 'Vælg for at definere'}</span></div>
                <div className="flex gap-2 mb-3 bg-neutral-50 p-2 rounded-lg border border-neutral-100">{(['Technical', 'Tactical', 'Physical', 'Mental'] as FourCornerTag[]).map(corner => {const isActive = activeCorner === corner; return (<button key={corner} onClick={() => setActiveCorner(corner)} className={`relative flex-1 py-2 flex items-center justify-center rounded-lg border transition-all duration-200 group ${isActive ? 'bg-black border-black text-white shadow-md transform -translate-y-0.5' : 'bg-white border-neutral-200 text-neutral-500 hover:border-orange-500'}`}><div className="absolute left-3 top-1/2 -translate-y-1/2">{getCornerIcon(corner, isActive)}</div><span className={`text-[11px] font-black uppercase tracking-wider transition-colors duration-200 w-full text-center ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-orange-500'}`}>{translateVal(corner, 'tag')}</span></button>)})}</div>
                <div className="mb-3 overflow-x-auto custom-scrollbar p-1"><div className="flex flex-wrap gap-2">{DRILL_TAGS && DRILL_TAGS[activeCorner] && Object.keys(DRILL_TAGS[activeCorner]).map(sub => (<button key={sub} onClick={() => setActiveSubCat(sub)} className={`px-3 py-1.5 text-[10px] font-bold rounded-full whitespace-nowrap transition-all duration-200 ${activeSubCat === sub ? 'bg-white border-2 border-orange-500 text-orange-600 shadow-sm' : 'bg-white border border-neutral-200 text-neutral-500 hover:border-orange-500 hover:text-orange-500 hover:-translate-y-0.5'}`}>{translateVal(sub, 'sub')}</button>))}</div></div>
                <div className="grid grid-cols-4 gap-2 mb-4 max-h-[120px] overflow-y-auto custom-scrollbar p-1">{DRILL_TAGS && DRILL_TAGS[activeCorner] && activeSubCat && DRILL_TAGS[activeCorner][activeSubCat] ? (DRILL_TAGS[activeCorner][activeSubCat].map(tag => {const isSelected = formData.tags?.includes(tag); return (<button key={tag} onClick={() => toggleDetailedTag(tag)} className={`text-left px-2 py-1.5 rounded text-[10px] font-medium border transition-all flex items-center justify-center group ${isSelected ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'bg-white border-neutral-100 text-neutral-600 hover:border-orange-300'}`}><span className="truncate pr-1">{translateVal(tag, 'tag')}</span>{isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white ml-1"></div>}</button>)})) : (<div className="col-span-4 text-center text-[10px] text-neutral-400 italic py-4">Indlæser tags...</div>)}</div>
                {formData.tags && formData.tags.length > 0 && (<div className="pt-2 border-t border-neutral-100"><label className={labelClass}>{t.lbl_selected_tags || 'VALGTE TAGS'}</label><div className="flex flex-wrap gap-1.5">{formData.tags.map(tag => (<span key={tag} className="bg-neutral-800 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">{translateVal(tag, 'tag')} <button onClick={() => toggleDetailedTag(tag)} className="hover:text-red-300"><X size={10} /></button></span>))}</div></div>)}
              </div>
            </div>
          )}

          {/* FANE 3: MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              
              {/* TOP: ACTION CARDS (GRID) */}
              <div className="grid grid-cols-3 gap-3">
                  
                  {/* 1. DTL STUDIO (PREMIUM) */}
                  <button
                      onClick={() => setActiveModal('studio')}
                      className="group relative flex flex-col items-center justify-center p-6 bg-black rounded-xl border-2 border-neutral-800 hover:border-orange-500 transition-all duration-300 hover:-translate-y-1 shadow-lg overflow-hidden"
                  >
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center border-2 border-orange-500 group-hover:border-orange-400 transition-all mb-3 z-10 shadow-lg shadow-orange-500/20 group-hover:scale-105">
                          <GitPullRequestArrow className="text-white w-6 h-6 group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider z-10">{t.studio_title || 'DTL Studio'}</h3>
                      <p className="text-[9px] text-neutral-400 mt-1 z-10 font-medium">Design & Animation</p>
                  </button>

                  {/* 2. UPLOAD */}
                  <button
                      onClick={() => setActiveModal('upload')}
                      className="group relative flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-neutral-200 hover:border-orange-500 transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  >
                      <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100 group-hover:border-orange-500 transition-colors mb-3">
                          <Upload className="text-neutral-400 group-hover:text-orange-500 w-6 h-6 transition-colors" />
                      </div>
                      <h3 className="text-xs font-black text-neutral-900 group-hover:text-orange-500 uppercase tracking-wider transition-colors">{t.upload_title || 'Upload Fil'}</h3>
                      <p className="text-[9px] text-neutral-400 mt-1 font-medium group-hover:text-orange-400 transition-colors">JPG, PNG, MP4</p>
                  </button>

                  {/* 3. YOUTUBE */}
                  <button
                      onClick={() => setActiveModal('youtube')}
                      className="group relative flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-neutral-200 hover:border-orange-500 transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  >
                      <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100 group-hover:border-orange-500 transition-colors mb-3">
                          <Youtube className="text-neutral-400 group-hover:text-orange-500 w-6 h-6 transition-colors" />
                      </div>
                      <h3 className="text-xs font-black text-neutral-900 group-hover:text-orange-500 uppercase tracking-wider transition-colors">YouTube</h3>
                      <p className="text-[9px] text-neutral-400 mt-1 font-medium group-hover:text-orange-400 transition-colors">Link Integration</p>
                  </button>
              </div>

              {/* GALLERY SECTION */}
              <div className={boxClassOrange}>
                  <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                          <h4 className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">
                              {t.lbl_gallery || 'ILLUSTRATIONS & ANIMATIONS'}
                          </h4>
                          <span className="bg-orange-100 text-orange-700 text-[8px] font-bold px-1.5 py-0.5 rounded">
                              {localGallery.length}
                          </span>
                      </div>
                      <span className="text-[9px] text-neutral-400 font-medium flex items-center gap-1">
                          <Star size={10} className="text-orange-500 fill-current" /> {t.lbl_gallery_sub || 'Vælg forsidebillede'}
                      </span>
                  </div>

                  {localGallery.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                          {localGallery.map((url, idx) => {
                              const isCover = formData.thumbnailUrl === url;
                              const isVideo = isVideoUrl(url) || formData.videoUrl === url; 
                              
                              return (
                                  <div 
                                    key={idx} 
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDragEnd={handleDragEnd}
                                    className={`
                                        group relative aspect-video rounded-lg overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300
                                        ${isCover ? 'ring-2 ring-orange-500 shadow-md transform scale-[1.02]' : 'border border-neutral-200 hover:shadow-lg'}
                                        ${draggedItemIndex === idx ? 'opacity-50' : 'opacity-100'}
                                    `}
                                    onClick={() => setZoomedAsset(url)}
                                  >
                                      {/* Content Rendering (PUNKT 1: VIDEO HOVER FIX) */}
                                      {isVideo ? (
                                           <div className="w-full h-full bg-black relative"
                                                onMouseEnter={(e) => { 
                                                    const video = e.currentTarget.querySelector('video');
                                                    if(video) video.play().catch(() => {}); 
                                                }}
                                                onMouseLeave={(e) => { 
                                                    const video = e.currentTarget.querySelector('video');
                                                    if(video) {
                                                        video.pause();
                                                        video.currentTime = 0; 
                                                    }
                                                }}
                                           >
                                                <video 
                                                    src={url} 
                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none"
                                                    muted
                                                    preload="metadata"
                                                    playsInline
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                                        <Play size={16} className="text-white fill-white ml-1" />
                                                    </div>
                                                </div>
                                                <span className="absolute bottom-2 right-2 text-[8px] font-black text-white bg-black/60 px-1.5 py-0.5 rounded uppercase tracking-widest">VIDEO</span>
                                           </div>
                                      ) : (
                                           <img src={url} alt="Asset" className="w-full h-full object-cover" />
                                      )}
                                      
                                      {/* Cover Badge */}
                                      {isCover && (
                                          <div className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 z-10 pointer-events-none">
                                              <Star size={8} fill="currentColor" /> COVER
                                          </div>
                                      )}

                                      {/* Drag Indicator */}
                                      <div className="absolute top-2 right-2 p-1 bg-black/20 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                          <Move size={12} />
                                      </div>

                                      {/* Hover Overlay (PUNKT 5: MINDRE KNAP) */}
                                      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-200 flex flex-col justify-end p-2 ${isCover ? 'opacity-0 hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                          <div className="flex justify-between items-end gap-2">
                                              
                                              {/* SET COVER BUTTON */}
                                              {!isCover ? (
                                                  <button 
                                                      onClick={(e) => { e.stopPropagation(); handleSetCover(url); }}
                                                      className="flex-1 h-5 bg-white/90 hover:bg-orange-500 hover:text-white text-neutral-900 rounded-md text-[8px] font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-1"
                                                  >
                                                      <Star size={8} /> {t.btn_set_cover || 'Set Cover'}
                                                  </button>
                                              ) : (
                                                  <div className="flex-1"></div> 
                                              )}

                                              {/* DELETE BUTTON */}
                                              <button 
                                                  onClick={(e) => { e.stopPropagation(); handleDeleteMedia(url); }}
                                                  className="h-5 w-6 bg-neutral-900/80 hover:bg-orange-500 text-white rounded-md backdrop-blur-sm transition-colors flex items-center justify-center"
                                                  title="Slet"
                                              >
                                                  <Trash2 size={10} />
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              )
                          })}
                          
                          {/* Add More Ghost Card */}
                          <button 
                              onClick={() => setActiveModal('upload')}
                              className="aspect-video rounded-lg border-2 border-dashed border-neutral-200 hover:border-orange-300 bg-neutral-50 hover:bg-white flex flex-col items-center justify-center gap-2 group transition-all"
                          >
                              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-orange-500 transition-colors">
                                <Plus size={20} />
                              </div>
                              <span className="text-[10px] font-bold text-neutral-400 group-hover:text-orange-500 uppercase tracking-wider">{t.btn_add_more || 'Tilføj mere'}</span>
                          </button>
                      </div>
                  ) : (
                      <div className="h-40 flex flex-col items-center justify-center text-neutral-300 bg-neutral-50/50 rounded-lg border-2 border-dashed border-neutral-100">
                          <ImageIcon size={32} className="mb-2 opacity-20" />
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">{t.no_media_title || 'Galleriet er tomt'}</p>
                          <p className="text-[9px] text-neutral-300 mt-1">{t.no_media_desc || 'Vælg en kilde ovenfor for at starte'}</p>
                      </div>
                  )}
              </div>

            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-3 py-2 border-t border-neutral-100 bg-white flex justify-between items-center shrink-0">
           <div className="text-[10px] text-neutral-500 font-medium">
             {t.step_indicator?.replace('{{current}}', activeTab === 'practical' ? '1' : activeTab === 'data' ? '2' : '3') || `Trin ${activeTab === 'practical' ? '1' : activeTab === 'data' ? '2' : '3'} af 3`}
           </div>
           <div className="flex gap-2">
             {activeTab !== 'practical' && (
               <button onClick={() => setActiveTab(prev => prev === 'media' ? 'data' : 'practical')} className="px-3 py-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors">{t.btn_back || 'Tilbage'}</button>
             )}
             {activeTab === 'media' ? (
               <button onClick={handleSave} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all hover:-translate-y-0.5 disabled:opacity-50">{isSaving ? (t.btn_saving || 'Gemmer...') : <><Save size={14} /> {t.btn_save || 'Gem Øvelse'}</>}</button>
             ) : (
               <button onClick={() => setActiveTab(prev => prev === 'practical' ? 'data' : 'media')} className="bg-neutral-900 hover:bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all">{t.btn_next || 'Næste'}</button>
             )}
           </div>
        </div>
        
        {/* LIGHTBOX / ZOOM OVERLAY */}
        {zoomedAsset && (
            <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setZoomedAsset(null)}>
                <button className="absolute top-4 right-4 text-white/50 hover:text-white p-2" onClick={() => setZoomedAsset(null)}>
                    <X size={32} />
                </button>
                <div className="max-w-5xl max-h-[85vh] w-full flex justify-center" onClick={(e) => e.stopPropagation()}>
                    {isVideoUrl(zoomedAsset) ? (
                        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
                             {zoomedAsset.includes('youtube') || zoomedAsset.includes('youtu.be') ? (
                                 <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={`https://www.youtube.com/embed/${getYouTubeID(zoomedAsset)}?autoplay=1`} 
                                    frameBorder="0" 
                                    allow="autoplay; encrypted-media" 
                                    allowFullScreen
                                 ></iframe>
                             ) : (
                                 <video src={zoomedAsset} controls autoPlay className="w-full h-full object-contain" />
                             )}
                        </div>
                    ) : (
                        <img src={zoomedAsset} alt="Full size" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
                    )}
                </div>
            </div>
        )}

        {/* MATERIAL MODAL (PUNKT 4: RETTET INPUT) */}
        {isMaterialModalOpen && (
            <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-[300px] p-4 space-y-3 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                        <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wide">{t.mod_mat_title || 'Tilføj Materiale'}</h3>
                        <button onClick={() => setIsMaterialModalOpen(false)} className="text-neutral-400 hover:text-black"><X size={14}/></button>
                    </div>
                    <div className="space-y-2">
                        <div><label className={labelClass}>{t.mod_mat_type || 'TYPE'}</label><select className={inputClass} value={newMaterial.name} onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}>{EQUIPMENT_KEYS.map(key => (<option key={key} value={key}>{(t as any)[key] || key}</option>))}<option value="eq_other">{t.eq_other || 'Andet...'}</option></select></div>
                        {newMaterial.name === 'eq_other' && (<div><label className={labelClass}>{t.mod_mat_name || 'NAVN'}</label><input type="text" className={inputClass} placeholder="Fx Rebounder..." value={customMaterialName} onChange={(e) => setCustomMaterialName(e.target.value)} autoFocus /></div>)}
                        <div>
                            <label className={labelClass}>{COLOR_ITEMS.includes(newMaterial.name) ? (t.mod_mat_colors || 'ANTAL FARVER') : (t.mod_mat_count || 'ANTAL')}</label>
                            {/* RETTET HER: onFocus={e => e.target.select()} tilføjet */}
                            <input type="number" className={inputClass} value={newMaterial.count} onChange={(e) => setNewMaterial({ ...newMaterial, count: parseInt(e.target.value) || 1 })} min="1" onFocus={(e) => e.target.select()} />
                        </div>
                        <div><label className={labelClass}>{t.mod_mat_details || 'DETALJER (VALGFRI)'}</label><input type="text" className={inputClass} placeholder={t.ph_mat_details || "Fx 3 farver, Str. 5, Store..."} value={newMaterial.details} onChange={(e) => setNewMaterial({ ...newMaterial, details: e.target.value })} /></div>
                    </div>
                    <div className="flex gap-2 pt-1">
                        <button onClick={() => setIsMaterialModalOpen(false)} className="flex-1 py-1.5 text-xs font-bold text-neutral-500 hover:bg-neutral-100 rounded-lg">{t.mod_btn_cancel || 'Annuller'}</button>
                        <button onClick={saveMaterialFromModal} className="flex-1 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-neutral-800">{t.mod_btn_add || 'Tilføj'}</button>
                    </div>
                </div>
            </div>
        )}

        {/* 1. DTL STUDIO POPUP */}
        {activeModal === 'studio' && (
            <div className="absolute inset-0 z-[120] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white w-[95%] sm:w-[90%] md:w-full max-w-sm sm:max-w-xl md:max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col border border-neutral-100">
                      
                      {/* HEADER */}
                      <div className="relative z-10 p-4 pb-2 flex justify-between items-start border-b border-neutral-50 shrink-0 bg-white">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center border border-orange-600 shadow-sm shrink-0">
                                     <GitPullRequestArrow className="text-white w-4 h-4" />
                                 </div>
                                 <div>
                                     <h3 className="text-sm font-black text-neutral-900 uppercase tracking-tight leading-none">
                                         {t.studio_title || 'DTL Studio'}
                                     </h3>
                                 </div>
                              </div>
                              <p className="text-neutral-500 text-[10px] leading-relaxed line-clamp-2">
                                 {t.studio_desc || 'Vælg hvordan du vil skabe dit indhold. Design selv, importer eller brug video.'}
                              </p>
                          </div>
                          <button 
                             onClick={() => setActiveModal('none')} 
                             className="text-neutral-400 hover:text-neutral-900 transition-colors hover:bg-neutral-100 p-1.5 rounded-full"
                          >
                             <X size={18} />
                          </button>
                      </div>

                      {/* ACTION CARDS */}
                      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 lg:gap-6 p-4 pt-2 md:p-6 md:pt-3 lg:p-8 lg:pt-4 bg-neutral-50/50 overflow-y-auto">
                          
                          {/* Card 1: Create New */}
                          <button 
                             onClick={() => handleStudioAction('create')} 
                             className="group flex sm:flex-col items-center sm:justify-center p-3 md:p-5 lg:p-6 bg-white rounded-lg border border-neutral-200 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 w-full text-left sm:text-center gap-3 sm:gap-0"
                          >
                              <div className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-neutral-50 rounded-full flex items-center justify-center sm:mb-3 md:mb-4 group-hover:bg-orange-500 transition-colors duration-300 shadow-inner group-hover:shadow-md group-hover:shadow-orange-500/30 shrink-0">
                                  <MousePointer2 className="text-neutral-400 group-hover:text-white w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 transition-colors duration-300" />
                              </div>
                              <div>
                                 <h4 className="text-neutral-900 group-hover:text-orange-600 font-black uppercase text-[10px] md:text-xs lg:text-sm tracking-wider mb-0.5 md:mb-1 transition-colors">
                                     {t.studio_create_title || 'Opret Illustration'}
                                 </h4>
                                 <p className="text-neutral-400 text-[9px] md:text-[10px] lg:text-xs leading-tight sm:leading-relaxed">
                                    {t.studio_create_desc || 'Start med et tomt lærred.'}
                                 </p>
                              </div>
                          </button>

                          {/* Card 2: Import Image */}
                          <button 
                             onClick={() => handleStudioAction('import-image')} 
                             className="group flex sm:flex-col items-center sm:justify-center p-3 md:p-5 lg:p-6 bg-white rounded-lg border border-neutral-200 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 w-full text-left sm:text-center gap-3 sm:gap-0"
                          >
                              <div className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-neutral-50 rounded-full flex items-center justify-center sm:mb-3 md:mb-4 group-hover:bg-orange-500 transition-colors duration-300 shadow-inner group-hover:shadow-md group-hover:shadow-orange-500/30 shrink-0">
                                  <ImageIcon className="text-neutral-400 group-hover:text-white w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 transition-colors duration-300" />
                              </div>
                              <div>
                                 <h4 className="text-neutral-900 group-hover:text-orange-600 font-black uppercase text-[10px] md:text-xs lg:text-sm tracking-wider mb-0.5 md:mb-1 transition-colors">
                                     {t.studio_import_title || 'Importer Billede'}
                                 </h4>
                                 <p className="text-neutral-400 text-[9px] md:text-[10px] lg:text-xs leading-tight sm:leading-relaxed">
                                    {t.studio_import_desc || 'Hent fra bibliotek / upload.'}
                                 </p>
                              </div>
                          </button>

                          {/* Card 3: Video/Animation */}
                          <button 
                             onClick={() => handleStudioAction('import-animation')} 
                             className="group flex sm:flex-col items-center sm:justify-center p-3 md:p-5 lg:p-6 bg-white rounded-lg border border-neutral-200 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 w-full text-left sm:text-center gap-3 sm:gap-0"
                          >
                              <div className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-neutral-50 rounded-full flex items-center justify-center sm:mb-3 md:mb-4 group-hover:bg-orange-500 transition-colors duration-300 shadow-inner group-hover:shadow-md group-hover:shadow-orange-500/30 shrink-0">
                                  <Film className="text-neutral-400 group-hover:text-white w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 transition-colors duration-300" />
                              </div>
                              <div>
                                 <h4 className="text-neutral-900 group-hover:text-orange-600 font-black uppercase text-[10px] md:text-xs lg:text-sm tracking-wider mb-0.5 md:mb-1 transition-colors">
                                     {t.studio_video_title || 'Animation / Video'}
                                 </h4>
                                 <p className="text-neutral-400 text-[9px] md:text-[10px] lg:text-xs leading-tight sm:leading-relaxed">
                                    {t.studio_video_desc || 'Importer videoklip.'}
                                 </p>
                              </div>
                          </button>

                      </div>
                      
                      {/* FOOTER */}
                      <div className="bg-neutral-50 p-2 md:p-3 px-4 md:px-6 lg:px-8 border-t border-neutral-100 flex justify-between items-center shrink-0">
                         <span className="text-[8px] md:text-[9px] lg:text-[10px] text-neutral-400 font-medium">
                             {t.studio_powered || 'Powered by DTL Studio v1.0'}
                         </span>
                         <div className="flex gap-1.5 items-center">
                             <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-green-500 animate-pulse"></span>
                             <span className="text-[8px] md:text-[9px] lg:text-[10px] text-neutral-500 font-bold uppercase tracking-wide">
                                 {t.studio_status || 'Studio Online'}
                             </span>
                         </div>
                      </div>
                </div>
            </div>
        )}

        {/* 2. UPLOAD POPUP */}
        {activeModal === 'upload' && (
            <div className="absolute inset-0 z-[120] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white w-[95%] sm:w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col border border-neutral-100">
                      
                      {/* HEADER */}
                      <div className="relative z-10 p-4 pb-2 flex justify-between items-start border-b border-neutral-50 shrink-0 bg-white">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center border border-orange-600 shadow-sm shrink-0">
                                     <Upload className="text-white w-4 h-4" />
                                 </div>
                                 <div>
                                     <h3 className="text-sm font-black text-neutral-900 uppercase tracking-tight leading-none">
                                         {t.upload_title || 'Upload Fil'}
                                     </h3>
                                 </div>
                              </div>
                              <p className="text-neutral-500 text-[10px] leading-relaxed">
                                 {t.upload_desc || 'Upload billeder eller video til dit bibliotek.'}
                              </p>
                          </div>
                          
                          <button 
                             onClick={() => setActiveModal('none')} 
                             className="text-neutral-400 hover:text-neutral-900 transition-colors hover:bg-neutral-100 p-1.5 rounded-full"
                          >
                             <X size={18} />
                          </button>
                      </div>

                      {/* CONTENT */}
                      <div className="p-4 bg-neutral-50/50">
                         <div 
                              className={`
                                  group w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 gap-3
                                  ${isUploading ? 'bg-orange-50 border-orange-500 cursor-wait' : 'bg-white border-neutral-200 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/5 cursor-pointer hover:-translate-y-0.5'}
                              `}
                              onClick={() => !isUploading && fileInputRef.current?.click()}
                          >
                              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*,.mp4,.mov" onChange={handleFileUpload} />
                              
                              {isUploading ? (
                                  <div className="flex flex-col items-center animate-pulse">
                                      <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                                      <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{t.upload_status || 'Uploader fil...'}</p>
                                  </div>
                              ) : (
                                  <>
                                      <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300 border border-neutral-100 shadow-sm group-hover:shadow-orange-500/30">
                                          <Upload className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors duration-300" />
                                      </div>
                                      <div className="text-center">
                                          <p className="text-xs font-black text-neutral-900 group-hover:text-orange-600 uppercase tracking-wide transition-colors">
                                              {t.upload_btn_click || 'Klik for at vælge fil'}
                                          </p>
                                          <p className="text-[9px] text-neutral-400 mt-1 group-hover:text-neutral-500 transition-colors">{t.upload_format_hint || 'JPG, PNG, MP4 (Max 50MB)'}</p>
                                      </div>
                                  </>
                              )}
                          </div>
                      </div>
                </div>
            </div>
        )}

        {/* 3. YOUTUBE POPUP */}
        {activeModal === 'youtube' && (
            <div className="absolute inset-0 z-[120] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white w-[95%] sm:w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col border border-neutral-100 max-h-[90vh]">

                      {/* HEADER */}
                      <div className="relative z-10 p-4 pb-2 flex justify-between items-start border-b border-neutral-50 shrink-0 bg-white">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center border border-orange-600 shadow-sm shrink-0">
                                     <Youtube className="text-white w-4 h-4" />
                                 </div>
                                 <div>
                                     <h3 className="text-sm font-black text-neutral-900 uppercase tracking-tight leading-none">
                                         {t.youtube_title || 'Tilføj YouTube Link'}
                                     </h3>
                                 </div>
                              </div>
                              <p className="text-neutral-500 text-[10px] leading-relaxed">
                                 {t.youtube_desc || 'Indsæt et link for at integrere video direkte i øvelsen.'}
                              </p>
                          </div>
                          
                          <button 
                             onClick={() => setActiveModal('none')} 
                             className="text-neutral-400 hover:text-neutral-900 transition-colors hover:bg-neutral-100 p-1.5 rounded-full"
                          >
                             <X size={18} />
                          </button>
                      </div>

                      {/* CONTENT */}
                      <div className="p-4 bg-neutral-50/50 overflow-y-auto">
                         <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-bold text-neutral-900 uppercase mb-1.5 block">{t.youtube_label_url || 'Indsæt URL'}</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 text-xs text-neutral-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-neutral-400 shadow-sm"
                                        placeholder={t.ph_youtube_link || "https://youtube.com/watch?v=..."}
                                        value={tempYoutubeLink}
                                        onChange={(e) => setTempYoutubeLink(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <LinkIcon size={14} className="text-neutral-300" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Preview Section */}
                            {getYouTubeID(tempYoutubeLink) ? (
                                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-neutral-200 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src={`https://www.youtube.com/embed/${getYouTubeID(tempYoutubeLink)}`} 
                                        frameBorder="0" 
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="h-1 bg-transparent"></div>
                            )}

                            <button 
                                onClick={handleAddYoutube}
                                disabled={!getYouTubeID(tempYoutubeLink)}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5"
                            >
                                {t.btn_add_video || 'Tilføj til Galleri'}
                            </button>
                         </div>
                      </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}