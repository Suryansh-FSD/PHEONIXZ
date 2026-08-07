import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        phoenix: {
          bg: "var(--color-bg-base)",
          card: "var(--color-bg-surface)",
          elevated: "var(--color-bg-elevated)",
          subtle: "var(--color-bg-subtle)",

          border: "var(--color-border-default)",
          "border-subtle": "var(--color-border-subtle)",
          "border-strong": "var(--color-border-strong)",

          text: "var(--color-text-primary)",
          muted: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
          inverse: "var(--color-text-inverse)",

          accent: "var(--color-accent-primary)",
          "accent-hover": "var(--color-accent-hover)",
          "accent-subtle": "var(--color-accent-subtle)",

          live: "var(--color-status-live)",
          "live-bg": "var(--color-status-live-bg)",
          "live-border": "var(--color-status-live-border)",

          watch: "var(--color-status-watch)",
          "watch-bg": "var(--color-status-watch-bg)",
          "watch-border": "var(--color-status-watch-border)",

          reject: "var(--color-status-reject)",
          "reject-bg": "var(--color-status-reject-bg)",
          "reject-border": "var(--color-status-reject-border)",
        },
      },
      borderRadius: {
        none: "var(--radius-none)",
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
      },
      transitionTimingFunction: {
        editorial: "var(--ease-editorial)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
