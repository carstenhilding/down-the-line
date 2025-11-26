// lib/services/teamService.ts
import { db } from "@/firebase/config";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

// Type for en spiller
export interface Player {
  id: string;
  name: string;
  position: string;
  status: 'ready' | 'injured' | 'absent';
  teamId: string;
}

/**
 * Henter alle spillere på et givent hold
 */
export async function getTeamRoster(teamId: string) {
  try {
    // Vi leder i 'players' tabellen efter spillere med det rigtige teamId
    const q = query(collection(db, "players"), where("teamId", "==", teamId));
    const querySnapshot = await getDocs(q);

    const players: Player[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      players.push({
        id: doc.id,
        name: data.name || "Ukendt Spiller",
        position: data.position || "Ukendt",
        status: data.status || 'ready',
        teamId: data.teamId
      });
    });

    return players;
  } catch (error) {
    console.error("Fejl ved hentning af spillere:", error);
    return [];
  }
}

/**
 * Henter info om selve holdet (fx "U19 Drenge")
 */
export async function getTeamInfo(teamId: string) {
  try {
    const docRef = doc(db, "teams", teamId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("Intet hold fundet!");
      return null;
    }
  } catch (error) {
    console.error("Fejl ved hentning af hold:", error);
    return null;
  }
}