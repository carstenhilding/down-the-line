// app/[lang]/(secure)/trainer/new/NewTrainerClient.tsx (ENDELIG LAYOUT-RETTELSE)

"use client";

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Save, X, RotateCcw, RotateCw } from 'lucide-react';

// --- DEFINITIONER ---
interface TrainingSession {
    name: string;
    theme: string;
    durationMinutes: number;
    notes: string;
}

interface NewTrainerClientProps {
    trainerTranslations: { [key: string]: string };
    lang: 'da' | 'en';
}

export default function NewTrainerClient({ trainerTranslations, lang }: NewTrainerClientProps) {
    
    const t = trainerTranslations;
    const router = useRouter(); 
    
    const [sessionData, setSessionData] = useState<TrainingSession>({
        name: '',
        theme: '',
        durationMinutes: 60,
        notes: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        // Sikrer at durationMinutes håndteres som tal
        setSessionData(prev => ({
            ...prev,
            [id]: id === 'durationMinutes' ? parseInt(value) || 0 : value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            router.push(`/${lang}/dashboard`);
        }, 1500);
    };

    const handleCancel = () => {
        if (window.confirm(lang === 'da' ? 'Er du sikker på, du vil annullere? Alle ændringer går tabt.' : 'Are you sure you want to cancel? All changes will be lost.')) {
            router.push(`/${lang}/dashboard`);
        }
    };

    // VI HAR FJERNET DEN YDRE FLEX-STRUKTUR, DA DEN ALLEREDE LEVERES AF SecureLayout
    return (
        <div className="flex flex-1 overflow-hidden p-8 bg-gray-100">
            {/* Alt indhold skal nu pakkes ind i et layout, der respekterer SecureLayouts main-container */}
            
            {/* Dette er den INDRE HEADER / VÆRKTØJSBJÆLKE (hvilket du kan beholde, hvis det er nødvendigt for siden) */}
            <div className="flex-col w-full h-full">
                
                {/* 1. TOP KONTROL ELEMENTER */}
                <div className="bg-white shadow-md p-3 flex-shrink-0 mb-4 rounded-lg">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-bold text-gray-900">
                                {sessionData.name || t.titleNew}
                            </h1>
                            <button className="text-gray-500 hover:text-gray-900" title={lang === 'da' ? 'Sessionsindstillinger' : 'Session Settings'}>
                                <Settings className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex space-x-2 border-r pr-4 mr-4">
                            <button className="text-gray-500 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100" title={lang === 'da' ? 'Fortryd' : 'Undo'}>
                                <RotateCcw className="h-5 w-5" />
                            </button>
                            <button className="text-gray-500 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100" title={lang === 'da' ? 'Gentag' : 'Redo'}>
                                <RotateCw className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={handleCancel}
                                className="flex items-center space-x-1 py-2 px-3 text-sm font-medium text-gray-600 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 transition-colors"
                                disabled={isSaving}
                            >
                                <X className="h-4 w-4" />
                                <span>{t.cancelButton}</span>
                            </button>
                            <button
                                onClick={handleSave}
                                className={`flex items-center space-x-1 py-2 px-3 text-sm font-medium text-white rounded-md shadow-sm transition-colors ${isSaving ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
                                disabled={isSaving}
                            >
                                <Save className="h-4 w-4" />
                                <span>{isSaving ? (lang === 'da' ? 'Gemmer...' : 'Saving...') : t.saveButton}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. HOVEDINDHOLD: LÆRRED & DETALJER (Horisontal opdeling) */}
                <div className="flex flex-1 overflow-hidden">
                    
                    {/* VENSTRE SIDEBAR (Objekter) - BEVARES SOM EN LILLE SIDEBAR INDEN I SIDEN */}
                    <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto flex-shrink-0 rounded-l-lg mr-4 shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{lang === 'da' ? 'Objekter & Spillere' : 'Objects & Players'}</h2>
                        <div className="space-y-4">
                            <div className="p-3 bg-gray-100 rounded-lg text-center text-gray-600 text-sm">
                                Spiller (Træk mig)
                            </div>
                            <div className="p-3 bg-gray-100 rounded-lg text-center text-gray-600 text-sm">
                                Kegle (Træk mig)
                            </div>
                            <div className="p-3 bg-gray-100 rounded-lg text-center text-gray-600 text-sm">
                                Bold (Træk mig)
                            </div>
                        </div>
                    </aside>

                    {/* CENTRALT OMRÅDE: BANEEDITOR (Lærred) */}
                    <section className="flex-1 overflow-auto p-4 flex justify-center items-center bg-white rounded-lg shadow-lg">
                        <div className="relative w-full h-full bg-green-700 rounded-lg shadow-2xl p-6 flex items-center justify-center text-white">
                            <div className="absolute inset-0 border-4 border-white rounded-lg opacity-20"></div>
                            <h2 className="text-3xl font-extrabold z-10">{lang === 'da' ? 'Træningsbane (Konva/Fabric.js Lærred)' : 'Training Pitch (Canvas)'}</h2>
                            <div className="text-center absolute bottom-4 text-sm opacity-80">
                                [Pladsholder for interaktiv 3D/2D Baneeditor]
                            </div>
                        </div>
                    </section>
                    
                    {/* HØJRE SIDEBAR: DETALJER & INDSTILLINGER */}
                    <aside className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto flex-shrink-0 rounded-r-lg ml-4 shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">{t.detailsTitle}</h2>
                        <form className="space-y-4">
                            
                            {/* Input: Navn */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t.titleLabel}</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={sessionData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                    placeholder={lang === 'da' ? 'Opbygning fra bagerste kæde' : 'Build-up from the back'}
                                />
                            </div>

                            {/* Input: Tema */}
                            <div>
                                <label htmlFor="theme" className="block text-sm font-medium text-gray-700">{t.themeLabel}</label>
                                <select
                                    id="theme"
                                    value={sessionData.theme}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                >
                                    <option value="">{lang === 'da' ? 'Vælg Tema' : 'Select Theme'}</option>
                                    <option value="opbygning">Opbygning / Build-up</option>
                                    <option value="pres">Pres / Pressing</option>
                                    <option value="afslutning">Afslutning / Finishing</option>
                                </select>
                            </div>
                            
                            {/* Input: Varighed */}
                            <div>
                                <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700">{t.durationLabel}</label>
                                <input
                                    type="number"
                                    id="durationMinutes"
                                    value={sessionData.durationMinutes}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                />
                            </div>

                            {/* Input: Noter */}
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">{t.notesLabel}</label>
                                <textarea
                                    id="notes"
                                    rows={4}
                                    value={sessionData.notes}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                    placeholder={lang === 'da' ? 'Fokus på midtbanens positionering...' : 'Focus on midfield positioning...'}
                                />
                            </div>
                        </form>
                    </aside>
                </div>
            </div>
        </div>
    );
}