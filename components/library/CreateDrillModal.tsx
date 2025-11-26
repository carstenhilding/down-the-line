// components/library/CreateDrillModal.tsx
"use client";

import React, { useState } from 'react';
import { X, Save, Upload, HelpCircle, Activity, BrainCircuit, Users, Shield, Dumbbell } from 'lucide-react';
import { DrillAsset, GamePhase, PhysicalIntensity, FourCornerTag } from '@/lib/server/libraryData';

interface CreateDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'da' | 'en';
}

export default function CreateDrillModal({ isOpen, onClose, lang }: CreateDrillModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'pedagogy' | 'media'>('info');
  
  const [formData, setFormData] = useState<Partial<DrillAsset>>({
    title: '',
    durationMin: 15,
    minPlayers: 8,
    maxPlayers: 16,
    intensity: 'Aerob (RPE 4-7)',
    phase: 'Opbygningsspil',
    tags: [],
    ageGroups: []
  });

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              {lang === 'da' ? 'Opret Ny Øvelse' : 'Create New Drill'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'da' ? 'Definer øvelsens DNA og struktur' : 'Define drill DNA and structure'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400 hover:text-slate-900" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 gap-6 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('info')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'info' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400'}`}
          >
            1. {lang === 'da' ? 'Stamdata' : 'Basic Info'}
          </button>
          <button 
            onClick={() => setActiveTab('pedagogy')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'pedagogy' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400'}`}
          >
            2. {lang === 'da' ? 'Pædagogik & Fysik' : 'Pedagogy & Physics'}
          </button>
          <button 
            onClick={() => setActiveTab('media')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'media' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400'}`}
          >
            3. {lang === 'da' ? 'Medier' : 'Media'}
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#F8FAFC]">
          
          {/* --- TAB 1: STAMDATA --- */}
          {activeTab === 'info' && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    {lang === 'da' ? 'Øvelsens Navn' : 'Drill Title'}
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    placeholder={lang === 'da' ? 'F.eks. Opbygningsspil mod højt pres...' : 'E.g. Build-up against high press...'}
                    value={formData.title || ''} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                       {lang === 'da' ? 'Spilfase' : 'Game Phase'}
                    </label>
                    <select 
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none cursor-pointer"
                      value={formData.phase || 'Opbygningsspil'}
                      onChange={e => setFormData({...formData, phase: e.target.value as GamePhase})}
                    >
                      <option value="Opvarmning">Opvarmning</option>
                      <option value="Teknisk Færdighed">Teknisk Færdighed</option>
                      <option value="Opbygningsspil">Opbygningsspil</option>
                      <option value="Erobringsspil">Erobringsspil</option>
                      <option value="Afslutningsspil">Afslutningsspil</option>
                      <option value="Omstilling">Omstilling</option>
                      <option value="Dødbolde">Dødbolde</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                       {lang === 'da' ? 'Varighed (min)' : 'Duration (min)'}
                    </label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none"
                      value={formData.durationMin || 0}
                      onChange={e => setFormData({...formData, durationMin: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Min. {lang === 'da' ? 'Spillere' : 'Players'}
                      </label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none"
                        value={formData.minPlayers || 0}
                        onChange={e => setFormData({...formData, minPlayers: parseInt(e.target.value) || 0})}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Max. {lang === 'da' ? 'Spillere' : 'Players'}
                      </label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none"
                        value={formData.maxPlayers || 0}
                        onChange={e => setFormData({...formData, maxPlayers: parseInt(e.target.value) || 0})}
                      />
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB 2: PÆDAGOGIK & FYSIK --- */}
          {activeTab === 'pedagogy' && (
            <div className="space-y-5">
              
              {/* 4-Corner Model */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-3">
                  {lang === 'da' ? 'De 4 Hjørnesten (Primært fokus)' : 'The 4 Corners (Primary Focus)'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => toggleTag('Teknisk')}
                    className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${formData.tags?.includes('Teknisk') ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                  >
                    <Activity size={16} /> <span className="text-xs font-bold">{lang === 'da' ? 'Teknisk' : 'Technical'}</span>
                  </button>
                  <button 
                    onClick={() => toggleTag('Taktisk')}
                    className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${formData.tags?.includes('Taktisk') ? 'bg-purple-50 border-purple-500 text-purple-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                  >
                    <Shield size={16} /> <span className="text-xs font-bold">{lang === 'da' ? 'Taktisk' : 'Tactical'}</span>
                  </button>
                  <button 
                    onClick={() => toggleTag('Fysisk')}
                    className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${formData.tags?.includes('Fysisk') ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                  >
                    <Dumbbell size={16} /> <span className="text-xs font-bold">{lang === 'da' ? 'Fysisk' : 'Physical'}</span>
                  </button>
                  <button 
                    onClick={() => toggleTag('Mentalt')}
                    className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${formData.tags?.includes('Mentalt') ? 'bg-yellow-50 border-yellow-500 text-yellow-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                  >
                    <BrainCircuit size={16} /> <span className="text-xs font-bold">{lang === 'da' ? 'Mentalt' : 'Mental'}</span>
                  </button>
                </div>
              </div>

              {/* Fysisk Load */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-1.5">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {lang === 'da' ? 'Fysisk Intensitet (RPE)' : 'Physical Intensity (RPE)'}
                   </label>
                   <HelpCircle size={12} className="text-slate-400" />
                </div>
                <select 
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none cursor-pointer"
                  value={formData.intensity || 'Aerob (RPE 4-7)'}
                  onChange={e => setFormData({...formData, intensity: e.target.value as PhysicalIntensity})}
                >
                  <option value="Restitution (RPE 1-3)">Restitution (RPE 1-3) - Let</option>
                  <option value="Aerob (RPE 4-7)">Aerob (RPE 4-7) - Middel</option>
                  <option value="Anaerob (RPE 8-10)">Anaerob (RPE 8-10) - Høj / Sprint</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-2 italic">
                  {lang === 'da' ? '*Vigtigt for periodiserings-motoren og Load-bar i Planneren.' : '*Important for the periodization engine and Load-bar.'}
                </p>
              </div>
            </div>
          )}

          {/* --- TAB 3: MEDIER (Upload) --- */}
          {activeTab === 'media' && (
            <div className="space-y-5">
              <div className="bg-white p-8 rounded-xl border-2 border-dashed border-slate-200 hover:border-orange-400 transition-colors flex flex-col items-center justify-center text-center cursor-pointer">
                 <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-3">
                    <Upload size={24} className="text-orange-500" />
                 </div>
                 <h3 className="text-sm font-bold text-slate-900">
                    {lang === 'da' ? 'Upload Billede, Video eller PDF' : 'Upload Image, Video or PDF'}
                 </h3>
                 <p className="text-xs text-slate-500 mt-1">
                    {lang === 'da' ? 'Træk filen herind eller klik for at vælge' : 'Drag file here or click to select'}
                 </p>
                 <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-wide">
                    {lang === 'da' ? 'Eller' : 'Or'}
                 </p>
                 <button className="mt-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow hover:bg-black transition-colors">
                    {lang === 'da' ? 'Design i DTL Studio' : 'Design in DTL Studio'}
                 </button>
              </div>
              <div className="text-[10px] text-slate-400 text-center px-10">
                Understøtter: JPG, PNG, MP4, PDF. Max 50MB.
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center">
           <div className="text-xs text-slate-400 font-medium">
             {lang === 'da' 
                ? (activeTab === 'info' ? 'Trin 1 af 3' : activeTab === 'pedagogy' ? 'Trin 2 af 3' : 'Trin 3 af 3')
                : (activeTab === 'info' ? 'Step 1 of 3' : activeTab === 'pedagogy' ? 'Step 2 of 3' : 'Step 3 of 3')
             }
           </div>
           <div className="flex gap-3">
             {activeTab !== 'info' && (
               <button onClick={() => setActiveTab(prev => prev === 'media' ? 'pedagogy' : 'info')} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                 {lang === 'da' ? 'Tilbage' : 'Back'}
               </button>
             )}
             {activeTab !== 'media' ? (
               <button onClick={() => setActiveTab(prev => prev === 'info' ? 'pedagogy' : 'media')} className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
                 {lang === 'da' ? 'Næste' : 'Next'}
               </button>
             ) : (
               <button onClick={onClose} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all hover:-translate-y-0.5">
                 <Save size={14} /> {lang === 'da' ? 'Gem Øvelse' : 'Save Drill'}
               </button>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}