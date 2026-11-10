"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import content from "@/data/portfolio.json";
import PortfolioEditor, { EditBar } from "@/components/PortfolioEditor";
import MusicPlayer from "@/components/MusicPlayer";

/* ================================================================
   ✏️  DATA ab src/data/portfolio.json mein hai.
   Local (npm run dev) pe har section mein ✏️ Edit button se badlo;
   live site pe ye edit buttons nahi dikhte.
   ================================================================ */

const PROFILE = content.profile;
const HERO_WORDS = content.heroWords;
const ABOUT = content.about.text;
const HIGHLIGHT = content.about.highlight;
const WHAT_I_DO = content.whatIDo;
const STACK = content.stack;
const MARQUEE = content.marquee;
const PROJECTS = content.projects;
const ACTIVITIES = content.activities;
const CERTIFICATES = content.certificates;
const BACKGROUNDS = content.backgrounds;
const MUSIC = content.music;

const GREETINGS = ["Hello", "नमस्ते", "こんにちは", "Hola", "Bonjour"];

// 🎨 Default colour theme
//    Light: "sky" | "lavender" | "peach" | "mint"
//    Dark:  "midnight" | "violet" | "sunset" | "teal" | "lime"
//    (website pe 🎨 button se bhi badal sakte ho — pasand aaye woh yahan likh do)
const DEFAULT_THEME = "sky";

// Avatar ke speech bubble ki lines
const SPEECH_INTRO = [
  "Hi! I'm Ayush 👋",
  "Welcome to my portfolio!",
  "Click me — I can spin! 🌀",
  "Scroll down to know me ↓",
];
const SPEECH_WORK = [
  "This is what I do 💻",
  "Writing some clean code…",
  "Hover a card to know more →",
];

/* ================================================================
   🎨 COLOUR THEMES
   ================================================================ */
const THEMES = {
  sky: {
    mode: "light",
    label: "Sky Light",
    bg: "#f6f8fc",
    bg2: "#ffffff",
    bg3: "#eaf0fa",
    accent: "#2563eb",
    accRgb: "37,99,235",
    accent2: "#7c3aed",
    acc2Rgb: "124,58,237",
    ink: "#ffffff",
  },
  lavender: {
    mode: "light",
    label: "Lavender Light",
    bg: "#f8f6fe",
    bg2: "#ffffff",
    bg3: "#eeeafc",
    accent: "#7c3aed",
    accRgb: "124,58,237",
    accent2: "#0891b2",
    acc2Rgb: "8,145,178",
    ink: "#ffffff",
  },
  peach: {
    mode: "light",
    label: "Peach Light",
    bg: "#fdf8f3",
    bg2: "#ffffff",
    bg3: "#f8ece1",
    accent: "#ea580c",
    accRgb: "234,88,12",
    accent2: "#2563eb",
    acc2Rgb: "37,99,235",
    ink: "#ffffff",
  },
  mint: {
    mode: "light",
    label: "Mint Light",
    bg: "#f3faf7",
    bg2: "#ffffff",
    bg3: "#e3f3ec",
    accent: "#0d9488",
    accRgb: "13,148,136",
    accent2: "#6366f1",
    acc2Rgb: "99,102,241",
    ink: "#ffffff",
  },
  midnight: {
    label: "Midnight Blue",
    bg: "#0a0f1e",
    bg2: "#0f1629",
    bg3: "#152038",
    accent: "#7cc7ff",
    accRgb: "124,199,255",
    accent2: "#c4b5fd",
    acc2Rgb: "196,181,253",
    ink: "#04172b",
  },
  violet: {
    label: "Royal Violet",
    bg: "#0b0a14",
    bg2: "#13111f",
    bg3: "#1b182b",
    accent: "#a78bfa",
    accRgb: "167,139,250",
    accent2: "#67e8f9",
    acc2Rgb: "103,232,249",
    ink: "#160d33",
  },
  sunset: {
    label: "Sunset Orange",
    bg: "#0d0b0a",
    bg2: "#16120f",
    bg3: "#1f1914",
    accent: "#fb923c",
    accRgb: "251,146,60",
    accent2: "#fde68a",
    acc2Rgb: "253,230,138",
    ink: "#2a1404",
  },
  teal: {
    label: "Mint Teal",
    bg: "#07090e",
    bg2: "#0c0f16",
    bg3: "#121722",
    accent: "#5eead4",
    accRgb: "94,234,212",
    accent2: "#c4b5fd",
    acc2Rgb: "196,181,253",
    ink: "#04211c",
  },
  lime: {
    label: "Neon Lime",
    bg: "#0a0c0a",
    bg2: "#111511",
    bg3: "#171d17",
    accent: "#a3e635",
    accRgb: "163,230,53",
    accent2: "#93c5fd",
    acc2Rgb: "147,197,253",
    ink: "#172303",
  },
};

// light / dark ke hisaab se text, lines aur surfaces
const MODE = {
  light: {
    "--text": "#141824",
    "--muted": "#5d6475",
    "--fg-rgb": "20,24,36",
    "--line": "rgba(20,24,36,.09)",
    "--line2": "rgba(20,24,36,.18)",
    "--tint": "rgba(20,24,36,.03)",
    "--glass": "rgba(255,255,255,.78)",
    "--card-shadow":
      "0 1px 2px rgba(20,24,36,.04), 0 10px 30px -14px rgba(20,24,36,.14)",
    "--bubble-bg": "#141824",
    "--bubble-fg": "#ffffff",
    "--desk-top": "#cfd6e3",
    "--desk-front": "#e3e8f0",
    "--steam": "rgba(20,24,36,.35)",
    // nature scene
    "--sky1": "#bcd9f2",
    "--far": "#c3d6e6",
    "--mid": "#a6cd98",
    "--near": "#8bbf7a",
    "--tree1": "#6dad60",
    "--tree2": "#4f8f4a",
    "--bush": "#78b368",
    "--sun": "#ffd879",
    "--cloud": "#ffffff",
    "--cloud-op": "0.92",
    "--star-op": "0",
    "--bird": "rgba(30,40,60,.55)",
    "--win": "#bfe0f5",
    "--smoke": "#ffffff",
    "--lamp-op": "0",
    "--house-dim": "1",
    "--sky-soft": "#dcebf8",
    "--water": "#8cc4e8",
    "--water2": "#6aaedc",
    "--sand": "#f1dcae",
    "--rock": "#a3afbe",
    "--rock2": "#8593a5",
    "--snow": "#ffffff",
    "--field1": "#cde39a",
    "--field2": "#e7cf73",
    "--road": "#a8a29e",
    "--wool": "#ffffff",
    "--firefly": "rgba(255,255,255,.95)",
    "--beam-op": ".35",
  },
  dark: {
    "--text": "#eceef4",
    "--muted": "#8e94a8",
    "--fg-rgb": "255,255,255",
    "--line": "rgba(255,255,255,.08)",
    "--line2": "rgba(255,255,255,.16)",
    "--tint": "rgba(255,255,255,.03)",
    "--glass": "rgba(8,10,18,.72)",
    "--card-shadow": "none",
    "--bubble-bg": "#f4f5f7",
    "--bubble-fg": "#0b0e14",
    "--desk-top": "#262d3d",
    "--desk-front": "#121722",
    "--steam": "#ffffff",
    // nature scene (night)
    "--sky1": "#071029",
    "--far": "#16233d",
    "--mid": "#15302a",
    "--near": "#112821",
    "--tree1": "#1b4430",
    "--tree2": "#123222",
    "--bush": "#17392a",
    "--sun": "#f3f0c8",
    "--cloud": "#33415f",
    "--cloud-op": "0.55",
    "--star-op": "1",
    "--bird": "rgba(200,210,230,.5)",
    "--win": "#ffd27a",
    "--smoke": "#5d6a86",
    "--lamp-op": "1",
    "--house-dim": "0.6",
    "--sky-soft": "#0b1633",
    "--water": "#1a2c4d",
    "--water2": "#132341",
    "--sand": "#3a3527",
    "--rock": "#2a3448",
    "--rock2": "#20293a",
    "--snow": "#aab6cc",
    "--field1": "#1f3a2a",
    "--field2": "#33361f",
    "--road": "#2f3442",
    "--wool": "#c9cfdb",
    "--firefly": "#ffe58a",
    "--beam-op": ".85",
  },
};

const themeVars = (t) => ({
  ...MODE[t.mode || "dark"],
  "--bg": t.bg,
  "--bg2": t.bg2,
  "--bg3": t.bg3,
  "--accent": t.accent,
  "--acc-rgb": t.accRgb,
  "--accent2": t.accent2,
  "--acc2-rgb": t.acc2Rgb,
  "--accent-ink": t.ink,
});

/* ================================================================
   ⚙️  NICHE KA CODE — animations aur layout
   ================================================================ */

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

// shared scroll-story progress (read by the avatar every frame)
const story = { p1: 0, p2: 0 };

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smooth = (v) => v * v * (3 - 2 * v);

const Icon = ({ children, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const GitHubIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

function TechLogo({ name = "" }) {
  const n = (name || "").toLowerCase().trim();

  // JavaScript
  if (n.includes("javascript") || n === "js") {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <rect width="32" height="32" rx="6" fill="#F7DF1E" />
        <path
          d="M19.5 12v10.5c0 1.8-1.1 2.6-2.7 2.6-1.4 0-2.3-.7-2.7-1.6l1.8-.9c.2.5.5.8.9.8.6 0 .9-.4.9-1.1V12h1.8zm-6.5 7.8c.4.7 1 1.2 2 1.2 1.1 0 1.7-.6 1.7-1.4 0-1-.8-1.4-2-1.8-1.6-.6-2.6-1.3-2.6-2.8 0-1.5 1.2-2.6 2.8-2.6 1.3 0 2.2.5 2.7 1.5l-1.6 1c-.3-.5-.6-.8-1.1-.8-.5 0-.9.3-.9.8 0 .5.3.8 1.4 1.2 1.7.7 3 1.4 3 3.1 0 1.7-1.4 2.8-3.3 2.8-1.8 0-3-.9-3.5-2l1.6-1z"
          fill="#000000"
        />
      </svg>
    );
  }

  // HTML5
  if (n.includes("html")) {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <path d="M5 2l2.3 25.4L16 30l8.7-2.6L27 2H5z" fill="#E44D26" />
        <path d="M16 27.8l6.8-2.1L24.8 4.2H16v23.6z" fill="#F16529" />
        <path d="M16 12.5H11.2l-.3-3.4H16V5.5H7.7l.9 10.5H16v-3.5zm0 8.6l-3.9-1-.3-2.9H8.4l.5 5.7 7.1 2V21.1z" fill="#EBEBEB" />
        <path d="M16 12.5v3.5h4.3l-.4 4.8-3.9 1v3.4l7.1-2 .8-9.4H16v-1.3zm0-7v3.6h7.8l.3-3.6H16z" fill="#FFFFFF" />
      </svg>
    );
  }

  // CSS3
  if (n.includes("css")) {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <path d="M5 2l2.3 25.4L16 30l8.7-2.6L27 2H5z" fill="#1572B6" />
        <path d="M16 27.8l6.8-2.1L24.8 4.2H16v23.6z" fill="#33A9DC" />
        <path d="M16 12.5H11.2l-.3-3.4H16V5.5H7.7l.9 10.5H16v-3.5zm0 8.6l-3.9-1-.3-2.9H8.4l.5 5.7 7.1 2V21.1z" fill="#EBEBEB" />
        <path d="M16 12.5v3.5h4.3l-.4 4.8-3.9 1v3.4l7.1-2 .8-9.4H16v-1.3zm0-7v3.6h7.8l.3-3.6H16z" fill="#FFFFFF" />
      </svg>
    );
  }

  // Express.js
  if (n.includes("express")) {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <rect width="32" height="32" rx="6" fill="#1e2430" />
        <path
          d="M8.5 22l4-6.3-3.7-5.7h2.4l2.5 4 2.5-4h2.4l-3.7 5.7 4 6.3h-2.5L16 17.8l-2.8 4.2H8.5zm11.2 0l2.8-4.5h2.2l-2.8 4.5h-2.2z"
          fill="#ffffff"
        />
      </svg>
    );
  }

  // Node.js
  if (n.includes("node")) {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <path d="M16 2l12 6.9v14.2L16 30 4 23.1V8.9L16 2z" fill="#339933" />
        <path
          d="M16 8.5c-3.2 0-4.8 1.6-4.8 3.7 0 2.9 5.1 2.9 5.1 4.7 0 .7-.5 1.1-1.6 1.1-1.2 0-2.4-.5-3.2-1.1l-1 1.9c1.2.9 2.7 1.3 4.2 1.3 3.3 0 5.1-1.7 5.1-3.9 0-3.1-5.1-3.1-5.1-4.7 0-.5.5-.9 1.5-.9.9 0 2 .4 2.8.8l1-1.9c-1.1-.7-2.4-1-4-1z"
          fill="#ffffff"
        />
      </svg>
    );
  }

  // MongoDB
  if (n.includes("mongo")) {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <path
          d="M16 2c-.6 3.6-5.5 8.2-5.5 14.5 0 5.2 3.5 9.7 5.5 13.5 2-3.8 5.5-8.3 5.5-13.5C21.5 10.2 16.6 5.6 16 2z"
          fill="#47A248"
        />
        <path
          d="M16 2v28c.4-.7.9-1.5 1.3-2.3 1.8-3.4 4.2-7 4.2-11.2 0-6.3-4.9-10.9-5.5-14.5z"
          fill="#499D4A"
        />
        <path
          d="M16 22.5c-.3 0-.6-.3-.6-.6V9.8c0-.3.3-.6.6-.6s.6.3.6.6v12.1c0 .3-.3.6-.6.6z"
          fill="#ffffff"
          opacity="0.65"
        />
      </svg>
    );
  }

  // SQL / Database
  if (n.includes("sql") || n.includes("database")) {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <rect width="32" height="32" rx="6" fill="#00758F" />
        <ellipse cx="16" cy="9" rx="8.5" ry="3.5" fill="#ffffff" />
        <path
          d="M7.5 9v6.5c0 1.9 3.8 3.5 8.5 3.5s8.5-1.6 8.5-3.5V9"
          stroke="#ffffff"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M7.5 15.5V22c0 1.9 3.8 3.5 8.5 3.5s8.5-1.6 8.5-3.5v-6.5"
          stroke="#ffffff"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    );
  }

  // Python
  if (n.includes("python")) {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <path
          d="M15.9 3c-4.4 0-4.1 1.9-4.1 1.9l.01 2h4.2v.6h-5.9c-2.3 0-4 1.4-4 4.1 0 2.7 1.5 4 3.3 4h1.7v-2.3c0-1.9 1.6-3.4 3.5-3.4h4.1c1.6 0 2.9-1.3 2.9-2.9V5.9c0-1.6-1.4-2.9-3-2.9h-2.7zm-2.3 1.8a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z"
          fill="#3776AB"
        />
        <path
          d="M16.1 29c4.4 0 4.1-1.9 4.1-1.9l-.01-2h-4.2v-.6h5.9c2.3 0 4-1.4 4-4.1 0-2.7-1.5-4-3.3-4h-1.7v2.3c0 1.9-1.6 3.4-3.5 3.4h-4.1c-1.6 0-2.9 1.3-2.9 2.9v1.1c0 1.6 1.4 2.9 3 2.9h2.7zm2.3-1.8a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z"
          fill="#FFD43B"
        />
      </svg>
    );
  }

  // GitHub / Git
  if (n.includes("git")) {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <rect width="32" height="32" rx="6" fill="#181717" />
        <path
          d="M16 6C10.5 6 6 10.5 6 16c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1a9.8 9.8 0 0 1 5.2 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.02 10.02 0 0 0 26 16c0-5.5-4.5-10-10-10z"
          fill="#ffffff"
        />
      </svg>
    );
  }

  // React
  if (n.includes("react")) {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <rect width="32" height="32" rx="6" fill="#20232A" />
        <circle cx="16" cy="16" r="2.4" fill="#61DAFB" />
        <ellipse cx="16" cy="16" rx="10" ry="3.8" stroke="#61DAFB" strokeWidth="1.4" fill="none" />
        <ellipse cx="16" cy="16" rx="10" ry="3.8" stroke="#61DAFB" strokeWidth="1.4" fill="none" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="10" ry="3.8" stroke="#61DAFB" strokeWidth="1.4" fill="none" transform="rotate(120 16 16)" />
      </svg>
    );
  }

  // Tailwind CSS
  if (n.includes("tailwind")) {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <rect width="32" height="32" rx="6" fill="#0F172A" />
        <path
          d="M10.8 14.5c.9-3.5 3.1-4.9 6.7-4.2 2.1.4 3.5 1.9 5.1 3.5 2.6 2.7 5.6 5.8 12.1 5.8-2.6 3.5-5.6 4.9-9.1 4.2-2.1-.4-3.5-1.9-5.1-3.5-2.6-2.7-5.6-5.8-9.7-5.8zm-9.1 8c.9-3.5 3.1-4.9 6.7-4.2 2.1.4 3.5 1.9 5.1 3.5 2.6 2.7 5.6 5.8 12.1 5.8-2.6 3.5-5.6 4.9-9.1 4.2-2.1-.4-3.5-1.9-5.1-3.5-2.6-2.7-5.6-5.8-9.7-5.8z"
          fill="#06B6D4"
          transform="translate(-2, -3) scale(0.85)"
        />
      </svg>
    );
  }

  // Guitar 🎸
  if (n.includes("guitar")) {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <rect width="32" height="32" rx="6" fill="#EA580C" />
        <text x="16" y="22" textAnchor="middle" fontSize="18">🎸</text>
      </svg>
    );
  }

  // Photography 📸
  if (n.includes("photo")) {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <rect width="32" height="32" rx="6" fill="#0D9488" />
        <text x="16" y="22" textAnchor="middle" fontSize="18">📸</text>
      </svg>
    );
  }

  // Japanese 🏯
  if (n.includes("japan")) {
    return (
      <svg viewBox="0 0 32 32" width="34" height="34">
        <rect width="32" height="32" rx="6" fill="#E11D48" />
        <text x="16" y="22" textAnchor="middle" fontSize="18">🏯</text>
      </svg>
    );
  }

  // Fallback badge with initials
  return (
    <svg viewBox="0 0 32 32" width="34" height="34">
      <rect width="32" height="32" rx="6" fill="rgba(var(--acc-rgb),.15)" stroke="rgba(var(--acc-rgb),.3)" strokeWidth="1" />
      <text x="16" y="20.5" textAnchor="middle" fill="var(--accent)" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="11" letterSpacing="0.5">
        {(name || "").slice(0, 3).toUpperCase()}
      </text>
    </svg>
  );
}

const I = {
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  external: (
    <>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  code: (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </>
  ),
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </>
  ),
  palette: (
    <>
      <circle cx="13.5" cy="6.5" r="1.5" />
      <circle cx="17.5" cy="10.5" r="1.5" />
      <circle cx="8.5" cy="7.5" r="1.5" />
      <circle cx="6.5" cy="12.5" r="1.5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.56-2.5 5.56-5.55C21.97 6.01 17.46 2 12 2z" />
    </>
  ),
};

/* ---------- Reveal on scroll (state-based, never stays hidden) ---------- */
function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`reveal${shown ? " in" : ""}${className ? " " + className : ""}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ================================================================
   🧑 ANIMATED AVATAR
   - blinks, eyes & head follow the cursor
   - turns towards the content while you scroll (About)
   - sits at a laptop and types (What I Do)
   - click → 360° spin
   ================================================================ */
function Avatar({ talking = false }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const svgRef = useRef(null);
  const headRef = useRef(null);
  const featRef = useRef(null);
  const faceRef = useRef(null);
  const hairRef = useRef(null);
  const quiffRef = useRef(null);
  const earLRef = useRef(null);
  const earRRef = useRef(null);
  const chestRef = useRef(null);
  const collarRef = useRef(null);
  const pupilL = useRef(null);
  const pupilR = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let turnS = 0;
    let raf;
    let rect = null;
    const t0 = performance.now();

    const updateRect = () => {
      if (svgRef.current) rect = svgRef.current.getBoundingClientRect();
    };
    updateRect();

    const onMove = (e) => {
      if (!rect) updateRect();
      if (!rect) return;
      tx = Math.max(
        -1,
        Math.min(
          1,
          (e.clientX - (rect.left + rect.width * 0.5)) / (window.innerWidth * 0.5),
        ),
      );
      ty = Math.max(
        -1,
        Math.min(
          1,
          (e.clientY - (rect.top + rect.height * 0.42)) / (window.innerHeight * 0.5),
        ),
      );
    };

    const set = (ref, v) =>
      ref.current && ref.current.setAttribute("transform", v);

    let prevCx = 999;
    let prevCy = 999;
    let prevT = 999;
    let prevDown = 999;

    const loop = (now) => {
      if (coarse || reduce) {
        const t = (now - t0) / 1000;
        tx = reduce ? 0 : Math.sin(t * 0.7) * 0.6;
        ty = reduce ? 0 : Math.sin(t * 1.1) * 0.3;
      }
      const w = story.p2; // working at desk
      const look = 1 - w * 0.85;
      cx += (tx * look - cx) * 0.08;
      cy += (ty * look - cy) * 0.08;
      // body turn: towards About text (right) while p1, back to front while working
      const target = Math.max(
        -1,
        Math.min(1, (story.p1 - w) * 0.85 + cx * 0.3),
      );
      turnS += (target - turnS) * 0.1;
      const T = turnS;
      const down = w * 0.75;

      // Only write to DOM if values changed noticeably (saves CPU cycles)
      if (
        Math.abs(cx - prevCx) > 0.01 ||
        Math.abs(cy - prevCy) > 0.01 ||
        Math.abs(T - prevT) > 0.01 ||
        Math.abs(down - prevDown) > 0.01
      ) {
        prevCx = cx;
        prevCy = cy;
        prevT = T;
        prevDown = down;

        set(
          headRef,
          `translate(${(cx * 5).toFixed(2)} ${(cy * 4 + down * 6).toFixed(2)}) rotate(${(cx * 4 + T * 3).toFixed(2)} 200 300)`,
        );
        set(
          featRef,
          `translate(${(T * 24).toFixed(2)} ${(down * 6).toFixed(2)})`,
        );
        set(faceRef, `translate(${(T * 5).toFixed(2)} 0)`);
        set(hairRef, `translate(${(T * 7).toFixed(2)} 0)`);
        set(quiffRef, `translate(${(T * 12).toFixed(2)} 0)`);
        set(earLRef, `translate(${(T * 14).toFixed(2)} 0)`);
        set(earRRef, `translate(${(T * 14).toFixed(2)} 0)`);
        if (earLRef.current)
          earLRef.current.setAttribute(
            "opacity",
            (1 - Math.max(0, -T) * 1.1).toFixed(2),
          );
        if (earRRef.current)
          earRRef.current.setAttribute(
            "opacity",
            (1 - Math.max(0, T) * 1.1).toFixed(2),
          );
        set(chestRef, `translate(${(T * 18).toFixed(2)} 0)`);
        set(collarRef, `translate(${(T * 10).toFixed(2)} 0)`);
        const pt = `translate(${(cx * 8 + T * 5).toFixed(2)} ${(cy * 7 + down * 9).toFixed(2)})`;
        set(pupilL, pt);
        set(pupilR, pt);
        if (svgRef.current) svgRef.current.dataset.working = w > 0.5 ? "1" : "0";
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", updateRect, { passive: true });
    window.addEventListener("scroll", updateRect, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, []);

  const plateDark = `url(#plateDark${uid})`;
  const plateMid = `url(#plateMid${uid})`;
  const plateLight = `url(#plateLight${uid})`;
  const visorGrad = `url(#visorGrad${uid})`;
  const arcGrad = `url(#arcGrad${uid})`;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 470"
      className={`avatar cyber-bot${talking ? " talking" : ""}`}
      aria-hidden="true"
    >
      <defs>
        {/* Mecha chassis plating gradients */}
        <linearGradient id={`plateDark${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#080d1a" />
        </linearGradient>
        <linearGradient id={`plateMid${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id={`plateLight${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Visor 3D curved glass */}
        <linearGradient id={`visorGrad${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a101f" />
          <stop offset="40%" stopColor="#060913" />
          <stop offset="100%" stopColor="#020408" />
        </linearGradient>

        {/* Arc reactor quantum core */}
        <radialGradient id={`arcGrad${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="var(--accent)" />
          <stop offset="70%" stopColor="var(--accent2)" />
          <stop offset="100%" stopColor="rgba(var(--acc-rgb), 0)" />
        </radialGradient>

        {/* Holographic screens for phase 2 */}
        <linearGradient id={`holoScreen${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--accent2)" stopOpacity="0.08" />
        </linearGradient>

        <clipPath id={`visorClip${uid}`}>
          <rect x="124" y="156" width="152" height="106" rx="34" />
        </clipPath>
      </defs>

      {/* Orbiting Companion Mini-Drone */}
      <g className="drone-companion">
        <ellipse cx="335" cy="118" rx="22" ry="12" fill={plateMid} stroke="var(--accent)" strokeWidth="1.5" />
        <circle cx="335" cy="118" r="6" fill="var(--accent)" className="drone-eye" />
        <circle cx="335" cy="118" r="9" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="318" y1="118" x2="310" y2="118" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
        <line x1="352" y1="118" x2="360" y2="118" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
        {/* Micro thruster glow */}
        <ellipse cx="335" cy="132" rx="4" ry="2" fill="var(--accent2)" opacity="0.8" />
      </g>

      <g className="av-body">
        {/* Heavy Mecha Torso / Shoulders */}
        <path
          d="M 52 470 C 56 385 110 332 200 332 C 290 332 344 385 348 470 Z"
          fill={plateDark}
          stroke="#0b1120"
          strokeWidth="3"
        />

        {/* Left & Right Shoulder Armor Guards */}
        <path
          d="M 54 470 C 56 405 92 362 136 348 L 120 470 Z"
          fill={plateMid}
          opacity="0.8"
        />
        <path
          d="M 346 470 C 344 405 308 362 264 348 L 280 470 Z"
          fill={plateMid}
          opacity="0.8"
        />

        {/* Shoulder Bevel Highlights */}
        <path
          d="M 80 410 L 132 355 L 140 375 L 94 430 Z"
          fill="var(--accent)"
          opacity="0.15"
        />
        <path
          d="M 320 410 L 268 355 L 260 375 L 306 430 Z"
          fill="var(--accent)"
          opacity="0.15"
        />

        {/* Neck Hydraulic Cowl */}
        <g ref={collarRef}>
          <path
            d="M 160 286 L 160 338 C 160 354 240 354 240 338 L 240 286 Z"
            fill={plateMid}
            stroke="#070c18"
            strokeWidth="2"
          />
          {/* Hydraulic neck piston struts */}
          <line x1="174" y1="290" x2="174" y2="340" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
          <line x1="226" y1="290" x2="226" y2="340" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
          {/* Collar ring */}
          <ellipse cx="200" cy="336" rx="58" ry="14" fill="#090f1d" stroke="var(--line2)" strokeWidth="1.5" />
        </g>

        {/* Central Mecha Chest Chassis with Quantum Arc Reactor Core */}
        <g ref={chestRef}>
          {/* Hexagonal Armor Breastplate */}
          <polygon
            points="148,362 252,362 272,434 200,466 128,434"
            fill={plateMid}
            stroke="#0b1120"
            strokeWidth="2.5"
          />

          {/* Circuit bus conduits */}
          <path
            d="M 154 374 L 180 398 L 180 422"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 246 374 L 220 398 L 220 422"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Outer Quantum Arc Containment Ring */}
          <circle cx="200" cy="414" r="28" fill="#060a14" stroke="var(--line2)" strokeWidth="2" />
          <circle
            className="arc-gear"
            cx="200"
            cy="414"
            r="23"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeDasharray="5 7"
          />

          {/* Pulsing Arc Reactor Glow Core */}
          <circle cx="200" cy="414" r="18" fill={arcGrad} className="arc-core-pulse" />
          <circle cx="200" cy="414" r="8" fill="#ffffff" />

          {/* Telemetry insignia */}
          <text x="200" y="455" textAnchor="middle" className="av-chest">
            {"⚡ AP-DEV"}
          </text>
        </g>

        {/* Floating Magnetic Arm & Waving Cyber Hand */}
        <g className="av-arm-wrap">
          <g className="av-arm">
            {/* Magnetic Levitation Shoulder Joint */}
            <circle cx="316" cy="370" r="18" fill="#060a14" stroke="var(--accent)" strokeWidth="2" />
            <circle cx="316" cy="370" r="8" fill="var(--accent)" opacity="0.7" />

            {/* Arm Segment / Bionic Chassis */}
            <path
              d="M 314 362 C 330 332 344 304 352 278 L 380 286 C 374 322 356 358 332 388 Z"
              fill={plateMid}
              stroke="#0b1120"
              strokeWidth="2"
            />
            {/* Forearm Conduit Cable */}
            <path
              d="M 324 366 Q 348 325 364 286"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            {/* Wrist Cuff */}
            <rect x="348" y="270" width="34" height="12" rx="4" fill="#060a14" stroke="var(--accent)" strokeWidth="1.5" />

            {/* Precision Articulated Cyber Hand */}
            <g className="av-hand-w">
              {/* Metallic Palm Casing */}
              <ellipse cx="366" cy="248" rx="20" ry="22" fill={plateMid} stroke="#0b1120" strokeWidth="1.5" />
              <circle cx="366" cy="248" r="6" fill="var(--accent)" opacity="0.6" />

              {/* Articulated Bionic Digits with Glowing Sensor Tips */}
              {/* Thumb */}
              <path d="M 344 256 L 336 244 L 340 236" fill="none" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="340" cy="236" r="2.5" fill="var(--accent)" />
              {/* Index */}
              <path d="M 352 232 L 350 208 L 351 202" fill="none" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="351" cy="202" r="2.5" fill="var(--accent)" />
              {/* Middle */}
              <path d="M 364 228 L 364 198 L 365 194" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
              <circle cx="365" cy="194" r="2.5" fill="var(--accent)" />
              {/* Ring */}
              <path d="M 376 230 L 377 202 L 378 198" fill="none" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="378" cy="198" r="2.5" fill="var(--accent)" />
              {/* Pinky */}
              <path d="M 386 236 L 388 214 L 389 210" fill="none" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
              <circle cx="389" cy="210" r="2" fill="var(--accent)" />
            </g>
          </g>
        </g>

        {/* 3D Cybernetic Head Assembly */}
        <g ref={headRef}>
          {/* Left Audio / Comms Sensor Array */}
          <g ref={earLRef}>
            <polygon points="108,185 124,175 124,245 108,235" fill={plateMid} stroke="#070c18" strokeWidth="1.5" />
            <line x1="114" y1="192" x2="114" y2="228" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="114" cy="186" r="2" fill="var(--accent2)" />
          </g>

          {/* Right Audio / Comms Sensor Array */}
          <g ref={earRRef}>
            <polygon points="292,185 276,175 276,245 292,235" fill={plateMid} stroke="#070c18" strokeWidth="1.5" />
            <line x1="286" y1="192" x2="286" y2="228" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="286" cy="186" r="2" fill="var(--accent2)" />
          </g>

          {/* Outer Helmet Chassis / Chin Guard */}
          <g ref={faceRef}>
            <path
              d="M 116 195 C 114 140 148 108 200 108 C 252 108 286 140 284 195 C 284 250 252 278 200 278 C 148 278 116 250 116 195 Z"
              fill={plateDark}
              stroke="#070c18"
              strokeWidth="3"
            />
            {/* Aerodynamic Jaw Reinforcement Plates */}
            <polygon points="126,220 160,266 140,266 118,228" fill={plateMid} />
            <polygon points="274,220 240,266 260,266 282,228" fill={plateMid} />
          </g>

          {/* Top Helmet Cowl / Carbon Crest */}
          <g ref={hairRef}>
            <path
              d="M 124 165 C 130 115 160 92 200 92 C 240 92 270 115 276 165 C 258 135 232 124 200 124 C 168 124 142 135 124 165 Z"
              fill={plateLight}
            />
          </g>

          {/* Forehead Brow Guard & Optical Sensor Gem */}
          <g ref={quiffRef}>
            <path
              d="M 148 142 C 168 130 232 130 252 142 L 244 154 C 228 146 172 146 156 154 Z"
              fill={plateMid}
            />
            <circle cx="200" cy="138" r="4.5" fill="var(--accent)" />
            <circle cx="200" cy="138" r="8" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" />
          </g>

          {/* Curved Obsidian Glass Cyber Visor */}
          <g ref={featRef}>
            {/* Dark glass visor screen */}
            <rect
              x="124"
              y="156"
              width="152"
              height="106"
              rx="34"
              fill={visorGrad}
              stroke="var(--line2)"
              strokeWidth="2"
            />

            {/* Specular gloss reflection highlight arc (creates 3D glass curved bulb effect) */}
            <path
              d="M 138 175 Q 200 160 262 175"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.25"
            />

            {/* Visor HUD scanline effect */}
            <rect
              x="124"
              y="156"
              width="152"
              height="106"
              rx="34"
              fill="none"
              className="visor-hud-sweep"
            />

            {/* Visor Optics (LED Matrix Cyber Eyes & HUD Reticles) */}
            <g clipPath={`url(#visorClip${uid})`}>
              {/* Left Eye HUD & Optics */}
              <g className="av-eye">
                {/* HUD targeting brackets */}
                <path d="M 148 194 L 144 194 L 144 216 L 148 216" fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.6" />
                <path d="M 178 194 L 182 194 L 182 216 L 178 216" fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.6" />
                {/* Moving Eye Pupil Unit */}
                <g ref={pupilL}>
                  <circle cx="163" cy="205" r="13" fill="rgba(var(--acc-rgb), 0.15)" />
                  <circle cx="163" cy="205" r="8" fill="var(--accent)" className="eye-optic-glow" />
                  <circle cx="163" cy="205" r="3.5" fill="#ffffff" />
                </g>
              </g>

              {/* Right Eye HUD & Optics */}
              <g className="av-eye">
                {/* HUD targeting brackets */}
                <path d="M 222 194 L 218 194 L 218 216 L 222 216" fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.6" />
                <path d="M 252 194 L 256 194 L 256 216 L 252 216" fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.6" />
                {/* Moving Eye Pupil Unit */}
                <g ref={pupilR}>
                  <circle cx="237" cy="205" r="13" fill="rgba(var(--acc-rgb), 0.15)" />
                  <circle cx="237" cy="205" r="8" fill="var(--accent)" className="eye-optic-glow" />
                  <circle cx="237" cy="205" r="3.5" fill="#ffffff" />
                </g>
              </g>

              {/* Lower Visor Mouth / Voice Equalizer Waveform */}
              <g className="av-mouth">
                {/* Dynamic Audio Spectrum Bars (animate intensely when talking) */}
                <g className="voice-spectrum">
                  <rect x="172" y="238" width="3" height="8" rx="1.5" fill="var(--accent)" className="v-bar vb-1" />
                  <rect x="179" y="235" width="3" height="14" rx="1.5" fill="var(--accent)" className="v-bar vb-2" />
                  <rect x="186" y="232" width="3" height="20" rx="1.5" fill="var(--accent)" className="v-bar vb-3" />
                  <rect x="193" y="230" width="3" height="24" rx="1.5" fill="var(--accent2)" className="v-bar vb-4" />
                  <rect x="200" y="228" width="3" height="28" rx="1.5" fill="#ffffff" className="v-bar vb-5" />
                  <rect x="207" y="230" width="3" height="24" rx="1.5" fill="var(--accent2)" className="v-bar vb-6" />
                  <rect x="214" y="232" width="3" height="20" rx="1.5" fill="var(--accent)" className="v-bar vb-7" />
                  <rect x="221" y="235" width="3" height="14" rx="1.5" fill="var(--accent)" className="v-bar vb-8" />
                  <rect x="228" y="238" width="3" height="8" rx="1.5" fill="var(--accent)" className="v-bar vb-9" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>

      {/* Floating Holographic Cyber Workstation (Phase 2: "What I Do") */}
      <g className="av-desk">
        {/* Floating Hologram Code Screens */}
        <g className="av-holo-screens">
          {/* Left Hologram Projection */}
          <g className="holo-card l">
            <rect x="28" y="260" width="118" height="74" rx="6" fill={`url(#holoScreen${uid})`} stroke="var(--accent)" strokeWidth="1" />
            <text x="36" y="278" fill="var(--accent)" fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight="600">
              const dev = &apos;Ayush&apos;;
            </text>
            <text x="36" y="294" fill="var(--accent2)" fontSize="8" fontFamily="'JetBrains Mono', monospace">
              stack: [&apos;Full-Stack&apos;]
            </text>
            <text x="36" y="310" fill="#22c55e" fontSize="8" fontFamily="'JetBrains Mono', monospace">
              status: ONLINE ⚡
            </text>
            <line x1="36" y1="322" x2="136" y2="322" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          </g>

          {/* Right Hologram Projection */}
          <g className="holo-card r">
            <rect x="254" y="250" width="122" height="78" rx="6" fill={`url(#holoScreen${uid})`} stroke="var(--accent2)" strokeWidth="1" />
            <text x="262" y="270" fill="var(--accent2)" fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight="600">
              hardware.connect()
            </text>
            <text x="262" y="286" fill="var(--accent)" fontSize="8" fontFamily="'JetBrains Mono', monospace">
              telecom: &apos;MITS Gwalior&apos;
            </text>
            <text x="262" y="302" fill="var(--text)" fontSize="8" fontFamily="'JetBrains Mono', monospace">
              deploy({`{ latency: 0 }`})
            </text>
            <circle cx="362" cy="268" r="3" fill="#22c55e" />
          </g>
        </g>

        {/* Floating Holographic Terminal Console Base */}
        <polygon
          points="20,422 380,422 350,442 50,442"
          fill="rgba(var(--acc-rgb), 0.12)"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />

        {/* Neon Holographic Touch Keys Matrix */}
        <g stroke="var(--accent)" strokeWidth="1" opacity="0.5">
          <line x1="60" y1="428" x2="340" y2="428" />
          <line x1="75" y1="435" x2="325" y2="435" />
          {[90, 120, 150, 180, 210, 240, 270, 300].map((x) => (
            <line key={x} x1={x} y1="422" x2={x - 8} y2="442" />
          ))}
        </g>

        {/* Cyber Bionic Hands Typing on Hologram Console */}
        <g className="av-typing-hands">
          {/* Left Cyber Hand */}
          <g className="av-hand l">
            <rect x="116" y="404" width="28" height="18" rx="6" fill={plateMid} stroke="#070c18" strokeWidth="1.5" />
            <circle cx="122" cy="413" r="3" fill="var(--accent)" />
            <circle cx="130" cy="413" r="3" fill="var(--accent)" />
            <circle cx="138" cy="413" r="3" fill="var(--accent)" />
          </g>

          {/* Right Cyber Hand */}
          <g className="av-hand r">
            <rect x="256" y="404" width="28" height="18" rx="6" fill={plateMid} stroke="#070c18" strokeWidth="1.5" />
            <circle cx="262" cy="413" r="3" fill="var(--accent)" />
            <circle cx="270" cy="413" r="3" fill="var(--accent)" />
            <circle cx="278" cy="413" r="3" fill="var(--accent)" />
          </g>
        </g>

        {/* Quantum Energy Cooling Capacitor (replaces old coffee mug) */}
        <g className="av-quantum-cell">
          <rect x="328" y="380" width="22" height="38" rx="6" fill="#0b1120" stroke="var(--accent)" strokeWidth="1.5" />
          <rect x="332" y="388" width="14" height="22" rx="3" fill="var(--accent)" opacity="0.6" className="arc-core-pulse" />
          {/* Rising quantum energy wisps */}
          <g className="av-steam">
            <path d="M 335 374 Q 330 364 336 354" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 343 374 Q 348 364 342 354" fill="none" stroke="var(--accent2)" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </svg>
  );
}

/* ================================================================
   🌌 CYBER-COSMIC SCENERY
   - Dynamic laser constellation canvas tracking cursor in real-time
   - 3D perspective cyber horizon grid with infinite vanishing point
   - Glowing nebula celestial clouds & telemetry rings
   ================================================================ */
function Scenery() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf;
    const mouse = { x: -9999, y: -9999, active: false };

    // 60 dynamic energy star nodes
    const COUNT = 60;
    const particles = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particles.length === 0 && width > 0 && height > 0) {
        for (let i = 0; i < COUNT; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height * 0.85,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.6 + 0.8,
            isSec: i % 3 === 0,
          });
        }
      }
    };
    resize();

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    const maxDist = 120;
    const mouseDist = 160;

    const render = () => {
      if (width === 0 || height === 0) {
        raf = requestAnimationFrame(render);
        return;
      }
      ctx.clearRect(0, 0, width, height);

      // Read accent color from computed style
      const style = getComputedStyle(canvas);
      const accRgb = style.getPropertyValue("--acc-rgb").trim() || "124,199,255";
      const acc2Rgb = style.getPropertyValue("--acc2-rgb").trim() || "196,181,253";

      // Update & connect
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        else if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        else if (p.y > height * 0.85) { p.y = height * 0.85; p.vy *= -1; }

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseDist && dist > 0) {
            const force = (1 - dist / mouseDist) * 0.8;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;

            const alpha = (1 - dist / mouseDist) * 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${accRgb}, ${alpha.toFixed(2)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Inter-node laser lines
      ctx.lineWidth = 0.75;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${accRgb}, ${alpha.toFixed(2)})`;
            ctx.stroke();
          }
        }
      }

      // Draw star particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const rgb = p.isSec ? acc2Rgb : accRgb;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${rgb})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="scenery cyber-scenery" aria-hidden="true">
      {/* 3D Cyber Horizon & Cosmic Glow */}
      <svg
        className="cyber-grid-svg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <radialGradient id="nebula1" cx="25%" cy="25%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nebula2" cx="75%" cy="30%" r="55%">
            <stop offset="0%" stopColor="var(--accent2)" stopOpacity="0.2" />
            <stop offset="65%" stopColor="var(--accent2)" stopOpacity="0.03" />
            <stop offset="100%" stopColor="var(--accent2)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="horizonGlow" cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="40%" stopColor="var(--accent2)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--bg)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--bg)" stopOpacity="0" />
            <stop offset="40%" stopColor="var(--accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Nebula cosmic orbs */}
        <circle cx="380" cy="220" r="340" fill="url(#nebula1)" />
        <circle cx="1220" cy="260" r="380" fill="url(#nebula2)" />

        {/* Horizon Glow */}
        <ellipse cx="800" cy="620" rx="750" ry="180" fill="url(#horizonGlow)" />
        <line
          x1="0"
          y1="620"
          x2="1600"
          y2="620"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />

        {/* 3D Perspective Ground Grid (receding to 800, 620) */}
        <g className="cyber-grid-lines" stroke="url(#gridFade)" strokeWidth="1.2">
          {[-700, -500, -320, -160, 0, 160, 320, 500, 700].map((dx, i) => (
            <line
              key={`ray-${i}`}
              x1="800"
              y1="620"
              x2={800 + dx * 2.2}
              y2="920"
            />
          ))}
          {[635, 655, 682, 718, 765, 825, 900].map((y, i) => (
            <line
              key={`rung-${i}`}
              x1="0"
              y1={y}
              x2="1600"
              y2={y}
              strokeOpacity={(i + 1) * 0.12}
            />
          ))}
        </g>

        {/* Subtle Cyber Data telemetry rings in distance */}
        <g opacity="0.25" stroke="var(--accent)">
          <circle
            cx="800"
            cy="380"
            r="280"
            fill="none"
            strokeWidth="1"
            strokeDasharray="6 14"
          />
          <circle
            cx="800"
            cy="380"
            r="360"
            fill="none"
            strokeWidth="0.8"
            strokeDasharray="18 24"
          />
          <circle
            cx="800"
            cy="380"
            r="160"
            fill="none"
            strokeWidth="1.2"
            strokeDasharray="4 8"
          />
        </g>
      </svg>

      {/* Interactive Laser Constellation Canvas */}
      <canvas ref={canvasRef} className="cyber-canvas" />
    </div>
  );
}

/* ================================================================
   ⚡ SECTION BACKGROUND — Cyber matrix wave & quantum energy motes
   ================================================================ */
const rnd = (n) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
const MOTES = Array.from({ length: 24 }, (_, i) => ({
  x: Math.round(rnd(i + 401) * 100),
  y: Math.round(rnd(i + 411) * 100),
  s: 2 + Math.round(rnd(i + 421) * 3),
  d: 5 + Math.round(rnd(i + 431) * 6),
  dl: -Math.round(rnd(i + 441) * 10),
}));

function SectionBg({ image = "" }) {
  if (image) {
    return (
      <div className="sec-bg sec-photo" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" loading="lazy" />
      </div>
    );
  }
  return (
    <div className="sec-bg sec-cyber" aria-hidden="true">
      {/* Sleek cybernetic horizon wave */}
      <svg
        className="sec-grid-svg"
        viewBox="0 0 1600 360"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="secCyberGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          className="sec-wave-1"
          d="M0 260 Q 400 190 800 240 T 1600 220 L 1600 360 L 0 360 Z"
          fill="url(#secCyberGrad)"
        />
        <path
          className="sec-wave-2"
          d="M0 295 Q 400 240 800 280 T 1600 270 L 1600 360 L 0 360 Z"
          fill="var(--bg2)"
          opacity="0.6"
        />
        {/* Cyber perspective grid lines */}
        <line
          x1="0"
          y1="260"
          x2="1600"
          y2="260"
          stroke="var(--accent)"
          strokeOpacity="0.18"
          strokeDasharray="8 6"
        />
        <line
          x1="0"
          y1="300"
          x2="1600"
          y2="300"
          stroke="var(--accent)"
          strokeOpacity="0.25"
          strokeDasharray="12 8"
        />
        <line
          x1="0"
          y1="340"
          x2="1600"
          y2="340"
          stroke="var(--accent)"
          strokeOpacity="0.35"
        />
      </svg>
      {/* Floating Quantum Energy Motes */}
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="sec-quantum-mote"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: `${m.s}px`,
            height: `${m.s}px`,
            animationDuration: `${m.d}s`,
            animationDelay: `${m.dl}s`,
          }}
        />
      ))}
    </div>
  );
}

const noopSubscribe = () => () => {};

/* ---------- Avatar speech (types, pauses, deletes) ---------- */
function useSpeech(lines, start) {
  const [text, setText] = useState("");
  const [talking, setTalking] = useState(false);
  useEffect(() => {
    if (!start) return;
    let li = 0;
    let j = 0;
    let del = false;
    let t;
    const tick = () => {
      const chars = Array.from(lines[li]);
      if (!del) {
        j++;
        setText(chars.slice(0, j).join(""));
        setTalking(true);
        if (j >= chars.length) {
          del = true;
          setTalking(false);
          t = setTimeout(tick, 2200);
          return;
        }
        t = setTimeout(tick, 55);
      } else {
        j = Math.max(0, j - 2);
        setText(chars.slice(0, j).join(""));
        if (j === 0) {
          del = false;
          li = (li + 1) % lines.length;
          t = setTimeout(tick, 350);
          return;
        }
        t = setTimeout(tick, 22);
      }
    };
    t = setTimeout(() => {
      setText("");
      tick();
    }, 700);
    return () => {
      clearTimeout(t);
      setTalking(false);
    };
  }, [lines, start]);
  return { text, talking };
}

/* Avatar interactive unit: isolates speech typing & click spin
   so the entire page doesn't re-render 20 times a second */
function AvatarInteractive({ phase, ready, avatarImage, fullName }) {
  const avInRef = useRef(null);
  const { text: speech, talking } = useSpeech(
    phase === 2 ? SPEECH_WORK : SPEECH_INTRO,
    ready,
  );
  const spin = () => {
    const el = avInRef.current;
    if (!el || el.dataset.spin === "1") return;
    el.dataset.spin = "1";
    setTimeout(() => {
      if (el) el.dataset.spin = "0";
    }, 1100);
  };

  return (
    <div className="av-wrap">
      <div
        className="av-in"
        ref={avInRef}
        onClick={spin}
        title="Click me!"
      >
        <div className="av-glow" />
        {avatarImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="avatar avatar-img"
            src={avatarImage}
            alt={fullName}
          />
        ) : (
          <Avatar talking={talking} />
        )}
        <div className="bubble">
          <span>{speech}</span>
          <i className="caret" />
        </div>
      </div>
    </div>
  );
}

function Rotator({ words }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % words.length), 2600);
    return () => clearInterval(t);
  }, [words]);
  return (
    <div className="rot">
      <span className="rot-ghost" aria-hidden="true">
        {words[(i + 1) % words.length]}
      </span>
      <span key={i} className="rot-word">
        {words[i]}
      </span>
    </div>
  );
}

function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.classList.add("has-cursor");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf;
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        dot.current.classList.add("visible");
        ring.current?.classList.add("visible");
      }
    };
    const over = (e) => {
      const hit =
        e.target.closest &&
        e.target.closest(
          "a, button, .tilt, .wid, .tile, .av-in, input, textarea",
        );
      ring.current?.classList.toggle("hover", !!hit);
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current)
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);
  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}

function TiltCard({ children }) {
  const ref = useRef(null);
  const rectRef = useRef(null);

  const onEnter = () => {
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
  };

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    if (!rectRef.current) rectRef.current = el.getBoundingClientRect();
    const r = rectRef.current;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 7}deg) translateY(-6px)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const onLeave = () => {
    rectRef.current = null;
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className="tilt"
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}

function BigTitle({ label, a, b }) {
  return (
    <Reveal>
      <div className="eyebrow mono">{label}</div>
      <h2 className="big-title">
        {a} <span className="accent">{b}</span>
      </h2>
    </Reveal>
  );
}

function WidCard({ c, open, onOpen }) {
  return (
    <div
      className={`wid${open ? " open" : ""}`}
      onMouseEnter={onOpen}
      onClick={onOpen}
    >
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
      <div className="wid-head">
        <span className="wid-no mono">{c.no}</span>
        <h3>{c.title}</h3>
        <span className="wid-plus">+</span>
      </div>
      <div className="wid-body">
        <div className="wid-inner">
          <p>{c.text}</p>
          <div className="tags">
            {c.tags.map((t) => (
              <span key={t} className="mono">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ABOUT_WORDS = ABOUT.split(" ");
const isHighlight = (w) =>
  HIGHLIGHT.some((h) => w.toLowerCase().startsWith(h.toLowerCase()));

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [greet, setGreet] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [phase, setPhase] = useState(0);
  const [openWid, setOpenWid] = useState(0);
  const [cert, setCert] = useState(null);
  const [copied, setCopied] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [form, setForm] = useState({ name: "", message: "" });
  const sceneRef = useRef(null);
  const progressRef = useRef(null);
  const timelineRef = useRef(null);
  const lineRef = useRef(null);
  const activeRef = useRef("home");
  const scrolledRef = useRef(false);
  const phaseRef = useRef(0);

  const T = THEMES[theme] || THEMES.sky;
  // Year is read on the client only, so prerender doesn't capture the build date
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => "",
  );

  // remembered theme
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const saved = localStorage.getItem("pf-theme-v2");
        if (saved && THEMES[saved]) setTheme(saved);
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    document.body.style.background = T.bg;
  }, [T.bg]);
  const pickTheme = (k) => {
    setTheme(k);
    setPaletteOpen(false);
    try {
      localStorage.setItem("pf-theme-v2", k);
    } catch {}
  };

  // Loader: fast, snappy greeting animation without delaying the page
  useEffect(() => {
    let i = 0;
    const step = 160;
    const iv = setInterval(() => {
      i++;
      if (i < GREETINGS.length) setGreet(i);
      else clearInterval(iv);
    }, step);
    const done = setTimeout(
      () => setLoading(false),
      step * GREETINGS.length + 80,
    );
    return () => {
      clearInterval(iv);
      clearTimeout(done);
    };
  }, []);

  // Scroll story + nav + progress + timeline (60fps rAF throttled & 0 layout thrashing)
  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const top = window.scrollY;

      // GPU-accelerated progress bar update (zero React re-renders)
      if (progressRef.current) {
        const ratio = max > 0 ? top / max : 0;
        progressRef.current.style.transform = `scaleX(${ratio})`;
      }

      const isScrolled = top > 30;
      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }

      let current = "home";
      for (const n of NAV) {
        const el = document.getElementById(n.id);
        if (el && el.getBoundingClientRect().top <= 160) current = n.id;
      }
      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
      }

      const scene = sceneRef.current;
      if (scene) {
        const r = scene.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = total > 0 ? clamp01(-r.top / total) : 0;
        const p1 = smooth(clamp01((p - 0.04) / 0.2));
        const rr = clamp01((p - 0.26) / 0.26);
        const p2 = smooth(clamp01((p - 0.58) / 0.24));
        story.p1 = p1;
        story.p2 = p2;
        scene.style.setProperty("--p1", p1.toFixed(4));
        scene.style.setProperty("--r", rr.toFixed(4));
        scene.style.setProperty("--p2", p2.toFixed(4));
        const ph = p2 > 0.5 ? 2 : p1 > 0.5 ? 1 : 0;
        scene.dataset.phase = String(ph);
        if (ph !== phaseRef.current) {
          phaseRef.current = ph;
          setPhase(ph);
        }
      }

      if (timelineRef.current && lineRef.current) {
        const tr = timelineRef.current.getBoundingClientRect();
        const lp = clamp01((window.innerHeight * 0.75 - tr.top) / tr.height);
        lineRef.current.style.height = `calc(${lp} * (100% - 12px))`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setCert(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Editor save ke baad reload hota hai — scroll wahin se shuru karo
  useEffect(() => {
    try {
      const y = sessionStorage.getItem("pf-scroll");
      if (y) {
        sessionStorage.removeItem("pf-scroll");
        setTimeout(() => window.scrollTo(0, Number(y)), 50);
      }
    } catch {}
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  const sendMail = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Hello from ${form.name || "your portfolio"}`,
    );
    const body = encodeURIComponent(form.message);
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="pf" style={themeVars(T)}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Loader */}
      <div className={`loader ${loading ? "" : "done"}`} aria-hidden={!loading}>
        <span key={greet} className="greet">
          <i />
          {GREETINGS[greet]}
        </span>
      </div>

      <Cursor />
      <MusicPlayer src={MUSIC.src} title={MUSIC.title} />
      <div ref={progressRef} className="progress" />

      {/* Navbar */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#home" className="logo" aria-label="Home">
            {PROFILE.logoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={PROFILE.logoImage}
                alt={PROFILE.fullName || "Ayush Pandey"}
                className="logo-img"
              />
            ) : (
              <>
                {PROFILE.initials}
                <span>.</span>
              </>
            )}
          </a>
          <a href="#home" className="nav-name">
            {PROFILE.fullName || "Ayush Pandey"}
          </a>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            {NAV.filter((n) => n.id !== "home").map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={active === n.id ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {n.label}
              </a>
            ))}
          </div>
          <div className="palette">
            <button
              className="icon-btn"
              aria-label="Change colours"
              onClick={() => setPaletteOpen((o) => !o)}
            >
              <Icon size={19}>{I.palette}</Icon>
            </button>
            {paletteOpen && (
              <div className="palette-pop">
                {["light", "dark"].map((m) => (
                  <div key={m}>
                    <div className="mono palette-title">{m.toUpperCase()}</div>
                    {Object.entries(THEMES)
                      .filter(([, t]) => (t.mode || "dark") === m)
                      .map(([k, t]) => (
                        <button
                          key={k}
                          className={`swatch-row${k === theme ? " on" : ""}`}
                          onClick={() => pickTheme(k)}
                        >
                          <span
                            className="swatch"
                            style={{
                              background: t.accent,
                              boxShadow: `0 0 0 3px ${t.bg3}`,
                            }}
                          />
                          {t.label}
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            className="menu-btn icon-btn"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Icon size={20}>
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </Icon>
          </button>
        </div>
      </nav>

      <div className={`rail ${loading ? "" : "show"}`}>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <GitHubIcon />
        </a>
        <a
          href={PROFILE.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <Icon>{I.linkedin}</Icon>
        </a>
        {PROFILE.instagram && (
          <a
            href={PROFILE.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <Icon>{I.instagram}</Icon>
          </a>
        )}
        <a href={`mailto:${PROFILE.email}`} aria-label="Email">
          <Icon>{I.mail}</Icon>
        </a>
        <span className="rail-line" />
      </div>
      <a
        href={PROFILE.resume}
        download
        className={`resume-fab mono ${loading ? "" : "show"}`}
      >
        RESUME <Icon size={15}>{I.download}</Icon>
      </a>

      <main>
        {/* ============ HERO → ABOUT → WHAT I DO (one scroll story) ============ */}
        <section
          id="home"
          ref={sceneRef}
          className={`scene ${loading ? "" : "ready"}`}
        >
          <div id="about" className="anchor a1" />
          <div id="skills" className="anchor a2" />
          <div className="sticky">
            <EditBar
              groups={["hero", "skills", "music"]}
              onEdit={setEditGroup}
              abs
            />
            <Scenery />
            <div className="h-texts">
              <div className="h-left">
                <p className="h-small">Hello! I&apos;m</p>
                <h1 className="h-name">
                  <span>{PROFILE.firstName}</span>
                  <span className="accent">{PROFILE.lastName}</span>
                </h1>
              </div>
              <div className="h-right">
                <p className="h-small">A Full Stack</p>
                <Rotator words={HERO_WORDS} />
              </div>
            </div>

            <div className="what-title">
              <div className="eyebrow mono">SKILLS</div>
              <h2>
                WHAT
                <br />
                <span className="accent">I DO</span>
              </h2>
            </div>

            <AvatarInteractive
              phase={phase}
              ready={!loading}
              avatarImage={PROFILE.avatarImage}
              fullName={PROFILE.fullName}
            />

            <div className="about-blk">
              <div className="eyebrow mono">ABOUT ME</div>
              <EditBar groups={["about"]} onEdit={setEditGroup} inline />
              <p className="about-text" style={{ "--n": ABOUT_WORDS.length }}>
                {ABOUT_WORDS.map((w, i) => (
                  <span
                    key={i}
                    className={isHighlight(w) ? "hl" : ""}
                    style={{ "--i": i }}
                  >
                    {w}{" "}
                  </span>
                ))}
              </p>
              <div className="about-meta">
                <span>🎓 B.Tech E&amp;TC · MITS Gwalior</span>
                <span>⚡ IEEE Technical Team</span>
                <span>📍 {PROFILE.location}</span>
              </div>
            </div>

            <div className="what-blk">
              {WHAT_I_DO.map((c, i) => (
                <WidCard
                  key={c.no}
                  c={c}
                  open={openWid === i}
                  onOpen={() => setOpenWid(i)}
                />
              ))}
            </div>

            <div className="scroll-cue mono">
              <span className="mouse">
                <i />
              </span>
              SCROLL
            </div>
          </div>
        </section>

        {/* ============ TECH STACK ============ */}
        <div className="scene-wrap">
          <section id="stack" className="section stack-sec">
            <EditBar groups={["stack"]} onEdit={setEditGroup} />
            {/* phone pe "What I Do" cards yahan dikhte hain */}
            <div className="wid-mobile">
              {WHAT_I_DO.map((c) => (
                <Reveal key={c.no}>
                  <WidCard c={c} open onOpen={() => {}} />
                </Reveal>
              ))}
            </div>

            <BigTitle label="TOOLS I USE" a="TECH" b="STACK" />
            <div className="tiles">
              {STACK.map((s, i) => (
                <Reveal key={s.name} style={{ "--d": `${(i % 6) * 0.06}s` }}>
                  <div className="tile">
                    <span className="tile-abbr" title={s.name}>
                      <TechLogo name={s.name || s.abbr} />
                    </span>
                    <span className="tile-name">{s.name}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </div>
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={i}>
                {m} <b>✦</b>
              </span>
            ))}
          </div>
          <div className="marquee-track rev">
            {[...MARQUEE, ...MARQUEE].reverse().map((m, i) => (
              <span key={i}>
                {m} <b>✦</b>
              </span>
            ))}
          </div>
        </div>

        {/* ============ PROJECTS ============ */}
        <div className="scene-wrap">
          <SectionBg image={BACKGROUNDS.work} />
          <section id="work" className="section">
            <EditBar groups={["work"]} onEdit={setEditGroup} />
            <BigTitle label="PROJECTS" a="MY" b="WORK" />
            <div className="projects">
              {PROJECTS.map((p, i) => (
                <Reveal
                  key={p.title}
                  className="proj-wrap"
                  style={{ "--d": `${(i % 2) * 0.12}s` }}
                >
                  <TiltCard>
                    <article className="project">
                      <div className="browser">
                        <div className="b-bar">
                          <i />
                          <i />
                          <i />
                          <span className="mono">
                            {p.live
                              ? p.live
                                  .replace(/^https?:\/\//, "")
                                  .replace(/\/$/, "")
                              : "coming soon"}
                          </span>
                        </div>
                        <div className="b-view">
                          <div className="b-fallback">{p.emoji}</div>
                          {p.live && (
                            <iframe
                              src={p.live}
                              title={`${p.title} preview`}
                              loading="lazy"
                              tabIndex={-1}
                              aria-hidden="true"
                              sandbox="allow-scripts allow-same-origin"
                            />
                          )}
                        </div>
                      </div>
                      <div className="project-body">
                        <div className="p-top">
                          <span className="p-no mono">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="p-type mono">{p.type}</span>
                        </div>
                        <h3>{p.title}</h3>
                        <p>{p.description}</p>
                        <ul>
                          {p.points.map((pt) => (
                            <li key={pt}>{pt}</li>
                          ))}
                        </ul>
                        <div className="tags">
                          {p.tags.map((t) => (
                            <span key={t} className="mono">
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="project-links">
                          {p.live && (
                            <a
                              className="link-btn primary"
                              href={p.live}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Icon size={16}>{I.external}</Icon> Live Demo
                            </a>
                          )}
                          {p.code && (
                            <a
                              className="link-btn"
                              href={p.code}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Icon size={16}>{I.code}</Icon> Source Code
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
            <Reveal className="center">
              <a
                className="btn"
                href={PROFILE.github}
                target="_blank"
                rel="noreferrer"
              >
                <GitHubIcon /> More on GitHub
              </a>
            </Reveal>
          </section>
        </div>

        {/* ============ JOURNEY ============ */}
        <div className="scene-wrap">
          <SectionBg image={BACKGROUNDS.journey} />
          <section id="journey" className="section">
            <EditBar groups={["journey"]} onEdit={setEditGroup} />
            <BigTitle label="EXPERIENCE & ACTIVITIES" a="MY" b="JOURNEY" />
            <div className="timeline" ref={timelineRef}>
              <div className="timeline-line" ref={lineRef} />
              {ACTIVITIES.map((a) => (
                <Reveal key={a.title} className="t-item">
                  <div className="t-dot" />
                  <div className="t-card">
                    <div className="t-top">
                      <span className="t-date mono">{a.date}</span>
                      <span className="t-type mono">{a.type}</span>
                    </div>
                    <h3>{a.title}</h3>
                    <div className="t-org">{a.org}</div>
                    <p>{a.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </div>

        {/* ============ CERTIFICATES ============ */}
        <div className="scene-wrap">
          <SectionBg image={BACKGROUNDS.certificates} />
          <section id="certificates" className="section">
            <EditBar groups={["certificates"]} onEdit={setEditGroup} />
            <BigTitle
              label="CERTIFICATIONS & TRAINING"
              a="MY"
              b="CERTIFICATES"
            />
            {CERTIFICATES.length ? (
              <div className="certs">
                {CERTIFICATES.map((c, i) => (
                  <Reveal key={c.title} style={{ "--d": `${(i % 3) * 0.1}s` }}>
                    <button className="cert" onClick={() => setCert(c)}>
                      <div className="cert-thumb">
                        {c.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.image} alt={c.title} loading="lazy" />
                        ) : (
                          <Icon size={46}>{I.award}</Icon>
                        )}
                      </div>
                      <div className="cert-body">
                        <h3>{c.title}</h3>
                        <p>{c.issuer}</p>
                        <span className="cert-date mono">{c.date}</span>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal className="cert-empty">
                New certificates coming soon.
              </Reveal>
            )}
          </section>
        </div>

        {/* ============ CONTACT ============ */}
        <div className="scene-wrap">
          <SectionBg image={BACKGROUNDS.contact} />
          <section id="contact" className="section">
            <EditBar groups={["contact"]} onEdit={setEditGroup} />
            <BigTitle label="CONTACT" a="LET'S" b="TALK" />
            <div className="contact">
              <Reveal>
                <p className="contact-lead">
                  I&apos;m actively looking for placement and internship
                  opportunities in web development. Have an opening or an idea?
                  My inbox is always open.
                </p>
                <button className="mail-big" onClick={copyEmail}>
                  <span>{PROFILE.email}</span>
                  <Icon size={22}>{I.copy}</Icon>
                </button>
                <div className="contact-list">
                  {PROFILE.phone && (
                    <a
                      className="c-row"
                      href={`tel:${PROFILE.phone.replace(/\s/g, "")}`}
                    >
                      <Icon>{I.phone}</Icon>
                      <span>{PROFILE.phone}</span>
                    </a>
                  )}
                  <a
                    className="c-row"
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon>{I.linkedin}</Icon>
                    <span>LinkedIn</span>
                  </a>
                  <a
                    className="c-row"
                    href={PROFILE.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GitHubIcon />
                    <span>GitHub</span>
                  </a>
                  {PROFILE.instagram && (
                    <a
                      className="c-row"
                      href={PROFILE.instagram}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon>{I.instagram}</Icon>
                      <span>Instagram</span>
                    </a>
                  )}
                </div>
              </Reveal>
              <Reveal
                as="form"
                className="form"
                style={{ "--d": ".15s" }}
                onSubmit={sendMail}
              >
                <div className="field">
                  <label htmlFor="name">Your name</label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="msg">Message</label>
                  <textarea
                    id="msg"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Tell me about the role or project…"
                    required
                  />
                </div>
                <button className="btn primary full" type="submit">
                  <Icon>{I.send}</Icon> Send Message
                </button>
              </Reveal>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <span>
          Designed &amp; built by <b>{PROFILE.fullName}</b>
        </span>
        <span className="mono">© {year}</span>
      </footer>

      {copied && <div className="toast">Email copied ✓</div>}

      {editGroup && (
        <PortfolioEditor group={editGroup} onClose={() => setEditGroup(null)} />
      )}

      {cert && (
        <div
          className="modal"
          onClick={() => setCert(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setCert(null)}
              aria-label="Close"
            >
              ×
            </button>
            {cert.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cert.image} alt={cert.title} />
            ) : (
              <div className="modal-art">
                <Icon size={72}>{I.award}</Icon>
              </div>
            )}
            <div className="modal-info">
              <h3>{cert.title}</h3>
              <p>{cert.issuer}</p>
              <span className="cert-date mono">{cert.date}</span>
              {cert.link && (
                <a
                  className="btn primary"
                  href={cert.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon>{I.external}</Icon> View Credential
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   🎨 STYLES
   ================================================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

.pf{
  --bg:#f6f8fc; --bg2:#ffffff; --bg3:#eaf0fa;
  --accent:#7cc7ff; --acc-rgb:124,199,255; --accent2:#c4b5fd; --acc2-rgb:196,181,253; --accent-ink:#04172b;
  --line:rgba(20,24,36,.09); --line2:rgba(20,24,36,.18); --fg-rgb:20,24,36; --tint:rgba(20,24,36,.03); --glass:rgba(255,255,255,.78);
  --text:#eceef4; --muted:#8e94a8;
}
html{scroll-behavior:smooth}
body{margin:0;background:#f6f8fc}
.pf{position:relative;min-height:100vh;color:var(--text);font-family:'Archivo',system-ui,sans-serif;overflow-x:clip;-webkit-font-smoothing:antialiased;
  background:radial-gradient(1100px 600px at 50% -10%,rgba(var(--acc-rgb),.08),transparent 60%),var(--bg);transition:background-color .5s}
.pf *,.pf *::before,.pf *::after{box-sizing:border-box}
.pf a{color:inherit;text-decoration:none}
.pf ::selection{background:var(--accent);color:var(--accent-ink)}
.mono{font-family:'JetBrains Mono',monospace}
.accent{color:var(--accent)}
.center{text-align:center;margin-top:48px}

/* loader */
.loader{position:fixed;inset:0;z-index:200;background:var(--bg);display:grid;place-items:center;transition:transform .6s cubic-bezier(.76,0,.24,1);will-change:transform}
.loader.done{transform:translateY(-100%);pointer-events:none}
.greet{display:flex;align-items:center;gap:14px;font-size:clamp(36px,6vw,64px);font-weight:700;animation:greet .25s ease}
.greet i{width:12px;height:12px;border-radius:50%;background:var(--accent);box-shadow:0 0 18px var(--accent)}
@keyframes greet{from{opacity:0;transform:translateY(14px)}}

/* cursor */
.cursor-dot,.cursor-ring{position:fixed;top:0;left:0;pointer-events:none;z-index:300;border-radius:50%;opacity:0;will-change:transform}
.cursor-dot{width:8px;height:8px;margin:-4px 0 0 -4px;background:var(--accent2);box-shadow:0 0 14px var(--accent2);transition:opacity .3s}
.cursor-ring{width:38px;height:38px;margin:-19px 0 0 -19px;border:1.5px solid rgba(var(--acc2-rgb),.55);transition:width .25s,height .25s,margin .25s,background .25s,border-color .25s,opacity .3s}
.cursor-dot.visible,.cursor-ring.visible{opacity:1}
.cursor-ring.hover{width:64px;height:64px;margin:-32px 0 0 -32px;background:rgba(var(--acc-rgb),.08);border-color:var(--accent)}
html.has-cursor .pf,html.has-cursor .pf *{cursor:none!important}

.progress{position:fixed;top:0;left:0;width:100%;height:2px;background:var(--accent);z-index:60;box-shadow:0 0 10px var(--accent);transform-origin:left;transform:scaleX(0);will-change:transform}

/* nav */
.nav{position:fixed;top:0;left:0;right:0;z-index:50;border-bottom:1px solid transparent;transition:background .3s,border-color .3s}
.nav.scrolled{background:var(--glass);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom-color:var(--line)}
.nav-inner{position:relative;max-width:1280px;margin:0 auto;padding:22px 32px;display:flex;align-items:center;gap:20px;transition:padding .3s}
.nav.scrolled .nav-inner{padding-top:14px;padding-bottom:14px}
.logo{display:inline-flex;align-items:center;font-weight:900;font-size:24px;letter-spacing:.5px;text-decoration:none}
.logo span{color:var(--accent)}
.logo-img{width:42px;height:42px;border-radius:50%;object-fit:cover;object-position:center top;border:2px solid var(--line2);transition:border-color .25s,transform .25s,box-shadow .25s;box-shadow:0 2px 8px rgba(0,0,0,.08)}
.logo:hover .logo-img{border-color:var(--accent);transform:scale(1.06);box-shadow:0 0 16px rgba(var(--acc-rgb),.4)}
.nav-name{font-size:15px;font-weight:700;color:var(--text);letter-spacing:-.2px;text-decoration:none;transition:color .2s;white-space:nowrap}
.nav-name:hover{color:var(--accent)}
.nav-links{display:flex;gap:2px;margin-left:auto}
.nav-links a{position:relative;padding:8px 12px;font-size:13px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted);transition:color .2s}
.nav-links a::after{content:"";position:absolute;left:12px;right:12px;bottom:2px;height:2px;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .3s}
.nav-links a:hover,.nav-links a.active{color:var(--text)}
.nav-links a.active::after{transform:scaleX(1)}
.icon-btn{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;border:1px solid var(--line2);background:var(--tint);color:var(--text);cursor:pointer;transition:border-color .25s,color .25s}
.icon-btn:hover{border-color:var(--accent);color:var(--accent)}
.menu-btn{display:none}
.palette{position:relative}
.palette-pop{position:absolute;right:0;top:calc(100% + 10px);width:210px;max-height:75vh;overflow:auto;padding:10px;border-radius:16px;border:1px solid var(--line2);background:var(--bg2);box-shadow:0 20px 50px -20px rgba(0,0,0,.45);animation:pop .25s cubic-bezier(.2,.9,.3,1.3)}
@keyframes pop{from{opacity:0;transform:translateY(-6px) scale(.96)}}
.palette-title{font-size:10.5px;letter-spacing:2px;color:var(--muted);padding:4px 8px 8px}
.swatch-row{display:flex;align-items:center;gap:12px;width:100%;padding:9px 8px;border:0;border-radius:10px;background:none;color:var(--text);font-family:inherit;font-size:14px;font-weight:600;text-align:left;cursor:pointer}
.swatch-row:hover,.swatch-row.on{background:rgba(var(--fg-rgb),.06)}
.swatch{width:18px;height:18px;border-radius:50%;flex-shrink:0}

/* rail + resume */
.rail{position:fixed;left:28px;bottom:0;z-index:40;display:flex;flex-direction:column;align-items:center;gap:18px;opacity:0;transform:translateY(30px);transition:all .8s .6s}
.rail.show{opacity:1;transform:none}
.rail a{color:var(--muted);transition:color .2s,transform .2s}
.rail a:hover{color:var(--accent);transform:translateY(-3px)}
.rail-line{width:1px;height:90px;background:var(--line2)}
.resume-fab{position:fixed;right:24px;bottom:24px;z-index:40;display:inline-flex;align-items:center;gap:8px;padding:11px 16px;border-radius:999px;border:1px solid var(--line2);background:var(--glass);backdrop-filter:blur(8px);font-size:12px;letter-spacing:2px;opacity:0;transform:translateY(20px);transition:opacity .8s .7s,transform .8s .7s,border-color .25s,color .25s}
.resume-fab.show{opacity:1;transform:none}
.resume-fab:hover{border-color:var(--accent);color:var(--accent)}

/* sections */
.section{max-width:1200px;margin:0 auto;padding:120px 24px}
.eyebrow{color:var(--accent);font-size:12.5px;letter-spacing:3px}
.big-title{font-size:clamp(46px,8vw,120px);font-weight:900;line-height:.9;letter-spacing:-2px;margin:14px 0 56px;text-transform:uppercase}
.reveal{opacity:0;transform:translateY(40px);transition:opacity .9s ease,transform .9s cubic-bezier(.2,.8,.2,1);transition-delay:var(--d,0s)}
.reveal.in{opacity:1;transform:none}
.tags{display:flex;flex-wrap:wrap;gap:8px}
.tags span{font-size:11.5px;padding:5px 10px;border-radius:6px;background:rgba(var(--acc-rgb),.08);color:var(--accent);border:1px solid rgba(var(--acc-rgb),.2)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:14px 24px;border-radius:12px;font-weight:700;font-size:15px;border:1px solid var(--line2);background:var(--tint);color:var(--text);transition:transform .25s,box-shadow .25s,border-color .25s;font-family:inherit;cursor:pointer}
.btn:hover{transform:translateY(-3px);border-color:var(--accent)}
.btn.primary{background:var(--accent);color:var(--accent-ink);border:none;box-shadow:0 12px 30px -14px rgba(var(--acc-rgb),.7)}
.btn.primary:hover{box-shadow:0 18px 40px -12px rgba(var(--acc-rgb),.8)}
.btn.full{width:100%}
.caret{display:inline-block;width:2px;height:1em;background:currentColor;margin-left:3px;vertical-align:-2px;animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}

/* ===== scroll story ===== */
.scene{--p1:0;--r:0;--p2:0;position:relative;height:420vh}
.anchor{position:absolute;height:1px;width:1px}
.anchor.a1{top:160vh}
.anchor.a2{top:296vh}
.sticky{position:sticky;top:0;height:100vh;overflow:hidden}
.h-left,.h-right{position:absolute;top:50%;will-change:transform,opacity}
.h-left{left:8vw;transform:translateY(-50%) translateX(calc(var(--p1) * -160px));opacity:calc(1 - var(--p1) * 1.8)}
.h-right{left:71vw;transform:translateY(-35%) translateX(calc(var(--p1) * 160px));opacity:calc(1 - var(--p1) * 1.8)}
.h-left>*,.h-right>*{opacity:0;transform:translateY(30px)}
.scene.ready .h-left>*,.scene.ready .h-right>*{animation:rise .9s cubic-bezier(.2,.8,.2,1) forwards}
.scene.ready .h-left>:nth-child(2){animation-delay:.12s}
.scene.ready .h-right>*{animation-delay:.3s}
.scene.ready .h-right>:nth-child(2){animation-delay:.42s}
@keyframes rise{to{opacity:1;transform:none}}
.h-small{margin:0 0 10px;font-size:clamp(18px,1.6vw,24px);color:var(--muted);font-weight:500}
.h-name{margin:0;display:flex;flex-direction:column;font-size:clamp(44px,5.6vw,92px);font-weight:900;line-height:.92;letter-spacing:-1.5px}
.rot{position:relative;font-size:clamp(32px,3.8vw,64px);font-weight:900;letter-spacing:-1px;line-height:1;perspective:600px}
.rot-ghost{position:absolute;left:0;top:.92em;color:transparent;-webkit-text-stroke:1px rgba(var(--fg-rgb),.22);white-space:nowrap}
.rot-word{display:inline-block;white-space:nowrap;animation:flip .7s cubic-bezier(.2,.8,.2,1)}
@keyframes flip{from{opacity:0;transform:translateY(55%) rotateX(-75deg)}}

.av-wrap{position:absolute;left:50%;bottom:0;height:min(76vh,720px);aspect-ratio:400/470;perspective:1200px;transform-origin:bottom center;
  transform:translateX(calc(-50% - (var(--p1) - var(--p2)) * 25vw)) scale(calc(1 - var(--p2) * .14));will-change:transform}
.av-in{position:relative;height:100%;opacity:0;transform:translateY(35%) rotateY(-80deg);transform-style:preserve-3d;cursor:pointer;will-change:transform,opacity}
.scene.ready .av-in{animation:avIn 1.4s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes avIn{to{opacity:1;transform:none}}
.av-in[data-spin="1"] .avatar{animation:spin 1.05s cubic-bezier(.5,0,.25,1)}
@keyframes spin{to{transform:rotateY(360deg)}}
.av-glow{position:absolute;left:8%;right:8%;top:22%;bottom:-6%;border-radius:50%;background:radial-gradient(circle at 50% 45%,rgba(var(--acc-rgb),.34),rgba(var(--acc-rgb),.08) 45%,transparent 70%);filter:blur(10px);will-change:transform,opacity;animation:glowPulse 5s ease-in-out infinite}
@keyframes glowPulse{50%{opacity:.7;transform:scale(1.05)}}
.avatar{position:relative;width:100%;height:100%;display:block}
.avatar-img{object-fit:contain;object-position:bottom;animation:floaty 5s ease-in-out infinite}
@keyframes floaty{50%{transform:translateY(-10px)}}

.bubble{position:absolute;top:8%;left:66%;min-height:44px;padding:12px 18px;border-radius:18px 18px 18px 4px;background:var(--bubble-bg);color:var(--bubble-fg);font-weight:700;font-size:clamp(13px,1.1vw,16px);white-space:nowrap;box-shadow:0 14px 40px -12px rgba(0,0,0,.6);opacity:0;transform:scale(.6);transform-origin:bottom left;transition:opacity .3s,transform .5s cubic-bezier(.2,.9,.3,1.4)}
.scene.ready .bubble{opacity:max(calc(1 - var(--p1) * 3), calc(var(--p2) * 3 - 2));transform:none;transition-delay:.8s}
.bubble .caret{background:var(--bubble-fg)}

.about-blk{position:absolute;right:7vw;top:50%;width:min(580px,44vw);opacity:calc(var(--p1) - var(--p2) * 1.8);transform:translateY(calc(-50% + (1 - var(--p1)) * 60px - var(--p2) * 60px));pointer-events:none}
.about-text{margin:16px 0 26px;font-size:clamp(20px,1.9vw,28px);line-height:1.45;font-weight:600;letter-spacing:-.2px}
.about-text span{opacity:clamp(.14, calc(var(--r) * (var(--n) + 6) - var(--i)), 1);transition:opacity .2s}
.about-text span.hl{color:var(--accent)}
.about-meta{display:flex;flex-wrap:wrap;gap:10px;opacity:clamp(0, calc(var(--r) * 3 - 2), 1)}
.about-meta span{padding:8px 14px;border-radius:999px;border:1px solid var(--line2);font-size:13.5px;color:var(--muted)}

.what-title{position:absolute;left:8vw;top:50%;opacity:calc(var(--p2) * 1.6 - .6);transform:translateY(-50%) translateX(calc((1 - var(--p2)) * -90px));pointer-events:none}
.what-title h2{margin:12px 0 0;font-size:clamp(56px,7vw,116px);font-weight:900;line-height:.9;letter-spacing:-2px}
.what-blk{position:absolute;right:5vw;top:50%;width:min(420px,29vw);display:grid;gap:14px;opacity:calc(var(--p2) * 1.6 - .6);transform:translateY(-50%) translateX(calc((1 - var(--p2)) * 90px));pointer-events:none}
.scene[data-phase="2"] .what-blk{pointer-events:auto}
@media (min-width:901px){
  .scene[data-phase="2"] .bubble{left:auto;right:64%;border-radius:18px 18px 4px 18px;transform-origin:bottom right}
}

.scroll-cue{position:absolute;left:8vw;bottom:34px;display:flex;align-items:center;gap:12px;font-size:11px;letter-spacing:3px;color:var(--muted);opacity:calc(1 - var(--p1) * 4)}
.mouse{position:relative;width:22px;height:34px;border:2px solid var(--line2);border-radius:12px}
.mouse i{position:absolute;left:50%;top:6px;width:3px;height:7px;margin-left:-1.5px;border-radius:2px;background:var(--accent);animation:wheel 1.6s infinite}
@keyframes wheel{to{opacity:0;transform:translateY(12px)}}

/* cyber-bot avatar parts */
.av-acc-fill{fill:var(--accent)}
.av-acc-stroke{stroke:var(--accent)}
.av-acc2-fill{fill:var(--accent2)}
.av-acc2-stroke{stroke:var(--accent2)}
.av-body{transform-box:view-box;transform-origin:200px 470px;animation:breathe 4s ease-in-out infinite}
@keyframes breathe{50%{transform:translateY(-4px)}}
.avatar[data-working="1"] .av-body{animation:typebob .45s ease-in-out infinite alternate}
@keyframes typebob{to{transform:translateY(2.5px)}}
.av-chest{fill:var(--accent);font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:1px;opacity:.9}
.arc-gear{transform-box:fill-box;transform-origin:center;animation:arcSpin 8s linear infinite}
@keyframes arcSpin{to{transform:rotate(360deg)}}
.arc-core-pulse{animation:arcPulse 2.4s ease-in-out infinite alternate}
@keyframes arcPulse{0%{opacity:.75;transform:scale(.94)}100%{opacity:1;transform:scale(1.06)}}
.drone-companion{transform-box:fill-box;transform-origin:center;animation:droneBob 3.6s ease-in-out infinite alternate}
@keyframes droneBob{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(-12px) rotate(4deg)}}
.drone-eye{animation:droneBlink 2.8s ease-in-out infinite alternate}
@keyframes droneBlink{0%,75%{opacity:1}85%{opacity:.2}95%,100%{opacity:1}}
.av-eye{transform-box:fill-box;transform-origin:center;animation:blinkEye 5s infinite}
@keyframes blinkEye{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.08)}}
.eye-optic-glow{filter:drop-shadow(0 0 6px var(--accent))}
.av-mouth{transform-box:fill-box;transform-origin:center}
.voice-spectrum{transform-box:fill-box;transform-origin:center bottom}
.voice-spectrum .v-bar{transform-box:fill-box;transform-origin:center bottom;opacity:.45}
.talking .voice-spectrum .v-bar{animation:audioWave .3s ease-in-out infinite alternate}
.talking .v-bar.vb-1{animation-delay:.02s}
.talking .v-bar.vb-2{animation-delay:.08s}
.talking .v-bar.vb-3{animation-delay:.15s}
.talking .v-bar.vb-4{animation-delay:.22s}
.talking .v-bar.vb-5{animation-delay:.05s}
.talking .v-bar.vb-6{animation-delay:.18s}
.talking .v-bar.vb-7{animation-delay:.11s}
.talking .v-bar.vb-8{animation-delay:.25s}
.talking .v-bar.vb-9{animation-delay:.07s}
@keyframes audioWave{from{transform:scaleY(.35);opacity:.4}to{transform:scaleY(1.4);opacity:1}}
.av-arm-wrap{opacity:clamp(0, calc(1 - var(--p2) * 2.5), 1)}
.av-arm{transform-box:view-box;transform-origin:316px 370px;animation:armWave 7s ease-in-out 2.6s infinite}
@keyframes armWave{0%,34%,100%{transform:rotate(0)}4%{transform:rotate(7deg)}9%{transform:rotate(-4deg)}14%{transform:rotate(7deg)}19%{transform:rotate(-4deg)}24%{transform:rotate(5deg)}29%{transform:rotate(0)}}
.av-hand-w{transform-box:view-box;transform-origin:366px 270px;animation:handWave 7s ease-in-out 2.6s infinite}
@keyframes handWave{0%,34%,100%{transform:rotate(0)}4%{transform:rotate(14deg)}9%{transform:rotate(-12deg)}14%{transform:rotate(14deg)}19%{transform:rotate(-12deg)}24%{transform:rotate(10deg)}29%{transform:rotate(0)}}
.av-desk{opacity:clamp(0, calc(var(--p2) * 2), 1);transform:translateY(calc((1 - var(--p2)) * 170px))}
.holo-card{transform-box:fill-box;transform-origin:center;animation:holoFloat 4s ease-in-out infinite alternate}
.holo-card.r{animation-delay:-2s}
@keyframes holoFloat{0%{transform:translateY(0)}100%{transform:translateY(-6px)}}
.av-hand{transform-box:fill-box;animation:typing .2s ease-in-out infinite alternate}
.av-hand.r{animation-delay:.1s}
@keyframes typing{to{transform:translateY(-2.5px)}}
.av-steam path{opacity:0;transform-box:fill-box;animation:steam 2.4s ease-in-out infinite}
.av-steam path:nth-child(2){animation-delay:.8s}
@keyframes steam{0%{opacity:0;transform:translateY(6px)}40%{opacity:.6}100%{opacity:0;transform:translateY(-22px)}}

/* ===== what i do cards ===== */
.wid{position:relative;padding:20px 24px;border:1px dashed var(--line2);background:var(--glass);backdrop-filter:blur(6px);cursor:pointer;transition:background .35s,border-color .35s}
.wid.open{background:rgba(var(--acc-rgb),.06);border-color:rgba(var(--acc-rgb),.4)}
.corner{position:absolute;width:12px;height:12px;border:2px solid var(--accent);transition:width .35s,height .35s}
.corner.tl{top:-2px;left:-2px;border-right:0;border-bottom:0}
.corner.tr{top:-2px;right:-2px;border-left:0;border-bottom:0}
.corner.bl{bottom:-2px;left:-2px;border-right:0;border-top:0}
.corner.br{bottom:-2px;right:-2px;border-left:0;border-top:0}
.wid.open .corner{width:24px;height:24px}
.wid-head{display:flex;align-items:center;gap:16px}
.wid-no{color:var(--accent);font-size:13px}
.wid h3{flex:1;margin:0;font-size:clamp(17px,1.6vw,22px);font-weight:800;letter-spacing:-.2px;text-transform:uppercase}
.wid-plus{font-size:26px;line-height:1;color:var(--muted);transition:transform .35s,color .35s}
.wid.open .wid-plus{transform:rotate(45deg);color:var(--accent)}
.wid-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s ease}
.wid.open .wid-body{grid-template-rows:1fr}
.wid-inner{overflow:hidden}
.wid-inner p{margin:14px 0;color:var(--muted);line-height:1.65;font-size:15px}
.wid-mobile{display:none}

/* ===== tech stack ===== */
.stack-sec{padding-top:80px;padding-bottom:70px}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}
.tile{height:100%;display:flex;flex-direction:column;align-items:flex-start;gap:16px;padding:22px 20px;border-radius:18px;border:1px solid var(--line);background:var(--bg2);transition:transform .3s,border-color .3s,box-shadow .3s}
.tile:hover{transform:translateY(-6px);border-color:rgba(var(--acc-rgb),.45);box-shadow:0 20px 40px -22px rgba(var(--acc-rgb),.6)}
.tile-abbr{width:56px;height:56px;min-width:56px;display:grid;place-items:center;border-radius:14px;background:var(--bg3);border:1px solid var(--line2);box-shadow:0 2px 8px rgba(0,0,0,.04);transition:transform .4s cubic-bezier(.2,.9,.3,1.4),border-color .3s,box-shadow .3s}
.tile:hover .tile-abbr{transform:rotate(-6deg) scale(1.12);border-color:var(--accent);box-shadow:0 8px 24px -6px rgba(var(--acc-rgb),.4)}
.tile-abbr svg{display:block}
.tile-name{font-weight:700;font-size:15.5px}
.marquee{position:relative;overflow:hidden;padding:24px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
.marquee-track{display:flex;gap:40px;width:max-content;animation:marquee 30s linear infinite;font-size:clamp(22px,3vw,40px);font-weight:900;text-transform:uppercase;letter-spacing:-.5px;white-space:nowrap}
.marquee-track.rev{animation-direction:reverse;margin-top:10px;color:transparent;-webkit-text-stroke:1px rgba(var(--fg-rgb),.25)}
.marquee-track b{color:var(--accent);-webkit-text-stroke:0;margin-left:40px}
@keyframes marquee{to{transform:translateX(-50%)}}

/* ===== projects ===== */
.projects{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px}
.proj-wrap{display:flex;min-width:0}
.tilt{position:relative;width:100%;transition:transform .2s ease-out;transform-style:preserve-3d}
.project{position:relative;height:100%;display:flex;flex-direction:column;border:1px solid var(--line);border-radius:20px;background:var(--bg2);overflow:hidden;transition:border-color .3s,box-shadow .3s}
.tilt:hover .project{border-color:rgba(var(--acc-rgb),.4);box-shadow:0 30px 60px -30px rgba(var(--acc-rgb),.45)}
.project::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(420px circle at var(--mx,50%) var(--my,50%),rgba(var(--acc-rgb),.1),transparent 45%);opacity:0;transition:opacity .3s}
.tilt:hover .project::after{opacity:1}
.browser{margin:14px 14px 0;border-radius:12px;overflow:hidden;border:1px solid var(--line);background:var(--bg3)}
.b-bar{display:flex;align-items:center;gap:6px;padding:9px 12px;border-bottom:1px solid var(--line)}
.b-bar i{width:9px;height:9px;border-radius:50%;background:rgba(var(--fg-rgb),.16)}
.b-bar span{margin-left:8px;min-width:0;font-size:11px;color:var(--muted);padding:3px 10px;border-radius:6px;background:rgba(var(--fg-rgb),.05);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.b-view{position:relative;aspect-ratio:16/10;overflow:hidden}
.b-fallback{position:absolute;inset:0;display:grid;place-items:center;font-size:56px;background:radial-gradient(circle at 50% 60%,rgba(var(--acc-rgb),.16),transparent 65%)}
.b-view iframe{position:absolute;top:0;left:0;width:200%;height:200%;border:0;transform:scale(.5);transform-origin:0 0;pointer-events:none}
.project-body{padding:22px 24px 26px;display:flex;flex-direction:column;gap:12px;flex:1}
.p-top{display:flex;justify-content:space-between;align-items:center;gap:10px}
.p-no{font-size:13px;color:var(--accent)}
.p-type{font-size:11px;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase}
.project h3{margin:0;font-size:24px;font-weight:800;letter-spacing:-.3px}
.project p{margin:0;color:var(--muted);line-height:1.7;font-size:15px}
.project ul{margin:0;padding-left:18px;color:var(--muted);font-size:14px;line-height:1.75}
.project-links{display:flex;flex-wrap:wrap;gap:12px;margin-top:auto;padding-top:6px}
.link-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:10px;font-size:14px;font-weight:700;border:1px solid var(--line2);transition:all .25s}
.link-btn:hover{border-color:var(--accent);transform:translateY(-2px)}
.link-btn.primary{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}

/* ===== timeline ===== */
.timeline{position:relative;max-width:860px;margin:0 auto;padding-left:44px}
.timeline::before{content:"";position:absolute;left:10px;top:6px;bottom:6px;width:2px;background:var(--line)}
.timeline-line{position:absolute;left:10px;top:6px;width:2px;height:0;background:var(--accent);box-shadow:0 0 12px var(--accent)}
.t-item{position:relative;margin-bottom:22px}
.t-item:last-child{margin-bottom:0}
.t-dot{position:absolute;left:-40px;top:28px;width:14px;height:14px;border-radius:50%;background:var(--bg);border:2px solid var(--accent);transition:background .4s .3s}
.t-item.in .t-dot{background:var(--accent);animation:pulse 2.2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(var(--acc-rgb),.55)}100%{box-shadow:0 0 0 14px rgba(var(--acc-rgb),0)}}
.t-card{padding:24px 26px;border:1px solid var(--line);border-radius:16px;background:var(--bg2);transition:transform .3s,border-color .3s}
.t-card:hover{transform:translateX(6px);border-color:rgba(var(--acc-rgb),.4)}
.t-top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.t-date{color:var(--accent);font-size:12.5px}
.t-type{font-size:10.5px;letter-spacing:1.5px;text-transform:uppercase;padding:4px 10px;border-radius:999px;border:1px solid var(--line2);color:var(--muted)}
.t-card h3{margin:10px 0 4px;font-size:20px;font-weight:800}
.t-org{font-size:14px;color:var(--text);opacity:.7}
.t-card p{color:var(--muted);margin:10px 0 0;line-height:1.7;font-size:15px}

/* ===== certificates ===== */
.certs{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:22px}
.cert{display:block;width:100%;text-align:left;padding:0;border-radius:18px;border:1px solid var(--line);background:var(--bg2);overflow:hidden;color:inherit;font-family:inherit;cursor:pointer;transition:transform .3s,border-color .3s,box-shadow .3s}
.cert:hover{transform:translateY(-6px);border-color:rgba(var(--acc-rgb),.45);box-shadow:0 22px 50px -24px rgba(var(--acc-rgb),.5)}
.cert-thumb{position:relative;aspect-ratio:16/10;display:grid;place-items:center;color:var(--accent);background:linear-gradient(135deg,rgba(var(--acc-rgb),.14),rgba(var(--acc2-rgb),.1));overflow:hidden}
.cert-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.cert:hover .cert-thumb img{transform:scale(1.06)}
.cert-thumb::after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);transform:skewX(-20deg);transition:left .8s}
.cert:hover .cert-thumb::after{left:130%}
.cert-body{padding:18px 20px 20px}
.cert-body h3{margin:0 0 6px;font-size:17px;font-weight:800}
.cert-body p{margin:0;color:var(--muted);font-size:13.5px;line-height:1.5}
.cert-date{display:inline-block;margin-top:10px;font-size:12px;color:var(--accent2)}
.cert-empty{padding:30px;text-align:center;color:var(--muted);border:1px dashed var(--line2);border-radius:16px}

.modal{position:fixed;inset:0;z-index:150;background:rgba(3,4,8,.82);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:grid;place-items:center;padding:20px;animation:fade .3s ease}
@keyframes fade{from{opacity:0}}
.modal-box{position:relative;width:min(760px,100%);max-height:90vh;overflow:auto;background:var(--bg2);border:1px solid var(--line);border-radius:20px;animation:zoom .4s cubic-bezier(.2,.9,.3,1.2)}
@keyframes zoom{from{transform:scale(.88);opacity:0}}
.modal-box img{width:100%;display:block}
.modal-art{height:220px;display:grid;place-items:center;color:var(--accent);background:linear-gradient(135deg,rgba(var(--acc-rgb),.14),rgba(var(--acc2-rgb),.1))}
.modal-close{position:absolute;top:12px;right:12px;width:40px;height:40px;border-radius:50%;border:1px solid var(--line);background:rgba(0,0,0,.55);color:#fff;font-size:22px;line-height:1;cursor:pointer;z-index:2}
.modal-info{padding:22px 26px 28px}
.modal-info h3{margin:0 0 6px;font-size:22px}
.modal-info p{margin:0;color:var(--muted)}
.modal-info .btn{margin-top:18px}

/* ===== contact ===== */
.contact{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}
.contact-lead{margin:0 0 28px;color:var(--muted);font-size:17px;line-height:1.75;max-width:480px}
.mail-big{display:inline-flex;align-items:center;gap:14px;max-width:100%;padding:0 0 8px;border:0;border-bottom:2px solid var(--line2);background:none;color:var(--text);font-family:inherit;font-size:clamp(18px,2.6vw,32px);font-weight:800;cursor:pointer;transition:color .25s,border-color .25s}
.mail-big span{overflow:hidden;text-overflow:ellipsis}
.mail-big:hover{color:var(--accent);border-color:var(--accent)}
.contact-list{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
.c-row{display:inline-flex;align-items:center;gap:10px;padding:11px 16px;border-radius:999px;border:1px solid var(--line2);font-size:14px;color:var(--muted);transition:all .25s}
.c-row:hover{color:var(--accent);border-color:var(--accent);transform:translateY(-2px)}
.form{padding:30px;border:1px solid var(--line);border-radius:20px;background:var(--bg2)}
.field{display:grid;gap:8px;margin-bottom:18px}
.field label{font-size:13px;color:var(--muted)}
.field input,.field textarea{width:100%;padding:14px 16px;border-radius:12px;border:1px solid var(--line);background:var(--tint);color:var(--text);font-family:inherit;font-size:15px;outline:none;transition:border-color .25s,box-shadow .25s}
.field input:focus,.field textarea:focus{border-color:var(--accent);box-shadow:0 0 0 4px rgba(var(--acc-rgb),.14)}
.field textarea{min-height:150px;resize:vertical}

.footer{max-width:1200px;margin:0 auto;padding:36px 24px 90px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;color:var(--muted);font-size:14px;border-top:1px solid var(--line)}
.footer b{color:var(--text)}
.toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:160;padding:12px 20px;border-radius:12px;background:var(--accent);color:var(--accent-ink);font-weight:700;font-size:14px;animation:toast .35s cubic-bezier(.2,.9,.3,1.3)}
@keyframes toast{from{opacity:0;transform:translate(-50%,20px)}}


/* cyber-cosmic scenery */
.scenery{position:absolute;inset:0;pointer-events:none;contain:paint}
.cyber-scenery{overflow:hidden}
.cyber-grid-svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.cyber-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}
.scenery::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 30%,color-mix(in srgb,var(--bg) 82%,transparent) 58%);opacity:calc(var(--p1) - var(--p2))}

/* section landscapes */
.scene-wrap{position:relative;isolation:isolate;overflow:hidden;background:linear-gradient(180deg,var(--bg) 0%,var(--sky-soft) 70%)}
.scene-wrap>.section{padding-bottom:120px}
.sec-bg{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden;background:radial-gradient(120% 80% at 50% 0%,var(--sky-soft) 0%,var(--bg) 70%)}
.sec-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}
.sec-photo::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,color-mix(in srgb,var(--bg) 82%,transparent) 0%,color-mix(in srgb,var(--bg) 70%,transparent) 60%,var(--bg) 100%)}
.sec-grid-svg{position:absolute;left:0;bottom:0;width:100%;height:clamp(160px,22vw,320px)}
.sec-quantum-mote{position:absolute;border-radius:50%;background:var(--accent);box-shadow:0 0 10px var(--accent);opacity:0;animation:quantumMote 6s ease-in-out infinite}
@keyframes quantumMote{0%,100%{opacity:.15;transform:translate(0,0)}50%{opacity:.95;transform:translate(14px,-24px) scale(1.3)}}
@media (prefers-reduced-motion: reduce){.sec-quantum-mote{animation:none;opacity:.5}}

/* light-mode helpers */
.project,.tile,.t-card,.cert,.form,.palette-pop{box-shadow:var(--card-shadow)}
.av-desk-top{fill:var(--desk-top)}
.av-desk-front{fill:var(--desk-front)}
.av-steam path{stroke:var(--steam)}
.bubble{border:1px solid var(--line)}

/* ===== responsive ===== */
@media (max-width:1100px){
  .rail{display:none}
}
@media (max-width:540px){
  .nav-name{display:none}
}
@media (max-width:900px){
  .menu-btn{display:grid}
  .nav-inner{padding:18px 16px;gap:10px}
  .nav.scrolled .nav-inner{padding:12px 16px}
  .palette{margin-left:auto}
  .nav-links{position:absolute;top:100%;left:16px;right:16px;flex-direction:column;background:var(--bg2);border:1px solid var(--line);border-radius:16px;padding:10px;opacity:0;transform:translateY(-10px);pointer-events:none;transition:all .25s}
  .nav-links.open{opacity:1;transform:none;pointer-events:auto}
  .nav-links a{padding:13px 14px}
  .nav-links a::after{display:none}

  .h-texts{position:absolute;top:92px;left:16px;right:16px;display:flex;flex-direction:column;gap:22px}
  .h-left,.h-right{position:static;transform:translateY(calc(var(--p1) * -40px))}
  .h-name{font-size:clamp(44px,12vw,72px)}
  .rot{font-size:clamp(32px,9vw,56px);margin-top:.2em}
  .av-wrap{height:min(52vh,520px);transform:translateX(-50%) translateY(calc((var(--p1) - var(--p2)) * 6vh)) scale(calc(1 - (var(--p1) - var(--p2)) * .12));opacity:calc(1 - (var(--p1) - var(--p2)) * .75)}
  .bubble{left:58%;top:2%;font-size:13px;padding:10px 14px;min-height:38px}
  .about-blk{left:16px;right:16px;width:auto;top:92px;transform:translateY(calc((1 - var(--p1)) * 50px - var(--p2) * 50px))}
  .about-text{font-size:clamp(19px,5vw,24px)}
  .what-title{left:16px;top:96px;transform:translateY(calc((1 - var(--p2)) * 40px))}
  .what-title h2{font-size:clamp(56px,16vw,96px)}
  .what-blk{display:none}
  .scroll-cue{display:none}
  .wid-mobile{display:grid;gap:14px;margin-bottom:90px}

  .contact{grid-template-columns:1fr;gap:36px}
  .projects{grid-template-columns:minmax(0,1fr)}
  .tiles{grid-template-columns:repeat(2,1fr)}
}
@media (max-width:600px){
  .section{padding:90px 16px}
  .stack-sec{padding-top:60px}
  .big-title{letter-spacing:-1px;margin-bottom:40px}
  .wid{padding:18px}
  .tile{padding:18px 16px}
  .form{padding:22px}
  .timeline{padding-left:34px}
  .t-dot{left:-30px}
  .t-card{padding:20px}
  .resume-fab{right:16px;bottom:16px;padding:10px 14px}
}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .pf *,.pf *::before,.pf *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}
`;
