// lib/server/dashboard.ts - Service til Dashboard Persistens
// Denne bruger nu rigtig Firestore

import { db } from '@/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// --- Type Definition for gemt Canvas Data ---
export interface CanvasCardPersist {
  id: string;
  type: 'note' | 'ai_readiness' | 'weekly_calendar';
  // RETTELSE: Vi tillader 'null' i stedet for 'undefined' for Firebase
  content: { 
    title: string;
    text: string;
  } | null; // <--- RETTELSE HER
  defaultPosition: { x: number; y: number };
  size: { w: number; h: number };
}

// NYT interface for zoom/pan
export interface CanvasState {
  zoom: number;
  position: { x: number; y: number };
}

// OPGAVE 4 RETTELSE: Vi gemmer også visningstilstanden
export interface DashboardSettings {
    cards: CanvasCardPersist[];
    activeTool: 'grid' | 'canvas' | 'add';
    canvasState?: CanvasState; // Tilføjet (valgfri for bagudkompatibilitet)
}

/**
 * Henter det gemte dashboard-layout for en given bruger.
 * @param userId Brugerens ID.
 * @returns Objekt med gemte kort og activeTool, eller null hvis intet findes.
 */
export async function getDashboardLayout(userId: string): Promise<DashboardSettings | null> {
  // Forsinker en smule for at sikre, at auth er klar
  await new Promise(resolve => setTimeout(resolve, 50));
  
  try {
    const docRef = doc(db, "user-dashboards", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(`[DashboardService] Layout loaded from Firestore for user ${userId}.`);
      return docSnap.data() as DashboardSettings;
    } else {
      console.log(`[DashboardService] No layout found in Firestore for user ${userId}.`);
      return null;
    }
  } catch (error) {
    console.error("[DashboardService] Error fetching document:", error);
    return null;
  }
}

/**
 * Gemmer det aktuelle dashboard-layout for en given bruger.
 * @param userId Brugerens ID.
 * @param settings Objekt med kort og activeTool.
 */
export async function saveDashboardLayout(userId: string, settings: DashboardSettings) {
  try {
    const docRef = doc(db, "user-dashboards", userId);
    // Vi gemmer settings OG et tidsstempel
    await setDoc(docRef, { ...settings, lastUpdated: new Date().toISOString() }, { merge: true });
    console.log(`[DashboardService] Layout saved successfully to Firestore for user ${userId}.`);
  } catch (error) {
    console.error("[DashboardService] Error saving document:", error);
  }
}