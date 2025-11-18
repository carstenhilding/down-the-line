// app/[lang]/(secure)/trainer/TrainerClient.tsx
"use client";

import React, { useMemo } from 'react';
import { PlusCircle, Book, Film, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { UserRole, SubscriptionLevel } from '@/lib/server/data';

// --- TYPE DEFINITIONER ---
interface SecureTranslations {
    dashboard?: any;
    sidebar?: any;
    header?: any;
    trainer?: any;
    trainer_page: any;
}

interface TrainerHubData {
    weeksFocus: string;
    upcomingSessions: { id: number; title: string; time: string }[];
}

interface TrainerClientProps {
    dict: SecureTranslations;
    trainerHubData: TrainerHubData;
    accessLevel: SubscriptionLevel;
    userRole: UserRole;
    lang: 'da' | 'en';
}


export default function TrainerClient({ dict, trainerHubData, accessLevel, userRole, lang }: TrainerClientProps) {

    // Sikrer at t altid er et objekt
    const t = useMemo(() => dict.trainer_page || {}, [dict]);

    return (
        // MINIMAL YDRE PADDING (Som defineret i tidligere trin)
        <div className="p-0 md:p-1 lg:p-2"> 
            <div className="space-y-4 md:space-y-6 xl:space-y-8">

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-8">

                    {/* Main Section (Left side) */}
                    <div className="lg:col-span-2 space-y-4 md:space-y-6 xl:space-y-8">

                        {/* Large Shortcut Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 xl:gap-8">
                            
                            {/* 1. SESSION PLANNER (Opdateret link til /planner) */}
                            <Link href={`/${lang}/trainer/planner`} className="group bg-orange-500 text-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-3 sm:space-x-4 cursor-pointer">
                                <PlusCircle className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
                                <div>
                                    <h2 className="font-bold text-base sm:text-lg">{t.session_planner ?? 'Session Planner'}</h2>
                                    <p className="text-xs sm:text-sm opacity-90">{t.session_planner_desc ?? 'Design og planlæg'}</p>
                                </div>
                            </Link>

                            {/* 2. DTL STUDIO (Opdateret link til /studio og ændret fra div til Link) */}
                            <Link href={`/${lang}/trainer/studio`} className="group bg-black text-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-3 sm:space-x-4 cursor-pointer">
                                <Film className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
                                <div>
                                    <h2 className="font-bold text-base sm:text-lg">{t.animation_studio ?? 'Animation Studio'}</h2>
                                    <p className="text-xs sm:text-sm opacity-90">{t.animation_studio_desc ?? 'Bring øvelser til live'}</p>
                                </div>
                            </Link>
                            
                        </div>

                        {/* Week's Focus */}
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                            <h3 className="text-base sm:text-lg font-semibold text-black mb-2 md:mb-4">{t.weeks_focus ?? 'Ugens Fokus'}</h3>
                            <p className="text-xs sm:text-sm text-gray-600"
                                dangerouslySetInnerHTML={{
                                    __html: (t.weeks_focus_desc || '').replace('<1>', '<span class="font-semibold text-black">').replace('</1>', '</span>')
                                }}
                            />
                        </div>
                    </div>

                    {/* Side Section (Right side) */}
                    <div className="space-y-4 md:space-y-6 xl:space-y-8">
                        {/* Upcoming Sessions */}
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                            <h3 className="text-base sm:text-lg font-semibold text-black mb-2 md:mb-4">{t.upcoming_sessions ?? 'Kommende Træninger'}</h3>
                            <ul className="space-y-2">
                                {trainerHubData.upcomingSessions?.map(session => (
                                    <li key={session.id} className="flex items-center justify-between text-xs sm:text-sm">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                            <span>{session.time} - {session.title}</span>
                                        </div>
                                    </li>
                                ))}
                                {(!trainerHubData.upcomingSessions || trainerHubData.upcomingSessions.length === 0) && (
                                    <p className="text-xs sm:text-sm text-gray-500">Ingen kommende træninger planlagt.</p>
                                )}
                            </ul>
                        </div>

                        {/* Drill Libraries */}
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                            <h3 className="text-base sm:text-lg font-semibold text-black mb-2 md:mb-4">{t.my_libraries ?? 'Mine Biblioteker'}</h3>
                            <div className="space-y-2">
                                <Link href={`/${lang}/trainer/library`} className="flex items-center p-2 sm:p-3 rounded-md hover:bg-gray-100 text-xs sm:text-sm font-medium cursor-pointer">
                                    <Book className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-orange-500"/>
                                    {t.club_catalog ?? 'Klub Katalog'}
                                </Link>
                                <Link href={`/${lang}/trainer/library`} className="flex items-center p-2 sm:p-3 rounded-md hover:bg-gray-100 text-xs sm:text-sm font-medium cursor-pointer">
                                    <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-black"/>
                                    {t.personal_catalog ?? 'Personligt Katalog'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}