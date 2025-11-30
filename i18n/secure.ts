// i18n/secure.ts - Til (secure) området (kræver login)

export const secureI18n = {
  en: {
    header: {
      title: "Down The Line Platform",
      settings: "Settings",
      profile: "Profile",
      access_level_label: "Access Level:",
      languageSelector: {
        label: "Language",
        danish: "Dansk",
        english: "English"
      }
    },
    // Dashboard Page
    dashboard: {
      loading: "Loading dashboard...",
      welcomeTitle: "Welcome",
      logoutButton: "Log Out",
      createSessionTitle: "Create Session",
      sessionPlannerSubtitle: "Session Planner",
      createDrillTitle: "Create Drill",
      dtlStudioSubtitle: "DTL Studio",
      readinessTitle: "Readiness",
      playerSubtitle: "Player",
      videoAnalysisTitle: "Video Analysis",
      analysisRoomSubtitle: "Analysis Room",
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
      saveNoteButton: "Done",
      addNote: "Add Note",
      addAiReadiness: "+ AI Readiness",
      addWeeklyCalendar: "+ Weekly Calendar",
      addGridWidget: "Add Widget (Grid)",
      changeBackground: "Change Background",
      saveLayout: "Save Layout",
      addWidgetTitle: "Add Widget",
      widgetAdded: "Already on canvas",
      toggleFont: "Toggle Font",
      toggleConnections: "Toggle Connections",
      clearConnections: "Clear All Connections"
    },

    // Sidebar Menu
    sidebar: {
      dashboard: "Dashboard",
      the_turf: "The Turf",
      session_planner: "Session Planner",
      dtl_studio: "DTL Studio",
      exercise_catalog: "Drill Catalog",
      club: "Club & Calendar",
      players: "Player Data",
      video: "Video Analysis",
      scouting: "Scouting",
      chat: "Communication"
    },

    // Trainer Page Content
    trainer_page: {
      session_planner: "Session Planner",
      session_planner_desc: "Design and plan your next session",
      animation_studio: "Animation Studio",
      animation_studio_desc: "Bring your drills to life with animation",
      weeks_focus: "Week's Focus (Periodization)",
      weeks_focus_desc:
        "This week (Week 42), the primary focus is on <1>Defensive Organization</1>, with a secondary focus on quick transitions after losing possession.",
      upcoming_sessions: "Upcoming Sessions",
      my_libraries: "My Libraries",
      club_catalog: "Club's Drill Catalog",
      personal_catalog: "My Personal Catalog"
    },

    // Trainer Module
    trainer: {
      titleNew: "New Training Session",
      titleLibrary: "Session Library",
      detailsTitle: "Session Details",
      titleLabel: "Session Title",
      dateLabel: "Date",
      todaysSquad: "Today's Squad",
      readyLabel: "Ready",
      themeLabel: "Theme",
      durationLabel: "Duration (min.)",
      notesLabel: "Coach Notes",
      saveButton: "Save Session",
      cancelButton: "Cancel"
    },
    // Library
    library: {
      title: "Library & Assets",
      subtitle: "Intelligent Asset Management",
      createBtn: "Create Drill",
      searchPlaceholder: 'Search (e.g. "Pressing" or "U12")',
      tabs: {
        global: "DTL Global",
        club: "Club Curriculum",
        team: "Team Library",
        personal: "My Drills"
      },
      filters: {
        all: "All",
        warmup: "Warm-up",
        technical: "Technical",
        tactical: "Tactical",
        physical: "Physical",
        mental: "Mental"
      },
      card: {
        verified: "Verified",
        by: "By",
        highIntensity: "High Intensity"
      },
      emptyState: {
        title: "No assets found",
        desc: "Try changing your filters or search query"
      }
    },
    // KATEGORIER (ENGLISH)
    categories: {
        main: {
          buildup_phase_1: "Build-up - Phase 1",
          buildup_phase_2: "Build-up - Phase 2",
          attacking: "Attacking (Finishing)",
          pressing: "Conquest (Pressing)",
          defending: "Defending",
          transition_off: "Transition - Offensive",
          transition_def: "Transition - Defensive",
          set_pieces: "Set Pieces",
          technical: "Technical Training",
          physical: "Physical Training",
          goalkeeper: "Goalkeeper Training",
          other: "Other"
        },
        sub: {
          establishment: "Establishment & Playing out from back",
          opening: "Opening the play (Fullbacks/Center)",
          switching_back: "Switching play (Back line)",
          relations_back: "Relationships in back line",
          resist_press: "Resisting high press",
          breaking_lines: "Breaking Lines",
          transition_to_finish: "Transition to finishing",
          pocket_play: "Play in pockets/between lines",
          switching_mid: "Switching play (Midfield)",
          rotation: "Rotations",
          progression: "Progression & Transport",
          breakthrough: "Breakthrough & Through balls",
          cross_box: "Crosses & Box play",
          finishing: "Finishing",
          "1v1_off": "1v1 Offensive",
          overloads: "Overloads",
          shooting: "Shooting practice",
          high_press: "High Press (Organized)",
          pres_traps: "Pressing Traps",
          mid_conquest: "Midfield Conquest",
          steering: "Steering play wide",
          break_rhythm: "Breaking opponent's rhythm",
          zonal: "Zonal defending",
          man_marking: "Man-to-man / Duels",
          defend_box: "Defending own box (Low Block)",
          shifting: "Shifting & Organization",
          "1v1_def": "1v1 Defensive",
          deep_runs: "Seeking depth quickly",
          imbalance: "Exploiting imbalance",
          first_pass: "The first pass forward",
          counter_press: "Counter-pressing",
          reaction: "Reaction to loss of possession",
          recovery_runs: "Recovery runs & Delay",
          reorg: "Re-establishing organization",
          corners_off: "Corners (Offensive)",
          corners_def: "Corners (Defensive)",
          freekicks: "Free kicks",
          throwins: "Throw-ins",
          penalties: "Penalties",
          passing_touch: "Passing & 1st touch",
          dribbling: "Dribbling, Feints & Turns",
          ball_mastery: "Ball Mastery",
          heading: "Heading",
          coordination_ball: "Coordination with ball",
          warmup: "Warm-up & Activation",
          sprint: "Sprint & Speed",
          strength: "Strength & Power",
          agility: "Agility & Coordination",
          endurance: "Endurance (Aerobic/Anaerob)",
          prehab: "Injury Prevention",
          shot_stopping: "Shot stopping & Saves",
          crosses: "Crosses",
          distribution: "Distribution (Feet/Throws)",
          "1v1_gk": "1v1 vs Striker",
          teambuilding: "Teambuilding",
          mental: "Mental Training",
          fun: "Fun & Games",
          rondos: "Rondos"
        }
      }
  },

  da: {
    header: {
      title: "Down The Line Platform",
      settings: "Indstillinger",
      profile: "Profil",
      access_level_label: "Adgangsniveau:",
      languageSelector: {
        label: "Sprog",
        danish: "Dansk",
        english: "English"
      }
    },
    // Dashboard Page
    dashboard: {
      loading: "Indlæser dashboard...",
      welcomeTitle: "Velkommen",
      logoutButton: "Log Ud",
      createSessionTitle: "Træningsplan",
      sessionPlannerSubtitle: "Træning Planlægning",
      createDrillTitle: "Tegn Øvelse",
      dtlStudioSubtitle: "DTL Studio",
      readinessTitle: "Readiness",
      playerSubtitle: "Spiller",
      videoAnalysisTitle: "Video Analyse",
      analysisRoomSubtitle: "Analysis Room",
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
      saveNoteButton: "Udfør",
      addNote: "Tilføj Note",
      addAiReadiness: "+ AI Readiness",
      addWeeklyCalendar: "+ Ugekalender",
      addGridWidget: "Tilføj Widget (Grid)",
      changeBackground: "Skift Baggrund",
      saveLayout: "Gem Layout",
      addWidgetTitle: "Tilføj Widget",
      widgetAdded: "Allerede på canvas",
      toggleFont: "Skift Skrifttype",
      toggleConnections: "Slå Forbindelser til",
      clearConnections: "Ryd Alle Forbindelser"
    },

    // Sidebar Menu
    sidebar: {
      dashboard: "Dashboard",
      the_turf: "The Turf",
      session_planner: "Træningsplan",
      dtl_studio: "DTL Studio",
      exercise_catalog: "Øvelseskatalog",
      club: "Klub & Kalender",
      players: "Spillerdata",
      video: "Videoanalyse",
      scouting: "Scouting",
      chat: "Kommunikation"
    },

    // Trainer Page Content
    trainer_page: {
      session_planner: "Session Planner",
      session_planner_desc: "Design og planlæg dit næste træningspas",
      animation_studio: "Animation Studio",
      animation_studio_desc: "Bring dine øvelser til live med animation",
      weeks_focus: "Ugens Fokus (Periodisering)",
      weeks_focus_desc:
        "I denne uge (Uge 42) er det primære fokus på <1>Defensiv Organisation</1>, med sekundært fokus på hurtige omstillinger efter boldtab.",
      upcoming_sessions: "Kommende Træninger",
      my_libraries: "Mine Biblioteker",
      club_catalog: "Klubbens Øvelseskatalog",
      personal_catalog: "Mit Personlige Katalog"
    },

    // Trainer Module
    trainer: {
      titleNew: "Nyt Træningspas",
      titleLibrary: "Øvelsesbibliotek",
      detailsTitle: "Pas Detaljer",
      titleLabel: "Titel på Pas",
      dateLabel: "Dato",
      todaysSquad: "Dagens Trup",
      readyLabel: "Klar",
      themeLabel: "Tema",
      durationLabel: "Varighed (min.)",
      notesLabel: "Trænernoter",
      saveButton: "Gem Pas",
      cancelButton: "Annuller"
    },
    // Library
    library: {
      title: "Bibliotek & Assets",
      subtitle: "Intelligent Asset Management",
      createBtn: "Opret Øvelse",
      searchPlaceholder: 'Søg (f.eks. "Genpres" eller "U12")',
      tabs: {
        global: "DTL Global",
        club: "Klubbens Curriculum",
        team: "Team Library",
        personal: "Mine Øvelser"
      },
      filters: {
        all: "Alle",
        warmup: "Opvarmning",
        technical: "Teknisk",
        tactical: "Taktisk",
        physical: "Fysisk",
        mental: "Mentalt"
      },
      card: {
        verified: "Verificeret",
        by: "Af",
        highIntensity: "Høj Intensitet"
      },
      emptyState: {
        title: "Ingen assets fundet",
        desc: "Prøv at ændre dine filtre eller søgning"
      }
    },
    // KATEGORIER (DANSK)
    categories: {
        main: {
          buildup_phase_1: "Opbygningsspil - Fase 1",
          buildup_phase_2: "Opbygningsspil - Fase 2",
          attacking: "Angrebsspil (Afslutningsspil)",
          pressing: "Erobringsspil (Pres)",
          defending: "Forsvarsspil",
          transition_off: "Omstilling - Offensiv",
          transition_def: "Omstilling - Defensiv",
          set_pieces: "Dødbolde",
          technical: "Teknisk Træning",
          physical: "Fysisk Træning",
          goalkeeper: "Målmandstræning",
          other: "Andet"
        },
        sub: {
          establishment: "Etablering & Spille ud fra bagkæden",
          opening: "Åbne spillet (Backs/Centrale)",
          switching_back: "Spilvendinger (Bagerste kæde)",
          relations_back: "Relationer i bagkæden",
          resist_press: "Modstå højt pres",
          breaking_lines: "Bryde kæder (Breaking Lines)",
          transition_to_finish: "Overgang til afslutningsspil",
          pocket_play: "Spil i mellemrum",
          switching_mid: "Spilvendinger (Midtbane)",
          rotation: "Rotationer",
          progression: "Progression & Transport",
          breakthrough: "Gennembrud & Stikninger",
          cross_box: "Indlæg & Boksspil",
          finishing: "Afslutninger (Finishing)",
          "1v1_off": "1v1 Offensivt",
          overloads: "Overtal (Overloads)",
          shooting: "Skudtræning",
          high_press: "Højt Pres (Organiseret)",
          pres_traps: "Presfælder",
          mid_conquest: "Erobring på midten",
          steering: "Styre spillet mod siderne",
          break_rhythm: "Bryde modstanders rytme",
          zonal: "Zoneforsvar",
          man_marking: "Mand-til-mand / Dueller",
          defend_box: "Forsvare eget felt (Low Block)",
          shifting: "Sideforskydning & Organisering",
          "1v1_def": "1v1 Defensivt",
          deep_runs: "Søge dybden hurtigt",
          imbalance: "Udnytte ubalance",
          first_pass: "Den første pasning fremad",
          counter_press: "Genpres (Counter-pressing)",
          reaction: "Reaktion ved boldtab",
          recovery_runs: "Returløb & Forsinkelse",
          reorg: "Genetablering af organisation",
          corners_off: "Hjørnespark (Offensivt)",
          corners_def: "Hjørnespark (Defensivt)",
          freekicks: "Frispark",
          throwins: "Indkast",
          penalties: "Straffespark",
          passing_touch: "Pasninger & 1. berøring",
          dribbling: "Driblinger, Finter & Vendinger",
          ball_mastery: "Ball Mastery",
          heading: "Hovedspil",
          coordination_ball: "Koordination med bold",
          warmup: "Opvarmning & Aktivering",
          sprint: "Sprint & Hurtighed",
          strength: "Styrke & Power",
          agility: "Agility & Koordination",
          endurance: "Udholdenhed (Aerob/Anaerob)",
          prehab: "Skadesforebyggelse",
          shot_stopping: "Skudtræning & Redninger",
          crosses: "Indlæg",
          distribution: "Distribution (Fødder/Kast)",
          "1v1_gk": "1v1 mod angriber",
          teambuilding: "Teambuilding",
          mental: "Mental Træning",
          fun: "Sjov & Leg",
          rondos: "Rondos"
        }
      }
  }
};