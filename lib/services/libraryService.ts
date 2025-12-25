// lib/services/libraryService.ts
import { db } from "@/firebase/config";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  updateDoc // NYT: Vi skal bruge denne til at opdatere
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
 * NYT: Opdaterer en eksisterende øvelse.
 */
export async function updateDrill(drillId: string, drillData: Partial<DrillAsset>) {
  try {
    const drillRef = doc(db, COLLECTION_NAME, drillId);
    
    // Vi fjerner ID fra dataen, så vi ikke overskriver dokumentets ID-felt (redundant)
    const cleanData = JSON.parse(JSON.stringify(drillData));
    delete cleanData.id;

    await updateDoc(drillRef, {
      ...cleanData,
      updatedAt: serverTimestamp(), // Opdater altid tidsstempel
    });

    console.log("Øvelse opdateret:", drillId);
    return { success: true };
  } catch (error) {
    console.error("Fejl ved opdatering af øvelse:", error);
    return { success: false, error };
  }
}

/**
 * Henter øvelser baseret på adgangsniveau.
 */
export async function getDrills(
    accessLevel: 'Global' | 'Club' | 'Team' | 'Personal' | 'All', 
    userId?: string, 
    clubId?: string,
    teamId?: string
): Promise<DrillAsset[]> {
  try {
    // HVIS 'ALL': Hent fra alle kilder parallelt (Global Search)
    if (accessLevel === 'All') {
        const [globalDrills, clubDrills, teamDrills, personalDrills] = await Promise.all([
            getDrills('Global'), 
            clubId ? getDrills('Club', undefined, clubId) : Promise.resolve([]), 
            teamId ? getDrills('Team', undefined, undefined, teamId) : Promise.resolve([]),
            userId ? getDrills('Personal', userId) : Promise.resolve([]) 
        ]);

        // Flet sammen 
        const allDrills = [...globalDrills, ...clubDrills, ...teamDrills, ...personalDrills];
        
        // Fjern dubletter baseret på ID og returner
        const uniqueDrills = Array.from(new Map(allDrills.map((item: DrillAsset) => [item.id, item])).values());
        
        return uniqueDrills;
    }

    // STANDARD LOGIK (Enkelt bibliotek)
    const drillsRef = collection(db, COLLECTION_NAME);
    let q = query(drillsRef);

    if (accessLevel === 'Personal' && userId) {
      q = query(drillsRef, where("accessLevel", "==", "Personal"), where("authorId", "==", userId));
    } else if (accessLevel === 'Club' && clubId) {
      q = query(drillsRef, where("accessLevel", "==", "Club"), where("clubId", "==", clubId));
    } else if (accessLevel === 'Team' && teamId) {
       q = query(drillsRef, where("accessLevel", "==", "Team"), where("teamId", "==", teamId));
    } else if (accessLevel === 'Global') {
      q = query(drillsRef, where("accessLevel", "==", "Global"));
    } else {
        return [];
    }

    const querySnapshot = await getDocs(q);
    
    const drills: DrillAsset[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
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