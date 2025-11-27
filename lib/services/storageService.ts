// lib/services/storageService.ts
import { storage } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Uploader en fil til Firebase Storage og returnerer download URL'en.
 * @param file Filen der skal uploades
 * @param path Stien i storage (f.eks. 'drills/thumbnails')
 */
export async function uploadFile(file: File, path: string): Promise<string | null> {
  if (!file) return null;

  try {
    // Vi laver et unikt filnavn for at undgå overskrivning
    const uniqueFileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${path}/${uniqueFileName}`);

    // Upload bytes
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Uploaded a blob or file!', snapshot);

    // Hent URL'en så vi kan vise billedet
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Fejl ved upload af fil:", error);
    return null;
  }
}