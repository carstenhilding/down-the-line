// components/library/CreateDrillModal.tsx
"use client";

import React, { useState, useRef } from 'react';
import { X, Save, Upload, Activity, Users, Target, Plus, Trash2, Shirt, ListChecks, Cone, Image as ImageIcon, Video, Youtube, Link as LinkIcon, Clock, Timer, MoveHorizontal, MonitorPlay, FileText, Info, Minus } from 'lucide-react';
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

export default function CreateDrillModal({ isOpen, onClose, lang, dict, onSuccess }: CreateDrillModalProps) {
  if (!isOpen) return null;
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'practical' | 'data'>('practical');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'youtube'>('image');
  const [materialInput, setMaterialInput] = useState('');

  const [teams, setTeams] = useState<TeamSetup[]>([
      { name: 'Hold 1', playerCount: 4, color: 'orange' },
      { name: 'Hold 2', playerCount: 4, color: 'white' }
  ]);

  const [formData, setFormData] = useState<Partial<DrillAsset>>({
    title: '',
    description: '',
    mainCategory: 'buildup_phase_2',
    subCategory: 'breaking_lines',
    durationMin: 15,
    minPlayers: 8,
    maxPlayers: 16,
    workDuration: 4,
    restDuration: 1,
    pitchSize: { width: 30, length: 40 },
    rules: ['', '', ''],
    ageGroups: [],
    physicalLoad: 'Aerob – moderat intensitet',
    accessLevel: 'Personal',
    tags: [],
    materials: [],
    mediaType: 'image',
    technicalGoals: [],
    tacticalGoals: [],
    mentalGoals: [],
    coachingPoints: { keyPoints: [], instruction: '' },
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

  const updateRule = (index: number, value: string) => {
      const newRules = [...(formData.rules || [])];
      newRules[index] = value;
      setFormData({ ...formData, rules: newRules });
  };
  const addRule = () => setFormData({ ...formData, rules: [...(formData.rules || []), ''] });
  const removeRule = (index: number) => setFormData({ ...formData, rules: (formData.rules || []).filter((_, i) => i !== index) });

  const handleAgeChange = (val: string) => { setFormData({ ...formData, ageGroups: [val] }); };

  // --- MATERIALE FUNKTIONER ---
  const addOrUpdateMaterial = (name: string, delta: number = 1) => {
      setFormData(prev => {
          const current = [...(prev.materials || [])];
          const existingIndex = current.findIndex(m => m.name === name);
          if (existingIndex >= 0) {
              const newCount = current[existingIndex].count + delta;
              if (newCount <= 0) {
                  return { ...prev, materials: current.filter((_, i) => i !== existingIndex) };
              }
              current[existingIndex] = { ...current[existingIndex], count: newCount };
              return { ...prev, materials: current };
          } else if (delta > 0) {
              return { ...prev, materials: [...current, { name, count: delta }] };
          }
          return prev;
      });
  };

  const addCustomMaterial = () => {
      if (!materialInput.trim()) return;
      addOrUpdateMaterial(materialInput.trim(), 1);
      setMaterialInput('');
  };

  const handleKeyDownMaterial = (e: React.KeyboardEvent) => { 
      if (e.key === 'Enter') { 
          e.preventDefault(); 
          addCustomMaterial(); 
      } 
  };
  
  const removeMaterial = (index: number) => {
      setFormData(prev => ({
          ...prev,
          materials: (prev.materials || []).filter((_, i) => i !== index)
      }));
  };
  // -----------------------------

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
        pitchSize: formData.pitchSize || { width: 30, length: 40 },
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

  // --- STYLES ---
  const inputClass = "w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-sm text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400";
  const textareaClass = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 min-h-[80px] resize-y";
  
  // Box Styles
  const boxClass = "bg-white border border-slate-200 rounded-lg p-3 flex flex-col items-center justify-center shadow-sm";
  const boxLabelClass = "text-[10px] font-black text-slate-800 uppercase tracking-wider mb-1 text-center w-full";
  const boxInputClass = "w-full text-center bg-slate-50 border border-slate-200 rounded text-sm py-1 px-1 text-slate-900 font-bold focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  
  // Standard Label Style (Rød understregning stil)
  const labelClass = "text-[10px] font-black text-slate-800 uppercase tracking-wider block mb-1.5";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200">
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
             <span className="bg-orange-500 w-1.5 h-5 rounded-sm"></span>
             <div>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-tight leading-none">
                  {lang === 'da' ? 'Opret Ny Øvelse' : 'Create New Drill'}
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">DTL Asset Management • {user?.name}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"><X size={18} className="text-slate-400 hover:text-slate-900" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
            <button onClick={() => setActiveTab('practical')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'practical' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>1. Praktisk Info</button>
            <button onClick={() => setActiveTab('data')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'data' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>2. Data & Analyse</button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 bg-[#F8FAFC]">
          
          {/* --- FANE 1: PRAKTISK --- */}
          {activeTab === 'practical' && (
            <div className="space-y-5">
              
              {/* Titel & Alder */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="grid grid-cols-4 gap-4">
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

              {/* Beskrivelse & Regler */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <label className={labelClass}>BESKRIVELSE</label>
                  <textarea className={textareaClass} placeholder="Kort beskrivelse af øvelsen..." value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div>
                   <label className={labelClass}>REGLER</label>
                   <div className="space-y-2">
                      {formData.rules?.map((rule, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                              <span className="text-xs font-bold text-slate-400 w-4 text-right">{idx + 1}.</span>
                              <input type="text" className={inputClass} placeholder={`Regel ${idx + 1}...`} value={rule} onChange={(e) => updateRule(idx, e.target.value)} />
                              {idx > 2 && <button onClick={() => removeRule(idx)} className="text-slate-300 hover:text-red-500"><X size={16}/></button>}
                          </div>
                      ))}
                      <button onClick={addRule} className="ml-6 text-xs font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1 mt-1"><Plus size={14} /> Tilføj regel</button>
                   </div>
                </div>
              </div>

              {/* PARAMETRE (4 Bokse) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className={boxClass}>
                      <label className={boxLabelClass}>TID (MIN)</label>
                      <input type="number" className={boxInputClass} 
                             value={formData.durationMin || ''} onChange={e => setFormData({...formData, durationMin: parseInt(e.target.value) || 0})} placeholder="15" />
                  </div>
                  <div className={boxClass}>
                      <label className={boxLabelClass}>ARBEJDE / PAUSE</label>
                      <div className="flex items-center justify-center gap-1 w-full">
                          <input type="number" className={boxInputClass} 
                                 placeholder="4" value={formData.workDuration || ''} onChange={e => setFormData({...formData, workDuration: parseInt(e.target.value) || 0})} />
                          <span className="text-slate-300 text-lg font-light">/</span>
                          <input type="number" className={boxInputClass} 
                                 placeholder="1" value={formData.restDuration || ''} onChange={e => setFormData({...formData, restDuration: parseInt(e.target.value) || 0})} />
                      </div>
                  </div>
                  <div className={boxClass}>
                      <label className={boxLabelClass}>ANTAL SPILLERE</label>
                      <div className="flex items-center justify-center gap-1 w-full">
                          <input type="number" className={boxInputClass} 
                                 placeholder="Min" value={formData.minPlayers || ''} onChange={e => setFormData({...formData, minPlayers: parseInt(e.target.value) || 0})} />
                          <span className="text-slate-300 text-lg font-light">-</span>
                          <input type="number" className={boxInputClass} 
                                 placeholder="Max" value={formData.maxPlayers || ''} onChange={e => setFormData({...formData, maxPlayers: parseInt(e.target.value) || 0})} />
                      </div>
                  </div>
                  <div className={boxClass}>
                      <label className={boxLabelClass}>BANESTØRRELSE (M)</label>
                      <div className="flex items-center justify-center gap-1 w-full">
                          <input type="number" className={boxInputClass} 
                                 placeholder="30" value={formData.pitchSize?.width || ''} onChange={e => setFormData({...formData, pitchSize: { ...formData.pitchSize!, width: parseInt(e.target.value) || 0 }})} />
                          <span className="text-slate-300 text-lg font-light">x</span>
                          <input type="number" className={boxInputClass} 
                                 placeholder="40" value={formData.pitchSize?.length || ''} onChange={e => setFormData({...formData, pitchSize: { ...formData.pitchSize!, length: parseInt(e.target.value) || 0 }})} />
                      </div>
                  </div>
              </div>

              {/* HOLD STRUKTUR (Fane 1) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <label className={labelClass}>ORGANISATION</label>
                 <div className="space-y-3">
                    {teams.map((team, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${getColorClass(team.color)}`}><Shirt size={16} className={team.color === 'white' ? 'text-black' : 'text-white'} /></div>
                            <div className="flex-1">
                                <input type="text" value={team.name} onChange={(e) => updateTeam(idx, 'name', e.target.value)} className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none border-b border-transparent focus:border-orange-300 px-1" placeholder="Hold Navn" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">ANTAL:</span>
                                <input type="number" value={team.playerCount} onChange={(e) => updateTeam(idx, 'playerCount', parseInt(e.target.value))} className="w-12 text-center bg-white border border-slate-300 rounded text-sm py-1" />
                            </div>
                            <div className="flex gap-1">
                                {['orange', 'red', 'blue', 'green', 'yellow', 'white', 'black'].map(c => (
                                    <button key={c} onClick={() => updateTeam(idx, 'color', c as any)} className={`w-4 h-4 rounded-full border border-black/10 ${getColorClass(c)} ${team.color === c ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`} />
                                ))}
                            </div>
                            <button onClick={() => removeTeam(idx)} className="ml-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                    ))}
                 </div>
                 <button onClick={addTeam} className="mt-3 flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-800 px-2 py-1.5 rounded hover:bg-orange-50 transition-colors"><Plus size={14} /> Tilføj Hold</button>
              </div>

              {/* MATERIALER */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <label className={labelClass}>MATERIALER</label>
                 
                 {/* Quick Select */}
                 <div className="mb-3 flex flex-wrap gap-1.5">
                    {EQUIPMENT_LIST.map(item => (
                        <button 
                            key={item} 
                            onClick={() => addOrUpdateMaterial(item)}
                            className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition-colors"
                        >
                            + {item}
                        </button>
                    ))}
                 </div>

                 <div className="flex gap-3 mb-3">
                    <input type="text" placeholder="Andet udstyr..." className={`${inputClass} flex-1`} value={materialInput} onChange={(e) => setMaterialInput(e.target.value)} onKeyDown={handleKeyDownMaterial} />
                    <button onClick={addCustomMaterial} className="bg-slate-900 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-black">Tilføj</button>
                 </div>

                 <div className="space-y-2">
                    {formData.materials && formData.materials.length > 0 ? formData.materials.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                           <div className="flex items-center gap-2">
                               <Cone size={14} className="text-orange-500" />
                               <span className="text-sm font-bold text-slate-700">{item.name}</span>
                           </div>
                           <div className="flex items-center gap-3">
                               <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1">
                                   <button onClick={() => addOrUpdateMaterial(item.name, -1)} className="px-1 hover:text-orange-600"><Minus size={10} /></button>
                                   <span className="text-xs w-5 text-center font-bold">{item.count}</span>
                                   <button onClick={() => addOrUpdateMaterial(item.name, 1)} className="px-1 hover:text-orange-600"><Plus size={10} /></button>
                               </div>
                               <button onClick={() => removeMaterial(idx)} className="text-slate-400 hover:text-red-600 ml-1"><Trash2 size={14} /></button>
                           </div>
                        </div>
                    )) : <p className="text-xs text-slate-400 italic text-center py-2">Ingen materialer valgt.</p>}
                 </div>
              </div>

              {/* Medier */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex gap-6 mb-4 border-b border-slate-100 pb-2">
                    <button onClick={() => setMediaType('image')} className={`text-xs font-bold flex items-center gap-2 pb-1 border-b-2 transition-colors ${mediaType === 'image' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400'}`}><ImageIcon size={16} /> Billede</button>
                    <button onClick={() => setMediaType('video')} className={`text-xs font-bold flex items-center gap-2 pb-1 border-b-2 transition-colors ${mediaType === 'video' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400'}`}><Video size={16} /> Video Upload</button>
                    <button onClick={() => setMediaType('youtube')} className={`text-xs font-bold flex items-center gap-2 pb-1 border-b-2 transition-colors ${mediaType === 'youtube' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400'}`}><Youtube size={16} /> YouTube Link</button>
                 </div>
                 
                 {mediaType === 'image' && (
                    <div className={`relative bg-slate-50 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer group flex items-center justify-center min-h-[140px] ${isUploading ? 'border-orange-300' : 'border-slate-300 hover:border-orange-400'}`} onClick={() => !isUploading && fileInputRef.current?.click()}>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        {formData.thumbnailUrl && formData.mediaType !== 'video' ? (
                            <img src={formData.thumbnailUrl} alt="Preview" className="h-32 object-contain rounded" />
                        ) : (
                            <div className="text-center text-slate-400">{isUploading ? <Activity className="animate-spin mx-auto text-orange-500" /> : <Upload className="mx-auto mb-2 w-8 h-8 text-slate-300" />}<span className="text-xs font-medium">Klik for at uploade billede</span></div>
                        )}
                    </div>
                 )}

                 {mediaType === 'video' && (
                    <div className={`relative bg-slate-50 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer group flex items-center justify-center min-h-[140px] ${isUploading ? 'border-orange-300' : 'border-slate-300 hover:border-orange-400'}`} onClick={() => !isUploading && videoInputRef.current?.click()}>
                        <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={handleVideoUpload} />
                        {formData.videoUrl ? (
                            <div className="text-center"><Video className="mx-auto text-green-500 mb-2 w-8 h-8" /><span className="text-xs font-bold text-green-600">Video uploadet!</span></div>
                        ) : (
                            <div className="text-center text-slate-400">{isUploading ? <Activity className="animate-spin mx-auto text-orange-500" /> : <Video className="mx-auto mb-2 w-8 h-8 text-slate-300" />}<span className="text-xs font-medium">Klik for at uploade videofil</span></div>
                        )}
                    </div>
                 )}

                 {mediaType === 'youtube' && (
                    <div className="space-y-2">
                        <label className={labelClass}>INDSÆT YOUTUBE LINK</label>
                        <div className="relative">
                            <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" className={`${inputClass} pl-10`} placeholder="https://youtube.com/watch?v=..." value={formData.youtubeUrl || ''} onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value, mediaType: 'youtube'})} />
                        </div>
                    </div>
                 )}
              </div>
            </div>
          )}

          {/* --- FANE 2: DATA & ANALYSE --- */}
          {activeTab === 'data' && (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                <div>
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
                <div>
                  <label className={labelClass}>SYNLIGHED</label>
                  <select className={inputClass} value={formData.accessLevel} onChange={e => setFormData({...formData, accessLevel: e.target.value as any})}>
                    <option value="Personal">Personligt (Kun mig)</option>
                    <option value="Club">Klubben (Alle trænere)</option>
                    <option value="Global">Global (DTL Community)</option>
                  </select>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div>
                    <label className={labelClass}>HJØRNESTEN (TAGS)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Teknisk', 'Taktisk', 'Fysisk', 'Mentalt'].map(tag => (
                        <button key={tag} onClick={() => toggleTag(tag as FourCornerTag)} className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${formData.tags?.includes(tag as FourCornerTag) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                          <span className={`w-2 h-2 rounded-full ${formData.tags?.includes(tag as FourCornerTag) ? 'bg-orange-500' : 'bg-slate-300'}`}></span>
                          <span className="text-xs font-bold uppercase">{tag}</span>
                        </button>
                      ))}
                    </div>
                </div>
                <div>
                    <label className={labelClass}>TRÆNER INSTRUKTION</label>
                    <textarea className={textareaClass} value={formData.coachingPoints?.instruction || ''} onChange={e => setFormData({...formData, coachingPoints: { ...formData.coachingPoints!, instruction: e.target.value }})} />
                </div>
                <div>
                    <label className={labelClass}>NØGLEPUNKTER (KEY POINTS)</label>
                    <div className="space-y-2">
                       <input type="text" placeholder="Punkt 1..." className={inputClass} />
                       <input type="text" placeholder="Punkt 2..." className={inputClass} />
                    </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
           <div className="text-xs text-slate-500 font-medium">
             {activeTab === 'practical' ? 'Trin 1 af 2' : 'Trin 2 af 2'}
           </div>
           <div className="flex gap-3">
             {activeTab === 'data' && (
               <button onClick={() => setActiveTab('practical')} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Tilbage</button>
             )}
             {activeTab === 'practical' ? (
               <button onClick={() => setActiveTab('data')} className="bg-slate-900 hover:bg-black text-white px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all">Næste</button>
             ) : (
               <button onClick={handleSave} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50">
                 {isSaving ? 'Gemmer...' : <><Save size={16} /> Gem Øvelse</>}
               </button>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}