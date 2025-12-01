// lib/server/libraryData.ts

// --- 1. HOVEDKATEGORIER (Keys / ID'er) ---
export type MainCategory = 
  | 'buildup_phase_1'
  | 'buildup_phase_2'
  | 'attacking'
  | 'pressing'
  | 'defending'
  | 'transition_off'
  | 'transition_def'
  | 'set_pieces'
  | 'technical'
  | 'physical'
  | 'goalkeeper'
  | 'other';

export const DRILL_CATEGORIES: Record<MainCategory, string[]> = {
  'buildup_phase_1': ['establishment', 'opening', 'switching_back', 'relations_back', 'resist_press'],
  'buildup_phase_2': ['breaking_lines', 'possession_retention', 'transition_to_finish', 'pocket_play', 'switching_mid', 'rotation', 'progression'],
  'attacking': ['breakthrough', 'cross_box', 'finishing', '1v1_off', 'overloads', 'shooting'],
  'pressing': ['high_press', 'pres_traps', 'mid_conquest', 'steering', 'break_rhythm'],
  'defending': ['zonal', 'man_marking', 'defend_box', 'shifting', '1v1_def'],
  'transition_off': ['deep_runs', 'imbalance', 'first_pass'],
  'transition_def': ['counter_press', 'reaction', 'recovery_runs', 'reorg'],
  'set_pieces': ['corners_off', 'corners_def', 'freekicks', 'throwins', 'penalties'],
  'technical': ['passing_touch', 'dribbling', 'ball_mastery', 'heading', 'coordination_ball'],
  'physical': ['warmup', 'sprint', 'strength', 'agility', 'endurance', 'prehab'],
  'goalkeeper': ['shot_stopping', 'crosses', 'distribution', '1v1_gk'],
  'other': ['teambuilding', 'mental', 'fun', 'rondos']
};

export type PhysicalLoadType = 
  | 'Aerob – lav intensitet' | 'Aerob – moderat intensitet' | 'Aerob – høj intensitet' 
  | 'Anaerob – Sprint' | 'Anaerob – Sprint udholdenhed' | 'Anaerob – Produktion' | 'Anaerob – Tolerance';

export type GamePhase = 
  | 'Opbygningsspil' | 'Opbygningsspil Fase 1' | 'Opbygningsspil Fase 2'
  | 'Erobringsspil' | 'Afslutningsspil' | 'Forsvarsspil'
  | 'Omstilling offensiv' | 'Omstilling defensiv' | 'Dødbolde';

export type FourCornerTag = 'Teknisk' | 'Taktisk' | 'Fysisk' | 'Mentalt';

export interface CoachingPoints {
  keyPoints: string[]; 
  instruction: string; 
}

// OPDATERET: Materiale type har nu 'details'
export interface MaterialItem {
  name: string;
  count: number;
  details?: string; // <--- Tilføjet for at fjerne fejl i modalen
}

export interface TeamSetup {
  name: string; 
  playerCount: number; 
  color: 'orange' | 'red' | 'blue' | 'green' | 'yellow' | 'white' | 'black'; 
}

export interface DrillAsset {
  id?: string;
  title: string; 
  description: string; 
  mainCategory: MainCategory; 
  subCategory: string;        
  rules?: string[]; 
  thumbnailUrl?: string; 
  videoUrl?: string;      
  youtubeUrl?: string;    
  mediaType: 'image' | 'video' | 'youtube' | 'dtl-studio';
  studioDataId?: string; 
  ageGroups: string[]; 
  accessLevel: 'Global' | 'Club' | 'Personal'; 
  authorId: string;
  authorName: string;
  clubId?: string;
  durationMin: number; 
  workDuration?: number; 
  restDuration?: number; 
  repetitions?: number; 
  minPlayers: number;
  maxPlayers: number;
  pitchSize: { width: number; length: number }; 
  setup?: TeamSetup[]; 
  physicalLoad: PhysicalLoadType; 
  phase?: string; 
  tags?: FourCornerTag[];
  primaryTheme?: string; 
  secondaryTheme?: string; 
  technicalGoals?: string[]; 
  tacticalGoals?: string[]; 
  mentalGoals?: string[]; 
  coachingPoints: CoachingPoints; 
  
  // NYT FELT:
  stopFreeze?: string; 

  progression?: string[]; 
  regression?: string[];
  gamification?: string;

  materials?: MaterialItem[]; 
  
  isVerified?: boolean; 
  createdAt: Date | any; 
}