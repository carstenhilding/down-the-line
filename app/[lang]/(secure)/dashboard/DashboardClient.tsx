// app/[lang]/(secure)/dashboard/DashboardClient.tsx (Client Component)

'use client'; 

import { LayoutDashboard, Rocket, Zap, Users } from 'lucide-react';
import React, { useMemo } from 'react';
import { UserRole } from '@/lib/server/data'; // Sikrer korrekt typebrug

// --- TYPE DEFINITIONER ---
// OBS: SecureTranslations skal matches fra i18n/secureTranslations.ts
interface SecureTranslations {
  dashboard: any;
  sidebar: any;
  header: any;
  trainer: any;
  trainer_page: any;
}

// Definerer de data, Dashboardet modtager fra Server Componentet
interface DashboardData {
    activityFeed: string[];
    teamReadiness: { score: number; status: string };
}

// KORREKTION: Definerer alle props DashboardClient modtager
interface DashboardProps {
  dict: SecureTranslations; // Nøgle rettet her
  dashboardData: DashboardData;
  accessLevel: string;
  userRole: UserRole;
}

export default function DashboardClient({ dict, dashboardData, accessLevel, userRole }: DashboardProps) {
  
  // Bruger Tailwind CSS for styling (Regel 2)
  const isPremium = accessLevel === 'Expert' || accessLevel === 'Elite' || accessLevel === 'Enterprise';
  
  // Henter oversættelser for Dashboardet
  const t = useMemo(() => dict.dashboard, [dict]); 

  // Simulerer rolletilpasset titel
  const dashboardTitle = useMemo(() => {
    if (userRole === UserRole.Admin) return `Admin Oversigt (${accessLevel})`;
    if (userRole === UserRole.HeadOfTalent) return `Talentchef Dashboard (${accessLevel})`;
    return `${t.welcomeTitle} (Rolle: ${userRole})`;
  }, [accessLevel, userRole, t.welcomeTitle]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <LayoutDashboard className="w-6 h-6 mr-3 text-blue-600" />
          {dashboardTitle}
      </h1>

      {/* Rollespecifik Quick Access (Knapper - Opret Ny) */}
      <div className="flex space-x-4">
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 shadow-md">
          <Rocket className="w-5 h-5" />
          <span>{t.createTrainingTitle}</span>
        </button>
        {isPremium && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition duration-150 shadow-md">
            <Zap className="w-5 h-5" />
            <span>{t.readiness}</span>
          </button>
        )}
      </div>

      {/* Widget-baseret Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Team Status */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2" /> {t.team_status}
            </h2>
            <p className="text-4xl font-bold text-green-600">{dashboardData.teamReadiness.score}%</p>
            <p className="text-sm text-gray-500 mt-2">{t.readiness} status: {dashboardData.teamReadiness.status}</p>
        </div>

        {/* Widget 2: Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">{t.recentActivityTitle}</h2>
            <ul className="space-y-2">
                {dashboardData.activityFeed.map((activity, index) => (
                    <li key={index} className="text-sm text-gray-700 border-b pb-1 last:border-b-0">
                        {activity}
                    </li>
                ))}
            </ul>
        </div>
      </div>
      
      {/* Viser adgangsniveau for debug/verifikation */}
      <footer className="text-sm text-gray-400 pt-4 border-t mt-6">
        Adgangsniveau: **{accessLevel}**
      </footer>
    </div>
  );
}