Down The Line — Coach Planning Platform

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
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Vigtig kontekst

- Framework: Next.js (App Router)
- TypeScript: Ja
- Styling: Tailwind CSS
- Dev container: Ubuntu 24.04.2 LTS

Forudsætninger

- Node.js >= 18 anbefales
- npm (medfølger normalt med Node)

Installation

1. Installer afhængigheder:

```bash
npm install
```

2. Start udviklingsserveren:

```bash
npm run dev
```

Bemærk: Hvis port 3000 er optaget, vælger Next.js automatisk en anden ledig port (fx 3001).

Typecheck

Kør TypeScript-check uden at emitte filer:

```bash
npx tsc --noEmit
```

Build & produktion

# Down The Line — Coach Planning Platform

Short description

Down The Line is a Next.js (App Router) web application for session planning, match preparation and team management targeted at coaches and clubs. The project contains both public and secure routes and supports two locales (da/en).

Quick facts

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Dev container: Ubuntu 24.04.2 LTS

Prerequisites

- Node.js >= 18 recommended
- npm

Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

Note: If port 3000 is taken, Next.js will pick another free port (e.g. 3001).

Type check

Run TypeScript check without emitting files:

```bash
npx tsc --noEmit
```

Build & production

- Build: `npm run build`
- Start: `npm run start`

Project structure (short)

- `app/` – Next.js app routes and layouts (locale-aware: `app/[lang]/`)
	- `(main)` – public pages
	- `(secure)` – secure pages for logged-in users (dashboard, trainer tools, etc.)
- `components/` – reusable React components (Header, Footer, LanguageContext, SecureLayoutClient, ...)
- `lib/` – helpers and server-side data access
	- `lib/server/data.ts` – mock/abstraction for user + access level
	- `lib/lang.ts` – runtime validator/normalizer for locale codes (use `validateLang`)
- `firebase/` – firebase config and auth helpers
- `i18n/` – translations (`en.json`, `da.json` and helpers)
- `public/` – public assets (images etc.)

Important implementation notes & recent fixes

1. App Router: async `params`

	 The Next.js App Router can provide `params` as an async object in some contexts. Do not read `params.lang` synchronously in server components. Correct usage:

	 ```ts
	 // inside a server component
	 const { lang } = await params;
	 ```

	 If you use `use(paramsPromise)` in a client component, destructure after resolving the promise via `use`/`React.use`.

2. Typing: central `Language` type

	 There's a central language type in `components/LanguageContext.tsx`:

	 ```ts
	 export type Language = 'da' | 'en';
	 ```

	 To avoid type mismatches against Next's generated types, server components often declare `params: Promise<{ lang: string }>` and then validate/normalize the value at runtime.

3. Runtime validation: `lib/lang.ts`

	 A small helper `validateLang` in `lib/lang.ts` normalizes and validates an incoming `lang` value and falls back to `'en'` when invalid. Example:

	 ```ts
	 import validateLang from '@/lib/lang';

	 const { lang } = await params; // lang may come from Next internals
	 const locale = validateLang(lang);
	 ```

4. Why `string` in `params` types?

	 Next generates internal route types that often use `string` for route params. To avoid validator/type mismatches from `.next/types/validator.ts` we prefer `params: Promise<{ lang: string }>` and runtime validation in server components.

Troubleshooting (quick tips)

- Error: "Route used `params.lang`. `params` should be awaited before using its properties." — await `params` before reading `params.lang` in server components.
- TypeScript errors from `.next/types/validator.ts` complaining about `lang` types: use `params: Promise<{ lang: string }>` and validate at runtime.
- Port 3000 in use — Next will pick another free port, or stop the process using 3000.

Testing

Unit tests use Vitest. After installing dev dependencies, run:

```bash
npm run test
```

There is a test for `lib/lang.ts` at `tests/lib/lang.test.ts`.

Contributing

- Work in feature branches (e.g. `feature/my-change`) and open PRs against `main`.
- Run `npx tsc --noEmit` and `npm run test` locally before creating a PR.

Future improvements

- Centralize `lang` validation in a single wrapper/HOC to reduce repetition.
- Add unit tests for critical server helpers and more pages.
- Consider stricter route typing generation to lock `lang` globally to `'da' | 'en'`.

Contact

Questions or help: see the repo owner or project README on GitHub.

---

If you want an additional README variant with deploy/env/CI instructions, say the word and I'll add it.
