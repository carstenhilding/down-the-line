// lib/server/data.ts (KORREKT NAVN FOR DEVELOPER)

// --- DTL DATA MODELLER OG MOCK FUNKTIONER ---

// Abonnementniveauer
export type SubscriptionLevel =
  'Starter' | 'Advance' | 'Expert' | // Træner
  'Essential' | 'Growth' | 'Complete' | // Breddeklub
  'Performance' | 'Elite' | 'Enterprise'; // Akademi

// Akademiroller
export enum UserRole {
  Unauthenticated = 'unauthenticated',
  Player = 'player',
  Parent = 'parent',
  Coach = 'coach',
  TransitionCoach = 'transition_coach',
  IndividualCoach = 'individual_coach',
  DefenseCoach = 'defense_coach',
  AttackCoach = 'attack_coach',
  DeadBallCoach = 'dead_ball_coach',
  Physio = 'physio',
  Scout = 'scout',
  HeadOfCoaching = 'head_of_coaching',
  HeadOfTalent = 'head_of_talent',
  Admin = 'admin',
  Developer = 'developer', // DTL medarbejder
  Tester = 'tester',       // DTL medarbejder
  CustomRole = 'custom_role',
}

// Interface for brugerdata (UDVIDET KORREKT)
export interface DTLUser {
  id: string;
  role: UserRole;
  subscriptionLevel: SubscriptionLevel;
  teamId: string; // Måske mindre relevant hvis vi har clubName?
  name: string; // Indeholder Fornavn + Efternavn
  clubName?: string; // Optionel: Kun relevant for klub/akademi brugere
  clubFunction?: string; // Optionel: Specifik rolle i klubben
}

// --- MOCK IMPLEMENTERINGER ---

export async function fetchUserAccessLevel(): Promise<DTLUser> {
  await new Promise(resolve => setTimeout(resolve, 50));

  // --- Vælg hvilken bruger du vil simulere ---

  // KORREKTION: SIMULERET DTL DEVELOPER (AKTIV SOM STANDARD NU):
   return {
     id: 'dtl-dev-123',
     role: UserRole.Developer,
     subscriptionLevel: 'Enterprise', // Irrelevant for DTL ansat
     teamId: 'internal',
     name: 'Carsten Hilding Larsen', // KORREKT NAVN HER
     // clubName og clubFunction er undefined for DTL ansatte
   };

   // // SIMULERET KLUB/AKADEMI BRUGER (udkommenteret for nu):
   // return {
   //   id: 'klub-coach-456',
   //   role: UserRole.HeadOfCoaching, // Funktion i klubben
   //   subscriptionLevel: 'Elite', // Klubbens abonnement
   //   teamId: 'u19-women',
   //   name: 'Anders Andersen', // Fornavn Efternavn
   //   clubName: 'Esbjerg fB Akademi', // Klubnavn
   //   clubFunction: 'U19 Headcoach Women' // Funktion i klubben
   // };

  // // SIMULERET DTL TESTER (udkommenteret for nu):
  // return {
  //   id: 'dtl-test-789',
  //   role: UserRole.Tester,
  //   subscriptionLevel: 'Enterprise',
  //   teamId: 'internal',
  //   name: 'Test Bruger',
  // };
}

// fetchSessionPlannerData forbliver uændret...
export async function fetchSessionPlannerData(userId: string, accessLevel: SubscriptionLevel, userRole: UserRole) {
  // ... (kode som før) ...
    const teamRoster = [
        { name: 'Emil M.', available: true, status: 'Ready' },
        { name: 'Mads J.', available: false, status: 'Injured (Knee)' },
        { name: 'Oscar B.', available: true, status: 'High Load' },
    ];
    const curriculumFocus = {
        theme: 'Pressing Spil',
        subTheme: 'Højt Genpres (Kolonne 1 Fokus)',
        isAdvanced: accessLevel === 'Performance' || accessLevel === 'Elite' || accessLevel === 'Enterprise',
    };
    const exerciseCatalog = [
        { id: 1, title: '5v2 Rondo', tags: ['Opvarmning', 'Pasningsspil'] },
        { id: 2, title: '4 Mål Spil', tags: ['Spil til slut', 'Afslutning'] },
    ];
    const aiReadinessScore = accessLevel === 'Elite' || accessLevel === 'Enterprise' || userRole === UserRole.HeadOfTalent;
    const showFullRoster = userRole === UserRole.Admin || userRole === UserRole.Developer;

    return {
        teamRoster,
        curriculumFocus,
        exerciseCatalog: aiReadinessScore ? exerciseCatalog.concat({ id: 3, title: 'AI Anbefalet Pas', tags: ['Taktisk'] }) : exerciseCatalog,
        accessFlags: {
            showReadiness: aiReadinessScore,
            canEditCurriculum: userRole === UserRole.HeadOfCoaching || userRole === UserRole.Admin,
            isDeveloper: userRole === UserRole.Developer,
            showFullRoster: showFullRoster,
        },
    };
}