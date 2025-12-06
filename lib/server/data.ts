// lib/server/data.ts
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

// Abonnementniveauer
export type SubscriptionLevel =
  'Starter' | 'Advance' | 'Expert' | 
  'Essential' | 'Growth' | 'Complete' | 
  'Performance' | 'Elite' | 'Enterprise'; 

// Roller - Opdateret med specialist-roller og CustomRole
export enum UserRole {
  // Tekniske roller
  Unauthenticated = 'unauthenticated',
  Developer = 'developer',
  Tester = 'tester',
  CustomRole = 'custom_role', // NY: Til specielle tilfælde

  // Ledelse & Administration
  ClubOwner = 'club_owner',
  ClubAdmin = 'club_admin',
  Management = 'management', 
  AcademyDirector = 'academy_director', 

  // Trænere (Coaching Staff - General)
  HeadOfCoach = 'head_of_coach',
  YouthDevelopmentCoach = 'youth_development_coach',
  Coach = 'coach', // Head Coach
  AssistantCoach = 'assistant_coach',
  
  // Trænere (Specialister - NYE)
  KeeperCoach = 'keeper_coach',
  TransitionsCoach = 'transitions_coach',
  IndividualCoach = 'individual_coach', // NY
  DefenseCoach = 'defense_coach',       // NY
  AttackCoach = 'attack_coach',         // NY
  DeadBallCoach = 'dead_ball_coach',    // NY
  
  // Performance & Medical
  FitnessCoach = 'fitness_coach', 
  Physio = 'physio', 

  // Analyse
  Analyst = 'analyst', 

  // Hold & Spillere
  TeamLead = 'team_lead', 
  Player = 'player',
  Parent = 'parent', 
  
  // Scouting & Eksterne
  Scout = 'scout', 
  ExternalPlayer = 'external_player'
}

export interface DTLUser {
  id: string;
  role: UserRole;
  subscriptionLevel: SubscriptionLevel;
  name: string;
  email?: string;
  clubId?: string;
  clubName?: string;
  clubFunction?: string;
  teamId?: string;
}

export async function fetchUserAccessLevel(userId?: string): Promise<DTLUser> {
  if (!userId) {
    return { 
        id: 'dev-bypass', 
        role: UserRole.Developer,  // <--- ÆNDRET FRA Unauthenticated
        subscriptionLevel: 'Enterprise', 
        name: 'Developer Bypass',
        // TILFØJET: Mock IDs så Club/Team library virker i dev-mode
        clubId: 'dev-club-123',
        teamId: 'dev-team-123'
    };
  }

  try {
    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: userId,
        role: (data.role as UserRole) || UserRole.Coach,
        subscriptionLevel: (data.subscriptionLevel as SubscriptionLevel) || 'Starter',
        name: data.fullName || data.name || 'Ukendt Bruger',
        clubId: data.clubId,
        clubName: data.clubName,
        clubFunction: data.clubFunction,
        teamId: data.teamId
      };
    }
  } catch (error) {
    console.error("Fejl ved hentning af bruger fra Firestore:", error);
  }

  // Fallback til Developer i dev-mode
  return {
    id: userId,
    role: UserRole.Developer, 
    subscriptionLevel: 'Enterprise', 
    name: 'Dev Bruger (Mangler i Firestore)',
    clubName: 'System Dev',
    // TILFØJET: Mock IDs så Club/Team library virker hvis bruger ikke findes
    clubId: 'dev-club-123',
    teamId: 'dev-team-123'
  };
}

// Mock data funktion
export async function fetchSessionPlannerData(userId: string, accessLevel: SubscriptionLevel, userRole: UserRole) {
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
    
    const showReadiness = ['Elite', 'Enterprise', 'Performance'].includes(accessLevel) || 
                          [UserRole.HeadOfCoach, UserRole.AcademyDirector, UserRole.Physio, UserRole.FitnessCoach].includes(userRole);
    
    const canEditCurriculum = [UserRole.HeadOfCoach, UserRole.AcademyDirector, UserRole.ClubAdmin, UserRole.Developer].includes(userRole);

    return {
        teamRoster,
        curriculumFocus,
        exerciseCatalog: showReadiness ? exerciseCatalog.concat({ id: 3, title: 'AI Anbefalet Pas', tags: ['Taktisk'] }) : exerciseCatalog,
        accessFlags: {
            showReadiness,
            canEditCurriculum,
            isDeveloper: userRole === UserRole.Developer,
            showFullRoster: true,
        },
    };
}