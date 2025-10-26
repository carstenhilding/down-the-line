// app/[lang]/(secure)/trainer/new/NewTrainerClient.tsx (Client Component)

'use client'; 

import { Settings, Users, ClipboardList, BookOpen, Clock, Zap, Target } from 'lucide-react';
import React, { useMemo, useEffect, useRef } from 'react';
import { UserRole } from '@/lib/server/data'; 

// --- TYPE DEFINITIONER ---
interface SessionData {
  teamRoster: { name: string; available: boolean; status: string }[];
  curriculumFocus: { theme: string; subTheme: string; isAdvanced: boolean };
  exerciseCatalog: { id: number; title: string; tags: string[] }[];
  accessFlags: { showReadiness: boolean; canEditCurriculum: boolean; isDeveloper: boolean; showFullRoster: boolean };
}

interface NewTrainerClientProps {
  dict: any; 
  sessionData: SessionData;
  accessLevel: string;
  userRole: UserRole;
}

export default function NewTrainerClient({ dict, sessionData, accessLevel, userRole }: NewTrainerClientProps) {
  
  // KORREKT NØGLE: Vi bruger 'dict.trainer'
  const t = useMemo(() => dict.trainer, [dict]); 
  const t_focus = useMemo(() => dict.trainer_page, [dict]); 

  // --- CANVAS LOGIK (Minimal Opsætning) ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawField(ctx, canvas.width, canvas.height);
    };

    const drawField = (c: CanvasRenderingContext2D, width: number, height: number) => {
      c.clearRect(0, 0, width, height);
      
      // Grøn baggrund for fodboldbane
      c.fillStyle = '#6ab04c'; 
      c.fillRect(0, 0, width, height);

      // Mellem streg
      c.strokeStyle = 'white';
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(width / 2, 0);
      c.lineTo(width / 2, height);
      c.stroke();

      // Midtercirkel
      c.beginPath();
      c.arc(width / 2, height / 2, Math.min(width, height) / 10, 0, 2 * Math.PI);
      c.stroke();

      c.fillStyle = 'white';
      c.font = '20px Inter, sans-serif';
      c.textAlign = 'center';
      c.fillText('Træningsbane (Modul 3)', width / 2, height / 2 + 50);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  // --- CANVAS LOGIK SLUT ---

  const isTalentOrAdmin = userRole === UserRole.HeadOfTalent || userRole === UserRole.Admin || userRole === UserRole.Developer;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      {/* Titel & Rolle Information */}
      <header className="flex justify-between items-center p-4 border-b bg-white rounded-t-xl">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Settings className="w-6 h-6 mr-3 text-blue-600" /> 
          {t.titleNew}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Rolle: {userRole} ({accessLevel})
        </p>
      </header>

      {/* --- DET INTELLIGENTE 3-KOLONNE WORKSPACE START --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* KOLONNE 1: Kontekst & Ressourcer (Venstre) */}
        <aside className="w-full lg:w-1/4 p-4 border-r bg-gray-50 overflow-y-auto space-y-6">
          
          {/* Sektion 1: Periodisering & Curriculum (Væsentlig for Akademi/Pro) */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-blue-200">
            <h3 className="font-semibold text-lg text-blue-800 flex items-center mb-2">
              <BookOpen className="w-5 h-5 mr-2" /> {t_focus.weeks_focus}
            </h3>
            <p className="text-sm text-gray-600 font-medium">{sessionData.curriculumFocus.theme}</p>
            <p className="text-xs text-gray-500 mt-1">{sessionData.curriculumFocus.subTheme}</p>
            
            {/* Adgangskontrol baseret på flag */}
            {sessionData.accessFlags.canEditCurriculum && (
              <button className="text-xs text-blue-600 hover:text-blue-800 mt-3 font-medium">
                Rediger curriculum (Admin)
              </button>
            )}
          </div>
          
          {/* Sektion 2: Holdets Statistik (AI-Anbefalinger) */}
          {sessionData.accessFlags.showReadiness && (
            <div className="bg-white p-4 rounded-xl shadow-md border border-green-200">
              <h3 className="font-semibold text-lg text-green-800 flex items-center mb-2">
                <Zap className="w-5 h-5 mr-2" /> AI Readiness Score
              </h3>
              <p className="text-sm text-gray-600">3 spillere i Rød Zone. Anbefaling: Lavere intensitet.</p>
            </div>
          )}

          {/* Sektion 3: Øvelseskatalog (Drag & Drop) */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2" /> {t_focus.club_catalog}
            </h3>
            {sessionData.exerciseCatalog.map(exercise => (
              <div 
                key={exercise.id} 
                className="bg-white p-3 rounded-lg shadow-sm border cursor-grab hover:shadow-md transition duration-150"
              >
                <p className="font-medium text-sm text-gray-800">{exercise.title}</p>
                <div className="flex space-x-1 mt-1">
                  {exercise.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </aside>

        {/* KOLONNE 2: Selve Træningspasset (Midten) */}
        <main className="w-full lg:w-2/4 flex flex-col p-4 bg-gray-200 overflow-y-auto">
          
          {/* Modul 3: Baneeditor (Canvas) */}
          <div className="flex-shrink-0 h-96 mb-4 relative bg-gray-800 rounded-xl shadow-xl">
            <canvas ref={canvasRef} className="w-full h-full rounded-xl block"></canvas>
            <div className="absolute top-2 left-4 text-xs text-white bg-black/50 p-1 rounded">
                {t_focus.animation_studio}
            </div>
          </div>

          {/* Modul 4: Tidslinje (Timeline) */}
          <div className="flex-1 bg-white p-4 rounded-xl shadow-lg space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center border-b pb-2">
              <Clock className="w-5 h-5 mr-2 text-red-500" /> Træningspas Tidslinje (Drag & Drop her)
            </h3>
            {/* Simulerer drag & drop faser */}
            {['Opvarmning (15 min)', 'Hoveddel 1 (25 min)', 'Spil til Slut (20 min)'].map((phase, index) => (
              <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 rounded-md">
                <p className="font-medium">{phase}</p>
                <p className="text-sm text-gray-500">Træk øvelser fra Kolonne 1 ind her.</p>
              </div>
            ))}
          </div>
        </main>

        {/* KOLONNE 3: Deltagere & Detaljer (Højre) */}
        <aside className="w-full lg:w-1/4 p-4 border-l bg-white overflow-y-auto space-y-6">
          
          {/* Sektion 1: Session Detaljer */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center pb-1 border-b">
              <Target className="w-5 h-5 mr-2" /> {t.detailsTitle}
            </h3>
            
            <label className="block">
              <span className="text-sm font-medium text-gray-700">{t.titleLabel}</span>
              <input type="text" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm" placeholder={t.titleNew} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">{t.themeLabel}</span>
              <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm">
                <option>Defensiv Organisation</option>
                <option>Opbygningsspil</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">{t.durationLabel}</span>
              <input type="number" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm" defaultValue={60} />
            </label>
          </div>

          {/* Sektion 2: Dagens Trup (Spillertilgængelighed) */}
          {sessionData.accessFlags.showFullRoster && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2" /> Dagens Trup ({sessionData.teamRoster.length} Spillere)
              </h3>
              <ul className="space-y-1">
                {sessionData.teamRoster.map((player, index) => (
                  <li key={index} className="flex justify-between items-center text-sm p-1.5 rounded-lg"
                    style={{ backgroundColor: player.status === 'Injured (Knee)' ? '#fef2f2' : (player.status === 'High Load' ? '#fefce8' : 'white') }}>
                    <span>{player.name}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      player.status === 'Injured (Knee)' ? 'bg-red-500 text-white' : 
                      player.status === 'High Load' ? 'bg-yellow-400 text-black' : 
                      'bg-green-500 text-white'
                    }`}>
                      {player.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sektion 3: Gem & Annuller */}
          <div className="mt-6 pt-4 border-t space-y-3">
            <button className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
              {t.saveButton}
            </button>
            <button className="w-full py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition">
              {t.cancelButton}
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}