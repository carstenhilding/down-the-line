// i18n/secureTranslations.ts
import { secureI18n } from './secure'; // <-- TILFØJ DENNE IMPORT

// Definer typer baseret på den danske version i secureI18n
type Dashboard = typeof secureI18n.da.dashboard;
type Header = typeof secureI18n.da.header;
type Sidebar = typeof secureI18n.da.sidebar;
type TrainerPage = typeof secureI18n.da.trainer_page;
type Trainer = typeof secureI18n.da.trainer;

export type SecureTranslations = {
  // Disse nøgler matcher de overordnede objekter
  dashboard: Dashboard; // <-- RETTET: Bruger nu den stærke type
  header: Header;       // <-- RETTET: Bruger nu den stærke type
  sidebar: Sidebar;     // <-- RETTET: Bruger nu den stærke type
  trainer_page: TrainerPage; // <-- RETTET: Bruger nu den stærke type
  trainer: Trainer;          // <-- RETTET: Bruger nu den stærke type
  
  // Tilføj fremtidige moduler her:
  // calendar: object;
  // scouting: object;
};