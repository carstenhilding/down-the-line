// lib/server/libraryData.ts

export type DrillCategory = 'Warm-up' | 'Technical' | 'Tactical' | 'Physical' | 'Match Play' | 'Goalkeeper' | 'Set Pieces';
export type AgeGroup = 'U5-U7' | 'U8-U10' | 'U11-U13' | 'U14-U16' | 'U17-U19' | 'Senior';
export type PhysicalLoadType = 
    'Aerobic – Low Intensity' | 
    'Aerobic – Moderate Intensity' | 
    'Aerobic – High Intensity' | 
    'Anaerobic – Sprint' | 
    'Anaerobic – Sprint Endurance' | 
    'Anaerobic – Production' | 
    'Anaerobic – Tolerance';

export type FourCornerTag = 'Technical' | 'Tactical' | 'Physical' | 'Mental';
export type GamePhase = 
    'Build-up' | 'Build-up - Phase 1' | 'Build-up - Phase 2' | 
    'Pressing' | 'Finishing Phase' | 'Defending' | 
    'Transition Attack' | 'Transition Defend' | 'Set Pieces';

// --- HOVEDKATEGORIER ---
export type MainCategory = 
    | 'warmup'
    | 'technical'
    | 'tactical'
    | 'game_forms'
    | 'physical'
    | 'set_pieces'
    | 'goalkeeper';

// --- UNDERKATEGORIER (ENGLISH BASE) ---
export const DRILL_CATEGORIES: Record<MainCategory, string[]> = {
    warmup: [
        'General Warm-up', 'Technical Warm-up', 'Physical Activation', 'Fun & Games'
    ],
    technical: [
        'Passing', 'First Touch', '1v1 Offensive', 'Turns', 
        'Finishing', '1v1 Defensive', 'Coordination'
    ],
    tactical: [
        'Build-up - Phase 1', 
        'Build-up - Phase 2', 
        'Attacking Phase', 
        'Pressing', 
        'Defending', 
        'Transition - Offensive', 
        'Transition - Defensive',
        'Positional Play'
    ],
    game_forms: [
        'Rondos', 'Small Sided Games', 'Match Play', 'Positional Play'
    ],
    physical: [
        'Energy & Capacity', 'Speed & Power', 'Movement'
    ],
    set_pieces: [
        'Corners', 'Free Kicks', 'Penalties', 'Throw-ins'
    ],
    goalkeeper: [
        'Shot Stopping', 'Crosses & Box', 'Reaction & Saves', 'Distribution'
    ]
};

// --- TAGS (ENGLISH BASE) ---
export interface TagTaxonomy {
    [key: string]: {
        [subCategory: string]: string[]
    }
}

export const DRILL_TAGS: TagTaxonomy = {
    'Technical': {
        'Passing': [
            'Inside pass', 'Outside pass', 'Lay-off',
            'Half-volley instep', 'Vertical instep', 'Curled pass', 'Chip', 
            'Through ball', 'Cross', 'Cut-back'
        ],
        'First Touch': [
            'Inside', 'Outside', 'Sole', 'Instep', 'Thigh', 'Chest', 'Head',
            'Directional', 'Shielding', 'Aerial', 'Turn on reception'
        ],
        '1v1 Offensive': [
            'Dribble', 'Feints', 'High speed dribbling', 'Body feints',
            '1v1 Frontal', '1v1 Shoulder to shoulder', '1v1 Back to goal'
        ],
        'Turns': [
            'Inside cut', 'Outside cut', 'Cruyff turn', 'Sole drag', 'Turn on support leg',
            'Turn away from pressure', 'Blind-side turn'
        ],
        'Finishing': [
            'Instep power', 'Placed inside', 'Curled shot', 'Volley', 
            'Header', 'Chip over keeper', '1v1 vs GK', 'Long shot', 'Rebound'
        ],
        '1v1 Defensive': [
            'Pressing run', 'Defensive stance', 'Body position', 'Steering',
            'Distance & Patience', 'Timing', 'Tackling',
            'Conquest', 'Physical duel', 'Pressing cues'
        ],
        'Coordination': [
            'Juggling', 'Quick feet', 'Coordination', 'Aerial control'
        ]
    },
    'Tactical': {
        'Build-up - Phase 1': [
            'Play out from GK', 'Positioning', 
            'Width', 'Depth', 'Back line relations', 'Seek pressure', 'Switch play'
        ],
        'Build-up - Phase 2': [
            'Switch play', 'Play through lines', 'Overloads', 'Breaking lines', 
            'Between lines', '3rd man run', 'Half-spaces', 'Triangles',
            'Retain possession', 'Rest attack/defense'
        ],
        'Attacking Phase': [
            'Crosses & Box', 'Combinations', 'Deep runs', 'Chance creation', 
            'Box positioning', 'Overlap/Underlap', 'Long shots',
            'Opposite movements', '3rd man run', 'Rest attack/defense'
        ],
        'Pressing': [
            'High press', 'Zone press', 'Pressing traps', 'Triggers',
            'Press as a unit', 'Mid press', 'Low press', 'Compactness', 'Sliding', 'Rest defense'
        ],
        'Defending': [
            'Low block', 'Mid block', 'Defending crosses', '1v1 Defensive', 'Zonal defense', 
            'Man marking', 'Compactness', 'Sliding', 'Rest defense', 'Offside line',
            'Defending box'
        ],
        'Transition - Offensive': [
            'Transition to Attack', 'Direct play', 'Vertical play', 
            'Play out of trouble', 'Secure first pass'
        ],
        'Transition - Defensive': [
            'Transition to Defense', 'Immediate counter-press', 'Delay/Drop back', 'Tactical foul'
        ],
        'Positional Play': [
            'Triangles', 'Diamonds', 'Overload/Underload', 'Rotations'
        ]
    },
    'Physical': {
        'Energy & Capacity': [
            'Aerobic Capacity', 'Anaerobic Threshold', 'RSA', 'Recovery'
        ],
        'Speed & Power': [
            'Acceleration', 'Top speed', 'Explosiveness', 'Jump Power', 'Duel Strength'
        ],
        'Movement': [
            'Agility', 'Change of Direction', 'Deceleration', 'Balance', 'Coordination'
        ]
    },
    'Mental': {
        'Individual': [
            'Concentration', 'Next Action', 'Decision Making', 
            'Scanning', 'Anticipation', 'Courage', 'Aggression'
        ],
        'Relational': [
            'Communication (Verbal)', 'Communication (Non-verbal)', 'Leadership', 'Cooperation', 'Responsibility'
        ]
    }
};

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
    description: string;
    
    mainCategory: MainCategory | string;
    subCategory: string;
    phase: string;
    accessLevel: 'Personal' | 'Club' | 'Team' | 'Global';
    primaryTheme?: string;
    secondaryTheme?: string;

    durationMin: number;
    minPlayers: number;
    maxPlayers: number;
    workDuration?: number;
    restDuration?: number;
    pitchSize?: { width: number; length: number };

    setup: TeamSetup[];
    materials: MaterialItem[];
    rules: string[];
    coachingPoints: {
        instruction: string;
        keyPoints: string[];
    };
    stopFreeze?: string;
    progression?: string[];
    regression?: string[];
    gamification?: string;
    
    ageGroups: string[];
    physicalLoad: PhysicalLoadType;
    rpe?: number;
    tags: string[]; 
    
    technicalGoals?: string[];
    tacticalGoals?: string[];
    mentalGoals?: string[];

    thumbnailUrl?: string;
    videoUrl?: string;
    youtubeUrl?: string;
    mediaType: 'image' | 'video' | 'youtube';

    authorId: string;
    authorName: string;
    clubId?: string;
    teamId?: string;
    createdAt: any;
}