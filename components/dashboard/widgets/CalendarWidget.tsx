// components/dashboard/widgets/CalendarWidget.tsx
"use client";

import React from 'react';

interface CalendarWidgetProps {
    translations: { upcoming_week?: string };
    lang: 'da' | 'en';
}

export default function CalendarWidget({ translations, lang }: CalendarWidgetProps) {
    const getDayInitial = (dayIndex: number) => {
        const daysDa = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
        const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return lang === 'da' ? daysDa[dayIndex] : daysEn[dayIndex];
    }
    const today = new Date();

    // FJERNEDE h-full og overflow-hidden herfra
    return (
        <div className="bg-white shadow rounded-lg p-3 sm:p-4">
             <h3 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4">{translations.upcoming_week || 'Upcoming Week'}</h3>
             <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
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
                        <div key={index} className="p-1 sm:p-2 rounded-lg">
                            <p className="text-xs font-semibold text-gray-500">{dayName}</p>
                            <p className={`font-bold mt-1 text-sm ${isToday ? 'bg-orange-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 mx-auto flex items-center justify-center text-xs sm:text-sm' : 'text-sm'}`}>{date.getDate()}</p>
                            <div className="h-4 mt-1 sm:mt-2 flex justify-center items-center">
                              {eventType === 'training' && <div className="w-1.5 h-1.5 sm:w-2 sm:w-2 rounded-full bg-orange-500" title="Træning"></div>}
                              {eventType === 'match' && <div className="w-1.5 h-1.5 sm:w-2 sm:w-2 rounded-full bg-black" title="Kamp"></div>}
                              {eventType === 'meeting' && <div className="w-1.5 h-1.5 sm:w-2 sm:w-2 rounded-full bg-gray-400" title="Møde"></div>}
                            </div>
                        </div>
                    )
                })}
             </div>
        </div>
    );
}