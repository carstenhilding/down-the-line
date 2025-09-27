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
    heroTitle: "Master Your Coaching, Elevate Your Team.",
    heroSubtitle: "The all-in-one platform for modern coaches, clubs, and academies to meticulously plan, analyze, and unleash their full potential on the pitch.",
    heroButton: "Discover Down The Line",

    // Features Section
    feature1Title: "Precision Planning. Flawless Execution.",
    feature1Description: "Transform your coaching vision into reality. Our intuitive drag-and-drop planner helps you craft detailed training sessions, build a vast library of drills, and share comprehensive playbooks with your entire staff. Master every moment on the pitch.",
    feature1Link: "Explore the Advanced Planner →",

    feature2Title: "Unify Your Team. Maximize Potential.",
    feature2Description: "Gain a 360-degree view of your club. From seamless member administration and team calendars to in-depth player statistics and injury tracking, manage every aspect of your organization. Empower every athlete with personalized development pathways.",
    feature2Link: "Discover Your Club Hub →",

    feature3Title: "Analyze to Dominate. Visualize to Win.",
    feature3Description: "Elevate your tactical understanding with cutting-edge analysis tools. Animate drills, draw directly on video clips for instant feedback, and integrate performance data from all sources. From in-depth scouting to post-match breakdowns, turn insights into victories.",
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
    heroTitle: "Mestr Din Træning, Løft Dit Hold.",
    heroSubtitle: "Den alt-i-én platform for moderne trænere, klubber og akademier til omhyggeligt at planlægge, analysere og frigøre deres fulde potentiale på banen.",
    heroButton: "Oplev Down The Line",

    // Features Section
    feature1Title: "Præcis Planlægning. Fejlfri Udførelse.",
    feature1Description: "Forvandl din træner-vision til virkelighed. Vores intuitive træk-og-slip planlægger hjælper dig med at skabe detaljerede træningspas, opbygge et omfattende øvelsesbibliotek og dele komplette spillerebøger med hele dit trænerteam. Mestr hvert øjeblik på banen.",
    feature1Link: "Udforsk den Avancerede Planlægger →",

    feature2Title: "Saml Dit Hold. Maksimer Potentialet.",
    feature2Description: "Få et 360-graders overblik over din klub. Fra problemfri medlemsadministration og holdkalendere til dybdegående spillerstatistik og skadesporing, administrer alle aspekter af din organisation. Styrk hver atlet med personlige udviklingsforløb.",
    feature2Link: "Opdag Dit Klubhubs →",

    feature3Title: "Analyser for at Dominere. Visualiser for at Vinde.",
    feature3Description: "Løft din taktiske forståelse med avancerede analyseværktøjer. Animer øvelser, tegn direkte på videoklip for øjeblikkelig feedback, og integrer præstationsdata fra alle kilder. Fra dybdegående scouting til kampanalyser, omsæt indsigt til sejre.",
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