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

    // Hero Section (Frontpage)
    heroTitle: "Elevate coaching, optimize the team.",
    heroSubtitle: "The all-in-one platform for modern coaches, clubs, and academies to meticulously plan, analyze, and unleash their full potential on the pitch.",
    heroButton: "Discover Down The Line",

    // Features Section (Frontpage)
    feature1Title: "Master every session.",
    feature1Description: "Bring your training ideas to life with ease. Our intuitive planner lets you design sessions, create an extensive drill library, and share structured playbooks with other coaches. Every detail counts, every session matters!",
    feature1Link: "Explore the Advanced Planner →",
    feature2Title: "Unite the club - Shape the game.",
    feature2Description: "Bring the entire club together in one system. Plan periodized training cycles, define play style, monitor stats and development goals, and ensure all coaches and players work toward the same vision.",
    feature2Link: "Discover Your Club Hub →",
    feature3Title: "Data-driven decisions, real results on the pitch.",
    feature3Description: "Turn data into development. Break down matches, analyze tactics, and visualize every detail. Track player progress and use data from training sessions, to measure if focus areas hit the mark. Use data to elevate every part of coaching.",
    feature3Link: "Master Tactical Analysis →",

    // CTA Section (Frontpage)
    ctaTitle: "Ready to Elevate Your Game?",
    ctaSubtitle: "Get instant access to Down The Line and revolutionize your coaching.",
    ctaButton: "Get Started Now",

    // Footer Section
    allRightsReserved: "All Rights Reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    
    // About Page
    about: { 
      title1: 'About Down The Line:',
      title2: 'The Future of Football Coaching',
      heroSubtitle: "Revolutionizing player development with advanced data and intelligent training tools.",
      introQuote: "At Down The Line, we envision a world where every football coach has the precision and insight they deserve to shape tomorrow's stars. We bridge the gap between intuition and data.",
      missionTitle: "Our Mission: Empower Coaches, Optimize Players",
      missionParagraph1: "Down The Line's mission is to transform football coaching by providing innovative, data-driven tools that maximize the potential of every player and team. We simplify the complexity of coaching, allowing coaches to focus on what truly matters: on-field development.",
      missionParagraph2: "We strive to equip coaches with intelligent solutions that streamline planning, analysis, and feedback, fostering a culture of continuous improvement and success for clubs at all levels.",
      valuesTitle: "Our Values: The Cornerstones of Our Success",
      value1Title: "Innovation & Precision",
      value1Description: "We embrace cutting-edge technology and data analytics to deliver tools that provide unparalleled insights and optimize training precision.",
      value2Title: "Simplicity & Accessibility", 
      value2Description: "Complex data and advanced planning are made easy to understand and accessible, enabling all coaches to fully leverage our platform.",
      value3Title: "Development & Collaboration",
      value3Description: "We believe in a culture of continuous learning for both players and coaches. Our platform fosters collaboration and knowledge sharing to achieve superior results.",
      historyTitle: "Our Journey: From Vision to Reality",
      historyDescription: "Down The Line was founded with a passion for modernizing football training. From an innovative idea in a garage project to a leading platform – we are driven to empower coaches with the tools they deserve. Follow our milestones that have shaped us into who we are today.",
      ctaTitle: "Ready to Redefine Your Training?",
      ctaSubtitle: "Join the Down The Line community and experience the future of football development.",
      ctaButton: "Explore Our Plans"
    },
    // Login Page
    login: {
      title: "Login to Your Account",
      emailLabel: "Email",
      passwordLabel: "Password",
      loginButton: "Login",
      errorMessage: "An unexpected error occurred. Please try again.",
      invalidCredentials: "Invalid email or password.",
      forgotPassword: "Forgot password?",
      noAccountPrompt: "Don't have an account?",
      contactSupport: "Contact support"
    },
    // Features Page
    featuresPage: {
      meta: {
          title: 'Features',
          description: 'Down The Line unites training, analysis, scouting, player development, and communication in one intelligent system.'
      },
      hero: {
        title1: 'Down The Line – One Platform',
        title2: 'Every Aspect of Football',
        subtitle: 'Built for coaches, clubs, and academies that want to work professionally, efficiently, and data-driven — without losing the human touch.',
        tagline: 'From the training ground to the analysis room – everything connects in Down The Line.'
      },
      feature1: {
        title: 'All-in-One Platform for Coaches and Clubs',
        description: 'Down The Line brings everything together — training design, video analysis, player tracking, scouting, and club management — in a single connected platform.',
        points: [ 'Plan and visualize sessions', 'Analyze matches and share feedback', 'Manage events, players, and communication seamlessly' ]
      },
      feature2: {
        title: 'AI-Driven Coaching and Player Development',
        description: 'Built-in intelligence helps coaches make smarter, faster decisions.',
        points: [ 'AI suggests drills and session plans based on themes and player data', 'Automatic workload and readiness tracking', 'Data-driven insights and reports with no manual input' ]
      },
      feature3: {
        title: 'Advanced Video Analysis and Feedback',
        description: 'Understand performance like never before with integrated video tools.',
        points: [ 'Upload, tag, and annotate clips directly in your browser', 'Draw and animate tactical movements on screen', 'Share highlights and personalized feedback with players' ]
      },
      feature4: {
        title: 'Complete Player Profiles and Performance Data',
        description: 'Every player’s journey — physical, technical, and mental — collected in one place.',
        points: [ 'Centralized statistics, testing, and progress history', 'Wellness and readiness tracking with AI analysis', 'Compare players and visualize development trends over time' ]
      },
      feature5: {
        title: 'Communication and Club Management Simplified',
        description: 'Keep your club connected and organized with one integrated communication hub.',
        points: [ 'Secure chats and group channels for teams, coaches, and parents', 'Shared calendar for training, matches, and events', 'File sharing, announcements, and reminders built into the platform' ]
      },
    },
    // Pricing Page
    pricing: {
      meta: {
          title: "Pricing",
          description: "Targeted plans for every level of ambition, from individual coaches to professional academies."
      },
      hero: {
          title1: 'Find the Perfect Plan',
          title2: 'For Your Ambition',
          subtitle: "We offer dedicated solutions for every part of the football world. Choose your category below."
      },
      trainer: {
          categoryTitle: "For the Individual Coach",
          shortTitle: "For the Coach",
          plans: [
              { name: "Starter", price: "€9", period: "/ month", description: "The essential tools to start planning.", features: ["Exercise Builder (2D)", "Session Planner", "Up to 25 saved drills"], buttonText: "Choose Starter" },
              { name: "Advanced", price: "€15", period: "/ month", mostPopular: "Most Popular", description: "Animate and share your vision.", features: ["Everything in Starter, plus:", "Animation Tools", "Video & PDF Export", "Unlimited Drills"], buttonText: "Choose Advanced" },
              { name: "Expert", price: "€25", period: "/ month", description: "Advanced analytics for the dedicated coach.", features: ["Everything in Advanced, plus:", "Personal Player Statistics", "Video Tagging Tool", "AI Drill Suggestions"], buttonText: "Choose Expert" }
          ]
      },
      grassroots: {
          categoryTitle: "For the Grassroots Club",
          shortTitle: "For the Club",
          plans: [
              { name: "Essential", price: "€49", period: "/ month", description: "Organize and communicate with the entire club.", features: ["Up to 5 Coaches", "Club Calendar", "Team Communication", "Shared Drill Library"], buttonText: "Choose Essential" },
              { name: "Growth", price: "€75", period: "/ month", mostPopular: "Most Popular", description: "Tools for developing players and coaches.", features: ["Up to 10 Coaches", "Everything in Essential, plus:", "Basic Player Development Plans", "Video Analysis Suite"], buttonText: "Choose Growth" },
              { name: "Complete", price: "€120", period: "/ month", description: "A full club management system.", features: ["Unlimited Coaches", "Everything in Growth, plus:", "Attendance Tracking", "Parent Communication Module"], buttonText: "Choose Complete" }
          ]
      },
      academy: {
          categoryTitle: "For Academy & Pro",
          shortTitle: "For the Academy",
          plans: [
              { name: "Performance", price: "Contact Us", description: "Advanced data for elite development.", features: ["Full Video Analysis Suite", "Advanced Player Statistics", "Wellness & Readiness Tracking", "Individual Development Plans"], buttonText: "Contact Us" },
              { name: "Elite", price: "Contact Us", mostPopular: "Most Popular", description: "The complete platform for professional organizations.", features: ["Everything in Performance, plus:", "Scouting & Talent ID Module", "API Access", "Custom Integrations"], buttonText: "Contact Us" },
              { name: "Enterprise", price: "Contact Us", description: "A tailored solution for federations and large-scale talent development.", features: ["Everything in Elite, plus:", "Custom Branding", "Federation-wide Database", "Dedicated Enterprise Support"], buttonText: "Contact Us" }
          ]
      }
    }
  },
  da: {
    // Header
    headerHome: "Forside",
    headerFeatures: "Funktioner",
    headerPricing: "Priser",
    headerAbout: "Om Os",
    headerLogin: "Log Ind",
    headerJoin: "Opret",

    // Hero Section (Frontpage)
    heroTitle: "Løft træningen, optimer holdet.",
    heroSubtitle: "Den komplette platform for trænere, klubber og akademier til at gøre planlægning og analyse nemt, og maksimerer præstationer på banen.",
    heroButton: "Oplev Down The Line",

    // Features Section (Frontpage)
    feature1Title: "Gør hver træning bedre",
    feature1Description: "Bring nemt dine ideer til live. Vores intuitive træningsværktøj lader dig designe træninger, skabe et stort øvelseskatalog, og dele strukturerede spillestilsprincipper andre trænere. Alle detaljer gør en forskel, og alle træninger gør en forskel!",
    feature1Link: "Udforsk den Avancerede Planlægger →",
    feature2Title: "Foren klubben, og form spillet.",
    feature2Description: "Bring en hel klub sammen i et system. Skab periodiseringer, definer spillestil, monitorer statistikker og udviklingsmål, og alle trænere og spillere sikres, at arbejde mod samme vision.",
    feature2Link: "Opdag Dit Klubhubs →",
    feature3Title: "Data-drevne beslutninger, reelle resultater på banen",
    feature3Description: "Brug data i udvikling. Nedbryd kampe, analyser taktikker, og visualiser enhver detalje. Holde øje med spilleres udvikling og brug data fra træninger, til at sikre at fokuspunkterne bliver ramt i træningen. Brug data til at forbedre alle dele af træningen.",
    feature3Link: "Mestr Taktisk Analyse →",

    // CTA Section (Frontpage)
    ctaTitle: "Klar til at løfte dit spil?",
    ctaSubtitle: "Få øjeblikkelig adgang til Down The Line og revolutioner din træning.",
    ctaButton: "Kom i gang nu",

    // Footer Section
    allRightsReserved: "Alle Rettigheder Forbeholdes.",
    privacyPolicy: "Fortrolighedspolitik",
    termsOfService: "Servicevilkår",

    // About Page
    about: { 
      title1: 'Om Down The Line:',
      title2: 'Fremtidens Fodboldtræning',
      heroSubtitle: "Revolutionerer spillerudvikling med avanceret data og intelligente træningsværktøjer.",
      introQuote: "Hos Down The Line forestiller vi os en verden, hvor enhver fodboldtræner har den præcision og indsigt, de fortjener, for at forme morgendagens stjerner. Vi bygger bro mellem intuition og data.",
      missionTitle: "Vores Mission: Styrk Trænere, Optimer Spillere",
      missionParagraph1: "Down The Lines mission er at transformere fodboldtræning ved at levere innovative, data-drevne værktøjer, der maksimerer potentialet hos hver eneste spiller og hold. Vi simplificerer kompleksiteten ved coaching, allowing coaches to focus on what truly matters: on-field development.",
      missionParagraph2: "Vi stræber efter at udstyre trænere med intelligente løsninger, der effektiviserer planlægning, analyse og feedback, hvilket fremmer en kultur af konstant forbedring og succes for klubber på alle niveauer.",
      valuesTitle: "Vores Værdier: Grundstenene i Vores Succes",
      value1Title: "Innovation & Præcision",
      value1Description: "Vi omfavner banebrydende teknologi og dataanalyse for at levere værktøjer, der giver uovertruffen indsigt og optimerer træningspræcision.",
      value2Title: "Enkelhed & Tilgængelighed", 
      value2Description: "Komplekse data og avanceret planlægning gøres letforståeligt og tilgængeligt, så alle trænere kan udnytte vores platform fuldt ud.",
      value3Title: "Udvikling & Samarbejde",
      value3Description: "Vi tror på en kultur af kontinuerlig læring for både spillere og trænere. Vores platform fremmer samarbejde og videndeling for at skabe bedre resultater.",
      historyTitle: "Our Journey: From Vision to Reality",
      historyDescription: "Down The Line blev grundlagt med en passion for at modernisere fodboldtræning. Fra en innovativ idé i et garageprojekt til en førende platform – vi er drevet af at give trænere de værktøjer, de fortjener. Følg vores milepæle, der har formet os til det, vi er i dag.",
      ctaTitle: "Ready to Redefine Your Training?",
      ctaSubtitle: "Slut dig til Down The Line-fællesskabet og oplev fremtiden inden for fodboldudvikling.",
      ctaButton: "Se Vores Planer"
    },
    // Login Page
    login: {
      title: "Log ind",
      emailLabel: "E-mail",
      passwordLabel: "Adgangskode",
      loginButton: "Log ind",
      errorMessage: "Der opstod en uventet fejl. Prøv venligst igen.",
      invalidCredentials: "Ugyldig e-mail eller adgangskode.",
      forgotPassword: "Glemt adgangskode?",
      noAccountPrompt: "Har du ingen konto?",
      contactSupport: "Kontakt support"
    },
    // Features Page
    featuresPage: {
      meta: {
          title: 'Funktioner',
          description: 'Down The Line samler træning, analyse, scouting, spillerudvikling og kommunikation i ét intelligent system.'
      },
      hero: {
        title1: 'Down The Line – Én platform',
        title2: 'Alle aspekter af fodbold',
        subtitle: 'Bygget til trænere, klubber og akademier, der vil arbejde professionelt, effektivt og datadrevet - uden at miste det menneskelige fokus.',
        tagline: 'Fra træningsbanen til analyserummet - alt hænger sammen i Down The Line.'
      },
      feature1: {
        title: 'Alt i én platform - fra træning til scouting',
        description: 'Down The Line samler alt, du som klub eller træner har brug for, ét sted. Ingen flere apps, excelark eller mails – alt er integreret og synkroniseret.',
        points: [ 'Planlæg og tegn træningspas med animationer', 'Analyser kampe og del feedback direkte i appen', 'Administrér klub, spillere, events og kommunikation samlet i én løsning' ]
      },
      feature2: {
        title: 'AI-drevet coaching og spillerudvikling',
        description: 'Lad vores intelligente assistent hjælpe dig med at tage beslutninger. Gør din klub smartere, hurtigere og mere data-drevet.',
        points: [ 'Få øvelsesforslag baseret på spillerniveau og træningstema', 'AI beregner belastning, readiness og skadesrisiko', 'Automatisk statistik og rapporter - uden manuelt tastearbejde' ]
      },
      feature3: {
        title: 'Avanceret videoanalyse og feedback',
        description: 'Se, forstå og forbedr præstationer med moderne video- og analyseværktøjer. Fra kampanalyse til personlig udvikling – alt sker i ét flow.',
        points: [ 'Upload og klip videoer, tegn direkte på skærmen', 'AI-tagging af highlights og sekvenser', 'Giv feedback til spillere med tekst, lyd eller video' ]
      },
      feature4: {
        title: 'Spillerprofiler, statistik og sundhedsdata samlet ét sted',
        description: 'Få et 360° overblik over hver spiller - fysisk, teknisk og mentalt. Ét klik - og du har hele spillerens udviklingsrejse.',
        points: [ 'Mål performance, tests og udvikling over tid', 'Log skader, wellness og readiness dagligt', 'Se trends, progression og sammenlign spillere på tværs af hold' ]
      },
      feature5: {
        title: 'Kommunikation og klubstyring gjort simpelt',
        description: 'Hold klubben forbundet - fra ungdomshold til seniorafdeling. Professionel klubkommunikation - nem, sikker og samlet.',
        points: [ 'Chat med spillere, forældre og trænere', 'Planlæg kampe, events og møder i én fælles kalender', 'Send påmindelser, beskeder og filer direkte i appen' ]
      },
    },
    // Pricing Page
    pricing: {
      meta: {
          title: "Priser",
          description: "Målrettede planer for ethvert ambitionsniveau, fra den individuelle træner til professionelle akademier."
      },
      hero: {
          title1: 'Find den Perfekte Plan',
          title2: 'for Jeres Ambitioner',
          subtitle: "Vi tilbyder dedikerede løsninger til alle dele af fodboldverdenen. Vælg din kategori herunder."
      },
      trainer: {
          categoryTitle: "For den Individuelle Træner",
          shortTitle: "For Træneren",
          plans: [
              { name: "Starter", price: "69 kr.", period: "/ md.", description: "De essentielle værktøjer til at starte din planlægning.", features: ["Øvelsesbygger (2D)", "Session Planner", "Op til 25 gemte øvelser"], buttonText: "Vælg Starter" },
              { name: "Advanced", price: "99 kr.", period: "/ md.", mostPopular: "Mest Populære", description: "Animer og del din vision.", features: ["Alt i Starter, plus:", "Animations-værktøjer", "Video & PDF Eksport", "Ubegrænset antal øvelser"], buttonText: "Vælg Advanced" },
              { name: "Expert", price: "169 kr.", period: "/ md.", description: "Avanceret analyse for den dedikerede træner.", features: ["Alt i Advanced, plus:", "Personlig Spillerstatistik", "Video Tagging-værktøj", "AI Øvelsesforslag"], buttonText: "Vælg Expert" }
          ]
      },
      grassroots: {
          categoryTitle: "For Breddeklubben",
          shortTitle: "For Klubben",
          plans: [
              { name: "Essential", price: "349 kr.", period: "/ md.", description: "Organisér og kommunikér med hele klubben.", features: ["Op til 5 Trænere", "Klubkalender", "Hold-kommunikation", "Fælles øvelsesbibliotek"], buttonText: "Vælg Essential" },
              { name: "Growth", price: "499 kr.", period: "/ md.", mostPopular: "Mest Populære", description: "Værktøjer til at udvikle spillere og trænere.", features: ["Op til 10 Trænere", "Alt i Essential, plus:", "Simple Udviklingsplaner", "Videoanalyse-pakke"], buttonText: "Vælg Growth" },
              { name: "Complete", price: "799 kr.", period: "/ md.", description: "Et fuldt system til at administrere klubben.", features: ["Ubegrænset antal trænere", "Alt i Growth, plus:", "Fremmøde-registrering", "Forældre-kommunikationsmodul"], buttonText: "Vælg Complete" }
          ]
      },
      academy: {
          categoryTitle: "For Akademi & Pro",
          shortTitle: "For Akademiet",
          plans: [
              { name: "Performance", price: "Kontakt Os", description: "Avanceret data til elite-udvikling.", features: ["Fuld Videoanalyse-pakke", "Avanceret Spillerstatistik", "Wellness & Readiness Tracking", "Individuelle Udviklingsplaner"], buttonText: "Kontakt Os" },
              { name: "Elite", price: "Contact Us", mostPopular: "Mest Populære", description: "Den komplette platform for professionelle organisationer.", features: ["Alt i Performance, plus:", "Scouting & Talent ID Modul", "API Adgang", "Skræddersyede Integrationer"], buttonText: "Kontakt Os" },
              { name: "Enterprise", price: "Contact Us", description: "A tailored solution for federations and large-scale talent development.", features: ["Everything in Elite, plus:", "Custom Branding", "Federation-wide Database", "Dedicated Enterprise Support"], buttonText: "Contact Us" }
          ]
      }
    }
  },
};

// Vi definerer en standardfunktion, der returnerer oversættelser for et givet sprog
export function getTranslations(lang: 'en' | 'da') {
  return i18n[lang];
}