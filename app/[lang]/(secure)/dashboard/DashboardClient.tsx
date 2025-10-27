// app/[lang]/(secure)/dashboard/DashboardClient.tsx (JSX SYNTAKS RETTET)
'use client';

import { LayoutDashboard, Rocket, Zap, Users } from 'lucide-react';
import React, { useMemo } from 'react';
import { UserRole, SubscriptionLevel } from '@/lib/server/data';

// --- TYPE DEFINITIONER ---
interface SecureTranslations {
  dashboard: any;
  sidebar?: any;
  header?: any;
  trainer?: any;
  trainer_page?: any;
}

interface DashboardData {
    activityFeed: string[];
    teamReadiness: { score: number; status: string };
}

interface DashboardProps {
  dict: SecureTranslations;
  dashboardData: DashboardData;
  accessLevel: SubscriptionLevel;
  userRole: UserRole;
}

export default function DashboardClient({ dict, dashboardData, accessLevel, userRole }: DashboardProps) {

  const isPremium = ['Expert', 'Complete', 'Elite', 'Enterprise'].includes(accessLevel);
  const t = useMemo(() => dict.dashboard || {}, [dict]);

  const dashboardTitle = useMemo(() => {
    if (userRole === UserRole.Admin) return `Admin Oversigt`;
    if (userRole === UserRole.HeadOfTalent) return `Talentchef Dashboard`;
    return (
        <>
            {t.welcomeTitle ?? 'Velkommen'}
            <span className="text-sm font-normal ml-2 hidden sm:inline">(Rolle: {userRole})</span>
        </>
    );
  }, [userRole, t.welcomeTitle]);

  return (
    <div className="space-y-4 md:space-y-6">

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
          <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-blue-600" />
          {dashboardTitle}
      </h1>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <button className="w-full sm:w-auto flex items-center justify-center sm:justify-start space-x-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 shadow-md">
          <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{t.createTrainingTitle ?? 'Opret Træning'}</span>
        </button>
        {isPremium && (
          <button className="w-full sm:w-auto flex items-center justify-center sm:justify-start space-x-2 px-3 py-1.5 text-sm bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition duration-150 shadow-md">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t.readiness ?? 'Readiness'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">

        {/* Widget 1: Team Status */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-1 md:mb-2 text-gray-800 flex items-center">
                <Users className="w-4 h-4 md:w-5 md:h-5 mr-2" /> {t.team_status ?? 'Team Status'}
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">{dashboardData.teamReadiness?.score ?? 'N/A'}%</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{t.readiness ?? 'Readiness'} status: {dashboardData.teamReadiness?.status ?? 'Ukendt'}</p>
        </div>

        {/* Widget 2: Recent Activity */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 md:col-span-1 lg:col-span-2">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-1 md:mb-2 text-gray-800">{t.recentActivityTitle ?? 'Seneste Aktivitet'}</h2>
            <ul className="space-y-1">
                {/* KORREKTION: Dobbelttjekket syntaksen her */}
                {dashboardData.activityFeed?.map((activity, index) => (
                    <li key={index} className="text-xs sm:text-sm text-gray-700 border-b pb-1 last:border-b-0">
                        {activity}
                    </li>
                ))}
                 {(!dashboardData.activityFeed || dashboardData.activityFeed.length === 0) && (
                     <p className="text-xs sm:text-sm text-gray-500">{t.activityPlaceholder ?? 'Ingen aktivitet fundet.'}</p>
                 )}
            </ul>
        </div>
         {/* Tilføj flere widgets her */}

      </div>
       {/* Footer fjernet */}
    </div>
  );
}