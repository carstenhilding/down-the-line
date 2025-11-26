// i18n/secureTranslations.ts
import { secureI18n } from './secure'; 

// Trin 1: Definer rod-typen for at sikre, at Typescript kender den fulde struktur.
type SecureI18NRoot = typeof secureI18n.da;

// Trin 2: Definer de enkelte grene ved at bruge Indexed Access til roden.
export type Dashboard = SecureI18NRoot['dashboard'];
export type Header = SecureI18NRoot['header'];
export type Sidebar = SecureI18NRoot['sidebar']; // Sikrer at de nye nøgler kan læses
export type TrainerPage = SecureI18NRoot['trainer_page'];
export type Trainer = SecureI18NRoot['trainer'];
export type Library = SecureI18NRoot['library']; // <-- NY LINJE

// Trin 3: Saml dem i den endelige type.
export type SecureTranslations = {
  dashboard: Dashboard; 
  header: Header; 
  sidebar: Sidebar; 
  trainer_page: TrainerPage; 
  trainer: Trainer;
  library: Library; // <-- NY LINJE 
 
  // Tilføj fremtidige moduler her:
 // calendar: object;
 // scouting: object;
};