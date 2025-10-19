"use client"; // <--- DENNE LINJE ER TILFØJET FOR AT TILLADE HOOKS SOM useRouter OG useState

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Settings, Save, X, RotateCcw, RotateCw } from 'lucide-react';
// Stien er sat til den nødvendige 4-niveau hop for at nå roden:
import { useLanguage } from '../../../../../components/LanguageContext'; 

// Definerer data-struktur for træningspasset (MVP)
interface TrainingSession {
    name: string;
    theme: string;
    durationMinutes: number;
    notes: string;
    // Senere: canvasData: string;
}

export default function NewTrainingSessionPage({
    params: paramsPromise
}: {
    params: Promise<{ lang: 'da' | 'en' }>;
}) {
    const params = use(paramsPromise);
    const { lang } = params;
    const router = useRouter();
    const { t, language } = useLanguage();

    const [sessionData, setSessionData] = useState<TrainingSession>({
        name: '',
        theme: '',
        durationMinutes: 60,
        notes: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    
    // Tjekker at oversættelser er klar
    if (!t || !t.trainer || !t.dashboard) {
        return <div className="flex min-h-screen items-center justify-center bg-gray-50"><p className="text-xl text-gray-700">Indlæser...</p></div>;
    }
    
    // const trainerTranslations = t.trainer; // Til senere brug
    // const dashboardTranslations = t.dashboard;

    // MVP: Gem funktion
    const handleSave = async () => {
        setIsSaving(true);
        console.log("Saving session:", sessionData.name);
        // Fremtidig logik: Firestore.addDoc(sessionData);
        setTimeout(() => {
            setIsSaving(false);
            // Brug en modal/message box i stedet for alert
            console.log(`Træningspas "${sessionData.name}" er gemt (simuleret).`);
            router.push(`/${language}/dashboard`);
        }, 1500);
    };

    // MVP: Annuller/Tilbage
    const handleCancel = () => {
         // Brug en modal/message box i stedet for confirm
        if (window.confirm("Er du sikker på, du vil annullere? Alle ændringer går tabt.")) {
            router.push(`/${language}/dashboard`);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-100">
            
            {/* TOP NAVIGATION BAR (KONTROL) */}
            <header className="bg-white shadow-md p-3">
                <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold text-gray-900">
                            {sessionData.name || (lang === 'da' ? 'Nyt Træningspas' : 'New Session')}
                        </h1>
                        <button className="text-gray-500 hover:text-gray-900" title="Sessionsindstillinger">
                            <Settings className="h-5 w-5" />
                        </button>
                    </div>

                    {/* VÆRKTØJSBJÆLKE (Undo/Redo & Banevalg) */}
                    <div className="flex space-x-2 border-r pr-4 mr-4">
                         <button className="text-gray-500 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100" title="Fortryd">
                            <RotateCcw className="h-5 w-5" />
                        </button>
                         <button className="text-gray-500 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100" title="Gentag">
                            <RotateCw className="h-5 w-5" />
                        </button>
                        {/* Fremtidig: Banevælger (11v11, 7v7, etc.) */}
                    </div>

                    {/* GEM & ANNULLER */}
                    <div className="flex space-x-3">
                        <button
                            onClick={handleCancel}
                            className="flex items-center space-x-1 py-2 px-3 text-sm font-medium text-gray-600 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 transition-colors"
                            disabled={isSaving}
                        >
                            <X className="h-4 w-4" />
                            <span>{lang === 'da' ? 'Annuller' : 'Cancel'}</span>
                        </button>
                        <button
                            onClick={handleSave}
                            className={`flex items-center space-x-1 py-2 px-3 text-sm font-medium text-white rounded-md shadow-sm transition-colors ${isSaving ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
                            disabled={isSaving}
                        >
                            <Save className="h-4 w-4" />
                            <span>{isSaving ? (lang === 'da' ? 'Gemmer...' : 'Saving...') : (lang === 'da' ? 'Gem Pas' : 'Save Session')}</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* HOVEDINDHOLD: VENSTRE SIDEBAR (OBJEKTER) & HØJRE LÆRRED */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* 1. VENSTRE SIDEBAR: TEGNE OBJEKTER (Pladsholder for Drag & Drop) */}
                <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">{lang === 'da' ? 'Objekter & Spillere' : 'Objects & Players'}</h2>
                    <div className="space-y-4">
                        {/* Pladsholder for Drag & Drop elementer (Konva/Fabric) */}
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

                {/* 2. CENTRALT OMRÅDE: BANEEDITOR (Lærred) */}
                <section className="flex-1 overflow-auto p-4 flex justify-center items-center">
                    
                    {/* CANVAS CONTAINER / PLADSHOLDER */}
                    <div className="relative w-full h-full bg-green-700 rounded-lg shadow-2xl p-6 flex items-center justify-center text-white">
                        <div className="absolute inset-0 border-4 border-white rounded-lg opacity-20"></div>
                        <h2 className="text-3xl font-extrabold z-10">{lang === 'da' ? 'Træningsbane (Konva/Fabric.js Lærred)' : 'Training Pitch (Canvas)'}</h2>
                        <div className="text-center absolute bottom-4 text-sm opacity-80">
                            {/* Fremtidig: Her placeres Canvas elementet */}
                            [Pladsholder for interaktiv 3D/2D Baneeditor]
                        </div>
                    </div>
                </section>
                
                {/* 3. HØJRE SIDEBAR: DETALJER & INDSTILLINGER */}
                <aside className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">{lang === 'da' ? 'Pas Detaljer' : 'Session Details'}</h2>

                    <form className="space-y-4">
                        {/* Input: Navn */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{lang === 'da' ? 'Titel på Pas' : 'Session Title'}</label>
                            <input
                                type="text"
                                id="name"
                                value={sessionData.name}
                                onChange={(e) => setSessionData({...sessionData, name: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                placeholder={lang === 'da' ? 'Opbygning fra bagerste kæde' : 'Build-up from the back'}
                            />
                        </div>

                        {/* Input: Tema */}
                        <div>
                            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">{lang === 'da' ? 'Tema' : 'Theme'}</label>
                            <select
                                id="theme"
                                value={sessionData.theme}
                                onChange={(e) => setSessionData({...sessionData, theme: e.target.value})}
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
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">{lang === 'da' ? 'Varighed (min.)' : 'Duration (min.)'}</label>
                            <input
                                type="number"
                                id="duration"
                                value={sessionData.durationMinutes}
                                onChange={(e) => setSessionData({...sessionData, durationMinutes: parseInt(e.target.value)})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                            />
                        </div>

                        {/* Input: Noter */}
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">{lang === 'da' ? 'Trænernoter' : 'Coach Notes'}</label>
                            <textarea
                                id="notes"
                                rows={4}
                                value={sessionData.notes}
                                onChange={(e) => setSessionData({...sessionData, notes: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                placeholder={lang === 'da' ? 'Fokus på midtbanens positionering...' : 'Focus on midfield positioning...'}
                            />
                        </div>
                    </form>
                </aside>
            </div>
        </div>
    );
}