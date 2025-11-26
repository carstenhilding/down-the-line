// lib/services/sessionService.ts
import { db } from "@/firebase/config";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  Timestamp 
} from "firebase/firestore";

// Vi definerer, hvordan en Session ser ud i databasen
export interface SessionData {
  id?: string;
  userId: string;         // Hvilken træner har lavet den?
  title: string;          // Titel på passet
  date: Date;             // Dato for træningen
  duration: number;       // Varighed i minutter
  theme: string;          // Tema (fx "Defensiv")
  intensity: 'low' | 'medium' | 'high';
  description?: string;
  exercises?: any[];      // Liste af øvelser (gemmes som JSON-data)
  createdAt?: Date;
}

const COLLECTION_NAME = "sessions";

/**
 * Opretter et nyt træningspas i databasen
 */
export async function createSession(data: SessionData) {
  try {
    // Vi forbereder data til Firestore (konverterer Date til Timestamp)
    const payload = {
      ...data,
      date: Timestamp.fromDate(data.date),
      createdAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
    console.log("Session gemt med ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Fejl ved oprettelse af session:", error);
    return { success: false, error };
  }
}

/**
 * Henter alle sessioner for en specifik bruger (Træner)
 */
export async function getUserSessions(userId: string) {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const sessions: SessionData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        userId: data.userId,
        title: data.title,
        date: data.date.toDate(), // Konverter Timestamp tilbage til Date
        duration: data.duration,
        theme: data.theme,
        intensity: data.intensity,
        description: data.description,
        exercises: data.exercises
      });
    });
    
    return sessions;
  } catch (error) {
    console.error("Fejl ved hentning af sessioner:", error);
    return [];
  }
}

/**
 * Opdaterer en eksisterende session
 */
export async function updateSession(sessionId: string, updates: Partial<SessionData>) {
  try {
    const docRef = doc(db, COLLECTION_NAME, sessionId);
    await updateDoc(docRef, updates);
    return { success: true };
  } catch (error) {
    console.error("Fejl ved opdatering:", error);
    return { success: false, error };
  }
}

/**
 * Sletter en session
 */
export async function deleteSession(sessionId: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, sessionId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Fejl ved sletning:", error);
    return { success: false, error };
  }
}