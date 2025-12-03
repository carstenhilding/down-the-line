// lib/services/libraryService.ts
import { db } from "@/firebase/config";
import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { DrillAsset } from "../server/libraryData";

const COLLECTION_NAME = "drills";

/**
 * Opretter en ny øvelse i biblioteket.
 */
export async function createDrill(drillData: DrillAsset) {
  try {
    // Vi rydder op i data før gemning og fjerner ID da Firestore laver det selv
    const cleanData = JSON.parse(JSON.stringify(drillData));
    delete cleanData.id;

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...cleanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("Øvelse oprettet med ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Fejl ved oprettelse af øvelse:", error);
    return { success: false, error };
  }
}

/**
 * Henter øvelser baseret på adgangsniveau.
 * OPDATERET: Understøtter nu 'Team' og teamId
 */
export async function getDrills(
    accessLevel: 'Global' | 'Club' | 'Team' | 'Personal', 
    userId?: string, 
    clubId?: string,
    teamId?: string
) {
  try {
    const drillsRef = collection(db, COLLECTION_NAME);
    let q = query(drillsRef);

    if (accessLevel === 'Personal' && userId) {
      q = query(drillsRef, where("accessLevel", "==", "Personal"), where("authorId", "==", userId));
    } else if (accessLevel === 'Club' && clubId) {
      q = query(drillsRef, where("accessLevel", "==", "Club"), where("clubId", "==", clubId));
    } else if (accessLevel === 'Team' && teamId) {
       // Henter øvelser for et specifikt hold
       q = query(drillsRef, where("accessLevel", "==", "Team"), where("teamId", "==", teamId));
    } else if (accessLevel === 'Global') {
      q = query(drillsRef, where("accessLevel", "==", "Global"));
    }

    const querySnapshot = await getDocs(q);
    
    const drills: DrillAsset[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Double-cast for at undgå TypeScript fejl ved timestamp
      drills.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(), 
      } as unknown as DrillAsset);
    });

    return drills;
  } catch (error) {
    console.error("Fejl ved hentning af øvelser:", error);
    return [];
  }
}

export async function deleteDrill(drillId: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, drillId);
    await deleteDoc(docRef);
    console.log("Øvelse slettet:", drillId);
    return { success: true };
  } catch (error) {
    console.error("Fejl ved sletning af øvelse:", error);
    return { success: false, error };
  }
}