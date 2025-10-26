// i18n/secure.ts - Til (secure) området (kræver login)

export const secureI18n = {
  en: {
    // KORREKTION: Tilføjet header sektion
    header: {
        title: "Down The Line Platform",
        settings: "Settings",
        profile: "Profile"
    },
    // Dashboard Page
    dashboard: {
      loading: "Loading dashboard...",
      welcomeTitle: "Welcome",
      logoutButton: "Log Out",
      createTrainingTitle: "Create New Session",
      createTrainingDesc: "Access the advanced training planner to design your next session.",
      viewTrainingTitle: "Session Library",
      viewTrainingDesc: "Review your saved drills, animations, and session plans.",
      recentActivityTitle: "Recent Activity",
      activityPlaceholder: "Your most recent activities and planned sessions will appear here.",
      upcoming_week: "Upcoming Week",
      team_status: "Team Status",
      player_availability: "Player Availability",
      total_load: "Total Load",
      readiness: "Readiness",
      top_scorer: "Top Scorer",
      injured_absent: "Injured & Absent",
    },

    // Sidebar Menu
    sidebar: {
      dashboard: 'Dashboard',
      training: 'Training',
      training_new: 'Create New Session',
      training_library: 'Session Library',
      club: 'Club & Calendar',
      players: 'Player Data',
      video: 'Video Analysis',
      scouting: 'Scouting',
      chat: 'Communication',
    },
    // Trainer Page Content (used by /trainer/page.tsx)
    trainer_page: {
      session_planner: "Session Planner",
      session_planner_desc: "Design and plan your next session",
      animation_studio: "Animation Studio",
      animation_studio_desc: "Bring your drills to life with animation",
      weeks_focus: "Week's Focus (Periodization)",
      weeks_focus_desc: "This week (Week 42), the primary focus is on <1>Defensive Organization</1>, with a secondary focus on quick transitions after losing possession.",
      upcoming_sessions: "Upcoming Sessions",
      my_libraries: "My Libraries",
      club_catalog: "Club's Drill Catalog",
      personal_catalog: "My Personal Catalog"
    },
    // Trainer Module (for forms etc. used by /trainer/new/page.tsx)
    trainer: {
      titleNew: "New Training Session",
      titleLibrary: "Session Library",
      detailsTitle: "Session Details",
      titleLabel: "Session Title",
      themeLabel: "Theme",
      durationLabel: "Duration (min.)",
      notesLabel: "Coach Notes",
      saveButton: "Save Session",
      cancelButton: "Cancel"
    },
  },
  da: {
    // KORREKTION: Tilføjet header sektion
    header: {
        title: "Down The Line Platform",
        settings: "Indstillinger",
        profile: "Profil"
    },
    // Dashboard Page
    dashboard: {
      loading: "Indlæser dashboard...",
      welcomeTitle: "Velkommen",
      logoutButton: "Log Ud",
      createTrainingTitle: "Opret Ny Træning",
      createTrainingDesc: "Adgang til den avancerede træningsplanlægger for at designe dit næste træningspas.",
      viewTrainingTitle: "Øvelsesbibliotek",
      viewTrainingDesc: "Gennemse dine gemte øvelser, animationer og træningsplaner.",
      recentActivityTitle: "Seneste Aktivitet",
      activityPlaceholder: "Dine seneste aktiviteter og planlagte træningspas vises her.",
      upcoming_week: "Kommende Uge",
      team_status: "Holdets Tilstand",
      player_availability: "Spillertilgængelighed",
      total_load: "Samlet Belastning",
      readiness: "Klarhed",
      top_scorer: "Topscorer",
      injured_absent: "Skadet & Fravær",
    },

    // Sidebar Menu
    sidebar: {
      dashboard: 'Dashboard',
      training: 'Træning',
      training_new: 'Opret Nyt Pas',
      training_library: 'Øvelsesbibliotek',
      club: 'Klub & Kalender',
      players: 'Spillerdata',
      video: 'Videoanalyse',
      scouting: 'Scouting',
      chat: 'Kommunikation',
    },
    // Trainer Page Content (used by /trainer/page.tsx)
    trainer_page: {
      session_planner: "Session Planner",
      session_planner_desc: "Design og planlæg dit næste træningspas",
      animation_studio: "Animation Studio",
      animation_studio_desc: "Bring dine øvelser til live med animation",
      weeks_focus: "Ugens Fokus (Periodisering)",
      weeks_focus_desc: "I denne uge (Uge 42) er det primære fokus på <1>Defensiv Organisation</1>, med sekundært fokus på hurtige omstillinger efter boldtab.",
      upcoming_sessions: "Kommende Træninger",
      my_libraries: "Mine Biblioteker",
      club_catalog: "Klubbens Øvelseskatalog",
      personal_catalog: "Mit Personlige Katalog"
    },
    // Trainer Module (for forms etc. used by /trainer/new/page.tsx)
    trainer: {
      titleNew: "Nyt Træningspas",
      titleLibrary: "Øvelsesbibliotek",
      detailsTitle: "Pas Detaljer",
      titleLabel: "Titel på Pas",
      themeLabel: "Tema",
      durationLabel: "Varighed (min.)",
      notesLabel: "Trænernoter",
      saveButton: "Gem Pas",
      cancelButton: "Annuller"
    },
  },
};