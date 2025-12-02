// components/library/CreateDrillModal.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Save, Upload, Activity, Users, Target, Plus, Trash2, Shirt, 
  Cone, Image as ImageIcon, Video, Youtube, Link as LinkIcon, 
  Minus, Trophy, TrendingUp, TrendingDown, PackagePlus, Calculator,
  Megaphone, PauseOctagon, ListChecks, ChevronRight, BarChart3,
  Brain, Zap, User, TrafficCone, GitPullRequestArrow, Dumbbell, Lock, Info
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

interface CreateDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'da' | 'en';
  dict: any; 
  onSuccess?: () => void;
}

const AGE_OPTIONS = [
    'U5+', 'U6+', 'U7+', 'U8+', 'U9+', 'U10+', 'U11+', 'U12+', 
    'U13+', 'U14+', 'U15+', 'U16+', 'U17+', 'U19+', 'Senior'
];

const EQUIPMENT_KEYS = [
    'eq_balls', 'eq_cones', 'eq_bibs', 'eq_flatmarkers', 'eq_mannequin', 
    'eq_goal_small', 'eq_goal_large', 'eq_bands', 'eq_ladder', 'eq_hurdles', 'eq_poles'
];

const COLOR_ITEMS = ['eq_cones', 'eq_flatmarkers', 'eq_bibs'];

export default function CreateDrillModal({ isOpen, onClose, lang, dict, onSuccess }: CreateDrillModalProps) {
  if (!isOpen) return null;
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const t = dict?.library || {};

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'practical' | 'data' | 'media'>('practical');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'youtube'>('image');

  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState<MaterialItem>({ name: 'eq_balls', count: 1, details: '' });
  const [customMaterialName, setCustomMaterialName] = useState('');
  
  const [activeCorner, setActiveCorner] = useState<FourCornerTag>('Teknisk');
  const [activeSubCat, setActiveSubCat] = useState<string>(''); 

  const [teams, setTeams] = useState<TeamSetup[]>([
      { name: '', playerCount: 4, color: 'orange' },
      { name: '', playerCount: 4, color: 'white' }
  ]);

  const [formData, setFormData] = useState<Partial<DrillAsset>>({
    title: '',
    description: '',
    mainCategory: 'technical', 
    subCategory: 'Aflevering',
    phase: '', 
    primaryTheme: '',
    secondaryTheme: '',
    durationMin: undefined,
    minPlayers: undefined,
    maxPlayers: undefined,
    workDuration: undefined,
    restDuration: undefined,
    pitchSize: { width: undefined as any, length: undefined as any },
    rules: ['', '', ''],
    coachingPoints: { keyPoints: ['', '', ''], instruction: '' },
    stopFreeze: '',
    progression: [''],
    regression: [''],
    ageGroups: [],
    physicalLoad: 'Aerob – moderat intensitet',
    rpe: 5, 
    accessLevel: 'Personal',
    tags: [],
    materials: [],
    mediaType: 'image',
    gamification: '' 
  });

  const isPremium = ['Expert', 'Complete', 'Elite', 'Enterprise'].includes(user?.subscriptionLevel || '');

  useEffect(() => {
     if (!DRILL_TAGS || !DRILL_TAGS[activeCorner]) return;
     const subCats = Object.keys(DRILL_TAGS[activeCorner]);
     if (!subCats.includes(activeSubCat)) {
         if (subCats.length > 0) setActiveSubCat(subCats[0]);
     }
  }, [activeCorner, activeSubCat]);

  const translateVal = (value: string, type: 'sub' | 'load' | 'tag') => {
     if (lang === 'da') return value; 
     if (type === 'sub' && t.val_sub) return t.val_sub[value] || value;
     if (type === 'load' && t.val_load) return t.val_load[value] || value;
     if (type === 'tag' && t.val_tags) return t.val_tags[value] || value;
     return value;
  };

  const getTrans = (type: 'main' | 'sub', key: string) => {
      const map: Record<string, string> = {
          'general': t.cat_general || 'Generel',
          'warmup': t.cat_warmup || 'Opvarmning',
          'technical': t.cat_technical || 'Teknisk',
          'tactical': t.cat_tactical || 'Taktisk',
          'game_forms': t.cat_game_forms || 'Spilformer',
          'physical': t.cat_physical || 'Fysisk',
          'mental': t.cat_mental || 'Mental',
          'goalkeeper': t.cat_goalkeeper || 'Keepertræning',
          'set_pieces': t.cat_set_pieces || 'Standardsituationer'
      };
      if (!dict?.categories?.[type]) return map[key] || key; 
      return dict.categories[type][key] || map[key] || key;
  };

  const handleMainCategoryChange = (newCategory: MainCategory) => {
      const subCategories = DRILL_CATEGORIES[newCategory];
      setFormData({
          ...formData,
          mainCategory: newCategory,
          subCategory: subCategories ? subCategories[0] : ''
      });
  };

  const updateRule = (index: number, value: string) => {
      const newRules = [...(formData.rules || [])];
      newRules[index] = value;
      setFormData({ ...formData, rules: newRules });
  };
  const addRule = () => setFormData({ ...formData, rules: [...(formData.rules || []), ''] });
  const removeRule = (index: number) => setFormData({ ...formData, rules: (formData.rules || []).filter((_, i) => i !== index) });

  const updateKeyPoint = (index: number, value: string) => {
      const currentPoints = [...(formData.coachingPoints?.keyPoints || [])];
      currentPoints[index] = value;
      setFormData({ 
          ...formData, 
          coachingPoints: { ...formData.coachingPoints!, keyPoints: currentPoints } 
      });
  };
  const addKeyPoint = () => {
      const currentPoints = [...(formData.coachingPoints?.keyPoints || [])];
      setFormData({ 
          ...formData, 
          coachingPoints: { ...formData.coachingPoints!, keyPoints: [...currentPoints, ''] } 
      });
  };
  const removeKeyPoint = (index: number) => {
      const currentPoints = (formData.coachingPoints?.keyPoints || []).filter((_, i) => i !== index);
      setFormData({ 
          ...formData, 
          coachingPoints: { ...formData.coachingPoints!, keyPoints: currentPoints } 
      });
  };

  const updateProgression = (index: number, value: string) => {
      const newItems = [...(formData.progression || [])];
      newItems[index] = value;
      setFormData({ ...formData, progression: newItems });
  };
  const addProgression = () => setFormData(prev => ({ ...prev, progression: [...(prev.progression || []), ''] }));
  const removeProgression = (index: number) => setFormData({ ...formData, progression: (formData.progression || []).filter((_, i) => i !== index) });

  const updateRegression = (index: number, value: string) => {
      const newItems = [...(formData.regression || [])];
      newItems[index] = value;
      setFormData({ ...formData, regression: newItems });
  };
  const addRegression = () => setFormData(prev => ({ ...prev, regression: [...(prev.regression || []), ''] }));
  const removeRegression = (index: number) => setFormData({ ...formData, regression: (formData.regression || []).filter((_, i) => i !== index) });

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
      if (load.includes('lav intensitet')) return 'green';
      if (load.includes('moderat')) return 'yellow';
      return 'red'; 
  };

  const setIntensityByColor = (color: 'green' | 'yellow' | 'red') => {
      let newLoad: PhysicalLoadType = 'Aerob – moderat intensitet';
      let newRPE = 5;

      if (color === 'green') {
          newLoad = 'Aerob – lav intensitet';
          newRPE = 3;
      } else if (color === 'yellow') {
          newLoad = 'Aerob – moderat intensitet';
          newRPE = 6;
      } else if (color === 'red') {
          newLoad = 'Aerob – høj intensitet';
          newRPE = 9;
      }
      setFormData({ ...formData, physicalLoad: newLoad, rpe: newRPE });
  };

  const handleLoadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLoad = e.target.value as PhysicalLoadType;
      let newRPE = formData.rpe || 5;
      if (newLoad.includes('lav intensitet')) newRPE = 3;
      else if (newLoad.includes('moderat')) newRPE = 6;
      else if (newLoad.includes('høj intensitet')) newRPE = 8;
      else if (newLoad.includes('Anaerob')) newRPE = 9; 
      if (newLoad.includes('Produktion') || newLoad.includes('Tolerance')) newRPE = 10; 

      setFormData({ ...formData, physicalLoad: newLoad, rpe: newRPE });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Filen er for stor (Max 5MB)");
    setIsUploading(true);
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const url = await uploadFile(compressedFile, 'drills/images');
      if (url) setFormData(prev => ({ ...prev, thumbnailUrl: url, mediaType: 'image' }));
    } catch (error) { console.error(error); alert("Fejl under upload."); } finally { setIsUploading(false); }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) return alert("Videoen er for stor (Max 50MB)");
    setIsUploading(true);
    try {
      const url = await uploadFile(file, 'drills/videos');
      if (url) setFormData(prev => ({ ...prev, videoUrl: url, mediaType: 'video' }));
    } catch (error) { console.error(error); alert("Fejl under upload."); } finally { setIsUploading(false); }
  };

  const addTeam = () => setTeams([...teams, { name: '', playerCount: 2, color: 'black' }]);
  const removeTeam = (index: number) => setTeams(teams.filter((_, i) => i !== index));
  const updateTeam = (index: number, field: keyof TeamSetup, value: any) => {
      const newTeams = [...teams];
      newTeams[index] = { ...newTeams[index], [field]: value };
      setTeams(newTeams);
  };

  const handleSave = async () => {
    if (!formData.title) return alert(t.ph_title || "Titel mangler!");
    setIsSaving(true);
    try {
      const cleanProgression = (formData.progression || []).filter(s => s.trim() !== '');
      const cleanRegression = (formData.regression || []).filter(s => s.trim() !== '');
      const cleanKeyPoints = (formData.coachingPoints?.keyPoints || []).filter(s => s.trim() !== '');
      const newDrill: DrillAsset = {
        ...formData as DrillAsset,
        authorId: user?.id || 'unknown',
        authorName: user?.name || 'Ukendt Træner',
        clubId: user?.clubId,
        createdAt: new Date(),
        thumbnailUrl: formData.thumbnailUrl || '/images/tactical-analysis.jpeg', 
        videoUrl: formData.videoUrl,
        youtubeUrl: formData.youtubeUrl,
        mediaType: mediaType,
        durationMin: formData.durationMin || 0,
        workDuration: formData.workDuration || 0,
        restDuration: formData.restDuration || 0,
        minPlayers: formData.minPlayers || 0,
        maxPlayers: formData.maxPlayers || 0,
        pitchSize: { width: formData.pitchSize?.width || 0, length: formData.pitchSize?.length || 0 },
        progression: cleanProgression,
        regression: cleanRegression,
        coachingPoints: { ...formData.coachingPoints!, keyPoints: cleanKeyPoints },
        setup: teams 
      };
      const result = await createDrill(newDrill);
      if (result.success) { if (onSuccess) onSuccess(); onClose(); } else { alert("Fejl ved gemning."); }
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const getColorClass = (color: string) => {
      switch(color) {
          case 'orange': return 'bg-orange-500'; 
          case 'red': return 'bg-red-500'; case 'blue': return 'bg-blue-600'; case 'green': return 'bg-green-500'; case 'yellow': return 'bg-yellow-400'; case 'white': return 'bg-white border border-gray-300'; case 'black': return 'bg-black'; default: return 'bg-gray-400';
      }
  };

  const inputClass = "w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400";
  const textareaClass = "w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 min-h-[60px] resize-y";
  const boxBaseClass = "bg-white border border-slate-200 rounded-lg p-3 shadow-sm border-l-4";
  const boxClassBlack = `${boxBaseClass} border-l-slate-900`; 
  const boxClassOrange = `${boxBaseClass} border-l-orange-500`;
  const paramBoxClass = "bg-white border border-slate-200 rounded-lg p-1.5 flex flex-col items-center justify-center shadow-sm border-l-4 border-l-slate-900";
  const boxLabelClass = "text-[9px] font-black text-slate-800 uppercase tracking-wider mb-0.5 text-center w-full";
  const boxInputClass = "w-full text-center bg-slate-50 border border-slate-200 rounded text-xs py-0.5 px-1 text-slate-900 font-bold focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const labelClass = "text-[9px] font-black text-slate-800 uppercase tracking-wider block mb-0.5";
  const addBtnClass = "mt-2 flex items-center gap-1.5 text-[10px] font-medium text-orange-500 px-2 py-1 rounded-md hover:bg-orange-500 hover:text-white transition-all w-fit";

  const getCornerIcon = (corner: FourCornerTag, isActive: boolean) => {
      const iconClass = isActive ? "text-orange-500" : "text-slate-400 group-hover:text-orange-500 transition-colors duration-200";
      switch(corner) {
          case 'Teknisk': return <TrafficCone size={20} className={iconClass} />;
          case 'Taktisk': return <GitPullRequestArrow size={20} className={iconClass} />;
          case 'Fysisk': return <Dumbbell size={20} className={iconClass} />;
          case 'Mentalt': return <Brain size={20} className={iconClass} />;
      }
  };

  const intensity = getIntensityLevel(formData.physicalLoad);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200 relative">
        
        <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-2">
             <span className="bg-orange-500 w-1 h-4 rounded-sm"></span>
             <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
                  {t.create_drill_title || 'Opret Ny Øvelse'}
                </h2>
                <p className="text-[9px] text-slate-400 font-medium">{t.subtitle || 'DTL Asset Management'}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={16} className="text-slate-400 hover:text-slate-900" /></button>
        </div>

        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
            <button onClick={() => setActiveTab('practical')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'practical' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>{t.tab_practical || '1. Praktisk Info'}</button>
            <button onClick={() => setActiveTab('data')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'data' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>{t.tab_data || '2. Data & Analyse'}</button>
            <button onClick={() => setActiveTab('media')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'media' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>{t.tab_media || '3. Medier'}</button>
        </div>

        <div className="p-3 overflow-y-auto custom-scrollbar flex-1 bg-[#F8FAFC]">
          
          {activeTab === 'practical' && (
            <div className="space-y-3">
              <div className={boxClassBlack}>
                  <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-3">
                          <label className={labelClass}>{t.lbl_title || 'ØVELSESNAVN *'}</label>
                          <input type="text" className={inputClass} placeholder={t.ph_title || "Navn på øvelsen..."} value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} autoFocus />
                      </div>
                      <div className="col-span-1">
                          <label className={labelClass}>{t.lbl_age || 'ALDERSGRUPPE'}</label>
                          <select className={inputClass} value={formData.ageGroups?.[0] || ''} onChange={(e) => handleAgeChange(e.target.value)}>
                              <option value="">{t.lbl_choose || 'Vælg...'}</option>
                              {AGE_OPTIONS.map(age => (
                                  <option key={age} value={age}>{age}</option>
                              ))}
                          </select>
                      </div>
                  </div>
              </div>

              <div className={boxClassOrange}>
                <div>
                  <label className={labelClass}>{t.lbl_desc || 'BESKRIVELSE'}</label>
                  <textarea className={textareaClass} placeholder={t.ph_desc || "Kort beskrivelse af øvelsen..."} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="mt-2">
                   <label className={labelClass}>{t.lbl_rules || 'REGLER'}</label>
                   <div className="space-y-1.5">
                      {formData.rules?.map((rule, idx) => (
                          <div key={idx} className="flex gap-1.5 items-center">
                              <span className="text-[10px] font-bold text-slate-400 w-3 text-right">{idx + 1}.</span>
                              <input 
                                type="text" 
                                className={inputClass} 
                                placeholder={`${t.ph_rule || 'Regel'} ${idx + 1}...`} 
                                value={rule} 
                                onChange={(e) => updateRule(idx, e.target.value)} 
                              />
                              {idx > 2 && <button onClick={() => removeRule(idx)} className="text-slate-300 hover:text-red-500"><X size={14}/></button>}
                          </div>
                      ))}
                      <button onClick={addRule} className={`${addBtnClass} ml-5`}>
                          <Plus size={14} /> {t.btn_add_rule || 'Tilføj regel'}
                      </button>
                   </div>
                </div>
              </div>

              <div className={boxClassOrange}>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>
                            {t.lbl_coach_instruction || 'TRÆNER INSTRUKTION'}
                        </label>
                        <textarea 
                            className={textareaClass} 
                            placeholder={t.ph_instruction || "Hvad skal træneren sige/gøre?"}
                            value={formData.coachingPoints?.instruction || ''} 
                            onChange={e => setFormData({...formData, coachingPoints: { ...formData.coachingPoints!, instruction: e.target.value }})} 
                        />
                    </div>
                    <div>
                        <label className={`${labelClass} text-red-600`}>
                            {t.lbl_stop_freeze || 'STOP / FRYS'}
                        </label>
                        <textarea 
                            className={textareaClass} 
                            placeholder={t.ph_stop || "Hvornår stopper vi spillet?"}
                            value={formData.stopFreeze || ''} 
                            onChange={e => setFormData({...formData, stopFreeze: e.target.value })} 
                        />
                    </div>
                </div>
                <div className="mt-2">
                    <label className={labelClass}>
                         {t.lbl_key_points || 'FOKUSPUNKTER'}
                    </label>
                    <div className="space-y-1.5">
                       {formData.coachingPoints?.keyPoints.map((point, idx) => (
                           <div key={idx} className="flex gap-1.5 items-center">
                              <span className="text-[10px] font-bold text-slate-400 w-3 text-right">{idx + 1}.</span>
                              <input 
                                type="text" 
                                className={inputClass} 
                                placeholder={`${t.ph_point || 'Punkt'} ${idx + 1}...`} 
                                value={point} 
                                onChange={(e) => updateKeyPoint(idx, e.target.value)} 
                              />
                              {idx > 2 && <button onClick={() => removeKeyPoint(idx)} className="text-slate-300 hover:text-red-500"><X size={14}/></button>}
                           </div>
                       ))}
                       <button onClick={addKeyPoint} className={`${addBtnClass} ml-5`}>
                          <Plus size={14} /> {t.btn_add_point || 'Tilføj punkt'}
                       </button>
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                  <div className={boxClassOrange}>
                      <label className={`${labelClass} text-orange-600 mb-2`}>
                          {t.lbl_progression || 'PROGRESSION (SVÆRERE)'}
                      </label>
                      <div className="space-y-1.5">
                          {(formData.progression || ['']).map((item, idx) => (
                              <div key={`prog-${idx}`} className="flex gap-1.5 items-center">
                                  <span className="text-[10px] font-bold text-slate-400 w-3 text-center">+</span>
                                  <input type="text" className={inputClass} placeholder="..." value={item} onChange={(e) => updateProgression(idx, e.target.value)} />
                                  {idx > 0 && <button onClick={() => removeProgression(idx)} className="text-slate-300 hover:text-red-500"><X size={14}/></button>}
                              </div>
                          ))}
                          <button onClick={addProgression} className={`${addBtnClass} ml-5`}><Plus size={14} /> {t.mod_btn_add || 'Tilføj'}</button>
                      </div>
                  </div>
                  <div className={boxClassOrange}>
                      <label className={`${labelClass} text-slate-500 mb-2`}>
                          {t.lbl_regression || 'REGRESSION (LETTERE)'}
                      </label>
                      <div className="space-y-1.5">
                          {(formData.regression || ['']).map((item, idx) => (
                              <div key={`reg-${idx}`} className="flex gap-1.5 items-center">
                                  <span className="text-[10px] font-bold text-slate-400 w-3 text-center">-</span>
                                  <input type="text" className={inputClass} placeholder="..." value={item} onChange={(e) => updateRegression(idx, e.target.value)} />
                                  {idx > 0 && <button onClick={() => removeRegression(idx)} className="text-slate-300 hover:text-red-500"><X size={14}/></button>}
                              </div>
                          ))}
                          <button onClick={addRegression} className={`${addBtnClass} ml-5`}><Plus size={14} /> {t.mod_btn_add || 'Tilføj'}</button>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className={paramBoxClass}>
                      <label className={boxLabelClass}>{t.lbl_time || 'TID (MIN)'}</label>
                      <input type="number" className={boxInputClass} value={formData.durationMin || ''} onChange={e => setFormData({...formData, durationMin: (parseInt(e.target.value) || undefined) as any})} placeholder="15" />
                  </div>
                  <div className={paramBoxClass}>
                      <label className={boxLabelClass}>{t.lbl_work_rest || 'ARBEJDE / PAUSE'}</label>
                      <div className="flex items-center justify-center gap-1 w-full">
                          <input type="number" className={boxInputClass} placeholder="4" value={formData.workDuration || ''} onChange={e => setFormData({...formData, workDuration: (parseInt(e.target.value) || undefined) as any})} />
                          <span className="text-slate-300 text-lg font-light">/</span>
                          <input type="number" className={boxInputClass} placeholder="1" value={formData.restDuration || ''} onChange={e => setFormData({...formData, restDuration: (parseInt(e.target.value) || undefined) as any})} />
                      </div>
                  </div>
                  <div className={paramBoxClass}>
                      <label className={boxLabelClass}>{t.lbl_players || 'ANTAL SPILLERE'}</label>
                      <div className="flex items-center justify-center gap-1 w-full">
                          <input type="number" className={boxInputClass} placeholder="Min" value={formData.minPlayers || ''} onChange={e => setFormData({...formData, minPlayers: (parseInt(e.target.value) || undefined) as any})} />
                          <span className="text-slate-300 text-lg font-light">-</span>
                          <input type="number" className={boxInputClass} placeholder="Max" value={formData.maxPlayers || ''} onChange={e => setFormData({...formData, maxPlayers: (parseInt(e.target.value) || undefined) as any})} />
                      </div>
                  </div>
                  <div className={paramBoxClass}>
                      <label className={boxLabelClass}>{t.lbl_pitch || 'BANESTØRRELSE (M)'}</label>
                      <div className="flex items-center justify-center gap-1 w-full">
                          <input type="number" className={boxInputClass} placeholder="30" value={formData.pitchSize?.width || ''} onChange={e => setFormData({...formData, pitchSize: { ...formData.pitchSize!, width: (parseInt(e.target.value) || undefined) as any }})} />
                          <span className="text-slate-300 text-lg font-light">x</span>
                          <input type="number" className={boxInputClass} placeholder="40" value={formData.pitchSize?.length || ''} onChange={e => setFormData({...formData, pitchSize: { ...formData.pitchSize!, length: (parseInt(e.target.value) || undefined) as any }})} />
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className={`${boxClassBlack} md:col-span-2 h-full flex flex-col`}>
                     <label className={labelClass}>{t.lbl_teams || 'ANTAL HOLD'}</label>
                     <div className="space-y-2 flex-1">
                        {teams.map((team, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                                <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${getColorClass(team.color)}`}><Shirt size={12} className={team.color === 'white' ? 'text-black' : 'text-white'} /></div>
                                <div className="flex-1">
                                    <input type="text" value={team.name} onChange={(e) => updateTeam(idx, 'name', e.target.value)} className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none border-b border-transparent focus:border-orange-300 px-1" placeholder={t.ph_team || "Hold Navn"} />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase">{t.mod_mat_count || 'ANTAL'}:</span>
                                    <input type="number" value={team.playerCount} onChange={(e) => updateTeam(idx, 'playerCount', parseInt(e.target.value) || 0)} className="w-8 text-center bg-white border border-slate-300 rounded text-xs py-0.5" />
                                </div>
                                <div className="flex gap-1">
                                    {['orange', 'red', 'blue', 'green', 'yellow', 'white', 'black'].map(c => (
                                        <button key={c} onClick={() => updateTeam(idx, 'color', c as any)} className={`w-3 h-3 rounded-full border border-black/10 ${getColorClass(c)} ${team.color === c ? 'ring-1 ring-offset-1 ring-slate-400' : ''}`} />
                                    ))}
                                </div>
                                <button onClick={() => removeTeam(idx)} className="ml-1 text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                            </div>
                        ))}
                     </div>
                     <button onClick={addTeam} className={addBtnClass}>
                        <Plus size={14} /> {t.btn_add_team || 'Tilføj Hold'}
                     </button>
                  </div>

                  <div className={`${boxClassBlack} h-full flex flex-col`}>
                     <div className="flex justify-between items-center mb-1">
                        <label className={labelClass}>{t.lbl_materials || 'MATERIALER'}</label>
                        {formData.materials && formData.materials.length > 0 && (
                            <span className="text-[9px] text-slate-400">{formData.materials.length}</span>
                        )}
                     </div>
                     
                     <div className="flex-1 bg-white flex flex-col min-h-[60px]">
                        <div className="overflow-y-auto custom-scrollbar flex-1 max-h-[160px]">
                            {formData.materials && formData.materials.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {formData.materials.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-0.5 group">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-[10px] font-bold text-slate-400 w-4">{idx + 1}.</span>
                                                <div className="truncate flex items-center gap-1">
                                                    <span className="text-[10px] font-bold text-slate-900">{t[item.name] || item.name}</span>
                                                    {item.details && <span className="text-[9px] text-slate-400 font-medium truncate">- {item.details}</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-[10px] font-bold text-slate-500">
                                                    {item.count}
                                                </span>
                                                <button onClick={() => removeMaterial(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                    <Trash2 size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-[10px] text-slate-300 italic">
                                    {t.no_materials || 'Ingen materialer'}
                                </div>
                            )}
                        </div>
                     </div>

                     <button onClick={openMaterialModal} className={addBtnClass}>
                        <Plus size={14} /> {t.btn_add_material || 'Tilføj Materiale'}
                     </button>
                  </div>

              </div>
            </div>
          )}

          {/* --- FANE 2: DATA & ANALYSE --- */}
          {activeTab === 'data' && (
            <div className="space-y-3">
              <div className={boxClassBlack}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className={labelClass}>{t.lbl_primary_theme || 'PRIMÆRT TEMA'}</label>
                        <input type="text" className={inputClass} placeholder={t.ph_theme_primary || "Fx Defensiv Org..."} value={formData.primaryTheme || ''} onChange={e => setFormData({...formData, primaryTheme: e.target.value})} />
                    </div>
                    <div>
                        <label className={labelClass}>{t.lbl_secondary_theme || 'SEKUNDÆRT TEMA'}</label>
                        <input type="text" className={inputClass} placeholder={t.ph_theme_secondary || "Fx Genpres..."} value={formData.secondaryTheme || ''} onChange={e => setFormData({...formData, secondaryTheme: e.target.value})} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                   <div>
                      <label className={labelClass}>{t.lbl_main_category || 'HOVEDKATEGORI'}</label>
                      <div className="relative">
                        <select className={`${inputClass} appearance-none pr-6`} value={formData.mainCategory} onChange={e => handleMainCategoryChange(e.target.value as MainCategory)}>
                            {Object.keys(DRILL_CATEGORIES).map(cat => (
                                <option key={cat} value={cat}>{getTrans('main', cat)}</option>
                            ))}
                        </select>
                        <ChevronRight size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 rotate-90" />
                      </div>
                   </div>
                   <div>
                      <label className={labelClass}>{t.lbl_sub_category || 'UNDERKATEGORI'}</label>
                      <div className="relative">
                        <select className={`${inputClass} appearance-none pr-6`} value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}>
                            {formData.mainCategory && DRILL_CATEGORIES[formData.mainCategory as MainCategory] && DRILL_CATEGORIES[formData.mainCategory as MainCategory].map(sub => (
                                <option key={sub} value={sub}>{translateVal(sub, 'sub')}</option>
                            ))}
                        </select>
                        <ChevronRight size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 rotate-90" />
                      </div>
                   </div>
                </div>
                
                <div className="mb-1">
                    <label className={labelClass}>{t.lbl_visibility || 'SYNLIGHED'}</label>
                    <select className={inputClass} value={formData.accessLevel} onChange={e => setFormData({...formData, accessLevel: e.target.value as any})}>
                        <option value="Personal">{t.access_personal || 'Personligt (Kun mig)'}</option>
                        <option value="Club">{t.access_club || 'Klubben (Alle trænere)'}</option>
                        <option value="Global">{t.access_global || 'Global (DTL Community)'}</option>
                    </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                  <div className={boxClassOrange}>
                       <div className="flex items-center justify-between mb-1">
                            <label className={labelClass + " mb-0"}>{t.lbl_physical_load || 'FYSISK BELASTNING'}</label>
                            <div className="flex items-center gap-1.5">
                                <button onClick={() => setIntensityByColor('green')} className={`w-3 h-3 rounded-full border transition-all ${intensity === 'green' ? 'bg-green-500 border-green-600 scale-125 shadow-sm' : 'bg-green-100 border-green-200 hover:bg-green-300'}`} title="Lav Intensitet" />
                                <button onClick={() => setIntensityByColor('yellow')} className={`w-3 h-3 rounded-full border transition-all ${intensity === 'yellow' ? 'bg-yellow-400 border-yellow-500 scale-125 shadow-sm' : 'bg-yellow-100 border-yellow-200 hover:bg-yellow-200'}`} title="Middel Intensitet" />
                                <button onClick={() => setIntensityByColor('red')} className={`w-3 h-3 rounded-full border transition-all ${intensity === 'red' ? 'bg-red-500 border-red-600 scale-125 shadow-sm' : 'bg-red-100 border-red-200 hover:bg-red-300'}`} title="Høj Intensitet" />
                            </div>
                       </div>
                       <select className={inputClass} value={formData.physicalLoad} onChange={handleLoadChange}>
                          <option value="Aerob – lav intensitet">{translateVal('Aerob – lav intensitet', 'load')}</option>
                          <option value="Aerob – moderat intensitet">{translateVal('Aerob – moderat intensitet', 'load')}</option>
                          <option value="Aerob – høj intensitet">{translateVal('Aerob – høj intensitet', 'load')}</option>
                          <option value="Anaerob – Sprint">{translateVal('Anaerob – Sprint', 'load')}</option>
                          <option value="Anaerob – Sprint udholdenhed">{translateVal('Anaerob – Sprint udholdenhed', 'load')}</option>
                          <option value="Anaerob – Produktion">{translateVal('Anaerob – Produktion', 'load')}</option>
                          <option value="Anaerob – Tolerance">{translateVal('Anaerob – Tolerance', 'load')}</option>
                        </select>
                  </div>
                  
                  <div className={boxClassOrange}>
                       <div className="relative h-full flex flex-col justify-center">
                            {!isPremium && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] z-10 flex items-center justify-center rounded">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <Lock size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{t.premium_feature || 'PREMIUM'}</span>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-1">
                                    <label className={labelClass + " mb-0"}>{t.lbl_rpe || 'RPE (INTENSITET 1-10)'}</label>
                                    <div className="group relative">
                                        <Info size={12} className="text-slate-400 cursor-help hover:text-slate-600" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-slate-900 text-white text-[9px] p-3 rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed border border-slate-700">
                                            <p className="font-bold text-orange-400 mb-1.5 border-b border-slate-700 pb-1">{t.rpe_info_title || 'RPE Skala (Borg)'}</p>
                                            <ul className="space-y-1.5">
                                                <li><strong className="text-red-500">10:</strong> {t.rpe_10 || 'Maksimal indsats.'}</li>
                                                <li><strong className="text-orange-500">9:</strong> {t.rpe_9 || 'En gentagelse mere.'}</li>
                                                <li><strong className="text-orange-400">8:</strong> {t.rpe_8 || 'To gentagelser mere.'}</li>
                                                <li><strong className="text-yellow-400">7:</strong> {t.rpe_7 || 'Tre gentagelser mere.'}</li>
                                                <li><strong className="text-yellow-300">6:</strong> {t.rpe_6 || 'Relativt let.'}</li>
                                                <li><strong className="text-green-400">1-5:</strong> {t.rpe_1_5 || 'Meget let.'}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-1.5 rounded ${(formData.rpe || 5) > 7 ? 'text-red-600 bg-red-50' : (formData.rpe || 5) > 4 ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50'}`}>{formData.rpe || 5}</span>
                            </div>
                            <input type="range" min="1" max="10" step="1" value={formData.rpe || 5} onChange={(e) => setFormData({...formData, rpe: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500" disabled={!isPremium} />
                            <div className="flex justify-between text-[8px] text-slate-400 font-medium mt-1">
                                <span>{t.rpe_easy || 'Let'} (1)</span>
                                <span>{t.rpe_hard || 'Hård'} (10)</span>
                            </div>
                       </div>
                  </div>
              </div>

              <div className={boxClassOrange}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-wider">{t.lbl_tags_header || 'ØVELSENS (TAGS)'}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">{t.lbl_tags_select || 'Vælg for at definere'}</span>
                </div>
                
                <div className="flex gap-2 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {(['Teknisk', 'Taktisk', 'Fysisk', 'Mentalt'] as FourCornerTag[]).map(corner => {
                        const isActive = activeCorner === corner;
                        return (
                            <button key={corner} onClick={() => setActiveCorner(corner)} className={`relative flex-1 py-2 flex items-center justify-center rounded-lg border transition-all duration-200 group ${isActive ? 'bg-black border-black text-white shadow-md transform -translate-y-0.5' : 'bg-white border-slate-200 text-slate-500 hover:border-orange-500'}`}>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">{getCornerIcon(corner, isActive)}</div>
                                <span className={`text-[11px] font-black uppercase tracking-wider transition-colors duration-200 w-full text-center ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-orange-500'}`}>{corner}</span>
                            </button>
                        )
                    })}
                </div>

                <div className="mb-3 overflow-x-auto custom-scrollbar p-1"> 
                    <div className="flex flex-wrap gap-2">
                        {DRILL_TAGS && DRILL_TAGS[activeCorner] && Object.keys(DRILL_TAGS[activeCorner]).map(sub => (
                            <button key={sub} onClick={() => setActiveSubCat(sub)} className={`px-3 py-1.5 text-[10px] font-bold rounded-full whitespace-nowrap transition-all duration-200 ${activeSubCat === sub ? 'bg-white border-2 border-orange-500 text-orange-600 shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:border-orange-500 hover:text-orange-500 hover:-translate-y-0.5'}`}>
                                {translateVal(sub, 'sub')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4 max-h-[120px] overflow-y-auto custom-scrollbar p-1">
                    {DRILL_TAGS && DRILL_TAGS[activeCorner] && activeSubCat && DRILL_TAGS[activeCorner][activeSubCat] ? (
                        DRILL_TAGS[activeCorner][activeSubCat].map(tag => {
                        const isSelected = formData.tags?.includes(tag);
                        return (
                            <button key={tag} onClick={() => toggleDetailedTag(tag)} className={`text-left px-2 py-1.5 rounded text-[10px] font-medium border transition-all flex items-center justify-between group ${isSelected ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'}`}>
                                <span className="truncate pr-1">{translateVal(tag, 'tag')}</span>
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
                            </button>
                        )})
                    ) : (
                        <div className="col-span-4 text-center text-[10px] text-slate-400 italic py-4">Indlæser tags...</div>
                    )}
                </div>

                {formData.tags && formData.tags.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                        <label className={labelClass}>{t.lbl_selected_tags || 'VALGTE TAGS'}</label>
                        <div className="flex flex-wrap gap-1.5">
                            {formData.tags.map(tag => (
                                <span key={tag} className="bg-slate-800 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                    {translateVal(tag, 'tag')} <button onClick={() => toggleDetailedTag(tag)} className="hover:text-red-300"><X size={10} /></button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            </div>
          )}

          {/* --- FANE 3: MEDIER --- */}
          {activeTab === 'media' && (
            <div className="space-y-3">
              <div className={boxClassBlack}>
                 <div className="flex gap-4 mb-3 border-b border-slate-100 pb-1">
                    <button onClick={() => setMediaType('image')} className={`text-[10px] font-bold flex items-center gap-1 pb-1 border-b-2 transition-colors ${mediaType === 'image' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400'}`}><ImageIcon size={12} /> {t.btn_image || 'Billede'}</button>
                    <button onClick={() => setMediaType('video')} className={`text-[10px] font-bold flex items-center gap-1 pb-1 border-b-2 transition-colors ${mediaType === 'video' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400'}`}><Video size={12} /> {t.btn_video || 'Video Upload'}</button>
                    <button onClick={() => setMediaType('youtube')} className={`text-[10px] font-bold flex items-center gap-1 pb-1 border-b-2 transition-colors ${mediaType === 'youtube' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400'}`}><Youtube size={12} /> {t.btn_youtube || 'YouTube Link'}</button>
                 </div>
                 
                 {mediaType === 'image' && (
                    <div className={`relative bg-slate-50 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer group flex items-center justify-center min-h-[100px] ${isUploading ? 'border-orange-300' : 'border-slate-300 hover:border-orange-400'}`} onClick={() => !isUploading && fileInputRef.current?.click()}>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        {formData.thumbnailUrl && formData.mediaType !== 'video' ? (
                            <img src={formData.thumbnailUrl} alt="Preview" className="h-24 object-contain rounded" />
                        ) : (
                            <div className="text-center text-slate-400">{isUploading ? <Activity className="animate-spin mx-auto text-orange-500" /> : <Upload className="mx-auto mb-1 w-6 h-6 text-slate-300" />}<span className="text-[10px] font-medium">{t.upload_image_text || 'Upload billede'}</span></div>
                        )}
                    </div>
                 )}

                 {mediaType === 'video' && (
                    <div className={`relative bg-slate-50 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer group flex items-center justify-center min-h-[100px] ${isUploading ? 'border-orange-300' : 'border-slate-300 hover:border-orange-400'}`} onClick={() => !isUploading && videoInputRef.current?.click()}>
                        <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={handleVideoUpload} />
                        {formData.videoUrl ? (
                            <div className="text-center"><Video className="mx-auto text-green-500 mb-1 w-6 h-6" /><span className="text-[10px] font-bold text-green-600">{t.video_uploaded || 'Video uploadet!'}</span></div>
                        ) : (
                            <div className="text-center text-slate-400">{isUploading ? <Activity className="animate-spin mx-auto text-orange-500" /> : <Video className="mx-auto mb-1 w-6 h-6 text-slate-300" />}<span className="text-[10px] font-medium">{t.upload_video_text || 'Upload videofil'}</span></div>
                        )}
                    </div>
                 )}

                 {mediaType === 'youtube' && (
                    <div className="space-y-1">
                        <label className={labelClass}>{t.btn_youtube || 'YOUTUBE LINK'}</label>
                        <div className="relative">
                            <LinkIcon size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" className={`${inputClass} pl-8 text-xs`} placeholder="https://youtube.com/watch?v=..." value={formData.youtubeUrl || ''} onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value, mediaType: 'youtube'})} />
                        </div>
                    </div>
                 )}
              </div>
            </div>
          )}

        </div>

        <div className="px-3 py-2 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
           <div className="text-[10px] text-slate-500 font-medium">
             {t.step_indicator?.replace('{{current}}', activeTab === 'practical' ? '1' : activeTab === 'data' ? '2' : '3') || `Trin ${activeTab === 'practical' ? '1' : activeTab === 'data' ? '2' : '3'} af 3`}
           </div>
           <div className="flex gap-2">
             {activeTab !== 'practical' && (
               <button onClick={() => setActiveTab(prev => prev === 'media' ? 'data' : 'practical')} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">{t.btn_back || 'Tilbage'}</button>
             )}
             {activeTab === 'media' ? (
               <button onClick={handleSave} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all hover:-translate-y-0.5 disabled:opacity-50">{isSaving ? (t.btn_saving || 'Gemmer...') : <><Save size={14} /> {t.btn_save || 'Gem Øvelse'}</>}</button>
             ) : (
               <button onClick={() => setActiveTab(prev => prev === 'practical' ? 'data' : 'media')} className="bg-slate-900 hover:bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all">{t.btn_next || 'Næste'}</button>
             )}
           </div>
        </div>
        
        {isMaterialModalOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-[300px] p-4 space-y-3 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide">{t.mod_mat_title || 'Tilføj Materiale'}</h3>
                        <button onClick={() => setIsMaterialModalOpen(false)} className="text-slate-400 hover:text-black"><X size={14}/></button>
                    </div>
                    
                    <div className="space-y-2">
                        <div>
                            <label className={labelClass}>{t.mod_mat_type || 'TYPE'}</label>
                            <select 
                                className={inputClass}
                                value={newMaterial.name}
                                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                            >
                                {EQUIPMENT_KEYS.map(key => (
                                    <option key={key} value={key}>{t[key] || key}</option>
                                ))}
                                <option value="eq_other">{t.eq_other || 'Andet...'}</option>
                            </select>
                        </div>

                        {newMaterial.name === 'eq_other' && (
                            <div>
                                <label className={labelClass}>{t.mod_mat_name || 'NAVN'}</label>
                                <input 
                                    type="text" 
                                    className={inputClass}
                                    placeholder="Fx Rebounder..."
                                    value={customMaterialName}
                                    onChange={(e) => setCustomMaterialName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}

                        <div>
                            <label className={labelClass}>
                                {COLOR_ITEMS.includes(newMaterial.name) ? (t.mod_mat_colors || 'ANTAL FARVER') : (t.mod_mat_count || 'ANTAL')}
                            </label>
                            <input 
                                type="number" 
                                className={inputClass}
                                value={newMaterial.count}
                                onChange={(e) => setNewMaterial({ ...newMaterial, count: parseInt(e.target.value) || 1 })}
                                min="1"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>{t.mod_mat_details || 'DETALJER (VALGFRI)'}</label>
                            <input 
                                type="text" 
                                className={inputClass} 
                                placeholder={t.ph_mat_details || "Fx 3 farver, Str. 5, Store..."} 
                                value={newMaterial.details} 
                                onChange={(e) => setNewMaterial({ ...newMaterial, details: e.target.value })} 
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                        <button onClick={() => setIsMaterialModalOpen(false)} className="flex-1 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg">{t.mod_btn_cancel || 'Annuller'}</button>
                        <button onClick={saveMaterialFromModal} className="flex-1 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-slate-800">{t.mod_btn_add || 'Tilføj'}</button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}