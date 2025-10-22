import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Bemærk: Denne konfiguration bruger miljøvariable, hvilket er bedst praksis i Next.js.
// Sørg for at disse variabler er defineret i din .env.local fil.
const firebaseConfig = {
  apiKey: "AIzaSyCX0UMAT4RVvUv7flJsjCy6ESba3y6WtGg",
  authDomain: "down-the-line-88033.firebaseapp.com",
  projectId: "down-the-line-88033",
  storageBucket: "down-the-line-88033.firebasestorage.app",
  messagingSenderId: "186290228799",
  appId: "1:186290228799:web:96d73b4096bf49f76bb28a",
  measurementId: "G-L43SPDHEXB"
};

// Initialiser Firebase Applikationen
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Eksportér de services, vi skal bruge
export const auth = getAuth(app);
export const db = getFirestore(app);

// Eksport af den initialiserede app
export default app;
