// app/[lang]/(secure)/trainer/new/NewTrainerClient.tsx (RESPONSIV - BASERET PÅ DIN KODE)
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
  const t = useMemo(() => dict.trainer || {}, [dict]); // Tilføjet fallback
  const t_focus = useMemo(() => dict.trainer_page || {}, [dict]); // Tilføjet fallback

  // --- CANVAS LOGIK (Fra din kode - UÆNDRET) ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      // Juster for at undgå forvrængning
      if(canvas.offsetWidth > 0) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawField(ctx, canvas.width, canvas.height);
      }
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

      // KORREKTION: Justeret font-størrelse til at være responsiv
      const fontSize = Math.max(12, width / 40);
      c.fillStyle = 'rgba(255, 255, 255, 0.7)';
      c.font = `${fontSize}px Inter, sans-serif`;
      c.textAlign = 'center';
      // KORREKTION: Brug t_focus til oversættelse
      c.fillText(t_focus.animation_studio ?? 'Træningsbane (Modul 3)', width / 2, height / 2 + (fontSize / 2));
    };

    // Sørg for at resize kører efter parent har fået sin bredde
    setTimeout(resizeCanvas, 0);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [t_focus.animation_studio]); // KORREKTION: Tilføjet afhængighed som din oprindelige kode havde
  // --- CANVAS LOGIK SLUT ---

  const isTalentOrAdmin = userRole === UserRole.HeadOfTalent || userRole === UserRole.Admin || userRole === UserRole.Developer;

  return (
    // KORREKTION: Tilføjet bg-white og shadow for at matche de andre siders look
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-xl shadow-lg">
      
      {/* KORREKTION: Responsiv Header */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center p-2 sm:p-4 border-b bg-white rounded-t-xl flex-shrink-0">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center mb-1 sm:mb-0">
          <Settings className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-600" /> 
          {t.titleNew ?? 'Nyt Træningspas'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 sm:mt-1">
          Rolle: {userRole} ({accessLevel})
        </p>
      </header>

      {/* --- DET INTELLIGENTE 3-KOLONNE WORKSPACE START --- */}
      {/* KORREKTION: Stabler lodret på mobil (flex-col), vandret på desktop (lg:flex-row) */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* KORREKTION: Kolonne 1 (Responsiv) */}
        <aside className="w-full lg:w-1/3 xl:w-1/4 p-2 md:p-4 border-b lg:border-b-0 lg:border-r bg-gray-50 overflow-y-auto space-y-3 md:space-y-4 flex-shrink-0">
          
          {/* Sektion 1: Periodisering & Curriculum */}
          <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-blue-200">
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-blue-800 flex items-center mb-1 sm:mb-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> {t_focus.weeks_focus ?? 'Ugens Fokus'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">{sessionData.curriculumFocus?.theme ?? 'N/A'}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{sessionData.curriculumFocus?.subTheme ?? 'N/A'}</p>
            
            {sessionData.accessFlags?.canEditCurriculum && (
              <button className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-800 mt-2 sm:mt-3 font-medium">
                Rediger curriculum (Admin)
              </button>
            )}
          </div>
          
          {/* Sektion 2: Holdets Statistik (AI-Anbefalinger) */}
          {sessionData.accessFlags?.showReadiness && (
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-green-200">
              <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-green-800 flex items-center mb-1 sm:mb-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> AI Readiness Score
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">3 spillere i Rød Zone. Anbefaling: Lavere intensitet.</p>
            </div>
          )}

          {/* Sektion 3: Øvelseskatalog (Drag & Drop) */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-800 flex items-center">
              <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> {t_focus.club_catalog ?? 'Klub Katalog'}
            </h3>
            {sessionData.exerciseCatalog?.map(exercise => (
              <div 
                key={exercise.id} 
                className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border cursor-grab hover:shadow-md transition duration-150"
              >
                <p className="font-medium text-xs sm:text-sm text-gray-800">{exercise.title}</p>
                <div className="flex flex-wrap gap-1 mt-1"> {/* Flex-wrap for tags */}
                  {exercise.tags.map(tag => (
                    <span key={tag} className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
             {(!sessionData.exerciseCatalog || sessionData.exerciseCatalog.length === 0) && (
                 <p className="text-xs text-gray-500 italic">Kataloget er tomt.</p>
             )}
          </div>

        </aside>

        {/* KORREKTION: Kolonne 2 (Responsiv) */}
        <main className="w-full lg:w-1/3 xl:w-2/4 flex flex-col p-2 md:p-4 bg-gray-200 overflow-y-auto flex-shrink-0 lg:flex-shrink">
          
          {/* Modul 3: Baneeditor (Canvas) */}
          {/* KORREKTION: Responsiv højde (h-64 sm:h-80 lg:h-96) og margin */}
          <div className="flex-shrink-0 h-64 sm:h-80 lg:h-96 mb-2 md:mb-4 relative bg-gray-100 rounded-lg shadow-inner border overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full rounded-lg block"></canvas>
            {/* Tekst fjernet fra overlay, da den nu tegnes på canvas */}
          </div>

          {/* Modul 4: Tidslinje (Timeline) */}
          <div className="flex-1 bg-white p-3 md:p-4 rounded-xl shadow-lg space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-800 flex items-center border-b pb-1 sm:pb-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-500" /> Træningspas Tidslinje (Drag & Drop her)
            </h3>
            {['Opvarmning (15 min)', 'Hoveddel 1 (25 min)', 'Spil til Slut (20 min)'].map((phase, index) => (
              <div key={index} className="border-l-4 border-yellow-500 pl-2 sm:pl-4 py-1 sm:py-2 bg-yellow-50 rounded-md">
                <p className="font-medium text-xs sm:text-sm">{phase}</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Træk øvelser ind her.</p>
              </div>
            ))}
          </div>
        </main>

        {/* KORREKTION: Kolonne 3 (Responsiv) */}
        <aside className="w-full lg:w-1/3 xl:w-1/4 p-2 md:p-4 border-t lg:border-t-0 lg:border-l bg-white overflow-y-auto space-y-3 md:space-y-4 flex-shrink-0">
          
          {/* Sektion 1: Session Detaljer */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-800 flex items-center pb-1 border-b">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> {t.detailsTitle ?? 'Detaljer'}
            </h3>
            
            <label className="block">
              <span className="text-xs sm:text-sm font-medium text-gray-700">{t.titleLabel ?? 'Titel'}</span>
              {/* KORREKTION: Tilføjet p-1.5 til inputs for ensartethed */}
              <input type="text" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm text-sm p-1.5" placeholder={t.titleNew ?? 'Nyt Pas'} />
            </label>
            <label className="block">
              <span className="text-xs sm:text-sm font-medium text-gray-700">{t.themeLabel ?? 'Tema'}</span>
              <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm text-sm p-1.5">
                <option>Defensiv Organisation</option>
                <option>Opbygningsspil</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs sm:text-sm font-medium text-gray-700">{t.durationLabel ?? 'Varighed'}</span>
              <input type="number" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm text-sm p-1.5" defaultValue={60} />
            </label>
          </div>

          {/* Sektion 2: Dagens Trup (Spillertilgængelighed) */}
          {sessionData.accessFlags?.showFullRoster && (
            <div className="space-y-2 pt-3 md:pt-4 border-t">
              <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-800 flex items-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Dagens Trup ({sessionData.teamRoster?.length ?? 0} Spillere)
              </h3>
               {/* KORREKTION: Tilføjet max-h-48 for at begrænse højden */}
              <ul className="space-y-1 max-h-48 overflow-y-auto"> 
                {sessionData.teamRoster?.map((player, index) => (
                  <li key={index} className="flex justify-between items-center text-xs sm:text-sm p-1 sm:p-1.5 rounded-lg"
                    style={{ backgroundColor: player.status === 'Injured (Knee)' ? '#fef2f2' : (player.status === 'High Load' ? '#fefce8' : 'transparent') }}>
                    <span>{player.name}</span>
                    <span className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${
                      player.status === 'Injured (Knee)' ? 'bg-red-100 text-red-800' : 
                      player.status === 'High Load' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {player.status}
                    </span>
                  </li>
                ))}
                 {(!sessionData.teamRoster || sessionData.teamRoster.length === 0) && (
                     <p className="text-xs italic text-gray-500">Ingen spillere valgt.</p>
                 )}
              </ul>
            </div>
          )}

          {/* Sektion 3: Gem & Annuller */}
          <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t space-y-2">
            <button className="w-full py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
              {t.saveButton ?? 'Gem'}
            </button>
            <button className="w-full py-1.5 sm:py-2 text-sm sm:text-base bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition">
              {t.cancelButton ?? 'Annuller'}
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}