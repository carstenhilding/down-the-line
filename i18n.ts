// down-the-line/i18n.ts

export const i18n = {
  en: {
    // Header
    headerHome: "Home",
    headerFeatures: "Features",
    headerPricing: "Pricing",
    headerAbout: "About",
    headerLogin: "Login",
    headerJoin: "Join",

    // Hero Section
    heroTitle: "Elevate coaching, optimize the team.",
    heroSubtitle: "The all-in-one platform for modern coaches, clubs, and academies to meticulously plan, analyze, and unleash their full potential on the pitch.",
    heroButton: "Discover Down The Line",

    // Features Section
    feature1Title: "Master every session.",
    feature1Description: "Bring your training ideas to life with ease. Our intuitive planner lets you design sessions, create an extensive drill library, and share structured playbooks with other coaches. Every detail counts, every session matters!",
    feature1Link: "Explore the Advanced Planner →",

    feature2Title: "Unite the club - Shape the game.",
    feature2Description: "Bring the entire club together in one system. Plan periodized training cycles, define play style, monitor stats and development goals, and ensure all coaches and players work toward the same vision.",
    feature2Link: "Discover Your Club Hub →",

    feature3Title: "Data-driven decisions, real results on the pitch.",
    feature3Description: "Turn data into development. Break down matches, analyze tactics, and visualize every detail. Track player progress and use data from training sessions, to measure if focus areas hit the mark. Use data to elevate every part of coaching.",
    feature3Link: "Master Tactical Analysis →",
    // CTA Section
    ctaTitle: "Ready to Elevate Your Game?",
    ctaSubtitle: "Get instant access to Down The Line and revolutionize your coaching.",
    ctaButton: "Get Started Now",
      // Footer Section
      allRightsReserved: "All Rights Reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
  },
  da: {
    // Header
    headerHome: "Forside",
    headerFeatures: "Funktioner",
    headerPricing: "Priser",
    headerAbout: "Om Os",
    headerLogin: "Log Ind",
    headerJoin: "Opret",

    // Hero Section
    heroTitle: "Løft træningen, optimer holdet.",
    heroSubtitle: "Den komplette platform for trænere, klubber og akademier til at gøre planlægning og analyse nemt, og maksimerer præstationer på banen.",
    heroButton: "Oplev Down The Line",

    // Features Section
    feature1Title: "Gør hver træning bedre",
    feature1Description: "Bring nemt dine ideer til live. Vores intuitive træningsværktøj lader dig designe træninger, skabe et stort øvelseskatalog, og dele strukturerede spillestilsprincipper andre trænere. Alle detaljer gør en forskel, og alle træninger gør en forskel!",
    feature1Link: "Udforsk den Avancerede Planlægger →",

    feature2Title: "Foren klubben, og form spillet.",
    feature2Description: "Bring en hel klub sammen i et system. Skab periodiseringer, definer spillestil, monitorer statistikker og udviklingsmål, og alle trænere og spillere sikres, at arbejde mod samme vision.",
    feature2Link: "Opdag Dit Klubhubs →",

    feature3Title: "Data-drevne beslutninger, reelle resultater på banen",
    feature3Description: "Brug data i udvikling. Nedbryd kampe, analyser taktikker, og visualiser enhver detalje. Holde øje med spilleres udvikling og brug data fra træninger, til at sikre at fokuspunkterne bliver ramt i træningen. Brug data til at forbedre alle dele af træningen.",
    feature3Link: "Mestr Taktisk Analyse →",
    // CTA Section
    ctaTitle: "Klar til at løfte dit spil?",
    ctaSubtitle: "Få øjeblikkelig adgang til Down The Line og revolutioner din træning.",
    ctaButton: "Kom i gang nu",
          // Footer Section
      allRightsReserved: "Alle Rettigheder Forbeholdes.",
      privacyPolicy: "Fortrolighedspolitik",
      termsOfService: "Servicevilkår",
  },
};

// Vi definerer en standardfunktion, der returnerer oversættelser for et givent sprog
export function getTranslations(lang: 'en' | 'da') {
  return i18n[lang];
}