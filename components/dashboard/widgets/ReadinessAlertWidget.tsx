// components/dashboard/widgets/ReadinessAlertWidget.tsx
"use client";

import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { SmartWidget } from './SmartWidget';

interface ReadinessAlertWidgetProps {
    t: any; // Oversættelses-objekt (dashboard-sektion)
    item: { data: { title: string; description: string } };
}

export default function ReadinessAlertWidget({ t, item }: ReadinessAlertWidgetProps) {
    return (
        <SmartWidget priority="high" className="h-full">
            <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 mr-3 md:mr-4 shrink-0 text-orange-500" />
                <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                        {item.data.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 mt-1">
                        {item.data.description}
                    </p>
                    <button className="mt-3 text-sm font-semibold text-orange-500 hover:text-black flex items-center">
                        {t.view_details ?? 'Se detaljer'}
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
            </div>
        </SmartWidget>
    );
}