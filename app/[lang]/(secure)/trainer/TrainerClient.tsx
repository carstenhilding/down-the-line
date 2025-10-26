// app/[lang]/(secure)/trainer/TrainerClient.tsx (KLIENTKOMPONENT - KORRIGERET PROPS)
"use client";

import React, { useMemo } from 'react'; // Importer useMemo
import { PlusCircle, Book, Film, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
// Importer nødvendige typer fra data laget
import { UserRole, SubscriptionLevel } from '@/lib/server/data';

// --- TYPE DEFINITIONER ---
// Sikrer at Client Componentet bruger den korrekte oversættelsesstruktur
interface SecureTranslations {
    dashboard: any;
    sidebar: any;
    header: any;
    trainer: any;
    trainer_page: any; // Denne nøgle bruges her
}

// Definerer de data, Trainer Hub modtager fra Server Componentet
interface TrainerHubData {
    weeksFocus: string;
    upcomingSessions: { id: number; title: string; time: string }[];
}

// KORREKTION: Definerer alle props TrainerClient modtager
interface TrainerClientProps {
    dict: SecureTranslations; // Modtager hele dict-objektet
    trainerHubData: TrainerHubData; // Modtager specifikke hub-data
    accessLevel: SubscriptionLevel; // Modtager adgangsniveau
    userRole: UserRole; // Modtager brugerrolle
    // lang prop fjernet, da den kan udledes fra dict eller globale kontekst om nødvendigt
}

// This page acts as a central hub for everything related to training
export default function TrainerClient({ dict, trainerHubData, accessLevel, userRole }: TrainerClientProps) {

    // KORREKTION: Bruger 'trainer_page' nøglen fra dict, som defineret i secure.ts
    const t = useMemo(() => dict.trainer_page, [dict]);
    // Henter 'lang' fra params i Server Component, men vi behøver den ikke direkte her endnu
    // const lang = ???; // Kan evt. hentes fra useLanguage context senere

    // Henter 'lang' for at bygge korrekte links
    // Antager at 'lang' er en del af 'params' i Server Component og skal sendes med?
    // For nu, lad os hårdkode det, indtil vi ser, om det er nødvendigt.
    const lang = 'da'; // ELLER 'en' - skal ideelt set komme fra props

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-screen-2xl space-y-6">

                {/* Grid for shortcuts and information */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Section (Left side) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Large Shortcut Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link href={`/${lang}/trainer/new`} className="group bg-orange-500 text-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-4 cursor-pointer">
                                <PlusCircle className="h-10 w-10" />
                                <div>
                                    <h2 className="font-bold text-lg">{t.session_planner}</h2>
                                    <p className="text-sm opacity-90">{t.session_planner_desc}</p>
                                </div>
                            </Link>
                            {/* Link til Animation Studio - skal måske have sin egen side? */}
                            <div className="group bg-black text-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-4 cursor-pointer">
                                <Film className="h-10 w-10" />
                                <div>
                                    <h2 className="font-bold text-lg">{t.animation_studio}</h2>
                                    <p className="text-sm opacity-90">{t.animation_studio_desc}</p>
                                </div>
                            </div>
                        </div>

                        {/* Week's Focus */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="font-bold text-black mb-4">{t.weeks_focus}</h3>
                            <p className="text-gray-600"
                                // Bruger 't' (fra dict.trainer_page)
                                dangerouslySetInnerHTML={{
                                    __html: t.weeks_focus_desc.replace('<1>', '<span class="font-semibold text-black">').replace('</1>', '</span>')
                                }}
                            />
                        </div>
                    </div>

                    {/* Side Section (Right side) */}
                    <div className="space-y-6">
                        {/* Upcoming Sessions - Bruger nu trainerHubData */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="font-bold text-black mb-4">{t.upcoming_sessions}</h3>
                            <ul className="space-y-3">
                                {trainerHubData.upcomingSessions.map(session => (
                                    <li key={session.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                            <span>{session.time} - {session.title}</span> {/* Bruger data */}
                                        </div>
                                        {/* <span className="font-semibold text-black">Bane 2</span> Mock Data */}
                                    </li>
                                ))}
                                {trainerHubData.upcomingSessions.length === 0 && (
                                     <p className="text-sm text-gray-500">Ingen kommende træninger planlagt.</p>
                                )}
                            </ul>
                        </div>

                        {/* Drill Libraries */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="font-bold text-black mb-4">{t.my_libraries}</h3>
                            <div className="space-y-3">
                                <Link href={`/${lang}/trainer/library`} className="flex items-center p-3 rounded-md hover:bg-gray-100 text-sm font-medium cursor-pointer">
                                    <Book className="h-5 w-5 mr-3 text-orange-500"/>
                                    {t.club_catalog}
                                </Link>
                                <Link href={`/${lang}/trainer/library`} className="flex items-center p-3 rounded-md hover:bg-gray-100 text-sm font-medium cursor-pointer">
                                    <Users className="h-5 w-5 mr-3 text-black"/>
                                    {t.personal_catalog}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}