// app/[lang]/(secure)/trainer/TrainerClient.tsx
"use client";

import React, { useMemo, useState } from 'react';
import { 
    Calendar, MapPin, Users, CheckSquare, MessageSquare, // <--- TILFØJET HER
    Trophy, Lightbulb, Save, Timer,
    Calendar as CalendarIcon, GitPullRequestArrowIcon, User as UserIcon, Video, PlusCircle, AlertCircle,
    Move, HelpCircle, Clock, PlayCircle, FileText, Mail
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; 
import { UserRole, SubscriptionLevel } from '@/lib/server/data';
import { useUser } from '@/components/UserContext'; 

// --- TYPES & PROPS ---
interface SecureTranslations {
    dashboard?: any;
    sidebar?: any;
    header?: any;
    trainer?: any;
    trainer_page: any;
}

interface TrainerHubData {
    upcomingSessions: { id: number; title: string; time: string }[];
}

interface TrainerClientProps {
    dict: SecureTranslations;
    trainerHubData: TrainerHubData;
    accessLevel: SubscriptionLevel;
    userRole: UserRole;
    lang: 'da' | 'en';
}

// --- 1. VIEW: STATIC DASHBOARD (STARTER) ---
const StaticDashboard = ({ nextSession, nextMatch, teamStatus, tasks, weeklyEvents, lang }: any) => (
    <div className="space-y-6 mt-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-wider mb-1">
                <AlertCircle className="w-4 h-4" /> Starter Plan
            </div>
            <p className="text-xs text-gray-500">Du ser det statiske overblik. Opgrader til Expert for at få det dynamiske dashboard.</p>
        </div>

        {/* GRID LAYOUT: 3 Kolonner x 2 Rækker (6 items) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Dagens Træning */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between hover:border-orange-300 transition-colors group">
                <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-500" /> Dagens Træning
                    </h3>
                    <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{nextSession.title}</h2>
                    <div className="flex flex-col gap-1 text-sm text-gray-600 mb-4 mt-2">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> {nextSession.time}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {nextSession.pitch}</span>
                    </div>
                </div>
                <Link href={`/${lang}/trainer/planner`} className="text-sm font-bold text-black hover:text-orange-600 flex items-center mt-2">
                    Gå til plan <PlusCircle className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
            </div>

            {/* 2. Kalender (Ugeplan) */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-gray-400" /> Denne Uge
                </h3>
                <ul className="space-y-3 flex-1">
                    {weeklyEvents.map((event: any) => (
                        <li key={event.id} className="flex justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                            <span className="text-gray-500 font-medium w-16">{event.day}</span>
                            <span className="text-gray-900 font-bold truncate flex-1 text-right">{event.title}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 3. Kommende Kamp */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-blue-500" /> Næste Kamp
                </h3>
                <div className="flex-1 flex flex-col justify-center text-center mb-2">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">MODSTANDER</div>
                    <div className="text-lg font-black text-gray-900">{nextMatch.opponent}</div>
                    <div className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-full inline-block mx-auto mt-2">
                        Om {nextMatch.daysLeft} dage
                    </div>
                </div>
                <div className="text-center text-xs text-gray-500 mt-2">
                    {nextMatch.date} • {nextMatch.venue}
                </div>
            </div>

            {/* 4. Indkomne Afbud (Kun status, ingen readiness) */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                 <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" /> Afbud & Status
                </h3>
                <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-bold text-gray-900">{teamStatus.available}</span>
                    <span className="text-sm text-gray-500 mb-1.5 font-medium">Spillere til rådighed</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center bg-red-50 px-3 py-2.5 rounded-lg text-sm text-red-700">
                        <span className="font-medium">Afbud modtaget</span>
                        <span className="font-bold">{teamStatus.absent}</span>
                    </div>
                     <div className="flex justify-between items-center bg-gray-50 px-3 py-2.5 rounded-lg text-sm text-gray-700">
                        <span className="font-medium">Skadede spillere</span>
                        <span className="font-bold">{teamStatus.injured}</span>
                    </div>
                </div>
            </div>

            {/* 5. Opgaver / Huskeliste */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-gray-400" /> Huskeliste
                </h3>
                <ul className="space-y-3 flex-1">
                    {tasks.map((task: any) => (
                        <li key={task.id} className="flex items-start gap-3 text-sm group cursor-pointer">
                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${task.done ? 'bg-black border-black text-white' : 'border-gray-300 group-hover:border-orange-400'}`}>
                                {task.done && <CheckSquare className="w-3 h-3" />}
                            </div>
                            <span className={`transition-colors ${task.done ? 'text-gray-400 line-through' : 'text-gray-700 group-hover:text-black'}`}>{task.text}</span>
                        </li>
                    ))}
                </ul>
                <button className="text-xs font-bold text-gray-400 hover:text-orange-500 text-left mt-4">+ Ny opgave</button>
            </div>
             
             {/* 6. Hjælp Mig (Support Widget) */}
             <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col group hover:border-blue-200 transition-colors">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-500" /> Hjælp Mig
                </h3>
                
                <div className="space-y-3 flex-1">
                    <Link href="/guides" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group/item">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 group-hover/item:bg-blue-100">
                            <FileText className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Kom godt i gang</p>
                            <p className="text-xs text-gray-500">Læs start-guiden</p>
                        </div>
                    </Link>
                    
                    <Link href="/tutorials" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group/item">
                        <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mr-3 group-hover/item:bg-orange-100">
                            <PlayCircle className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Video Tutorials</p>
                            <p className="text-xs text-gray-500">Se hvordan du gør</p>
                        </div>
                    </Link>
                </div>

                <Link href="/support" className="mt-4 w-full py-2 bg-black text-white rounded-lg text-xs font-bold flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <Mail className="w-3 h-3 mr-2" /> Kontakt Support
                </Link>
             </div>

        </div>
    </div>
);

// --- 2. VIEW: DYNAMIC DASHBOARD (EXPERT & ELITE GRID) ---
const DynamicDashboard = ({ nextSession, nextMatch, teamStatus, messages, quickNote, setQuickNote, lang }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in duration-500 mt-6">
        {/* Hero Card */}
        <div className="col-span-1 md:col-span-2 xl:col-span-2 bg-gradient-to-br from-white to-orange-50/30 rounded-2xl shadow-sm border border-orange-100 overflow-hidden relative group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Timer className="w-32 h-32 text-orange-500 rotate-12" /></div>
            <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Move className="w-3 h-3" /> Dynamic Widget
                    </span>
                    <span className="text-sm font-bold text-gray-400">Om 2 timer</span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">{nextSession.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600 mb-6">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-500" /> {nextSession.time}</div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-500" /> {nextSession.pitch}</div>
                    <div className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-orange-500" /> {nextSession.theme}</div>
                </div>
                <Link href={`/${lang}/trainer/planner`} className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl font-bold shadow-lg hover:bg-gray-900 hover:scale-[1.02] transition-all">
                    <PlusCircle className="w-5 h-5 mr-2" /> Åben Session Plan
                </Link>
            </div>
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-orange-300 absolute bottom-0 left-0"></div>
        </div>

        {/* Trup Status (Med Readiness for Expert/Elite) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between relative overflow-hidden group hover:border-orange-200 transition-colors">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5 text-gray-400" /> Trup</h3>
                    {teamStatus.status === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black text-gray-900">{teamStatus.available}</span>
                    <span className="text-lg font-medium text-gray-400">/ {teamStatus.total}</span>
                </div>
                <p className="text-sm text-gray-500 font-medium mb-4">Spillere klar</p>
                
                {/* Readiness Bar (Kun her) */}
                <div className="flex gap-1 h-2 mb-4">
                    {Array.from({ length: teamStatus.total }).map((_, i) => (
                        <div key={i} className={`flex-1 rounded-full ${i < teamStatus.available ? 'bg-green-500' : 'bg-red-200'}`}></div>
                    ))}
                </div>
            </div>
            <div className="flex gap-2">
                <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-bold flex-1 text-center">{teamStatus.injured} Skadet</div>
                <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-xs font-bold flex-1 text-center">{teamStatus.absent} Afbud</div>
            </div>
        </div>

        {/* Beskeder (Kun her) - MessageSquare bruges her! */}
        <div className="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:border-orange-200 transition-colors">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-gray-500" /> Indbakke</h3>
                <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">2 NYE</span>
            </div>
            <div className="divide-y divide-gray-50 flex-1 overflow-y-auto max-h-[200px]">
                {messages.map((msg: any) => (
                    <div key={msg.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer flex justify-between items-center group">
                        <div>
                            <p className="text-xs font-bold text-gray-900">{msg.from}</p>
                            <p className={`text-xs ${msg.important ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>{msg.subject}</p>
                        </div>
                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                    </div>
                ))}
            </div>
                <Link href="/comms" className="p-3 text-center text-xs font-bold text-gray-400 hover:text-orange-500 border-t border-gray-100 block transition-colors">
                Gå til Beskeder
            </Link>
        </div>
        
        {/* Næste Kamp */}
        <div className="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col justify-center relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10 mb-2">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><Trophy className="w-5 h-5" /></div>
                <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Næste Kamp</p>
                        <p className="text-lg font-black text-gray-900">{nextMatch.opponent}</p>
                </div>
                </div>
                <div className="text-right relative z-10">
                    <p className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600 inline-block">Om {nextMatch.daysLeft} dage</p>
                </div>
        </div>

        {/* Hurtig Note */}
        <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-200 p-5 flex flex-col relative group hover:shadow-md transition-all md:col-span-2 xl:col-span-1">
            <h3 className="font-bold text-yellow-800 flex items-center gap-2 mb-2 relative z-10">
                <Lightbulb className="w-5 h-5" /> Hurtig Note
            </h3>
            <textarea 
                className="flex-1 w-full bg-transparent border-none resize-none outline-none text-sm text-gray-800 placeholder-yellow-800/50 font-medium relative z-10"
                placeholder="Husk at..."
                value={quickNote}
                onChange={(e: any) => setQuickNote(e.target.value)}
                rows={2}
            ></textarea>
            <div className="flex justify-end mt-2 relative z-10">
                    <button className="p-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded-lg transition-colors"><Save className="w-4 h-4" /></button>
            </div>
        </div>
    </div>
);

// --- 3. VIEW: CANVAS DASHBOARD (ELITE ONLY) ---
const CanvasDashboard = () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden animate-in zoom-in-95 duration-300 mt-6">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
        <Layers className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-black text-gray-900">Infinite Canvas Mode</h2>
        <p className="text-gray-500 max-w-md text-center mt-2">
            Dette er dit frie arbejdsrum. Her kan du trække widgets, noter og data rundt præcis som du vil.
        </p>
        <span className="mt-6 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
            Kun for Elite & Enterprise
        </span>
    </div>
);

// --- HOVED KOMPONENT ---
export default function TrainerClient({ dict, trainerHubData, accessLevel: serverAccessLevel, userRole, lang }: TrainerClientProps) {
    const d_t = useMemo(() => dict.dashboard || {}, [dict]); 
    
    // 1. Hent bruger fra context
    const { user } = useUser();
    const searchParams = useSearchParams();
    
    // 2. Bestem Niveau
    const currentAccessLevel = user?.subscriptionLevel || serverAccessLevel;
    const isStarter = ['Starter', 'Essential', 'Advance'].includes(currentAccessLevel);
    const isExpert = ['Expert', 'Complete', 'Performance'].includes(currentAccessLevel);
    const isElite = ['Elite', 'Enterprise'].includes(currentAccessLevel);
    const isPremium = isExpert || isElite;

    // 3. Bestem View Mode
    const viewParam = searchParams.get('view');
    const showCanvas = isElite && viewParam === 'canvas';

    const [quickNote, setQuickNote] = useState("");

    // Mock Data
    const nextSession = { title: "Fase 1 - Opbygningsspil", date: "I dag", time: "17:30 - 19:00", pitch: "Bane 4 (Kunst)", theme: "Højt Pres & Genpres", weather: "14°C, Let regn" };
    const nextMatch = { opponent: "Vejle BK", date: "Lørdag, 11:00", venue: "Udebane", daysLeft: 3 };
    const teamStatus = { available: 18, total: 22, injured: 2, absent: 2, status: 'warning' };
    const messages = [{ id: 1, from: "Klubadmin", subject: "Husk banefordeling", time: "2t", important: true }, { id: 2, from: "Mads J.", subject: "Kommer lidt senere", time: "4t", important: false }];
    
    // NY DATA TIL STATIC DASHBOARD
    const tasks = [
        { id: 1, text: "Bestil bus til lørdag", done: false },
        { id: 2, text: "Indsaml tøjpakke U17", done: true },
        { id: 3, text: "Opdater kampdata", done: false }
    ];
    const weeklyEvents = [
        { id: 1, day: "Mandag", title: "Træning 17:30" },
        { id: 2, day: "Onsdag", title: "Træning 17:30" },
        { id: 3, day: "Lørdag", title: "Kamp vs Vejle" },
        { id: 4, day: "Søndag", title: "Fri" },
    ];

    // --- 100% MATCH AF DASHBOARD STYLING ---
    const buttonBaseClass = "flex items-center justify-between p-2 sm:p-3 text-xs sm:text-sm transition duration-200 shadow-xl rounded-lg border-2 border-black group hover:-translate-y-1 hover:shadow-2xl cursor-pointer";
    const activeButtonClass = "bg-black text-white";
    const lockedButtonClass = "bg-gray-900 text-gray-400 border-gray-800 cursor-not-allowed opacity-60 hover:translate-y-0 hover:shadow-none";
    
    const ICON_SIZE_CLASS = "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-3";
    
    // Bredde beregninger fra DashboardClient.tsx
    const responsiveWidthClass = "w-full md:w-[calc(50%-8px)] lg:w-[calc(33.33%-10.66px)] xl:w-[calc(25%-12px)]";

    return (
        <div className="h-full overflow-y-auto p-2 lg:p-4 bg-gray-50">

            {/* 1. QUICK ACCESS BUTTONS */}
            <div className="flex flex-wrap gap-4 md:gap-4 mb-4">
                
                {/* 1. Session Planner */}
                <Link href={`/${lang}/trainer/planner`} className={`${buttonBaseClass} ${activeButtonClass} ${responsiveWidthClass}`}>
                    <div className='flex items-center'>
                        <CalendarIcon className={ICON_SIZE_CLASS + " text-orange-500 shrink-0"} />
                    </div>
                    <div className='flex flex-col flex-1 items-center justify-center text-center'>
                        <span className='font-bold text-xs sm:text-sm'>{d_t.createSessionTitle ?? 'Ny Træningsplan'}</span>
                        <span className='text-[10px] text-gray-400'>{d_t.sessionPlannerSubtitle ?? 'Planlægning'}</span>
                    </div>
                    <div className={ICON_SIZE_CLASS}></div>
                </Link>

                {/* 2. DTL Studio */}
                <Link href={`/${lang}/trainer/studio`} className={`${buttonBaseClass} ${activeButtonClass} ${responsiveWidthClass}`}>
                    <div className='flex items-center'>
                        <GitPullRequestArrowIcon className={ICON_SIZE_CLASS + " text-orange-500 shrink-0"} />
                    </div>
                    <div className='flex flex-col flex-1 items-center justify-center text-center'>
                        <span className='font-bold text-xs sm:text-sm'>{d_t.createDrillTitle ?? 'Ny Øvelse'}</span>
                        <span className='text-[10px] text-gray-400'>{d_t.dtlStudioSubtitle ?? 'DTL Studio'}</span>
                    </div>
                    <div className={ICON_SIZE_CLASS}></div>
                </Link>

                {/* 3. Readiness */}
                {isPremium ? (
                    <Link href="/analysis" className={`${buttonBaseClass} ${activeButtonClass} ${responsiveWidthClass}`}>
                        <div className='flex items-center'><UserIcon className={ICON_SIZE_CLASS + " text-orange-500 shrink-0"} /></div>
                        <div className='flex flex-col flex-1 items-center justify-center text-center'>
                            <span className='font-bold text-xs sm:text-sm'>{d_t.readinessTitle ?? 'Readiness'}</span>
                            <span className='text-[10px] text-gray-400'>{d_t.playerSubtitle ?? 'Spiller Data'}</span>
                        </div>
                        <div className={ICON_SIZE_CLASS}></div>
                    </Link>
                ) : (
                    <div className={`${buttonBaseClass} ${lockedButtonClass} ${responsiveWidthClass}`}>
                        <div className='flex items-center'><UserIcon className={`${ICON_SIZE_CLASS} text-gray-600 shrink-0`} /></div>
                        <div className='flex flex-col flex-1 items-center justify-center text-center'>
                            <span className='font-bold text-xs sm:text-sm text-gray-500'>{d_t.readinessTitle ?? 'Readiness'}</span>
                            <span className='text-[10px] text-gray-600 uppercase tracking-wider'>Låst</span>
                        </div>
                        <div className={ICON_SIZE_CLASS}></div>
                    </div>
                )}

                {/* 4. Video Analysis */}
                {isPremium ? (
                    <Link href="/analysis" className={`${buttonBaseClass} ${activeButtonClass} ${responsiveWidthClass}`}>
                        <div className='flex items-center'><Video className={ICON_SIZE_CLASS + " text-orange-500 shrink-0"} /></div>
                        <div className='flex flex-col flex-1 items-center justify-center text-center'>
                            <span className='font-bold text-xs sm:text-sm'>{d_t.videoAnalysisTitle ?? 'Video Analyse'}</span>
                            <span className='text-[10px] text-gray-400'>{d_t.analysisRoomSubtitle ?? 'Analyse Rum'}</span>
                        </div>
                        <div className={ICON_SIZE_CLASS}></div>
                    </Link>
                ) : (
                    <div className={`${buttonBaseClass} ${lockedButtonClass} ${responsiveWidthClass}`}>
                        <div className='flex items-center'><Video className={`${ICON_SIZE_CLASS} text-gray-600 shrink-0`} /></div>
                        <div className='flex flex-col flex-1 items-center justify-center text-center'>
                            <span className='font-bold text-xs sm:text-sm text-gray-500'>{d_t.videoAnalysisTitle ?? 'Video Analyse'}</span>
                            <span className='text-[10px] text-gray-600 uppercase tracking-wider'>Låst</span>
                        </div>
                        <div className={ICON_SIZE_CLASS}></div>
                    </div>
                )}
            </div>

            {/* 2. HOVED OMRÅDE */}
            <div>
                {showCanvas ? (
                    <CanvasDashboard />
                ) : isStarter ? (
                    <StaticDashboard 
                        nextSession={nextSession} 
                        nextMatch={nextMatch}
                        teamStatus={teamStatus} 
                        tasks={tasks} 
                        weeklyEvents={weeklyEvents}
                        lang={lang} 
                    />
                ) : (
                    <DynamicDashboard 
                        nextSession={nextSession} 
                        nextMatch={nextMatch}
                        teamStatus={teamStatus} 
                        messages={messages} 
                        quickNote={quickNote}
                        setQuickNote={setQuickNote}
                        lang={lang} 
                    />
                )}
            </div>
        </div>
    );
}