# Down The Line — Coach Planning Platform

Kort beskrivelse

Down The Line er en Next.js (App Router) webapplikation til træningsplanlægning, kampforberedelse og holdstyring målrettet trænere og klubber. Projektet har både offentlige og sikrede ruter og understøtter to sprog (da/en).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Open http://localhost:3000 with your browser to see the result.

Vigtig kontekst

Framework: Next.js (App Router)

TypeScript: Ja

Styling: Tailwind CSS

Dev container: Ubuntu 24.04.2 LTS

Forudsætninger

Node.js >= 18 anbefales

npm (medfølger normalt med Node)

Installation

Installer afhængigheder:

Bash

npm install
Start udviklingsserveren:

Bash

npm run dev
Bemærk: Hvis port 3000 er optaget, vælger Next.js automatisk en anden ledig port (fx 3001).

Typecheck

Kør TypeScript-check uden at emitte filer:

Bash

npx tsc --noEmit
Build & produktion

Down The Line — Coach Planning Platform
Short description

Down The Line is a Next.js (App Router) web application for session planning, match preparation and team management targeted at coaches and clubs. The project contains both public and secure routes and supports two locales (da/en).

Quick facts

Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS

Dev container: Ubuntu 24.04.2 LTS

Prerequisites

Node.js >= 18 recommended

npm

Installation

Install dependencies:

Bash

npm install
Start the development server:

Bash

npm run dev
Note: If port 3000 is taken, Next.js will pick another free port (e.g. 3001).

Type check

Run TypeScript check without emitting files:

Bash

npx tsc --noEmit
Build & production

Build: npm run build

Start: npm run start

Project structure (short)

app/ – Next.js app routes and layouts (locale-aware: app/[lang]/)     - (main) – public pages     - (secure) – secure pages for logged-in users (dashboard, trainer tools, etc.)

components/ – reusable React components (Header, Footer, LanguageContext, SecureLayoutClient, ...)

lib/ – helpers and server-side data access     - lib/server/data.ts – mock/abstraction for user + access level     - lib/lang.ts – runtime validator/normalizer for locale codes (use validateLang)

firebase/ – firebase config and auth helpers

i18n/ – translations (en.json, da.json and helpers)

public/ – public assets (images etc.)

Internationalization (i18n) Struktur
Projektet bruger en opdelt struktur til oversættelser for at adskille offentlige og sikrede dele af appen.

1. Offentlige Sider (main)
Kilde: i18n/main.ts

Loader: Tekster indlæses via LanguageProvider i app/[lang]/layout.tsx/layout.tsx].

Brug: Tilgås i klientkomponenter via useLanguage() hook.

2. Sikrede Sider (secure) (Dashboard, Trainer, etc.)
Dette område bruger ikke LanguageProvider. Oversættelser indlæses på serveren og sendes som props (dict eller t).

VIGTIGT: Sådan tilføjes en ny oversættelse til det sikrede område (f.eks. en ny knap i Dashboard):

Trin 1: Tilføj teksten i i18n/secure.ts Åbn i18n/secure.ts og tilføj din nye nøgle til både en- og da-objekterne.

Eksempel (tilføjelse af addNote til dashboard):

TypeScript

// i18n/secure.ts

export const secureI18n = {
  en: {
    dashboard: {
      // ... eksisterende nøgler ...
      "addNote": "Add Note" // <-- NY LINJE
    },
    // ...
  },
  da: {
    dashboard: {
      // ... eksisterende nøgler ...
      "addNote": "Tilføj Note" // <-- NY LINJE
    },
    // ...
  },
};
Trin 2: Opdater type-filen i18n/secureTranslations.ts Åbn i18n/secureTranslations.ts for at gøre TypeScript opmærksom på din nye nøgle. Denne fil importerer typerne direkte fra secure.ts, så du skal blot sikre, at importen er korrekt.

Eksempel:

TypeScript

// i18n/secureTranslations.ts
import { secureI18n } from './secure'; // Sørg for at denne import er der

// Definer typer baseret på den danske version
type Dashboard = typeof secureI18n.da.dashboard;
// ... andre typer ...

// Din type er nu automatisk opdateret, fordi den læser fra 'secureI18n'.

export type SecureTranslations = {
  dashboard: Dashboard;
  // ... resten af typerne ...
};
Trin 3: Brug oversættelsen i din komponent (f.eks. DashboardClient.tsx) Din server-layoutfil (app/[lang]/(secure)/layout.tsx/(secure)/layout.tsx]) henter alle oversættelser via fetchSecureTranslations og sender dem som dict til din page.tsx, som sender dem videre til din *Client.tsx.

Du kan nu bruge den via t-variablen (som normalt er dict.dashboard):

TypeScript

// I DashboardClient.tsx/(secure)/dashboard/DashboardClient.tsx]
const t = useMemo(() => dict.dashboard || {}, [dict]);

// ...
<button>{t.addNote ?? 'Tilføj Note'}</button>
// ...
Trin 4: Genstart serveren VIGTIGT: Efter ændring af secure.ts eller secureTranslations.ts, skal du genstarte din npm run dev server (Ctrl+C) for at se ændringerne.

Important implementation notes & recent fixes

App Router: async params

     The Next.js App Router can provide params as an async object in some contexts. Do not read params.lang synchronously in server components. Correct usage:

     ts      // inside a server component      const { lang } = await params;      

     If you use use(paramsPromise) in a client component, destructure after resolving the promise via use/React.use.

Typing: central Language type

     There's a central language type in components/LanguageContext.tsx:

     ts      export type Language = 'da' | 'en';      

     To avoid type mismatches against Next's generated types, server components often declare params: Promise<{ lang: string }> and then validate/normalize the value at runtime.

Runtime validation: lib/lang.ts

     A small helper validateLang in lib/lang.ts normalizes and validates an incoming lang value and falls back to 'en' when invalid. Example:

     ```ts      import validateLang from '@/lib/lang';

     const { lang } = await params; // lang may come from Next internals      const locale = validateLang(lang);      ```

Why string in params types?

     Next generates internal route types that often use string for route params. To avoid validator/type mismatches from .next/types/validator.ts we prefer params: Promise<{ lang: string }> and runtime validation in server components.

Troubleshooting (quick tips)

Error: "Route used params.lang. params should be awaited before using its properties." — await params before reading params.lang in server components.

TypeScript errors from .next/types/validator.ts complaining about lang types: use params: Promise<{ lang: string }> and validate at runtime.

Port 3000 in use — Next will pick another free port, or stop the process using 3000.

Testing

Unit tests use Vitest. After installing dev dependencies, run:

Bash

npm run test
There is a test for lib/lang.ts at tests/lib/lang.test.ts.

Contributing

Work in feature branches (e.g. feature/my-change) and open PRs against main.

Run npx tsc --noEmit and npm run test locally before creating a PR.

Future improvements

Centralize lang validation in a single wrapper/HOC to reduce repetition.

Add unit tests for critical server helpers and more pages.

Consider stricter route typing generation to lock lang globally to 'da' | 'en'.

Contact

Questions or help: see the repo owner or project README on GitHub.