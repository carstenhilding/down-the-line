// lib/server/libraryData.ts

// --- 1. FYSISK LOAD KATEGORIER ---
export type PhysicalLoadType = 
  | 'Aerob – lav intensitet' 
  | 'Aerob – moderat intensitet' 
  | 'Aerob – høj intensitet' 
  | 'Anaerob – Sprint' 
  | 'Anaerob – Sprint udholdenhed' 
  | 'Anaerob – Produktion' 
  | 'Anaerob – Tolerance';

// --- 2. SPIL FASER ---
export type GamePhase = 
  | 'Opbygningsspil' 
  | 'Opbygningsspil Fase 1'
  | 'Opbygningsspil Fase 2'
  | 'Erobringsspil' 
  | 'Afslutningsspil' 
  | 'Forsvarsspil'
  | 'Omstilling offensiv' 
  | 'Omstilling defensiv'
  | 'Dødbolde';

// --- 3. KATEGORIER & TAGS ---
export type FourCornerTag = 'Teknisk' | 'Taktisk' | 'Fysisk' | 'Mentalt';

// --- 4. COACHING INTELLIGENCE ---
export interface CoachingPoints {
  keyPoints: string[]; 
  instruction: string; 
}

// --- 5. HOVED ØVELSES OBJEKT (The Drill Asset) ---
export interface DrillAsset {
  id?: string; // Firebase ID
  
  // BASIS INFO
  title: string; 
  description: string; 
  rules?: string; 
  ageGroups: string[]; 
  
  // MEDIA
  thumbnailUrl?: string; 
  mediaType: 'image' | 'video' | 'dtl-studio';
  studioDataId?: string; 

  // EJERSKAB
  accessLevel: 'Global' | 'Club' | 'Personal'; 
  authorId: string;
  authorName: string;
  clubId?: string;

  // PARAMETRE
  durationMin: number; 
  workDuration?: number; 
  restDuration?: number; 
  repetitions?: number; 
  
  minPlayers: number;
  maxPlayers: number;
  pitchSize: { width: number; length: number }; 
  
  // FAGLIGHED
  physicalLoad: PhysicalLoadType; 
  phase: GamePhase; 
  
  // KATEGORISERING (FIX: Dette felt manglede!)
  tags?: FourCornerTag[];

  // PERIODISERING & TEMAER
  primaryTheme?: string; 
  secondaryTheme?: string; 
  
  // LÆRINGSMÅL & PRINCIPPER
  technicalGoals?: string[]; 
  tacticalGoals?: string[]; 
  mentalGoals?: string[]; 
  
  playStylePrinciples?: string[]; 
  groupPrinciples?: string[]; 
  individualPrinciples?: string[]; 
  
  coachingPoints: CoachingPoints; 
  progression?: string; 
  materials?: string[]; 
  
  isVerified?: boolean; 
  createdAt: Date | any; 
}