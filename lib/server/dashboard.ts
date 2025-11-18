// lib/server/dashboard.ts
import { db } from '@/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// --- TYPER ---
export type NoteColor = 'yellow' | 'blue' | 'pink';
export type NoteFont = 'marker' | 'sans';
export type ConnectionPointId = 'top' | 'right' | 'bottom' | 'left';

// NYT: Definerer et simpelt punkt
// Til (tilføj 'export'):
export type Point = { x: number; y: number };

// OPDATERET: Connection kan nu gemme bruger-justerede kontrolpunkter
export type Connection = {
  id: string;
  fromId: string; // ID på start-kort
  toId: string;   // ID på slut-kort
  fromPoint: ConnectionPointId; 
  toPoint: ConnectionPointId;
  controlPoints?: { // Valgfri: Gemmer brugerens justeringer
    c1: Point;
    c2: Point;
  } | null;
};

// --- INTERFACES ---
export interface CanvasCardPersist {
  id: string;
  type: 'note' | 'ai_readiness' | 'weekly_calendar';
  content: { 
    title: string;
    text: string;
    color: NoteColor; 
    font: NoteFont;
  } | null; 
  defaultPosition: { x: number; y: number };
  size: { w: number; h: number };
}

export type CanvasBackground = 'default' | 'dots' | 'week' | 'pitch';

export interface CanvasState {
  zoom: number;
  position: { x: number; y: number };
  background?: CanvasBackground; 
}

export interface DashboardSettings {
    cards: CanvasCardPersist[];
    activeTool: 'grid' | 'canvas' | 'add';
    canvasState?: CanvasState; 
    connections?: Connection[]; // OPDATERET
}

// --- FUNKTIONER ---
export async function getDashboardLayout(userId: string): Promise<DashboardSettings | null> {
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

export async function saveDashboardLayout(userId: string, settings: DashboardSettings) {
  try {
    const docRef = doc(db, "user-dashboards", userId);
    await setDoc(docRef, { ...settings, lastUpdated: new Date().toISOString() }, { merge: true });
    console.log(`[DashboardService] Layout saved successfully to Firestore for user ${userId}.`);
  } catch (error) {
    console.error("[DashboardService] Error saving document:", error);
  }
}