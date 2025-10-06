import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Din eksisterende font-definition, som forbliver uændret
        sans: ['var(--font-inter)'],
      },
      // START ÆNDRING: Tilføj din brugerdefinerede orange farveskala her
      colors: {
        orange: {
          DEFAULT: '#fa8f4d',   // Din primære orange
          '50': '#fff8f2',      // Lette nuancer
          '100': '#ffefde',
          '200': '#ffdeb5',
          '300': '#ffc58c',
          '400': '#ffac63',
          '500': '#fa8f4d',     // Din #fa8f4d
          '600': '#e07f44',     // Lidt mørkere til hover
          '700': '#c26f3b',     // Endnu mørkere
          '800': '#a35f32',
          '900': '#854f2a',
          '950': '#442614',
        },
      },
      // SLUT ÆNDRING
    },
  },
  plugins: [],
};
export default config;