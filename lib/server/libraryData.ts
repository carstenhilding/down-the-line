// lib/server/libraryData.ts

// --- PÆDAGOGISK STRUKTUR (4-Corner Model) ---
export type FourCornerTag = 'Teknisk' | 'Taktisk' | 'Fysisk' | 'Mentalt';

// --- FYSISK PROFILERING (The Science Layer) ---
export type PhysicalIntensity = 'Restitution (RPE 1-3)' | 'Aerob (RPE 4-7)' | 'Anaerob (RPE 8-10)';

// --- FASE OPDELING ---
export type GamePhase = 
  | 'Opvarmning' 
  | 'Teknisk Færdighed' 
  | 'Opbygningsspil' 
  | 'Erobringsspil' 
  | 'Afslutningsspil' 
  | 'Omstilling' 
  | 'Dødbolde' 
  | 'Fysisk Træning';

// --- COACHING INTELLIGENCE (Trigger-Based) ---
export interface CoachingPoints {
  before: string[]; // Instruktion før start
  during: string[]; // "Freeze" situationer / Stop-billeder
  after: string[];  // Evalueringsspørgsmål
}

// --- HOVED ØVELSES OBJEKT (Asset Management) ---
export interface DrillAsset {
  id: string;
  title: string;
  thumbnailUrl: string; // Billede til kortet
  
  // Multi-Level Access
  accessLevel: 'Global' | 'Club' | 'Team' | 'Personal'; 
  author: {
    id: string;
    name: string; 
    role: string;
  };
  version: string; // Fx "v2.0" (Git for Drills)

  // Metadata (Standard + Smart)
  ageGroups: string[]; // ['U13', 'U14', 'U15']
  durationMin: number;
  minPlayers: number;
  maxPlayers: number;
  pitchSize: { width: number; length: number }; // Bruges til Area Per Player Calc
  
  // Smart Data
  areaPerPlayer?: number; // Udregnes automatisk (m2)
  intensity: PhysicalIntensity;
  tags: FourCornerTag[]; // 4-Corner tags
  phase: GamePhase;

  // Didaktik
  coachingPoints: CoachingPoints;
  gamification?: string; // "Hvordan vinder man?"

  isVerified?: boolean; // "Best Practice" stempel
}