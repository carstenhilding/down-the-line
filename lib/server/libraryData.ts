// lib/server/libraryData.ts

export type DrillCategory = 'Opvarmning' | 'Teknisk' | 'Taktisk' | 'Fysisk' | 'Spil til Mål' | 'Målmand' | 'Set Pieces';
export type AgeGroup = 'U5-U7' | 'U8-U10' | 'U11-U13' | 'U14-U16' | 'U17-U19' | 'Senior';
export type PhysicalLoadType = 
    'Aerob – lav intensitet' | 
    'Aerob – moderat intensitet' | 
    'Aerob – høj intensitet' | 
    'Anaerob – Sprint' | 
    'Anaerob – Sprint udholdenhed' | 
    'Anaerob – Produktion' | 
    'Anaerob – Tolerance';

export type FourCornerTag = 'Teknisk' | 'Taktisk' | 'Fysisk' | 'Mentalt';
export type GamePhase = 
    'Opbygningsspil' | 'Opbygningsspil - Fase 1' | 'Opbygningsspil - Fase 2' | 
    'Erobringsspil' | 'Afslutningsspil' | 'Forsvarsspil' | 
    'Omstilling offensiv' | 'Omstilling defensiv' | 'Standardsituationer';

// --- HOVEDKATEGORIER ---
export type MainCategory = 
    | 'warmup'
    | 'technical'
    | 'tactical'
    | 'game_forms'
    | 'physical'
    | 'set_pieces'
    | 'goalkeeper';

// --- UNDERKATEGORIER (DANSK - RETTET TILBAGE) ---
export const DRILL_CATEGORIES: Record<MainCategory, string[]> = {
    warmup: [
        'Generel Opvarmning', 'Teknisk Opvarmning', 'Fysisk Aktivering', 'Leg og Boldleg'
    ],
    // RETTET TILBAGE: De gamle, detaljerede underkategorier
    technical: [
        'Aflevering', 'Første berøring', '1v1 Offensivt', 'Vendinger', 
        'Afslutninger', '1v1 Defensiv', 'Fodboldkoordination'
    ],
    // TAKTISK: Beholder de nye faser, som du sagde var rigtige
    tactical: [
        'Opbygningsspil - Fase 1', 
        'Opbygningsspil - Fase 2', 
        'Afslutningsspil', 
        'Erobringsspil', 
        'Forsvarsspil', 
        'Omstilling - Offensiv', 
        'Omstilling - Defensiv',
        'Positionsspil'
    ],
    game_forms: [
        'Rondos', 'Småspil (SSG)', 'Spil til to mål', 'Positionsspil'
    ],
    // RETTET TILBAGE: De gamle fysiske kategorier
    physical: [
        'Energi & Kapacitet', 'Fart & Power', 'Bevægelse'
    ],
    set_pieces: [
        'Hjørnespark', 'Frispark', 'Straffespark', 'Indkast'
    ],
    goalkeeper: [
        'Skudtræning', 'Indlæg & Feltet', 'Reaktion & Redninger', 'Spil med fødderne'
    ]
};

// --- TAGS (DINE SPECIFIKKE DANSKE LISTER GENOPRETTET) ---
export interface TagTaxonomy {
    [key: string]: {
        [subCategory: string]: string[]
    }
}

export const DRILL_TAGS: TagTaxonomy = {
    'Teknisk': {
        'Aflevering': [
            'Aflevering inderside', 'Aflevering yderside', 'Aflæg',
            'Halvtliggende vristspark', 'Lodret vristspark', 'Aflevering med curl', 'Chip bold', 
            'Stikning', 'Indlæg', 'Cut-back'
        ],
        'Første berøring': [
            'Inderside', 'Yderside', 'Sålen', 'Vrist', 'Lår', 'Bryst', 'Hoved',
            'Retningsbestemt', 'Afskærmende', 'I luften', 'Vending i modtagelse'
        ],
        '1v1 Offensivt': [
            'Drible', 'Finter', 'Driblinger med højt tempo', 'Kropsfinter',
            '1v1 Frontalt', '1v1 Skulder mod skulder', '1v1 Ryggen til mål'
        ],
        'Vendinger': [
            'Inderside cut', 'Yderside cut', 'Cruyff-vending', 'Såle-drag', 'Vending om støtteben',
            'Vending væk fra pres', 'Blind-side vending'
        ],
        'Afslutninger': [
            'Vristspark/Power', 'Placeret inderside', 'Skruet spark', 'Flugtning/Volley', 
            'Afslutning med hovedet', 'Chip over keeper', '1v1 mod keeper', 'Langskud', 'Rebound/Tap-in'
        ],
        '1v1 Defensiv': [
            'Pres-løb og vinkel', 'Defensiv holdning', 'Kropsstilling', 'Styring af modstander',
            'Afstand og Tålmodighed', 'Timing i indgreb', 'Tackling (Stående/Glidende)',
            'Erobring (Prikke/Stjæle bolden)', 'Fysisk duel (Skulder/Arm)', 'Pres-signaler'
        ],
        'Fodboldkoordination': [
            'Jonglering', 'Hurtige fødder', 'Koordination', 'Føre bold i luften'
        ]
    },
    'Taktisk': {
        'Opbygningsspil - Fase 1': [
            'Spille ud fra Keeper', 'Positionering', 
            'Spilbredde', 'Spildybde', 'Relationer i bagkæden', 'Opsøge pres', 'Vende spillet'
        ],
        'Opbygningsspil - Fase 2': [
            'Spilvending', 'Spil gennem kæder', 'Overtalsspil (2v1/3v2)', 'Breaking lines', 
            'Spil vendinger', 'Spil i mellem kæderne', 'Spil på 3. mand', 'Spil i halvrummet', 'Trekantsspil',
            'Fast holde bolden', 'Rest angreb/forsvar'
        ],
        'Afslutningsspil': [
            'Indlæg og boksspil', 'Kombinationsspil', 'Dybdeløb', 'Chance skabelse', 
            'Positionering i feltet', 'Overlap/Underlap', 'Skud fra distancen',
            'Modsatrettede bevægelser', 'Spil på 3. mand', 'Rest angreb/forsvar'
        ],
        'Erobringsspil': [
            'Højt pres', 'Zonepres', 'Presfælder', 'Triggers/Signaler',
            'Presse som en enhed', 'Middelpres', 'Lavt pres', 'Kompakthed', 'Sideforskydning', 'Restforsvar'
        ],
        'Forsvarsspil': [
            'Lav blok', 'Mellem blok', 'Forsvar af indlæg', '1v1 Defensivt', 'Zone-forsvar', 
            'Mandsopdækning', 'Kompakthed', 'Sideforskydning', 'Restforsvar', 'Offside-linjen',
            'Forsvar af feltet'
        ],
        'Omstilling - Offensiv': [
            'Omstilling til angreb', 'Direkte spil', 'Vertikalt spil', 
            'Spille ud af tætte områder', 'Sikre første aflevering'
        ],
        'Omstilling - Defensiv': [
            'Omstilling til forsvar', 'Genpres straks', 'Delay/Falde tilbage', 'Taktisk frispark'
        ],
        'Positionsspil': [
            'Trekantsspil', 'Diamanter', 'Overload/Underload', 'Rotationer'
        ]
    },
    'Fysisk': {
        'Energi & Kapacitet': [
            'Aerob (Udholdenhed)', 'Anaerob (Høj intensitet)', 'RSA (Gentagne sprinter)', 'Restitutionsevne'
        ],
        'Fart & Power': [
            'Acceleration (0-10m)', 'Topfart (30m+)', 'Eksplosivitet', 'Springkraft', 'Duelstyrke'
        ],
        'Bevægelse': [
            'Agility', 'Retningsskift (COD)', 'Deceleration (Bremse op)', 'Balance', 'Koordination'
        ]
    },
    'Mentalt': {
        'Individuelt': [
            'Koncentration', 'Nulstilling (Next Action)', 'Beslutningstagning (Decision Making)', 
            'Scanning/Orientering', 'Anticipation (Forudseenhed)', 'Mod (Growth Mindset)', 'Vilje/Aggressivitet'
        ],
        'Relationelt': [
            'Kommunikation (Verbal)', 'Kommunikation (Non-verbal)', 'Lederskab', 'Samarbejde', 'Ansvarlighed'
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
    accessLevel: 'Personal' | 'Club' | 'Global';
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
    createdAt: any;
}