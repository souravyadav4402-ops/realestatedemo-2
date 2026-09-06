import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "30rem",
      sm: "40rem",
      md: "48rem",
      lg: "64rem",
      xl: "80rem",
      "2xl": "96rem",
    },
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#FDFBF7",
          deep: "#F7F1E8",
        },
        monsoon: {
          DEFAULT: "#1A2B3C",
          light: "#31465A",
          dark: "#101D29",
        },
        sandstone: {
          DEFAULT: "#EFECE6",
          dark: "#DED8CE",
        },
        brass: {
          DEFAULT: "#D4AF37",
          light: "#E5CA74",
          dark: "#A78622",
        },
        graphite: "#28323B",
        muted: "#6E746F",
        success: "#326A4B",
        danger: "#9B3A32",
      },
      fontFamily: {
        display: ["var(--font-rozha-one)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "Arial", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-2xl": [
          "clamp(3.6rem, 8.5vw, 8.75rem)",
          { lineHeight: "0.88", letterSpacing: "-0.045em" },
        ],
        "display-xl": [
          "clamp(3rem, 6.8vw, 7rem)",
          { lineHeight: "0.92", letterSpacing: "-0.04em" },
        ],
        "display-lg": [
          "clamp(2.45rem, 5vw, 5rem)",
          { lineHeight: "0.96", letterSpacing: "-0.035em" },
        ],
        "display-md": [
          "clamp(2rem, 3.7vw, 3.75rem)",
          { lineHeight: "1", letterSpacing: "-0.025em" },
        ],
        lead: ["clamp(1.05rem, 1.45vw, 1.3rem)", { lineHeight: "1.65" }],
        metric: [
          "clamp(2rem, 4vw, 4.5rem)",
          { lineHeight: "1", letterSpacing: "-0.04em" },
        ],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "section-sm": "clamp(4rem, 7vw, 7rem)",
        section: "clamp(5.5rem, 10vw, 10rem)",
        gutter: "clamp(1.25rem, 4vw, 4.5rem)",
      },
      maxWidth: {
        shell: "92rem",
        reading: "46rem",
      },
      borderRadius: {
        ledger: "2px",
      },
      boxShadow: {
        ledger:
          "0 1px 0 rgb(26 43 60 / 0.08), 0 24px 60px -40px rgb(26 43 60 / 0.35)",
        float: "0 30px 90px -45px rgb(16 29 41 / 0.55)",
        brass: "0 14px 42px -24px rgb(212 175 55 / 0.8)",
      },
      transitionTimingFunction: {
        deliberate: "cubic-bezier(0.16, 1, 0.3, 1)",
        editorial: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      transitionDuration: {
        "450": "450ms",
        "700": "700ms",
        "900": "900ms",
      },
      backgroundImage: {
        "marble-light":
          "radial-gradient(circle at 15% 10%, rgb(212 175 55 / 0.07), transparent 30%), radial-gradient(circle at 85% 70%, rgb(26 43 60 / 0.05), transparent 36%)",
        "ledger-grid":
          "linear-gradient(rgb(26 43 60 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(26 43 60 / 0.07) 1px, transparent 1px)",
        "indigo-radial":
          "radial-gradient(circle at 75% 20%, rgb(212 175 55 / 0.14), transparent 34%), linear-gradient(145deg, #1A2B3C 0%, #101D29 100%)",
      },
      backgroundSize: {
        vastu: "4rem 4rem",
      },
      keyframes: {
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(1.5rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "line-draw": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "reveal-up": "reveal-up 900ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "line-draw": "line-draw 900ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
