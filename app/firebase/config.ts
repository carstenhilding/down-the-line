import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Bemærk: Denne konfiguration bruger miljøvariable, hvilket er bedst praksis i Next.js.
// Sørg for at disse variabler er defineret i din .env.local fil.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialiser Firebase Applikationen
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Eksportér de services, vi skal bruge
export const auth = getAuth(app);
export const db = getFirestore(app);

// Eksport af den initialiserede app
export default app;
