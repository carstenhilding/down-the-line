import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "firebase/auth";
import { auth } from "./config"; // Importerer 'auth'-servicen fra din config.ts

/**
 * Registrerer en ny bruger med e-mail og adgangskode.
 * @param email - Brugerens e-mail.
 * @param password - Brugerens adgangskode.
 * @returns Promise med brugerinformation (UserCredential).
 */
export async function signupUser(email: string, password: string) {
    // Bemærk: Fejlhåndtering (try/catch) skal typisk ske i komponenten/form action.
    return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Logger en eksisterende bruger ind med e-mail og adgangskode.
 * @param email - Brugerens e-mail.
 * @param password - Brugerens adgangskode.
 * @returns Promise med brugerinformation (UserCredential).
 */
export async function signInUser(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}
