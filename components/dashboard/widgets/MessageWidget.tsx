// components/dashboard/widgets/MessageWidget.tsx
"use client";

import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { SmartWidget } from './SmartWidget';
import Link from 'next/link';

interface MessageWidgetProps {
    t: any; // Oversættelses-objekt (dashboard-sektion)
    item: { data: { title: string; snippet: string } };
}

export default function MessageWidget({ t, item }: MessageWidgetProps) {
    return (
        // RETTET: "h-full" er TILFØJET
        <SmartWidget priority="medium" className="h-full">
            <div className="flex">
                <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-black mr-3 md:mr-4 shrink-0" />
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {item.data.title}
                    </h3>
                    <p className="text-sm text-gray-700 mt-1 italic">
                        "{item.data.snippet}..."
                    </p>
                    <Link
                        href="/comms"
                        className="mt-3 text-sm font-semibold text-orange-500 hover:text-black flex items-center"
                    >
                        {t.go_to_chat ?? 'Gå til chat'}
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        </SmartWidget>
    );
}