// components/library/CreateDrillModal.tsx
"use client";

import React, { useState, useRef } from 'react';
import { 
  X, Save, Upload, Activity, Users, Target, Plus, Trash2, Shirt, 
  Cone, Image as ImageIcon, Video, Youtube, Link as LinkIcon, 
  Minus, Trophy, TrendingUp, TrendingDown, PackagePlus, Calculator,
  Megaphone, PauseOctagon, ListChecks
} from 'lucide-react';
import { DrillAsset, PhysicalLoadType, FourCornerTag, TeamSetup, DRILL_CATEGORIES, MainCategory, MaterialItem } from '@/lib/server/libraryData';
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

const EQUIPMENT_LIST = [
    'Bolde', 'Kegler', 'Overtrækstrøjer', 'Flatmarkers', 'Frisparksmand', 
    'Mål (lille)', 'Mål (stor)', 'Elastikker', 'Agility Stige', 'Hække', 'Stænger'
];

const COLOR_ITEMS = ['Kegler', 'Flatmarkers', 'Overtrækstrøjer'];

export default function CreateDrillModal({ isOpen, onClose, lang, dict, onSuccess }: CreateDrillModalProps) {
  if (!isOpen) return null;
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'practical' | 'data' | 'media'>('practical');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'youtube'>('image');

  // --- POPUP STATE ---
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState<MaterialItem>({ name: 'Bolde', count: 1, details: '' });
  const [customMaterialName, setCustomMaterialName] = useState('');
  // -------------------

  const [teams, setTeams] = useState<TeamSetup[]>([
      { name: 'Hold 1', playerCount: 4, color: 'orange' },
      { name: 'Hold 2', playerCount: 4, color: 'white' }
  ]);

  const [formData, setFormData] = useState<Partial<DrillAsset>>({
    title: '',
    description: '',
    mainCategory: 'buildup_phase_2',
    subCategory: 'breaking_lines',
    
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
    accessLevel: 'Personal',
    tags: [],
    materials: [],
    mediaType: 'image',
    technicalGoals: [],
    tacticalGoals: [],
    mentalGoals: [],
    gamification: '' 
  });

  const getTrans = (type: 'main' | 'sub', key: string) => {
      if (!dict?.categories?.[type]) return key; 
      return dict.categories[type][key] || key;
  };

  const handleMainCategoryChange = (newCategory: MainCategory) => {
      const subCategories = DRILL_CATEGORIES[newCategory];
      setFormData({
          ...formData,
          mainCategory: newCategory,
          subCategory: subCategories[0] || ''
      });
  };

  // --- DYNAMIC RULES ---
  const updateRule = (index: number, value: string) => {
      const newRules = [...(formData.rules || [])];
      newRules[index] = value;
      setFormData({ ...formData, rules: newRules });
  };
  const addRule = () => setFormData({ ...formData, rules: [...(formData.rules || []), ''] });
  const removeRule = (index: number) => setFormData({ ...formData, rules: (formData.rules || []).filter((_, i) => i !== index) });

  // --- DYNAMIC KEY POINTS ---
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

  // --- PROGRESSION LOGIC ---
  const updateProgression = (index: number, value: string) => {
      const newItems = [...(formData.progression || [])];
      newItems[index] = value;
      setFormData({ ...formData, progression: newItems });
  };
  const addProgression = () => {
      setFormData(prev => ({ ...prev, progression: [...(prev.progression || []), ''] }));
  };
  const removeProgression = (index: number) => {
      const newItems = (formData.progression || []).filter((_, i) => i !== index);
      setFormData({ ...formData, progression: newItems });
  };

  // --- REGRESSION LOGIC ---
  const updateRegression = (index: number, value: string) => {
      const newItems = [...(formData.regression || [])];
      newItems[index] = value;
      setFormData({ ...formData, regression: newItems });
  };
  const addRegression = () => {
      setFormData(prev => ({ ...prev, regression: [...(prev.regression || []), ''] }));
  };
  const removeRegression = (index: number) => {
      const newItems = (formData.regression || []).filter((_, i) => i !== index);
      setFormData({ ...formData, regression: newItems });
  };

  const handleAgeChange = (val: string) => { setFormData({ ...formData, ageGroups: [val] }); };

  // --- MATERIALE POPUP ---
  const openMaterialModal = () => {
      setNewMaterial({ name: 'Bolde', count: 1, details: '' });
      setCustomMaterialName('');
      setIsMaterialModalOpen(true);
  };

  const saveMaterialFromModal = () => {
      const finalName = newMaterial.name === 'Andet' ? customMaterialName : newMaterial.name;
      if (!finalName.trim()) return;

      setFormData(prev => ({
          ...prev,
          materials: [...(prev.materials || []), { ...newMaterial, name: finalName }]
      }));
      setIsMaterialModalOpen(false);
  };

  const removeMaterial = (index: number) => {
      setFormData(prev => ({
          ...prev,
          materials: (prev.materials || []).filter((_, i) => i !== index)
      }));
  };
  // --------------------------------

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

  const addTeam = () => setTeams([...teams, { name: `Hold ${teams.length + 1}`, playerCount: 2, color: 'black' }]);
  const removeTeam = (index: number) => setTeams(teams.filter((_, i) => i !== index));
  const updateTeam = (index: number, field: keyof TeamSetup, value: any) => {
      const newTeams = [...teams];
      newTeams[index] = { ...newTeams[index], [field]: value };
      setTeams(newTeams);
  };

  const handleSave = async () => {
    if (!formData.title) return alert("Titel mangler!");

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
        pitchSize: { 
            width: formData.pitchSize?.width || 0, 
            length: formData.pitchSize?.length || 0 
        },
        
        progression: cleanProgression,
        regression: cleanRegression,
        coachingPoints: {
            ...formData.coachingPoints!,
            keyPoints: cleanKeyPoints
        },
        setup: teams 
      };
      const result = await createDrill(newDrill);
      if (result.success) { if (onSuccess) onSuccess(); onClose(); } else { alert("Fejl ved gemning."); }
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const toggleTag = (tag: FourCornerTag) => {
    setFormData(prev => {
      const currentTags = prev.tags || [];
      return currentTags.includes(tag) ? { ...prev, tags: currentTags.filter(t => t !== tag) } : { ...prev, tags: [...currentTags, tag] };
    });
  };

  const getColorClass = (color: string) => {
      switch(color) {
          case 'orange': return 'bg-orange-500'; 
          case 'red': return 'bg-red-500'; case 'blue': return 'bg-blue-600'; case 'green': return 'bg-green-500'; case 'yellow': return 'bg-yellow-400'; case 'white': return 'bg-white border border-gray-300'; case 'black': return 'bg-black'; default: return 'bg-gray-400';
      }
  };

  // --- COMPACT STYLES ---
  // Ændret: text-xs (12px) fixed, ingen sm:text-sm
  const inputClass = "w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400";
  const textareaClass = "w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 min-h-[60px] resize-y";
  
  const boxBaseClass = "bg-white border border-slate-200 rounded-lg p-3 shadow-sm border-l-4";
  const boxClassBlack = `${boxBaseClass} border-l-slate-900`; 
  const boxClassOrange = `${boxBaseClass} border-l-orange-500`;

  const paramBoxClass = "bg-white border border-slate-200 rounded-lg p-1.5 flex flex-col items-center justify-center shadow-sm border-l-4 border-l-slate-900";

  const boxLabelClass = "text-[9px] font-black text-slate-800 uppercase tracking-wider mb-0.5 text-center w-full";
  // Ændret: text-xs (12px) for tal-inputs
  const boxInputClass = "w-full text-center bg-slate-50 border border-slate-200 rounded text-xs py-0.5 px-1 text-slate-900 font-bold focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  
  const labelClass = "text-[9px] font-black text-slate-800 uppercase tracking-wider block mb-0.5";
  const addBtnClass = "mt-2 flex items-center gap-1.5 text-[10px] font-medium text-orange-500 px-2 py-1 rounded-md hover:bg-orange-500 hover:text-white transition-all w-fit";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200 relative">
        
        {/* Header - Compact */}
        <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-2">
             <span className="bg-orange-500 w-1 h-4 rounded-sm"></span>
             <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
                  {lang === 'da' ? 'Opret Ny Øvelse' : 'Create New Drill'}
                </h2>
                <p className="text-[9px] text-slate-400 font-medium">DTL Asset Management</p>
             </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={16} className="text-slate-400 hover:text-slate-900" /></button>
        </div>

        {/* Tabs - Compact */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
            <button onClick={() => setActiveTab('practical')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'practical' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>1. Praktisk Info</button>
            <button onClick={() => setActiveTab('data')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'data' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>2. Data & Analyse</button>
            <button onClick={() => setActiveTab('media')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'media' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>3. Medier</button>
        </div>

        {/* Content - Compact Padding */}
        <div className="p-3 overflow-y-auto custom-scrollbar flex-1 bg-[#F8FAFC]">
          
          {/* --- FANE 1: PRAKTISK --- */}
          {activeTab === 'practical' && (
            <div className="space-y-3">
              
              {/* Titel & Alder - SORT KANT */}
              <div className={boxClassBlack}>
                  <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-3">
                          <label className={labelClass}>ØVELSESNAVN *</label>
                          <input type="text" className={inputClass} placeholder="Navn på øvelsen..." value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} autoFocus />
                      </div>
                      <div className="col-span-1">
                          <label className={labelClass}>ALDERSGRUPPE</label>
                          <select className={inputClass} value={formData.ageGroups?.[0] || ''} onChange={(e) => handleAgeChange(e.target.value)}>
                              <option value="">Vælg...</option>
                              {AGE_OPTIONS.map(age => (
                                  <option key={age} value={age}>{age}</option>
                              ))}
                          </select>
                      </div>
                  </div>
              </div>

              {/* Beskrivelse & Regler - ORANGE KANT */}
              <div className={boxClassOrange}>
                <div>
                  <label className={labelClass}>BESKRIVELSE</label>
                  <textarea className={textareaClass} placeholder="Kort beskrivelse af øvelsen..." value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="mt-2">
                   <label className={labelClass}>REGLER</label>
                   <div className="space-y-1.5">
                      {formData.rules?.map((rule, idx) => (
                          <div key={idx} className="flex gap-1.5 items-center">
                              <span className="text-[10px] font-bold text-slate-400 w-3 text-right">{idx + 1}.</span>
                              <input type="text" className={inputClass} placeholder={`Regel ${idx + 1}...`} value={rule} onChange={(e) => updateRule(idx, e.target.value)} />
                              {idx > 2 && <button onClick={() => removeRule(idx)} className="text-slate-300 hover:text-red-500"><X size={14}/></button>}
                          </div>
                      ))}
                      <button onClick={addRule} className={`${addBtnClass} ml-5`}>
                          <Plus size={14} /> {lang === 'da' ? 'Tilføj regel' : 'Add rule'}
                      </button>
                   </div>
                </div>
              </div>

              {/* TRÆNER FOKUS (KOMPAKT & ORANGE KANT - NYT LAYOUT) */}
              <div className={boxClassOrange}>
                {/* Top: Instruktion & Stop/Frys */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>
                            {lang === 'da' ? 'TRÆNER INSTRUKTION' : 'COACH INSTRUCTION'}
                        </label>
                        <textarea 
                            className={textareaClass} 
                            placeholder="Hvad skal træneren sige/gøre?"
                            value={formData.coachingPoints?.instruction || ''} 
                            onChange={e => setFormData({...formData, coachingPoints: { ...formData.coachingPoints!, instruction: e.target.value }})} 
                        />
                    </div>
                    <div>
                        <label className={`${labelClass} text-red-600`}>
                            STOP / FRYS
                        </label>
                        <textarea 
                            className={textareaClass} 
                            placeholder="Hvornår stopper vi spillet?"
                            value={formData.stopFreeze || ''} 
                            onChange={e => setFormData({...formData, stopFreeze: e.target.value })} 
                        />
                    </div>
                </div>
                
                {/* Bund: Fokuspunkter */}
                <div className="mt-2">
                    <label className={labelClass}>
                         {lang === 'da' ? 'FOKUSPUNKTER' : 'KEY POINTS'}
                    </label>
                    <div className="space-y-1.5">
                       {formData.coachingPoints?.keyPoints.map((point, idx) => (
                           <div key={idx} className="flex gap-1.5 items-center">
                              <span className="text-[10px] font-bold text-slate-400 w-3 text-right">{idx + 1}.</span>
                              <input 
                                type="text" 
                                className={inputClass} 
                                placeholder={`Punkt ${idx + 1}...`} 
                                value={point} 
                                onChange={(e) => updateKeyPoint(idx, e.target.value)} 
                              />
                              {idx > 2 && <button onClick={() => removeKeyPoint(idx)} className="text-slate-300 hover:text-red-500"><X size={14}/></button>}
                           </div>
                       ))}
                       <button onClick={addKeyPoint} className={`${addBtnClass} ml-5`}>
                          <Plus size={14} /> {lang === 'da' ? 'Tilføj punkt' : 'Add point'}
                       </button>
                    </div>
                </div>
              </div>

              {/* PROGRESSION & REGRESSION (KOMPAKT & ORANGE KANT) */}
              <div className="grid grid-cols-2 gap-3">
                  {/* Progression */}
                  <div className={boxClassOrange}>
                      <label className={`${labelClass} text-orange-600 mb-2`}>
                          PROGRESSION (SVÆRERE)
                      </label>
                      <div className="space-y-1.5">
                          {(formData.progression || ['']).map((item, idx) => (
                              <div key={`prog-${idx}`} className="flex gap-1.5 items-center">
                                  <span className="text-[10px] font-bold text-slate-400 w-3 text-center">+</span>
                                  <input 
                                    type="text" 
                                    className={inputClass} 
                                    placeholder="..." 
                                    value={item} 
                                    onChange={(e) => updateProgression(idx, e.target.value)} 
                                  />
                                  {idx > 0 && (
                                      <button onClick={() => removeProgression(idx)} className="text-slate-300 hover:text-red-500">
                                          <X size={14} />
                                      </button>
                                  )}
                              </div>
                          ))}
                          <button onClick={addProgression} className={`${addBtnClass} ml-5`}>
                              <Plus size={14} /> {lang === 'da' ? 'Tilføj' : 'Add'}
                          </button>
                      </div>
                  </div>

                  {/* Regression */}
                  <div className={boxClassOrange}>
                      <label className={`${labelClass} text-slate-500 mb-2`}>
                          REGRESSION (LETTERE)
                      </label>
                      <div className="space-y-1.5">
                          {(formData.regression || ['']).map((item, idx) => (
                              <div key={`reg-${idx}`} className="flex gap-1.5 items-center">
                                  <span className="text-[10px] font-bold text-slate-400 w-3 text-center">-</span>
                                  <input 
                                    type="text" 
                                    className={inputClass} 
                                    placeholder="..." 
                                    value={item} 
                                    onChange={(e) => updateRegression(idx, e.target.value)} 
                                  />
                                  {idx > 0 && (
                                      <button onClick={() => removeRegression(idx)} className="text-slate-300 hover:text-red-500">
                                          <X size={14} />
                                      </button>
                                  )}
                              </div>
                          ))}
                          <button onClick={addRegression} className={`${addBtnClass} ml-5`}>
                              <Plus size={14} /> {lang === 'da' ? 'Tilføj' : 'Add'}
                          </button>
                      </div>
                  </div>
              </div>

              {/* PARAMETRE (SORT KANT - KOMPAKT) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className={paramBoxClass}>
                      <label className={boxLabelClass}>TID (MIN)</label>
                      <input type="number" className={boxInputClass} 
                             value={formData.durationMin || ''} 
                             onChange={e => setFormData({...formData, durationMin: (parseInt(e.target.value) || undefined) as any})} 
                             placeholder="15" />
                  </div>
                  <div className={paramBoxClass}>
                      <label className={boxLabelClass}>ARBEJDE / PAUSE</label>
                      <div className="flex items-center justify-center gap-1 w-full">
                          <input type="number" className={boxInputClass} 
                                 placeholder="4" value={formData.workDuration || ''} 
                                 onChange={e => setFormData({...formData, workDuration: (parseInt(e.target.value) || undefined) as any})} 
                          />
                          <span className="text-slate-300 text-lg font-light">/</span>
                          <input type="number" className={boxInputClass} 
                                 placeholder="1" value={formData.restDuration || ''} 
                                 onChange={e => setFormData({...formData, restDuration: (parseInt(e.target.value) || undefined) as any})} 
                          />
                      </div>
                  </div>
                  <div className={paramBoxClass}>
                      <label className={boxLabelClass}>ANTAL SPILLERE</label>
                      <div className="flex items-center justify-center gap-1 w-full">
                          <input type="number" className={boxInputClass} 
                                 placeholder="Min" value={formData.minPlayers || ''} 
                                 onChange={e => setFormData({...formData, minPlayers: (parseInt(e.target.value) || undefined) as any})} 
                          />
                          <span className="text-slate-300 text-lg font-light">-</span>
                          <input type="number" className={boxInputClass} 
                                 placeholder="Max" value={formData.maxPlayers || ''} 
                                 onChange={e => setFormData({...formData, maxPlayers: (parseInt(e.target.value) || undefined) as any})} 
                          />
                      </div>
                  </div>
                  <div className={paramBoxClass}>
                      <label className={boxLabelClass}>BANESTØRRELSE (M)</label>
                      <div className="flex items-center justify-center gap-1 w-full">
                          <input type="number" className={boxInputClass} 
                                 placeholder="30" value={formData.pitchSize?.width || ''} 
                                 onChange={e => setFormData({...formData, pitchSize: { ...formData.pitchSize!, width: (parseInt(e.target.value) || undefined) as any }})} 
                          />
                          <span className="text-slate-300 text-lg font-light">x</span>
                          <input type="number" className={boxInputClass} 
                                 placeholder="40" value={formData.pitchSize?.length || ''} 
                                 onChange={e => setFormData({...formData, pitchSize: { ...formData.pitchSize!, length: (parseInt(e.target.value) || undefined) as any }})} 
                          />
                      </div>
                  </div>
              </div>

              {/* HOLD & MATERIALER (SORT KANT - KOMPAKT) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* VENSTRE KOLONNE: ANTAL HOLD (2/3) */}
                  <div className={`${boxClassBlack} md:col-span-2 h-full flex flex-col`}>
                     <label className={labelClass}>
                         {lang === 'da' ? 'ANTAL HOLD' : 'NUMBER OF TEAMS'}
                     </label>
                     <div className="space-y-2 flex-1">
                        {teams.map((team, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                                <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${getColorClass(team.color)}`}><Shirt size={12} className={team.color === 'white' ? 'text-black' : 'text-white'} /></div>
                                <div className="flex-1">
                                    <input type="text" value={team.name} onChange={(e) => updateTeam(idx, 'name', e.target.value)} className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none border-b border-transparent focus:border-orange-300 px-1" placeholder="Hold Navn" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase">ANTAL:</span>
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
                        <Plus size={14} /> {lang === 'da' ? 'Tilføj Hold' : 'Add Team'}
                     </button>
                  </div>

                  {/* HØJRE KOLONNE: MATERIALER (1/3) */}
                  <div className={`${boxClassBlack} h-full flex flex-col`}>
                     <div className="flex justify-between items-center mb-1">
                        <label className={labelClass}>MATERIALER</label>
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
                                                    <span className="text-[10px] font-bold text-slate-900">{item.name}</span>
                                                    {item.details && <span className="text-[9px] text-slate-400 font-medium truncate">- {item.details}</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-[10px] font-bold text-slate-500">
                                                    {item.count} {COLOR_ITEMS.includes(item.name) ? (lang === 'da' ? 'farver' : 'colors') : (lang === 'da' ? 'stk' : 'pcs')}
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
                                    {lang === 'da' ? 'Ingen materialer' : 'No equipment'}
                                </div>
                            )}
                        </div>
                     </div>

                     <button onClick={openMaterialModal} className={addBtnClass}>
                        <Plus size={14} /> {lang === 'da' ? 'Tilføj Materiale' : 'Add Material'}
                     </button>
                  </div>

              </div>
            </div>
          )}

          {/* --- FANE 2: DATA & ANALYSE --- */}
          {activeTab === 'data' && (
            <div className="space-y-3">
              <div className={boxClassBlack}>
                <div className="grid grid-cols-2 gap-2">
                   <div>
                      <label className={labelClass}>HOVEDKATEGORI</label>
                      <select className={inputClass} value={formData.mainCategory} onChange={e => handleMainCategoryChange(e.target.value as MainCategory)}>
                        {Object.keys(DRILL_CATEGORIES).map(cat => (
                            <option key={cat} value={cat}>{getTrans('main', cat)}</option>
                        ))}
                      </select>
                   </div>
                   <div>
                      <label className={labelClass}>UNDERKATEGORI</label>
                      <select className={inputClass} value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}>
                        {formData.mainCategory && DRILL_CATEGORIES[formData.mainCategory as MainCategory].map(sub => (
                            <option key={sub} value={sub}>{getTrans('sub', sub)}</option>
                        ))}
                      </select>
                   </div>
                </div>
                <div className="mt-3">
                   <label className={labelClass}>FYSISK LOAD</label>
                   <select className={inputClass} value={formData.physicalLoad} onChange={e => setFormData({...formData, physicalLoad: e.target.value as PhysicalLoadType})}>
                      <option value="Aerob – lav intensitet">Aerob – lav (Restitution)</option>
                      <option value="Aerob – moderat intensitet">Aerob – moderat</option>
                      <option value="Aerob – høj intensitet">Aerob – høj</option>
                      <option value="Anaerob – Sprint">Anaerob – Sprint</option>
                      <option value="Anaerob – Sprint udholdenhed">Anaerob – Sprint Udholdenhed</option>
                      <option value="Anaerob – Produktion">Anaerob – Produktion</option>
                      <option value="Anaerob – Tolerance">Anaerob – Tolerance</option>
                    </select>
                </div>
                <div className="mt-3">
                  <label className={labelClass}>SYNLIGHED</label>
                  <select className={inputClass} value={formData.accessLevel} onChange={e => setFormData({...formData, accessLevel: e.target.value as any})}>
                    <option value="Personal">Personligt (Kun mig)</option>
                    <option value="Club">Klubben (Alle trænere)</option>
                    <option value="Global">Global (DTL Community)</option>
                  </select>
                </div>
              </div>

              <div className={boxClassOrange}>
                <div>
                    <label className={labelClass}>HJØRNESTEN (TAGS)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Teknisk', 'Taktisk', 'Fysisk', 'Mentalt'].map(tag => (
                        <button key={tag} onClick={() => toggleTag(tag as FourCornerTag)} className={`p-2 rounded-lg border flex items-center gap-1.5 transition-all ${formData.tags?.includes(tag as FourCornerTag) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${formData.tags?.includes(tag as FourCornerTag) ? 'bg-orange-500' : 'bg-slate-300'}`}></span>
                          <span className="text-[10px] font-bold uppercase">{tag}</span>
                        </button>
                      ))}
                    </div>
                </div>
              </div>

            </div>
          )}

          {/* --- FANE 3: MEDIER --- */}
          {activeTab === 'media' && (
            <div className="space-y-3">
              <div className={boxClassBlack}>
                 <div className="flex gap-4 mb-3 border-b border-slate-100 pb-1">
                    <button onClick={() => setMediaType('image')} className={`text-[10px] font-bold flex items-center gap-1 pb-1 border-b-2 transition-colors ${mediaType === 'image' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400'}`}><ImageIcon size={12} /> Billede</button>
                    <button onClick={() => setMediaType('video')} className={`text-[10px] font-bold flex items-center gap-1 pb-1 border-b-2 transition-colors ${mediaType === 'video' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400'}`}><Video size={12} /> Video Upload</button>
                    <button onClick={() => setMediaType('youtube')} className={`text-[10px] font-bold flex items-center gap-1 pb-1 border-b-2 transition-colors ${mediaType === 'youtube' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400'}`}><Youtube size={12} /> YouTube Link</button>
                 </div>
                 
                 {mediaType === 'image' && (
                    <div className={`relative bg-slate-50 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer group flex items-center justify-center min-h-[100px] ${isUploading ? 'border-orange-300' : 'border-slate-300 hover:border-orange-400'}`} onClick={() => !isUploading && fileInputRef.current?.click()}>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        {formData.thumbnailUrl && formData.mediaType !== 'video' ? (
                            <img src={formData.thumbnailUrl} alt="Preview" className="h-24 object-contain rounded" />
                        ) : (
                            <div className="text-center text-slate-400">{isUploading ? <Activity className="animate-spin mx-auto text-orange-500" /> : <Upload className="mx-auto mb-1 w-6 h-6 text-slate-300" />}<span className="text-[10px] font-medium">Upload billede</span></div>
                        )}
                    </div>
                 )}

                 {mediaType === 'video' && (
                    <div className={`relative bg-slate-50 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer group flex items-center justify-center min-h-[100px] ${isUploading ? 'border-orange-300' : 'border-slate-300 hover:border-orange-400'}`} onClick={() => !isUploading && videoInputRef.current?.click()}>
                        <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={handleVideoUpload} />
                        {formData.videoUrl ? (
                            <div className="text-center"><Video className="mx-auto text-green-500 mb-1 w-6 h-6" /><span className="text-[10px] font-bold text-green-600">Video uploadet!</span></div>
                        ) : (
                            <div className="text-center text-slate-400">{isUploading ? <Activity className="animate-spin mx-auto text-orange-500" /> : <Video className="mx-auto mb-1 w-6 h-6 text-slate-300" />}<span className="text-[10px] font-medium">Upload videofil</span></div>
                        )}
                    </div>
                 )}

                 {mediaType === 'youtube' && (
                    <div className="space-y-1">
                        <label className={labelClass}>YOUTUBE LINK</label>
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

        {/* Footer Actions - Compact */}
        <div className="px-3 py-2 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
           <div className="text-[10px] text-slate-500 font-medium">
             {activeTab === 'practical' ? 'Trin 1 af 3' : activeTab === 'data' ? 'Trin 2 af 3' : 'Trin 3 af 3'}
           </div>
           <div className="flex gap-2">
             {activeTab !== 'practical' && (
               <button 
                 onClick={() => setActiveTab(prev => prev === 'media' ? 'data' : 'practical')} 
                 className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
               >
                 Tilbage
               </button>
             )}
             {activeTab === 'media' ? (
               <button onClick={handleSave} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all hover:-translate-y-0.5 disabled:opacity-50">
                 {isSaving ? 'Gemmer...' : <><Save size={14} /> Gem Øvelse</>}
               </button>
             ) : (
               <button 
                 onClick={() => setActiveTab(prev => prev === 'practical' ? 'data' : 'media')} 
                 className="bg-slate-900 hover:bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
               >
                 Næste
               </button>
             )}
           </div>
        </div>
        
        {/* --- INNER MODAL: TILFØJ MATERIALE --- */}
        {isMaterialModalOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-[300px] p-4 space-y-3 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide">Tilføj Materiale</h3>
                        <button onClick={() => setIsMaterialModalOpen(false)} className="text-slate-400 hover:text-black"><X size={14}/></button>
                    </div>
                    
                    <div className="space-y-2">
                        <div>
                            <label className={labelClass}>TYPE</label>
                            <select 
                                className={inputClass}
                                value={newMaterial.name}
                                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                            >
                                {EQUIPMENT_LIST.map(e => <option key={e} value={e}>{e}</option>)}
                                <option value="Andet">Andet...</option>
                            </select>
                        </div>

                        {newMaterial.name === 'Andet' && (
                            <div>
                                <label className={labelClass}>NAVN</label>
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
                                {COLOR_ITEMS.includes(newMaterial.name) ? 'ANTAL FARVER' : 'ANTAL'}
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
                            <label className={labelClass}>DETALJER (VALGFRI)</label>
                            <input 
                                type="text" 
                                className={inputClass}
                                placeholder="Fx 3 farver, Str. 5, Store..."
                                value={newMaterial.details}
                                onChange={(e) => setNewMaterial({ ...newMaterial, details: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                        <button 
                            onClick={() => setIsMaterialModalOpen(false)}
                            className="flex-1 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
                        >
                            Annuller
                        </button>
                        <button 
                            onClick={saveMaterialFromModal}
                            className="flex-1 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-slate-800"
                        >
                            Tilføj
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}