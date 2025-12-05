// lib/server/libraryData.ts

export type MainCategory = 
  | 'general' | 'warmup' | 'technical' | 'tactical' 
  | 'game_forms' | 'physical' | 'mental' | 'set_pieces' | 'goalkeeper';

export type DrillCategoryMap = Record<MainCategory, string[]>;

export const DRILL_CATEGORIES: DrillCategoryMap = {
  general: ['General'],
  warmup: ['General Warm-up', 'Technical Warm-up', 'Physical Activation', 'Fun & Games'],
  technical: ['Passing', 'First Touch', '1v1 Offensive', 'Dribbling & Turns', 'Finishing', '1v1 Defensive', 'Coordination'],
  tactical: ['Build-up - Phase 1', 'Build-up - Phase 2', 'Attacking Phase', 'Pressing', 'Defending', 'Transition - Offensive', 'Transition - Defensive', 'Positional Play'],
  game_forms: ['Rondos', 'Small Sided Games', 'Match Play'],
  physical: ['Energy & Capacity', 'Speed & Power', 'Movement'],
  mental: ['Individual', 'Relational'],
  set_pieces: ['Corners', 'Free Kicks', 'Penalties', 'Throw-ins'],
  goalkeeper: ['Shot Stopping', 'Crosses & Box', 'Reaction & Saves', 'Distribution']
};

export type FourCornerTag = 'Technical' | 'Tactical' | 'Physical' | 'Mental';

export const DRILL_TAGS: Record<string, Record<string, string[]>> = {
    Technical: {
        "Passing": [
            "Inside pass", "Outside pass", "Lay-off", "Half-volley instep", 
            "Vertical instep", "Curled pass", "Chip Pass", "Through ball", "Crossing", "Cut-back"
        ],
        "First Touch": [
            "Inside", "Outside", "Sole", "Instep", "Thigh", "Chest", 
            "Head", "Directional", "Shielding", "Aerial", "Turn on reception"
        ],
        "1v1 Offensive": [
            "Dribble", "Feints", "High speed dribbling", "Body feints", 
            "1v1 Frontal", "1v1 Shoulder to shoulder", "1v1 Back to goal"
        ],
        "Dribbling & Turns": [
            "Inside cut", "Outside cut", "Cruyff turn", "Sole drag", 
            "Turn on support leg", "Turn away from pressure", "Blind-side turn"
        ],
        "Finishing": [
            "Instep power", "Placed inside", "Curled shot", "Volley", 
            "Header", "Chip Shot", "1v1 vs GK", "Long shot", "Rebound"
        ],
        "1v1 Defensive": [
            "Pressing run", "Defensive stance", "Body position", "Steering", 
            "Distance & Patience", "Timing", "Tackling", "Conquest", 
            "Physical duel", "Pressing cues"
        ],
        "Coordination": [
            "Juggling", "Quick feet", "Coordination", "Aerial control", "Movement"
        ]
    },
    Tactical: {
        "Build-up - Phase 1": [
            "Play out from GK", "Positioning", "Width and Depth", "Depth", 
            "Back line relations", "Seek pressure", "Switch play", "Support player", "Rotations"
        ],
        "Build-up - Phase 2": [
            "Switch play", "Play through lines", "Overloads", "Breaking lines", 
            "Between lines", "3rd man run", "Half-spaces", "Triangles", "Retain possession", 
            "Rest attack/defense", "Combinations", "Penetration", "Support player", 
            "Width and Depth", "Rotations", "Possession"
        ],
        "Attacking Phase": [
            "Crosses & Box", "Combinations", "Movement to finish", "Penetration", 
            "Deep runs", "Chance creation", "Box positioning", "Overlap/Underlap", 
            "Long shots", "Opposite movements", "Support player", "Rotations"
        ],
        "Pressing": [
            "High press", "Mid press", "Low press", "Zone press", "Press and cover", 
            "Press as a unit", "Compactness", "Sliding - Shifting", "Pressing traps", 
            "Triggers", "Rest defense"
        ],
        "Defending": [
            "Low block", "Mid block", "Defending crosses", "1v1 Defensive", 
            "Zonal defense", "Man marking", "Offside line", "Defend the Goal", 
            "Compactness", "Sliding - Shifting"
        ],
        "Transition - Offensive": [
            "Transition to Attack", "Direct play", "Vertical play", 
            "Play out of trouble", "Secure first pass"
        ],
        "Transition - Defensive": [
            "Transition to Defense", "Counter-press", "Delay/Drop back", "Tactical foul"
        ],
        "Set Pieces": [
            "Corner (Off)", "Corner (Def)", "Free kick", "Penalty", "Throw-in"
        ],
        "Formation": [
            "433", "343", "4231", "352", "442 Diamond", "442"
        ]
    },
    Physical: {
        "Energy & Capacity": [
            "Aerobic Capacity", "Anaerobic Threshold", "RSA", "Recovery"
        ],
        "Speed & Power": [
            "Acceleration", "Top speed", "Explosiveness", "Jump Power", "Duel Strength"
        ],
        "Movement": [
            "Agility", "Change of Direction", "Deceleration", "Balance", "Coordination"
        ]
    },
    Mental: {
        "Individual": [
            "Concentration", "Next Action", "Decision Making", "Scanning", 
            "Anticipation", "Courage", "Aggression"
        ],
        "Relational": [
            "Communication (Verbal)", "Communication (Non-verbal)", 
            "Leadership", "Cooperation", "Responsibility"
        ]
    }
};

export type PhysicalLoadType = 
  | 'Aerobic – Low Intensity' 
  | 'Aerobic – Moderate Intensity' 
  | 'Aerobic – High Intensity'
  | 'Anaerobic – Sprint'
  | 'Anaerobic – Sprint Endurance'
  | 'Anaerobic – Production'
  | 'Anaerobic – Tolerance';

export interface MaterialItem {
  name: string;
  count: number;
  details?: string;
}

export interface TeamSetup {
  name: string;
  playerCount: number;
  color: 'orange' | 'red' | 'blue' | 'green' | 'yellow' | 'white' | 'black';
}

export interface DrillAsset {
  id?: string;
  title: string;
  description?: string;
  mainCategory: MainCategory;
  subCategory: string;
  phase?: string;
  primaryTheme?: string;
  secondaryTheme?: string;
  durationMin?: number;
  minPlayers?: number;
  maxPlayers?: number;
  workDuration?: number;
  restDuration?: number;
  pitchSize?: { width: number; length: number };
  rules?: string[];
  coachingPoints?: {
      instruction?: string;
      keyPoints: string[];
  };
  stopFreeze?: string;
  progression?: string[];
  regression?: string[];
  ageGroups?: string[];
  physicalLoad?: PhysicalLoadType;
  rpe?: number;
  accessLevel: 'Global' | 'Club' | 'Team' | 'Personal';
  
  // Media
  thumbnailUrl?: string;
  videoUrl?: string;
  youtubeUrl?: string;
  mediaType: 'image' | 'video' | 'youtube';
  
  tags?: string[];
  materials?: MaterialItem[];
  setup?: TeamSetup[];
  
  authorId: string;
  authorName: string;
  clubId?: string;
  teamId?: string;
  createdAt: Date;
  updatedAt?: Date;
  
  gamification?: string;
  goalsTechnical?: string;
  goalsTactical?: string;
  goalsMental?: string;
  
  // HER ER DET NYE FELT DU MANGLER FOR AT FJERNE DE RØDE STREGER I MODALEN:
  goalKeeper?: boolean;
  
  // NYT FELT TIL SPROG:
  language?: 'da' | 'en';
}

export type GamePhase = 'Opbygning' | 'Afslutning' | 'Erobring' | 'Forsvar' | 'Omstilling - Off' | 'Omstilling - Def';