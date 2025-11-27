// components/library/CreateDrillModal.tsx
"use client";

import React, { useState, useRef } from 'react';
import { X, Save, Upload, Activity, Users, Target, Image as ImageIcon } from 'lucide-react';
import { DrillAsset, GamePhase, PhysicalLoadType, FourCornerTag } from '@/lib/server/libraryData';
import { createDrill } from '@/lib/services/libraryService';
import { uploadFile } from '@/lib/services/storageService';
import { useUser } from '@/components/UserContext';
// NY: Import af komprimerings-biblioteket
import imageCompression from 'browser-image-compression';

interface CreateDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'da' | 'en';
  onSuccess?: () => void;
}

export default function CreateDrillModal({ isOpen, onClose, lang, onSuccess }: CreateDrillModalProps) {
  if (!isOpen) return null;
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'details' | 'pedagogy'>('info');
  
  const [formData, setFormData] = useState<Partial<DrillAsset>>({
    title: '',
    description: '',
    durationMin: 15,
    minPlayers: 8,
    maxPlayers: 16,
    physicalLoad: 'Aerob – moderat intensitet',
    phase: 'Opbygningsspil',
    accessLevel: 'Personal',
    tags: [],
    ageGroups: [],
    mediaType: 'image',
    technicalGoals: [],
    tacticalGoals: [],
    mentalGoals: [],
    coachingPoints: { keyPoints: [], instruction: '' },
    pitchSize: { width: 30, length: 40 }
  });

  // --- DEN NYE SMARTE UPLOAD FUNKTION ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. INDSTILLINGER FOR KOMPRIMERING
      const options = {
        maxSizeMB: 1,          // Vi vil have filen under 1MB (rigeligt til web)
        maxWidthOrHeight: 1920, // Max bredde/højde (Full HD er nok)
        useWebWorker: true,    // Gør det hurtigt uden at fryse skærmen
      };

      console.log(`Original filstørrelse: ${file.size / 1024 / 1024} MB`);

      // 2. UDFØR KOMPRIMERING
      const compressedFile = await imageCompression(file, options);
      
      console.log(`Ny filstørrelse: ${compressedFile.size / 1024 / 1024} MB`);

      // 3. UPLOAD DEN LILLE FIL TIL FIREBASE
      const url = await uploadFile(compressedFile, 'drills');
      
      if (url) {
        setFormData(prev => ({ ...prev, thumbnailUrl: url }));
      } else {
        alert("Upload fejlede. Tjek dine netværksforbindelse.");
      }
    } catch (error) {
      console.error("Fejl under komprimering eller upload:", error);
      alert("Der skete en fejl. Prøv et andet billede.");
    } finally {
      setIsUploading(false);
    }
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
        pitchSize: formData.pitchSize || { width: 30, length: 40 }
      };

      const result = await createDrill(newDrill);
      
      if (result.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert("Fejl ved gemning: " + result.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTag = (tag: FourCornerTag) => {
    setFormData(prev => {
      const currentTags = prev.tags || [];
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...currentTags, tag] };
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 md:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <span className="bg-orange-500 w-2 h-6 rounded-sm"></span>
              {lang === 'da' ? 'Opret Ny Øvelse' : 'Create New Drill'}
            </h2>
            <p className="text-xs text-slate-500 font-medium ml-4">
              DTL Asset Management • {user?.name}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400 hover:text-slate-900" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
          {['info', 'details', 'pedagogy'].map((tab, idx) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all
                ${activeTab === tab 
                  ? 'border-orange-500 text-orange-600 bg-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'}
              `}
            >
              {idx + 1}. {tab === 'info' ? 'Stamdata' : tab === 'details' ? 'Parametre & Load' : 'Læring & Fokus'}
            </button>
          ))}
        </div>

        {/* Content Scroll Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#F8FAFC]">
          
          {activeTab === 'info' && (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Øvelsens Navn *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-base font-bold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none placeholder:font-normal"
                    placeholder="F.eks. Opbygningsspil Fase 1 mod højt pres"
                    value={formData.title || ''} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    autoFocus
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Spilfase</label>
                      <select 
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none cursor-pointer"
                        value={formData.phase || 'Opbygningsspil'}
                        onChange={e => setFormData({...formData, phase: e.target.value as GamePhase})}
                      >
                        <option value="Opbygningsspil">Opbygningsspil (Generel)</option>
                        <option value="Opbygningsspil Fase 1">Opbygningsspil Fase 1</option>
                        <option value="Opbygningsspil Fase 2">Opbygningsspil Fase 2</option>
                        <option value="Erobringsspil">Erobringsspil</option>
                        <option value="Afslutningsspil">Afslutningsspil</option>
                        <option value="Forsvarsspil">Forsvarsspil</option>
                        <option value="Omstilling offensiv">Omstilling Offensiv</option>
                        <option value="Omstilling defensiv">Omstilling Defensiv</option>
                        <option value="Dødbolde">Dødbolde</option>
                      </select>
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Synlighed</label>
                      <select 
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none cursor-pointer"
                        value={formData.accessLevel}
                        onChange={e => setFormData({...formData, accessLevel: e.target.value as any})}
                      >
                        <option value="Personal">Personligt (Kun mig)</option>
                        <option value="Club">Klubben (Alle trænere)</option>
                        <option value="Global">Global (DTL Community)</option>
                      </select>
                   </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Beskrivelse & Regler</label>
                  <textarea 
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none min-h-[100px]"
                    placeholder="Beskriv øvelsens formål, regler og flow..."
                    value={formData.description || ''} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              {/* MEDIE UPLOAD BOKS */}
              <div 
                className={`
                  relative bg-slate-50 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer group
                  ${isUploading ? 'border-orange-300 bg-orange-50' : 'border-slate-300 hover:border-orange-400'}
                `}
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                 />
                 
                 {formData.thumbnailUrl ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">Klik for at skifte</span>
                        </div>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center text-center py-6">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            {isUploading ? <Activity className="text-orange-500 animate-spin" /> : <Upload size={20} className="text-orange-500" />}
                        </div>
                        <h3 className="text-sm font-bold text-slate-700">
                            {isUploading ? 'Komprimerer & Uploader...' : 'Upload Diagram eller Billede'}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">JPG, PNG (Vi komprimerer automatisk)</p>
                    </div>
                 )}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-wide mb-4 flex items-center gap-2 text-slate-800">
                  <Activity size={16} className="text-orange-500" /> Fysisk Belastning (Load)
                </h3>
                <div className="mb-4">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Fysisk Load Kategori</label>
                   <select 
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none cursor-pointer"
                      value={formData.physicalLoad}
                      onChange={e => setFormData({...formData, physicalLoad: e.target.value as PhysicalLoadType})}
                    >
                      <option value="Aerob – lav intensitet">Aerob – lav intensitet (Restitution)</option>
                      <option value="Aerob – moderat intensitet">Aerob – moderat intensitet</option>
                      <option value="Aerob – høj intensitet">Aerob – høj intensitet</option>
                      <option value="Anaerob – Sprint">Anaerob – Sprint</option>
                      <option value="Anaerob – Sprint udholdenhed">Anaerob – Sprint udholdenhed</option>
                      <option value="Anaerob – Produktion">Anaerob – Produktion</option>
                      <option value="Anaerob – Tolerance">Anaerob – Tolerance</option>
                    </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                   <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Total Tid (min)</label>
                      <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold"
                        value={formData.durationMin || ''} onChange={e => setFormData({...formData, durationMin: parseInt(e.target.value) || 0})} />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Arbejde (min)</label>
                      <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        value={formData.workDuration || ''} onChange={e => setFormData({...formData, workDuration: parseInt(e.target.value) || 0})} placeholder="Ex: 4" />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Pause (min)</label>
                      <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        value={formData.restDuration || ''} onChange={e => setFormData({...formData, restDuration: parseInt(e.target.value) || 0})} placeholder="Ex: 1" />
                   </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-wide mb-4 flex items-center gap-2 text-slate-800">
                  <Users size={16} className="text-blue-500" /> Organisation
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Min. Spillere</label>
                      <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        value={formData.minPlayers || ''} onChange={e => setFormData({...formData, minPlayers: parseInt(e.target.value) || 0})} />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Max. Spillere</label>
                      <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        value={formData.maxPlayers || ''} onChange={e => setFormData({...formData, maxPlayers: parseInt(e.target.value) || 0})} />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Banestørrelse (Bredde m)</label>
                      <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        value={formData.pitchSize?.width || ''} 
                        onChange={e => setFormData({...formData, pitchSize: { ...formData.pitchSize!, width: parseInt(e.target.value) || 0 }})} />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Banestørrelse (Længde m)</label>
                      <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        value={formData.pitchSize?.length || ''} 
                        onChange={e => setFormData({...formData, pitchSize: { ...formData.pitchSize!, length: parseInt(e.target.value) || 0 }})} />
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pedagogy' && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-3">De 4 Hjørnesten</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Teknisk', 'Taktisk', 'Fysisk', 'Mentalt'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => toggleTag(tag as FourCornerTag)}
                      className={`p-3 rounded-lg border flex items-center gap-2 transition-all 
                        ${formData.tags?.includes(tag as FourCornerTag) 
                          ? 'bg-slate-900 border-slate-900 text-white' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${formData.tags?.includes(tag as FourCornerTag) ? 'bg-orange-500' : 'bg-slate-300'}`}></span>
                      <span className="text-xs font-bold">{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="text-sm font-black uppercase tracking-wide mb-4 flex items-center gap-2 text-slate-800">
                    <Target size={16} className="text-red-500" /> Coaching Intelligence
                 </h3>
                 <div className="mb-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Træner Instruktion (Hvad skal siges?)</label>
                    <textarea 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                      rows={2}
                      value={formData.coachingPoints?.instruction || ''}
                      onChange={e => setFormData({...formData, coachingPoints: { ...formData.coachingPoints!, instruction: e.target.value }})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Nøglepunkter (Key Points)</label>
                    <div className="space-y-2">
                       <input type="text" placeholder="Punkt 1..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                       <input type="text" placeholder="Punkt 2..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
           <div className="text-xs text-slate-400 font-medium">
             Step {activeTab === 'info' ? '1' : activeTab === 'details' ? '2' : '3'} of 3
           </div>
           <div className="flex gap-3">
             {activeTab !== 'info' && (
               <button onClick={() => setActiveTab(prev => prev === 'pedagogy' ? 'details' : 'info')} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                 Tilbage
               </button>
             )}
             {activeTab !== 'pedagogy' ? (
               <button onClick={() => setActiveTab(prev => prev === 'info' ? 'details' : 'pedagogy')} className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
                 Næste
               </button>
             ) : (
               <button 
                 onClick={handleSave} 
                 disabled={isSaving}
                 className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50"
               >
                 {isSaving ? 'Gemmer...' : <><Save size={14} /> Gem Øvelse</>}
               </button>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}