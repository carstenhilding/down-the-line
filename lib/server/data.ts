// lib/server/data.ts

// --- DTL DATA MODELLER OG MOCK FUNKTIONER ---

// Abonnementniveauer baseret på Fase 1/Pricing (ALLE 9 NIVEAUER)
export type SubscriptionLevel = 
  'Starter' | 'Advance' | 'Expert' | // Træner
  'Essential' | 'Growth' | 'Complete' | // Breddeklub
  'Performance' | 'Elite' | 'Enterprise'; // Akademi

// Akademiroller (Inkluderer alle specialister)
export enum UserRole {
  Unauthenticated = 'unauthenticated',
  Player = 'player',
  Parent = 'parent',
  Coach = 'coach', // Almindelig holdtræner
  TransitionCoach = 'transition_coach', // Transitionstræner
  IndividualCoach = 'individual_coach', // Individuel træner
  DefenseCoach = 'defense_coach', // Forsvarstræner
  AttackCoach = 'attack_coach', // Angrebstræner
  DeadBallCoach = 'dead_ball_coach', // Dødboldstræner
  Physio = 'physio',
  Scout = 'scout',
  HeadOfCoaching = 'head_of_coaching',
  HeadOfTalent = 'head_of_talent', // Talentchef
  Admin = 'admin', // Klub/Akademi Admin (højeste adgang)
  Developer = 'developer', // DTL udvikler/ejer
  Tester = 'tester', // DTL tester
  CustomRole = 'custom_role', // Til brugerdefinerede roller
}

// Interface for brugerdata, som hentes fra Firebase Auth/Firestore
export interface DTLUser {
  id: string;
  role: UserRole;
  subscriptionLevel: SubscriptionLevel;
  teamId: string;
  name: string;
}

// --- MOCK IMPLEMENTERINGER (SIMULERER FIREBASE) ---

/**
 * Simulerer hentning af brugerens rolle og abonnementsniveau fra Firestore.
 * Denne funktion er ESSENTIEL for adgangskontrol.
 */
export async function fetchUserAccessLevel(): Promise<DTLUser> {
  // SIMULERET BRUGER: Sættes til 'Developer' for at sikre fuld adgang under udvikling.
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulerer netværksforsinkelse

  return {
    id: 'dtl-dev-123',
    role: UserRole.Developer, // Sæt til Developer/Admin for at se alle UI-elementer
    subscriptionLevel: 'Enterprise', // Simulerer højeste abonnement
    teamId: 'u17-elite',
    name: 'Carsten (Developer)',
  };
}

/**
 * Simulerer hentning af Session Planner data (Modul 4).
 * Dataen filtreres baseret på brugerens adgangsniveau.
 */
export async function fetchSessionPlannerData(userId: string, accessLevel: SubscriptionLevel, userRole: UserRole) {
  // Fiktiv holdliste
  const teamRoster = [
    { name: 'Emil M.', available: true, status: 'Ready' },
    { name: 'Mads J.', available: false, status: 'Injured (Knee)' },
    { name: 'Oscar B.', available: true, status: 'High Load' },
  ];

  // Curriculum Fokus for ugen (Mock data)
  const curriculumFocus = {
    theme: 'Pressing Spil',
    subTheme: 'Højt Genpres (Kolonne 1 Fokus)',
    // Avanceret funktion er kun tilgængelig for Akademi niveauer (Performance+)
    isAdvanced: accessLevel === 'Performance' || accessLevel === 'Elite' || accessLevel === 'Enterprise',
  };

  const exerciseCatalog = [
    { id: 1, title: '5v2 Rondo', tags: ['Opvarmning', 'Pasningsspil'] },
    { id: 2, title: '4 Mål Spil', tags: ['Spil til slut', 'Afslutning'] },
  ];

  // Filtreringslogik baseret på DTL's abonnement:
  const aiReadinessScore = accessLevel === 'Elite' || accessLevel === 'Enterprise' || userRole === UserRole.HeadOfTalent;
  const showFullRoster = userRole === UserRole.Admin || userRole === UserRole.Developer;

  return {
    teamRoster,
    curriculumFocus,
    exerciseCatalog: aiReadinessScore ? exerciseCatalog.concat({ id: 3, title: 'AI Anbefalet Pas', tags: ['Taktisk'] }) : exerciseCatalog,
    
    // Adgangsflag sendes til Client Component
    accessFlags: {
      showReadiness: aiReadinessScore,
      canEditCurriculum: userRole === UserRole.HeadOfCoaching || userRole === UserRole.Admin,
      isDeveloper: userRole === UserRole.Developer,
      showFullRoster: showFullRoster,
    },
  };
}
