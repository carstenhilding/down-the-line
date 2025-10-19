"use client";

import React, { use } from 'react';
import { useLanguage } from '../../../../components/LanguageContext';
import Link from 'next/link';
import { Plus, List, Settings, ClipboardList, Calendar, Zap, Shield, UserMinus, Trophy } from 'lucide-react';
import ActivityItem from '../../../../components/dashboard/ActivityItem';

// --- MOCK DATA ---
const upcomingEvents = [
    { day: "Tir", date: 21, type: 'training', time: '17:00' },
    { day: "Ons", date: 22, type: 'meeting', time: '19:00' },
    { day: "Tor", date: 23, type: 'training', time: '17:30' },
    { day: "Lør", date: 25, type: 'match', time: '14:00' },
];
const unavailablePlayers = [
    { name: "Mads Larsen", status: "Forstrækning", returnDate: "2 uger" },
    { name: "Jonas Wind", status: "Sygdom", returnDate: "Ukendt" },
];
const mockActivity = [
    { type: 'exercise_created', text: "Du oprettede øvelsen 'Hurtige afslutninger'", time: '2 timer siden' },
    { type: 'player_added', text: "Mads Larsen blev tilføjet til U19 holdet", time: 'I går' },
];

// --- Hovedkomponent ---
export default function DashboardPage() {
    const { t, language: lang } = useLanguage();

    if (!t || !t.dashboard || !t.sidebar) {
        return <div className="p-8">Loading...</div>;
    }
    const dashboardTranslations = t.dashboard as {[key: string]: string};
    
    const userRole = 'developer';

    const getDayInitial = (dayIndex: number) => {
        const daysDa = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
        const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return lang === 'da' ? daysDa[dayIndex] : daysEn[dayIndex];
    }

    const today = new Date();

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-screen-2xl space-y-6">
                
                {/* OVERSKRIFT FJERNET HERFRA */}
                
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-4">{dashboardTranslations.upcoming_week}</h3>
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {Array.from({ length: 7 }).map((_, index) => {
                            const date = new Date();
                            date.setDate(today.getDate() + index);
                            const dayName = getDayInitial(date.getDay());
                            const isToday = index === 0;

                            let eventType = null;
                            if (dayName === 'Tir' || dayName === 'Tor' || dayName === 'Tue' || dayName === 'Thu') eventType = 'training';
                            if (dayName === 'Lør' || dayName === 'Sat') eventType = 'match';
                            if (dayName === 'Ons' || dayName === 'Wed') eventType = 'meeting';

                            return (
                                <div key={index} className="p-2 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-500">{dayName}</p>
                                    <p className={`font-bold mt-1 text-sm ${isToday ? 'bg-orange-500 text-white rounded-full w-6 h-6 mx-auto flex items-center justify-center' : ''}`}>{date.getDate()}</p>
                                    <div className="h-4 mt-2 flex justify-center items-center">
                                      {eventType === 'training' && <div className="w-2 h-2 rounded-full bg-orange-500" title="Træning"></div>}
                                      {eventType === 'match' && <div className="w-2 h-2 rounded-full bg-black" title="Kamp"></div>}
                                      {eventType === 'meeting' && <div className="w-2 h-2 rounded-full bg-gray-400" title="Møde"></div>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <section className="lg:w-2/3 space-y-6">
                        <div className="bg-white shadow rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-black border-b pb-2 mb-4">{lang === 'da' ? 'Hurtig Adgang' : 'Quick Access'}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link href={`/${lang}/trainer/new`} className="group bg-orange-500 rounded-lg shadow hover:shadow-md p-4 flex flex-col items-start space-y-2 hover:bg-orange-600">
                                    <Plus className="h-6 w-6 text-white" />
                                    <h2 className="text-base font-semibold text-white">{dashboardTranslations.createTrainingTitle}</h2>
                                </Link>
                                <Link href={`/${lang}/trainer/library`} className="group bg-black rounded-lg shadow hover:shadow-md p-4 flex flex-col items-start space-y-2 hover:bg-gray-800">
                                    <List className="h-6 w-6 text-white" />
                                    <h2 className="text-base font-semibold text-white">{dashboardTranslations.viewTrainingTitle}</h2>
                                </Link>
                                {userRole === 'developer' && (
                                    <div className="bg-black rounded-lg shadow p-4 flex flex-col items-start space-y-2">
                                        <Settings className="h-6 w-6 text-white" />
                                        <h2 className="text-base font-semibold text-white">Udvikler Værktøjer</h2>
                                    </div>
                                )}
                                <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start space-y-2 border">
                                    <ClipboardList className="h-6 w-6 text-gray-500" />
                                    <h2 className="text-base font-semibold text-gray-700">Opgaveoversigt</h2>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-black mb-4 border-b pb-2">{dashboardTranslations.recentActivityTitle}</h3>
                            <div className="space-y-2">
                                {mockActivity.map((activity, index) => <ActivityItem key={index} {...activity} />)}
                            </div>
                        </div>
                    </section>
                    
                    <aside className="lg:w-1/3 space-y-6">
                        <div className="bg-white shadow rounded-lg p-4">
                             <h3 className="text-lg font-semibold text-black mb-4">{dashboardTranslations.team_status}</h3>
                             <div className="grid grid-cols-3 gap-4 text-center">
                                 <div className="bg-gray-100 p-3 rounded-lg">
                                     <Zap className="h-6 w-6 text-orange-500 mx-auto"/>
                                     <p className="text-xl font-bold mt-1">85%</p>
                                     <p className="text-xs text-gray-500">{dashboardTranslations.total_load}</p>
                                 </div>
                                 <div className="bg-gray-100 p-3 rounded-lg">
                                     <Shield className="h-6 w-6 text-orange-500 mx-auto"/>
                                     <p className="text-xl font-bold mt-1">92%</p>
                                     <p className="text-xs text-gray-500">{dashboardTranslations.readiness}</p>
                                 </div>
                                  <div className="bg-gray-100 p-3 rounded-lg">
                                     <Trophy className="h-6 w-6 text-orange-500 mx-auto"/>
                                     <p className="text-xl font-bold mt-1">J. Doe</p>
                                     <p className="text-xs text-gray-500">{dashboardTranslations.top_scorer}</p>
                                 </div>
                             </div>
                        </div>
                        
                        <div className="bg-white shadow rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-black mb-4">{dashboardTranslations.player_availability}</h3>
                            <ul className="space-y-3">
                                {unavailablePlayers.map(player => (
                                    <li key={player.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center">
                                            <UserMinus className="h-5 w-5 mr-3 text-orange-500"/>
                                            <div>
                                                <p className="font-semibold">{player.name}</p>
                                                <p className="text-xs text-gray-500">{player.status}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-black">{player.returnDate}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

