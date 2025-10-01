import type { Config } from "tailwindcss";
// FJERN DEN FORKERTE IMPORT: import { fontFamily } from 'tailwindcss/defaultTheme'; 

// Du behøver ikke at importere 'fontFamily' direkte på denne måde længere
// Du kan stadig få fat i standard skrifttyperne via theme() funktionen eller theme.fontFamily

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Her definerer vi din 'sans' font.
        // Tailwind vil automatisk flette dette med sine standard 'sans' skrifttyper
        // uden at du manuelt skal inkludere '...fontFamily.sans' på samme måde som før.
        sans: ['var(--font-inter)'], 
        // Hvis du vil tilføje fallback-systemskrifttyper, kan du gøre det eksplicit:
        // sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
    },
  },
  plugins: [],
};
export default config;