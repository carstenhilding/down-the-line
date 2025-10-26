// components/dashboard/widgets/AiReadinessWidget.tsx
"use client";

import React from 'react';
import { Zap } from 'lucide-react';

interface AiReadinessWidgetProps {
    userData: {
        subscriptionLevel: 'Starter' | 'Advance' | 'Expert' | 'Performance' | 'Elite' | 'Enterprise';
    };
    lang: 'da' | 'en';
}

export default function AiReadinessWidget({ userData, lang }: AiReadinessWidgetProps) {
    const isAdvancedUser = userData.subscriptionLevel === 'Elite' ||
                           userData.subscriptionLevel === 'Enterprise' ||
                           userData.subscriptionLevel === 'Expert' ||
                           userData.subscriptionLevel === 'Performance';

    // FJERNEDE h-full og overflow-hidden herfra
    return (
        <div className="bg-white shadow rounded-lg p-3 sm:p-4 border border-orange-500/50">
            <h3 className="text-base sm:text-lg font-semibold text-black mb-2 sm:mb-3 flex justify-between items-center">
                AI Readiness Score
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
            </h3>
            {!isAdvancedUser ? (
                <div className="text-center bg-gray-50 p-3 sm:p-4 rounded-md">
                    <p className="text-xs sm:text-sm font-medium mb-2">{lang === 'da' ? 'Opgrader for at få adgang til AI Performance Data.' : 'Upgrade to access AI Performance Data.'}</p>
                    <button className="text-xs text-white bg-black px-2 py-1 sm:px-3 rounded-full hover:bg-gray-800 transition-colors">
                        Opgrader til Elite Plan →
                    </button>
                </div>
            ) : (
                <div>
                    <p className="text-3xl sm:text-4xl font-extrabold text-green-600">92%</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{lang === 'da' ? 'Holdets gennemsnitlige klarhed i dag.' : 'Team average readiness today.'}</p>
                    <div className="mt-2 sm:mt-3 flex justify-between text-xs text-gray-700">
                        <span>Laveste risiko: 88%</span>
                        <span>Højeste risiko: 98%</span>
                    </div>
                </div>
            )}
        </div>
    );
}