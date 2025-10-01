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
      // ---------- NYT: About Side Tekster starter her ----------
    aboutHeroTitle: "About Down The Line",
    aboutHeroSubtitle: "Our story, mission, and values",
    aboutMissionTitle: "Our Mission",
    aboutMissionParagraph1: "At Down The Line, our mission is to transform how football coaches and clubs operate. We strive to provide the most innovative tools that enable every coach to maximize their team's potential and foster player development.",
    aboutMissionParagraph2: "We believe in a future where all coaches have access to data-driven insights and effective planning tools that simplify complex tasks, freeing up time for what truly matters: on-field development.",
    aboutValuesTitle: "Our Values",
    value1Title: "Innovation",
    value1Description: "We are driven to explore new technologies and methods to give you an edge.",
    value2Title: "Simplicity",
    value2Description: "Complex data and planning made easy to understand and use for everyone.",
    value3Title: "Collaboration",
    value3Description: "We build tools that foster teamwork among coaches, players, and management.",
    aboutCtaTitle: 'Ready to Optimize Your Training?',
    aboutCtaSubtitle: 'Explore our platform and take your team to the next level.',
    aboutCtaButton: 'Get Started',
    // ---------- NYT: About Side Tekster slutter her ----------
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

      // ---------- NYT: About Side Tekster starter her ----------
    aboutHeroTitle: 'Om Down The Line',
    aboutHeroSubtitle: 'Vores historie, mission og værdier',
    aboutMissionTitle: 'Vores Mission',
    aboutMissionParagraph1: 'Hos Down The Line er vores mission at transformere den måde, fodboldtrænere og klubber arbejder på. Vi stræber efter at levere de mest innovative værktøjer, der gør det muligt for enhver træner at maksimere sit holds potentiale og fremme spillerudvikling.',
    aboutMissionParagraph2: 'Vi tror på en fremtid, hvor alle trænere har adgang til data-drevet indsigt og effektive planlægningsværktøjer, der forenkler komplekse opgaver og frigør tid til det, der virkelig betyder noget: udvikling på banen.',
    aboutValuesTitle: 'Vores Værdier',
    value1Title: 'Innovation',
    value1Description: 'Vi er drevet af at udforske nye teknologier og metoder for at give dig et forspring.',
    value2Title: 'Enkelhed',
    value2Description: 'Komplekse data og planlægning gjort letforståeligt og brugbart for alle.',
    value3Title: 'Samarbejde',
    value3Description: 'Vi bygger værktøjer, der fremmer teamwork mellem trænere, spillere og ledelse.',
    aboutCtaTitle: 'Klar til at Optimere Din Træning?',
    aboutCtaSubtitle: 'Udforsk vores platform og tag dit team til næste niveau.',
    aboutCtaButton: 'Kom i Gang',
    // ---------- NYT: About Side Tekster slutter her ----------
  },
};

// Vi definerer en standardfunktion, der returnerer oversættelser for et givent sprog
export function getTranslations(lang: 'en' | 'da') {
  return i18n[lang];
}