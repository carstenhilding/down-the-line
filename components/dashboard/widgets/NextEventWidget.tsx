// components/dashboard/widgets/NextEventWidget.tsx
// OPDATERET til at matche logikken fra DashboardClient og bruge SmartWidget
"use client";

import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { SmartWidget } from './SmartWidget'; // Importerer den new wrapper
import Link from 'next/link';

// OPDATERET: Denne interface matcher nu de data, som DashboardClient sender
interface CalendarWidgetProps {
    t: any; // Oversættelses-objekt (dashboard-sektion)
    item: { 
        data: { 
            title: string; 
            time: string;
            focus: string;
            link: string;
        } 
    };
}

// OPDATERET: Denne logik er hentet fra DashboardClient
export default function NextEventWidget({ t, item }: CalendarWidgetProps) {
    return (
        // RETTET: "h-full" er TILFØJET
        <SmartWidget priority="medium" className="h-full">
            <div className="flex">
                <Calendar className="w-6 h-6 text-black mr-3 shrink-0" />
                <div>
                    <h3 className="text-base font-semibold text-gray-900">
                        {item.data.title}
                    </h3>
                    <p className="text-sm text-gray-700 mt-1">{item.data.time}</p>
                    <p className="text-sm text-gray-700 mt-1">
                        {t.focus ?? 'Fokus'}:{' '}
                        <span className="font-medium text-black">{item.data.focus}</span>
                    </p>
                    <Link
                        href={item.data.link}
                        className="mt-3 text-sm font-semibold text-orange-500 hover:text-black flex items-center"
                    >
                        {t.view_session_plan ?? 'Se træningspas'}
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        </SmartWidget>
    );
}