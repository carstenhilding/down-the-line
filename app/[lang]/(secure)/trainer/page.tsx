"use client";

import React, { use } from 'react';
import { useLanguage } from '../../../../components/LanguageContext';
import { PlusCircle, Book, Film, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

// This page acts as a central hub for everything related to training
export default function TrainerPage() {
    const { t, language: lang } = useLanguage();

    // Wait for translations to be ready
    if (!t || !t.sidebar || !t.trainer_page) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-screen-2xl">
                    <h1 className="text-2xl font-bold text-black mb-6">Loading...</h1>
                </div>
            </div>
        );
    }
    
    const trainerPageTranslations = t.trainer_page as {[key: string]: string};

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
                                    <h2 className="font-bold text-lg">{trainerPageTranslations.session_planner}</h2>
                                    <p className="text-sm opacity-90">{trainerPageTranslations.session_planner_desc}</p>
                                </div>
                            </Link>
                            <div className="group bg-black text-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-4 cursor-pointer">
                                <Film className="h-10 w-10" />
                                <div>
                                    <h2 className="font-bold text-lg">{trainerPageTranslations.animation_studio}</h2>
                                    <p className="text-sm opacity-90">{trainerPageTranslations.animation_studio_desc}</p>
                                </div>
                            </div>
                        </div>

                        {/* Week's Focus */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="font-bold text-black mb-4">{trainerPageTranslations.weeks_focus}</h3>
                            <p className="text-gray-600"
                               dangerouslySetInnerHTML={{
                                   __html: trainerPageTranslations.weeks_focus_desc.replace('<1>', '<span class="font-semibold text-black">').replace('</1>', '</span>')
                               }}
                            />
                        </div>
                    </div>

                    {/* Side Section (Right side) */}
                    <div className="space-y-6">
                        {/* Upcoming Sessions */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="font-bold text-black mb-4">{trainerPageTranslations.upcoming_sessions}</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>Tirsdag 17:00 - U19 Drenge</span>
                                    </div>
                                    <span className="font-semibold text-black">Bane 2</span>
                                </li>
                                <li className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>Torsdag 17:30 - U19 Drenge</span>
                                    </div>
                                    <span className="font-semibold text-black">Bane 2</span>
                                </li>
                            </ul>
                        </div>

                        {/* Drill Libraries */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="font-bold text-black mb-4">{trainerPageTranslations.my_libraries}</h3>
                            <div className="space-y-3">
                                <Link href={`/${lang}/trainer/library`} className="flex items-center p-3 rounded-md hover:bg-gray-100 text-sm font-medium cursor-pointer">
                                    <Book className="h-5 w-5 mr-3 text-orange-500"/>
                                    {trainerPageTranslations.club_catalog}
                                </Link>
                                <Link href={`/${lang}/trainer/library`} className="flex items-center p-3 rounded-md hover:bg-gray-100 text-sm font-medium cursor-pointer">
                                    <Users className="h-5 w-5 mr-3 text-black"/>
                                    {trainerPageTranslations.personal_catalog}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

