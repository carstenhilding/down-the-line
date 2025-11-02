// components/dashboard/widgets/ActivityWidget.tsx
"use client";

import React from 'react';
import { Activity } from 'lucide-react';
import { SmartWidget } from './SmartWidget'; // Importerer den nye wrapper

interface ActivityWidgetProps {
    t: any; // Oversættelses-objekt (dashboard-sektion)
    item: { data: { feed: string[] } };
}

export default function ActivityWidget({ t, item }: ActivityWidgetProps) {
    return (
        <SmartWidget priority="low" className="h-full">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-black" />
                {t.recentActivityTitle ?? 'Seneste Aktivitet'}
            </h3>
            <ul className="space-y-1.5">
                {item.data.feed?.map((activity: string, index: number) => (
                    <li
                        key={index}
                        className="text-xs sm:text-sm text-gray-700 border-b border-gray-100 pb-1.5 last:border-b-0"
                    >
                        {activity}
                    </li>
                ))}
                {(!item.data.feed || item.data.feed.length === 0) && (
                    <p className="text-xs sm:text-sm text-gray-500">
                        {t.activityPlaceholder ?? 'Ingen aktivitet fundet.'}
                    </p>
                )}
            </ul>
        </SmartWidget>
    );
}