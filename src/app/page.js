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
    const t0 = performance.now();
    const onMove = (e) => {
      const el = svgRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      tx = Math.max(
        -1,
        Math.min(
          1,
          (e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5),
        ),
      );
      ty = Math.max(
        -1,
        Math.min(
          1,
          (e.clientY - (r.top + r.height * 0.42)) / (window.innerHeight * 0.5),
        ),
      );
    };
    const set = (ref, v) =>
      ref.current && ref.current.setAttribute("transform", v);
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
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const skin = `url(#skin${uid})`;
  const hood = `url(#hood${uid})`;
  const hairFill = `url(#hairg${uid})`;
  const hair = "#16100c";
  const shade = "#9a5f3a";

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 470"
      className={`avatar${talking ? " talking" : ""}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`skin${uid}`} cx="0.42" cy="0.38" r="0.75">
          <stop offset="0" stopColor="#e2ab80" />
          <stop offset="1" stopColor="#b5774b" />
        </radialGradient>
        <linearGradient id={`hood${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#283044" />
          <stop offset="1" stopColor="#151a26" />
        </linearGradient>
        <linearGradient id={`hairg${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2018" />
          <stop offset="1" stopColor={hair} />
        </linearGradient>
        <linearGradient id={`lid${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2d3549" />
          <stop offset="1" stopColor="#1a2030" />
        </linearGradient>
        <clipPath id={`eL${uid}`}>
          <ellipse cx="163" cy="206" rx="21" ry="23" />
        </clipPath>
        <clipPath id={`eR${uid}`}>
          <ellipse cx="237" cy="206" rx="21" ry="23" />
        </clipPath>
      </defs>

      <g className="av-body">
        {/* hoodie */}
        <path
          d="M50 470 C 54 390 112 336 200 336 C 288 336 346 390 350 470 Z"
          fill={hood}
        />
        <g ref={collarRef}>
          <path
            d="M200 336 C 160 336 136 342 128 350 C 146 398 254 398 272 350 C 264 342 240 336 200 336 Z"
            fill="#0a0d14"
            opacity=".6"
          />
        </g>
        {/* neck */}
        <path
          d="M174 280 L 174 338 Q 200 364 226 338 L 226 280 Z"
          fill={shade}
        />
        <g ref={chestRef}>
          <path
            className="av-acc-stroke"
            d="M180 372 L 175 420"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            className="av-acc-stroke"
            d="M220 372 L 225 420"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle className="av-acc-fill" cx="175" cy="424" r="4.5" />
          <circle className="av-acc-fill" cx="225" cy="424" r="4.5" />
          <text x="200" y="455" textAnchor="middle" className="av-chest">
            {"</>"}
          </text>
        </g>

        {/* waving arm (fades out when he starts working) */}
        <g className="av-arm-wrap">
          <g className="av-arm">
            <path
              d="M292 372 C 314 344 330 316 338 286 L 370 294 C 364 330 348 364 324 394 Z"
              fill={hood}
              stroke="#0a0d14"
              strokeWidth="2"
            />
            <path d="M336 290 L 371 299 L 375 284 L 340 275 Z" fill="#0f131c" />
            <ellipse
              cx="334"
              cy="256"
              rx="9"
              ry="15"
              transform="rotate(-35 334 256)"
              fill={skin}
            />
            <rect x="339" y="216" width="11" height="32" rx="5.5" fill={skin} />
            <rect x="351" y="207" width="11" height="34" rx="5.5" fill={skin} />
            <rect x="363" y="208" width="11" height="34" rx="5.5" fill={skin} />
            <rect x="374" y="217" width="10" height="30" rx="5" fill={skin} />
            <ellipse cx="358" cy="254" rx="23" ry="26" fill={skin} />
          </g>
        </g>

        {/* head */}
        <g ref={headRef}>
          <g ref={earLRef}>
            <ellipse cx="116" cy="218" rx="17" ry="25" fill={skin} />
            <ellipse
              cx="118"
              cy="219"
              rx="8"
              ry="13"
              fill={shade}
              opacity=".5"
            />
          </g>
          <g ref={earRRef}>
            <ellipse cx="284" cy="218" rx="17" ry="25" fill={skin} />
            <ellipse
              cx="282"
              cy="219"
              rx="8"
              ry="13"
              fill={shade}
              opacity=".5"
            />
          </g>
          <g ref={faceRef}>
            <ellipse cx="200" cy="208" rx="86" ry="100" fill={skin} />
          </g>

          <g ref={featRef}>
            <ellipse
              cx="148"
              cy="250"
              rx="15"
              ry="8"
              fill="#e3735a"
              opacity=".22"
            />
            <ellipse
              cx="252"
              cy="250"
              rx="15"
              ry="8"
              fill="#e3735a"
              opacity=".22"
            />

            <g className="av-brows">
              <path
                d="M140 170 Q 162 154 186 166"
                fill="none"
                stroke={hair}
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M214 166 Q 238 154 260 170"
                fill="none"
                stroke={hair}
                strokeWidth="8"
                strokeLinecap="round"
              />
            </g>

            <g className="av-eye">
              <ellipse cx="163" cy="206" rx="21" ry="23" fill="#fff" />
              <g clipPath={`url(#eL${uid})`}>
                <g ref={pupilL}>
                  <circle cx="165" cy="209" r="12.5" fill="#3b2415" />
                  <circle cx="165" cy="209" r="6.5" fill="#0b0705" />
                  <circle cx="160.5" cy="204" r="3.6" fill="#fff" />
                </g>
              </g>
              <path
                d="M142 206 Q 163 160 184 206"
                fill="none"
                stroke={hair}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
            <g className="av-eye">
              <ellipse cx="237" cy="206" rx="21" ry="23" fill="#fff" />
              <g clipPath={`url(#eR${uid})`}>
                <g ref={pupilR}>
                  <circle cx="235" cy="209" r="12.5" fill="#3b2415" />
                  <circle cx="235" cy="209" r="6.5" fill="#0b0705" />
                  <circle cx="230.5" cy="204" r="3.6" fill="#fff" />
                </g>
              </g>
              <path
                d="M216 206 Q 237 160 258 206"
                fill="none"
                stroke={hair}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>

            <path
              d="M195 222 Q 191 238 200 240 Q 206 240 207 236"
              fill="none"
              stroke={shade}
              strokeWidth="4"
              strokeLinecap="round"
            />

            <g className="av-mouth">
              <path
                d="M170 258 Q 200 292 230 258 Q 200 270 170 258 Z"
                fill="#3d1a12"
              />
              <path
                d="M178 262 Q 200 269 222 262 L 219 268 Q 200 275 181 268 Z"
                fill="#fff"
              />
              <path
                d="M187 277 Q 200 284 213 277 Q 200 280 187 277 Z"
                fill="#e0776b"
              />
            </g>
          </g>

          <g ref={hairRef}>
            <path
              d="M112 222 C 102 150 132 102 190 96 C 248 90 292 120 292 178 C 292 198 290 212 287 222 C 282 192 268 170 250 156 C 230 172 192 176 162 162 C 142 174 122 194 112 222 Z"
              fill={hairFill}
            />
          </g>
          <g ref={quiffRef}>
            <path
              d="M146 118 C 154 78 214 58 256 80 C 278 92 290 112 286 132 C 266 110 232 100 200 108 C 180 112 162 122 146 118 Z"
              fill={hairFill}
            />
            <path
              d="M178 92 C 200 80 232 82 252 96"
              fill="none"
              stroke="#3b2c21"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </g>
      </g>

      {/* desk + laptop (slides up when he starts working) */}
      <g className="av-desk">
        <g className="av-code">
          <text x="66" y="300">
            {"</>"}
          </text>
          <text x="292" y="286">
            {"{ }"}
          </text>
          <text x="44" y="372">
            {"( )"}
          </text>
        </g>
        <path d="M92 426 C 96 404 108 398 126 404 L 134 426 Z" fill={hood} />
        <ellipse
          className="av-hand l"
          cx="130"
          cy="412"
          rx="15"
          ry="9"
          fill={skin}
        />
        <path d="M308 426 C 304 404 292 398 274 404 L 266 426 Z" fill={hood} />
        <ellipse
          className="av-hand r"
          cx="270"
          cy="412"
          rx="15"
          ry="9"
          fill={skin}
        />
        <path
          d="M124 322 Q 124 314 132 314 L 268 314 Q 276 314 276 322 L 282 422 L 118 422 Z"
          fill={`url(#lid${uid})`}
        />
        <circle
          className="av-logo av-acc-fill"
          cx="200"
          cy="368"
          r="24"
          opacity=".16"
        />
        <circle className="av-logo av-acc-fill" cx="200" cy="368" r="10" />
        <rect
          className="av-desk-top"
          x="0"
          y="420"
          width="400"
          height="10"
          rx="3"
          fill="#262d3d"
        />
        <rect
          className="av-desk-front"
          x="0"
          y="430"
          width="400"
          height="40"
          fill="#121722"
        />
        <rect
          className="av-acc2-fill"
          x="312"
          y="384"
          width="30"
          height="36"
          rx="5"
        />
        <path
          className="av-acc2-stroke"
          d="M342 392 q 13 0 13 10 q 0 10 -13 10"
          fill="none"
          strokeWidth="5"
        />
        <g className="av-steam">
          <path
            d="M321 376 q -5 -8 0 -16 q 5 -8 0 -16"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M333 376 q -5 -8 0 -16 q 5 -8 0 -16"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}

/* ================================================================
   🏡 NATURE SCENE behind the hero — sky, sun/moon, clouds, birds,
   hills, trees and a cosy little house (smoke + cat)
   ================================================================ */
const rnd = (n) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
const STARS = Array.from({ length: 45 }, (_, i) => [
  Math.round(rnd(i + 1) * 1600),
  Math.round(rnd(i + 101) * 430) + 15,
  (i % 3) * 0.6 + 0.8,
]);
const FLOWERS = Array.from({ length: 22 }, (_, i) => [
  40 + i * 72 + (i % 3) * 14,
  822 + ((i * 37) % 56),
  ["#f9a8c4", "#fde68a", "#ffffff", "#c4b5fd"][i % 4],
]);
const PINES = [
  [250, 648, 1],
  [292, 656, 0.8],
  [880, 640, 0.9],
  [925, 632, 1.1],
  [968, 642, 0.8],
  [1180, 640, 0.9],
];

function Scenery() {
  return (
    <div className="scenery" aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="sk1" />
            <stop offset="0.8" className="sk2" />
          </linearGradient>
          <g id="sc-cloud">
            <ellipse cx="0" cy="0" rx="78" ry="26" />
            <circle cx="-34" cy="-14" r="28" />
            <circle cx="10" cy="-26" r="36" />
            <circle cx="48" cy="-10" r="24" />
          </g>
        </defs>

        <rect width="1600" height="900" fill="url(#sc-sky)" />

        <g className="sc-stars">
          {STARS.map(([x, y, r], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              style={{ animationDelay: `${(i % 5) * 0.7}s` }}
            />
          ))}
        </g>

        <g className="sc-sun">
          <circle className="glow" cx="1250" cy="165" r="100" />
          <circle className="glow" cx="1250" cy="165" r="78" />
          <circle className="core" cx="1250" cy="165" r="60" />
        </g>

        <g className="sc-clouds">
          <g className="cloud" style={{ "--dur": "120s", "--delay": "-30s" }}>
            <use href="#sc-cloud" transform="translate(0 150) scale(1.35)" />
          </g>
          <g className="cloud" style={{ "--dur": "95s", "--delay": "-70s" }}>
            <use href="#sc-cloud" transform="translate(0 260) scale(0.9)" />
          </g>
          <g className="cloud" style={{ "--dur": "140s", "--delay": "-100s" }}>
            <use href="#sc-cloud" transform="translate(0 95) scale(1)" />
          </g>
          <g className="cloud" style={{ "--dur": "105s", "--delay": "-5s" }}>
            <use href="#sc-cloud" transform="translate(0 330) scale(0.7)" />
          </g>
        </g>

        <g className="birds">
          <g className="bird b1">
            <path d="M0 0 q 10 -9 20 0 q 10 -9 20 0" />
          </g>
          <g className="bird b2">
            <path d="M0 0 q 8 -7 16 0 q 8 -7 16 0" />
          </g>
          <g className="bird b3">
            <path d="M0 0 q 7 -6 14 0 q 7 -6 14 0" />
          </g>
        </g>

        {/* hills */}
        <g className="ly-far">
          <path
            className="far"
            d="M-200 615 L0 600 C 200 520 380 540 560 580 C 760 625 900 520 1100 540 C 1300 560 1450 500 1600 530 C 1680 545 1740 540 1800 530 L1800 900 L-200 900 Z"
          />
        </g>
        <g className="ly-mid">
          <path
            className="mid"
            d="M-200 690 L0 680 C 180 620 360 640 520 660 C 700 690 860 610 1060 630 C 1260 650 1420 600 1600 620 C 1680 628 1740 622 1800 618 L1800 900 L-200 900 Z"
          />
          {PINES.map(([x, y, k], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${k})`}>
              <path
                className="pine"
                d="M0 -58 L 20 -14 L 10 -14 L 26 12 L -26 12 L -10 -14 L -20 -14 Z"
              />
              <rect x="-4" y="12" width="8" height="12" fill="#7a5538" />
            </g>
          ))}
        </g>

        {/* cosy house */}
        <g className="ly-house">
          <g className="house">
            <circle className="smoke s1" cx="1471" cy="574" r="12" />
            <circle className="smoke s2" cx="1471" cy="574" r="12" />
            <circle className="smoke s3" cx="1471" cy="574" r="12" />
            <rect x="1460" y="586" width="22" height="52" fill="#b9a58a" />
            <rect
              x="1455"
              y="580"
              width="32"
              height="9"
              rx="2"
              fill="#9c886e"
            />
            <rect x="1338" y="645" width="164" height="127" fill="#efe1c6" />
            <rect
              x="1346"
              y="742"
              width="26"
              height="12"
              rx="4"
              fill="#e1cfae"
            />
            <rect
              x="1470"
              y="722"
              width="22"
              height="11"
              rx="4"
              fill="#e1cfae"
            />
            <rect
              x="1348"
              y="652"
              width="18"
              height="9"
              rx="3"
              fill="#e1cfae"
            />
            <path d="M1318 652 L1420 570 L1522 652 Z" fill="#5d6677" />
            <path
              d="M1318 652 L1420 570 L1522 652"
              fill="none"
              stroke="#454d5c"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <circle
              className="win"
              cx="1420"
              cy="622"
              r="12"
              stroke="#8a6a4f"
              strokeWidth="4"
            />
            <rect
              className="win"
              x="1354"
              y="672"
              width="36"
              height="32"
              rx="3"
              stroke="#8a6a4f"
              strokeWidth="4"
            />
            <path
              d="M1372 672 V704 M1354 688 H1390"
              stroke="#8a6a4f"
              strokeWidth="3"
            />
            <rect
              className="win"
              x="1450"
              y="672"
              width="36"
              height="32"
              rx="3"
              stroke="#8a6a4f"
              strokeWidth="4"
            />
            <path
              d="M1468 672 V704 M1450 688 H1486"
              stroke="#8a6a4f"
              strokeWidth="3"
            />
            <path d="M1404 772 V722 a16 16 0 0 1 32 0 V772 Z" fill="#c9443a" />
            <circle cx="1429" cy="748" r="2.6" fill="#f3d27a" />
            <rect
              x="1396"
              y="770"
              width="48"
              height="7"
              rx="3"
              fill="#cdbb9c"
            />
            {/* lamp post */}
            <rect x="1288" y="676" width="6" height="98" fill="#3f4654" />
            <rect
              x="1281"
              y="664"
              width="20"
              height="16"
              rx="4"
              fill="#3f4654"
            />
            <circle className="lamp" cx="1291" cy="674" r="22" />
            <rect
              x="1285"
              y="668"
              width="12"
              height="9"
              rx="2"
              fill="#ffe7a3"
            />
            {/* bushes */}
            <circle className="bush" cx="1338" cy="770" r="20" />
            <circle className="bush" cx="1362" cy="776" r="16" />
            <circle className="bush" cx="1500" cy="772" r="18" />
            {/* cat */}
            <g className="cat">
              <path
                className="cat-tail"
                d="M1556 768 C 1580 762 1582 740 1570 731"
                fill="none"
                stroke="#f0a55b"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <ellipse cx="1545" cy="754" rx="16" ry="20" fill="#f0a55b" />
              <ellipse cx="1541" cy="758" rx="7" ry="11" fill="#fff4e6" />
              <circle cx="1539" cy="728" r="13" fill="#f0a55b" />
              <path
                d="M1528 721 L1530 706 L1539 716 Z M1541 716 L1549 706 L1551 721 Z"
                fill="#f0a55b"
              />
              <circle cx="1535" cy="727" r="1.8" fill="#2b1d12" />
              <circle cx="1544" cy="727" r="1.8" fill="#2b1d12" />
            </g>
          </g>
        </g>

        <g className="ly-near">
          <path
            className="near"
            d="M-200 785 L0 780 C 240 740 480 760 700 775 C 940 792 1180 745 1400 755 C 1500 760 1560 750 1600 752 L1800 750 L1800 900 L-200 900 Z"
          />
          {FLOWERS.map(([x, y, c], i) => (
            <g key={i}>
              <path d={`M${x} ${y} v12`} stroke="#4f8f4a" strokeWidth="2" />
              <circle cx={x} cy={y} r="4.5" fill={c} />
            </g>
          ))}
        </g>

        {/* big tree on the left */}
        <g className="ly-tree">
          <rect x="108" y="640" width="24" height="150" rx="6" fill="#86603f" />
          <g className="tree-top">
            <circle className="t2" cx="70" cy="640" r="52" />
            <circle className="t2" cx="176" cy="636" r="54" />
            <circle className="t1" cx="120" cy="598" r="72" />
            <circle className="t1" cx="88" cy="566" r="40" />
            <circle className="t1" cx="158" cy="572" r="38" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* ================================================================
   🌿 SECTION BACKGROUND — har section ke peeche nature scene
   layered pahadiyan + girte hue patte + chamakte jugnu.
   Colours theme se aate hain (light: green · dark: night forest)
   ================================================================ */
const LEAVES = Array.from({ length: 14 }, (_, i) => ({
  x: Math.round(rnd(i + 301) * 96),
  y: Math.round(rnd(i + 311) * 70),
  s: 0.7 + rnd(i + 321) * 0.8,
  d: 12 + Math.round(rnd(i + 331) * 10),
  dl: -Math.round(rnd(i + 341) * 18),
  r: Math.round(rnd(i + 351) * 360),
  c: i % 3 === 0 ? "var(--accent)" : "var(--tree1)",
}));
const MOTES = Array.from({ length: 20 }, (_, i) => ({
  x: Math.round(rnd(i + 401) * 100),
  y: Math.round(rnd(i + 411) * 100),
  s: 2 + Math.round(rnd(i + 421) * 3),
  d: 5 + Math.round(rnd(i + 431) * 6),
  dl: -Math.round(rnd(i + 441) * 10),
}));

function SectionBg({ image = "" }) {
  // Photo set hai to wahi dikhao (overlay ke saath, taaki text padhne mein aaye)
  if (image) {
    return (
      <div className="sec-bg sec-photo" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" loading="lazy" />
      </div>
    );
  }
  return (
    <div className="sec-bg" aria-hidden="true">
      <svg
        className="sec-hills"
        viewBox="0 0 1600 360"
        preserveAspectRatio="none"
      >
        <path
          className="sec-h3"
          d="M0 220 C 200 150 380 170 560 210 C 760 255 900 150 1100 180 C 1300 210 1460 150 1600 190 L1600 360 L0 360 Z"
        />
        <path
          className="sec-h2"
          d="M0 262 C 220 200 420 240 640 270 C 860 300 1040 220 1260 252 C 1380 268 1500 240 1600 250 L1600 360 L0 360 Z"
        />
        <path
          className="sec-h1"
          d="M0 312 C 260 282 520 302 780 318 C 1040 334 1300 298 1600 312 L1600 360 L0 360 Z"
        />
      </svg>
      {LEAVES.map((l, i) => (
        <svg
          key={i}
          className="sec-leaf"
          viewBox="-20 -20 40 40"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            width: `${18 * l.s}px`,
            height: `${18 * l.s}px`,
            color: l.c,
            animationDuration: `${l.d}s`,
            animationDelay: `${l.dl}s`,
            "--r": `${l.r}deg`,
          }}
        >
          <path
            d="M0 -16 C 12 -8 12 8 0 16 C -12 8 -12 -8 0 -16 Z"
            fill="currentColor"
          />
          <path d="M0 -14 L0 14" stroke="rgba(0,0,0,.18)" strokeWidth="1" />
        </svg>
      ))}
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="sec-mote"
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
        dot.current.style.transform = `translate(${x}px, ${y}px)`;
        dot.current.classList.add("visible");
        ring.current.classList.add("visible");
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
        ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
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
  const onMove = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 7}deg) translateY(-6px)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    ref.current.style.transform = "";
  };
  return (
    <div ref={ref} className="tilt" onMouseMove={onMove} onMouseLeave={onLeave}>
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
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [openWid, setOpenWid] = useState(0);
  const [cert, setCert] = useState(null);
  const [copied, setCopied] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [form, setForm] = useState({ name: "", message: "" });
  const sceneRef = useRef(null);
  const avInRef = useRef(null);
  const timelineRef = useRef(null);
  const lineRef = useRef(null);
  const { text: speech, talking } = useSpeech(
    phase === 2 ? SPEECH_WORK : SPEECH_INTRO,
    !loading,
  );
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

  // Loader
  useEffect(() => {
    let i = 0;
    const step = 300;
    const iv = setInterval(() => {
      i++;
      if (i < GREETINGS.length) setGreet(i);
      else clearInterval(iv);
    }, step);
    const done = setTimeout(
      () => setLoading(false),
      step * GREETINGS.length + 250,
    );
    return () => {
      clearInterval(iv);
      clearTimeout(done);
    };
  }, []);

  // Scroll story + nav + progress + timeline
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const top = window.scrollY;
      setProgress(max > 0 ? (top / max) * 100 : 0);
      setScrolled(top > 30);

      let current = "home";
      for (const n of NAV) {
        const el = document.getElementById(n.id);
        if (el && el.getBoundingClientRect().top <= 160) current = n.id;
      }
      setActive(current);

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
        setPhase(ph);
      }

      if (timelineRef.current && lineRef.current) {
        const tr = timelineRef.current.getBoundingClientRect();
        const lp = clamp01((window.innerHeight * 0.75 - tr.top) / tr.height);
        lineRef.current.style.height = `calc(${lp} * (100% - 12px))`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
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

  const spin = () => {
    const el = avInRef.current;
    if (!el || el.dataset.spin === "1") return;
    el.dataset.spin = "1";
    setTimeout(() => {
      el.dataset.spin = "0";
    }, 1100);
  };

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
      <div className="progress" style={{ width: `${progress}%` }} />

      {/* Navbar */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#home" className="logo">
            {PROFILE.initials}
            <span>.</span>
          </a>
          <a href={`mailto:${PROFILE.email}`} className="nav-mail mono">
            {PROFILE.email}
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

            <div className="av-wrap">
              <div
                className="av-in"
                ref={avInRef}
                onClick={spin}
                title="Click me!"
              >
                <div className="av-glow" />
                {PROFILE.avatarImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="avatar avatar-img"
                    src={PROFILE.avatarImage}
                    alt={PROFILE.fullName}
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
                    <span className="tile-abbr mono">{s.abbr}</span>
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
.loader{position:fixed;inset:0;z-index:200;background:var(--bg);display:grid;place-items:center;transition:transform .9s cubic-bezier(.76,0,.24,1)}
.loader.done{transform:translateY(-100%)}
.greet{display:flex;align-items:center;gap:14px;font-size:clamp(36px,6vw,64px);font-weight:700;animation:greet .3s ease}
.greet i{width:12px;height:12px;border-radius:50%;background:var(--accent);box-shadow:0 0 18px var(--accent)}
@keyframes greet{from{opacity:0;transform:translateY(14px)}}

/* cursor */
.cursor-dot,.cursor-ring{position:fixed;top:0;left:0;pointer-events:none;z-index:300;border-radius:50%;opacity:0}
.cursor-dot{width:8px;height:8px;margin:-4px 0 0 -4px;background:var(--accent2);box-shadow:0 0 14px var(--accent2);transition:opacity .3s}
.cursor-ring{width:38px;height:38px;margin:-19px 0 0 -19px;border:1.5px solid rgba(var(--acc2-rgb),.55);transition:width .25s,height .25s,margin .25s,background .25s,border-color .25s,opacity .3s}
.cursor-dot.visible,.cursor-ring.visible{opacity:1}
.cursor-ring.hover{width:64px;height:64px;margin:-32px 0 0 -32px;background:rgba(var(--acc-rgb),.08);border-color:var(--accent)}
html.has-cursor .pf,html.has-cursor .pf *{cursor:none!important}

.progress{position:fixed;top:0;left:0;height:2px;background:var(--accent);z-index:60;box-shadow:0 0 10px var(--accent)}

/* nav */
.nav{position:fixed;top:0;left:0;right:0;z-index:50;border-bottom:1px solid transparent;transition:background .3s,border-color .3s}
.nav.scrolled{background:var(--glass);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom-color:var(--line)}
.nav-inner{position:relative;max-width:1280px;margin:0 auto;padding:22px 32px;display:flex;align-items:center;gap:20px;transition:padding .3s}
.nav.scrolled .nav-inner{padding-top:14px;padding-bottom:14px}
.logo{font-weight:900;font-size:24px;letter-spacing:.5px}
.logo span{color:var(--accent)}
.nav-mail{font-size:12.5px;color:var(--muted);transition:color .2s}
.nav-mail:hover{color:var(--accent)}
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
.av-in{position:relative;height:100%;opacity:0;transform:translateY(35%) rotateY(-80deg);transform-style:preserve-3d;cursor:pointer}
.scene.ready .av-in{animation:avIn 1.4s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes avIn{to{opacity:1;transform:none}}
.av-in[data-spin="1"] .avatar{animation:spin 1.05s cubic-bezier(.5,0,.25,1)}
@keyframes spin{to{transform:rotateY(360deg)}}
.av-glow{position:absolute;left:8%;right:8%;top:22%;bottom:-6%;border-radius:50%;background:radial-gradient(circle at 50% 45%,rgba(var(--acc-rgb),.34),rgba(var(--acc-rgb),.08) 45%,transparent 70%);filter:blur(10px);animation:glowPulse 5s ease-in-out infinite}
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

/* avatar parts */
.av-acc-fill{fill:var(--accent)}
.av-acc-stroke{stroke:var(--accent)}
.av-acc2-fill{fill:var(--accent2)}
.av-acc2-stroke{stroke:var(--accent2)}
.av-body{transform-box:view-box;transform-origin:200px 470px;animation:breathe 4s ease-in-out infinite}
@keyframes breathe{50%{transform:translateY(-4px)}}
.avatar[data-working="1"] .av-body{animation:typebob .45s ease-in-out infinite alternate}
@keyframes typebob{to{transform:translateY(2.5px)}}
.av-chest{fill:var(--accent);font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:600;opacity:.85}
.av-eye{transform-box:fill-box;transform-origin:center;animation:blinkEye 5s infinite}
@keyframes blinkEye{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.08)}}
.av-mouth{transform-box:fill-box;transform-origin:50% 25%}
.talking .av-mouth{animation:talk .2s ease-in-out infinite alternate}
@keyframes talk{from{transform:scaleY(.6) scaleX(.94)}to{transform:scaleY(1.3)}}
.av-brows{transform-box:fill-box}
.talking .av-brows{animation:brow .5s ease-in-out infinite alternate}
@keyframes brow{to{transform:translateY(-3px)}}
.av-arm-wrap{opacity:clamp(0, calc(1 - var(--p2) * 2.5), 1)}
.av-arm{transform-box:view-box;transform-origin:318px 388px;animation:wave 7s ease-in-out 2.6s infinite}
@keyframes wave{0%,34%,100%{transform:rotate(0)}4%{transform:rotate(16deg)}9%{transform:rotate(-8deg)}14%{transform:rotate(16deg)}19%{transform:rotate(-8deg)}24%{transform:rotate(12deg)}29%{transform:rotate(0)}}
.av-desk{opacity:clamp(0, calc(var(--p2) * 2), 1);transform:translateY(calc((1 - var(--p2)) * 170px))}
.av-hand{transform-box:fill-box;animation:typing .2s ease-in-out infinite alternate}
.av-hand.r{animation-delay:.1s}
@keyframes typing{to{transform:translateY(-5px)}}
.av-logo{animation:logo 2.4s ease-in-out infinite}
@keyframes logo{50%{opacity:.35}}
.av-code text{fill:var(--accent);font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:600;opacity:0;transform-box:fill-box;animation:codeUp 3.6s ease-in infinite}
.av-code text:nth-child(2){animation-delay:1.2s}
.av-code text:nth-child(3){animation-delay:2.4s}
@keyframes codeUp{0%{opacity:0;transform:translateY(10px)}20%{opacity:.9}100%{opacity:0;transform:translateY(-90px)}}
.av-steam path{opacity:0;transform-box:fill-box;animation:steam 2.4s ease-in-out infinite}
.av-steam path:nth-child(2){animation-delay:.8s}
@keyframes steam{0%{opacity:0;transform:translateY(6px)}40%{opacity:.5}100%{opacity:0;transform:translateY(-22px)}}

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
.tile-abbr{min-width:54px;height:54px;padding:0 10px;display:grid;place-items:center;border-radius:14px;background:rgba(var(--acc-rgb),.1);border:1px solid rgba(var(--acc-rgb),.25);color:var(--accent);font-size:17px;font-weight:600;transition:transform .4s cubic-bezier(.2,.9,.3,1.4)}
.tile:hover .tile-abbr{transform:rotate(-8deg) scale(1.1)}
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


/* nature scene */
.scenery{position:absolute;inset:0;pointer-events:none}
.scenery svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.scenery::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 30%,color-mix(in srgb,var(--bg) 82%,transparent) 58%);opacity:calc(var(--p1) - var(--p2))}
.sk1{stop-color:var(--sky1)}
.sk2{stop-color:var(--bg)}
.sc-stars circle{fill:#fff;opacity:var(--star-op);animation:twinkle 3s ease-in-out infinite alternate}
@keyframes twinkle{to{opacity:calc(var(--star-op) * .3)}}
.sc-sun .glow{fill:var(--sun);opacity:.2}
.sc-sun .core{fill:var(--sun)}
.sc-sun{transform-box:fill-box;transform-origin:center;animation:sunPulse 6s ease-in-out infinite}
@keyframes sunPulse{50%{transform:scale(1.04)}}
.cloud{fill:var(--cloud);opacity:var(--cloud-op);animation:drift var(--dur) linear infinite;animation-delay:var(--delay)}
@keyframes drift{from{transform:translateX(-300px)}to{transform:translateX(1900px)}}
.bird path{fill:none;stroke:var(--bird);stroke-width:3;stroke-linecap:round;transform-box:fill-box;transform-origin:center;animation:flap .45s ease-in-out infinite alternate}
@keyframes flap{to{transform:scaleY(.35)}}
.bird.b1{animation:fly1 34s linear infinite}
.bird.b2{animation:fly1 34s linear -2s infinite}
.bird.b3{animation:fly2 46s linear -20s infinite}
@keyframes fly1{from{transform:translate(-120px,250px)}to{transform:translate(1750px,150px)}}
@keyframes fly2{from{transform:translate(1750px,200px)}to{transform:translate(-120px,300px)}}
.far{fill:var(--far)}
.mid{fill:var(--mid)}
.near{fill:var(--near)}
.pine{fill:var(--tree2)}
.t1{fill:var(--tree1)}
.t2{fill:var(--tree2)}
.bush{fill:var(--bush)}
.win{fill:var(--win)}
.lamp{fill:#ffd27a;opacity:calc(var(--lamp-op) * .35)}
.house{filter:brightness(var(--house-dim))}
.smoke{fill:var(--smoke);opacity:0;transform-box:fill-box;transform-origin:center;animation:smoke 4.5s ease-out infinite}
.smoke.s2{animation-delay:1.5s}
.smoke.s3{animation-delay:3s}
@keyframes smoke{0%{opacity:0;transform:translate(0,0) scale(.5)}15%{opacity:.85}100%{opacity:0;transform:translate(-36px,-120px) scale(2)}}
.cat-tail{transform-box:view-box;transform-origin:1556px 768px;animation:swish 2.6s ease-in-out infinite alternate}
@keyframes swish{to{transform:rotate(-18deg)}}
.tree-top{transform-box:view-box;transform-origin:120px 790px;animation:sway 6s ease-in-out infinite alternate}
@keyframes sway{from{transform:rotate(-1.3deg)}to{transform:rotate(1.3deg)}}
.ly-far{transform:translateX(calc(var(--p1) * -30px))}
.ly-mid{transform:translateX(calc(var(--p1) * -60px))}
.ly-house{transform:translateX(calc(var(--p1) * 480px))}
.ly-tree{transform:translateX(calc((var(--p1) - var(--p2)) * -320px))}

/* section landscapes */
.scene-wrap{position:relative;isolation:isolate;overflow:hidden;background:linear-gradient(180deg,var(--bg) 0%,var(--sky-soft) 70%)}
.bg-scene{position:absolute;inset:0;z-index:-1;pointer-events:none}
.bg-top{position:absolute;top:0;left:0;width:100%;height:clamp(140px,19vw,300px)}
.bg-bottom{position:absolute;bottom:0;left:0;width:100%;height:clamp(250px,37.5vw,600px)}
.scene-wrap>.section{padding-bottom:120px}
.sec-bg{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden;background:radial-gradient(120% 80% at 50% 0%,var(--sky-soft) 0%,var(--bg) 70%)}
.sec-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}
.sec-photo::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,color-mix(in srgb,var(--bg) 82%,transparent) 0%,color-mix(in srgb,var(--bg) 70%,transparent) 60%,var(--bg) 100%)}
.sec-hills{position:absolute;left:0;bottom:0;width:100%;height:clamp(160px,22vw,320px)}
.sec-h3{fill:var(--far);opacity:.45}
.sec-h2{fill:var(--mid);opacity:.5}
.sec-h1{fill:var(--near);opacity:.6}
.sec-leaf{position:absolute;opacity:0;animation:leafFall linear infinite}
@keyframes leafFall{0%{opacity:0;transform:translate3d(0,0,0) rotate(var(--r))}10%{opacity:.75}90%{opacity:.75}100%{opacity:0;transform:translate3d(90px,35vh,0) rotate(calc(var(--r) + 300deg))}}
.sec-mote{position:absolute;border-radius:50%;background:var(--firefly);box-shadow:0 0 8px var(--firefly);opacity:0;animation:mote ease-in-out infinite}
@keyframes mote{0%,100%{opacity:.1;transform:translate(0,0)}50%{opacity:.9;transform:translate(12px,-16px)}}
@media (prefers-reduced-motion: reduce){.sec-leaf,.sec-mote{animation:none;opacity:.5}}
.fade0{stop-color:var(--bg);stop-opacity:0}
.rock{fill:var(--rock)}
.rock2{fill:var(--rock2)}
.snow{fill:var(--snow)}
.water{fill:var(--water)}
.water2{fill:var(--water2)}
.sand{fill:var(--sand)}
.field1{fill:var(--field1)}
.row{fill:none;stroke:var(--field2);stroke-width:7;opacity:.7}
.wool{fill:var(--wool)}
.obj{filter:brightness(var(--house-dim))}
.ripple{fill:none;stroke:rgba(255,255,255,.65);stroke-width:3;stroke-linecap:round;animation:shimmer 3s ease-in-out infinite alternate}
@keyframes shimmer{to{transform:translateX(16px);opacity:.25}}
.boat-drift{animation:boatDrift 26s ease-in-out infinite alternate}
.sail-drift{animation:boatDrift 36s ease-in-out infinite alternate}
@keyframes boatDrift{to{transform:translateX(280px)}}
.boat{transform-box:fill-box;transform-origin:50% 100%;animation:rock 3s ease-in-out infinite alternate}
@keyframes rock{from{transform:rotate(-3deg)}to{transform:rotate(3deg) translateY(2px)}}
.duck{transform-box:fill-box;transform-origin:center;animation:swim 18s linear infinite}
@keyframes swim{0%{transform:translateX(0) scaleX(1)}49%{transform:translateX(220px) scaleX(1)}50%{transform:translateX(220px) scaleX(-1)}99%{transform:translateX(0) scaleX(-1)}100%{transform:translateX(0) scaleX(1)}}
.reeds{transform-box:view-box;transform-origin:160px 560px;animation:sway 3.5s ease-in-out infinite alternate}
.blades{transform-box:view-box;transform-origin:1240px 290px;animation:spinB 9s linear infinite}
@keyframes spinB{to{transform:rotate(360deg)}}
.sheep{animation:graze 2.2s ease-in-out infinite alternate}
@keyframes graze{to{transform:translateY(2px)}}
.kite{transform-box:fill-box;transform-origin:50% 100%;animation:kite 4s ease-in-out infinite alternate}
@keyframes kite{from{transform:rotate(-8deg)}to{transform:rotate(8deg) translateY(-14px)}}
.balloon{animation:bob var(--bd,7s) ease-in-out infinite alternate}
@keyframes bob{to{transform:translateY(-20px)}}
.road{fill:none;stroke:var(--road);stroke-width:22;stroke-linecap:round}
.road-dash{fill:none;stroke:rgba(255,255,255,.8);stroke-width:2.5;stroke-dasharray:12 14;animation:dash 1.2s linear infinite}
@keyframes dash{to{stroke-dashoffset:-26}}
.sign-text{fill:#fff8e6;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600}
.wave{fill:none;stroke:rgba(255,255,255,.55);stroke-width:3;stroke-linecap:round;animation:wave 7s linear infinite}
.wave.w2{animation-duration:9s;opacity:.7}
.wave.w3{animation-duration:5.5s}
@keyframes wave{to{transform:translateX(-160px)}}
.beam{transform-box:view-box;transform-origin:1340px 249px;opacity:var(--beam-op);animation:sweep 5s ease-in-out infinite alternate}
@keyframes sweep{from{transform:rotate(-12deg)}to{transform:rotate(14deg)}}
.palm{transform-box:view-box;transform-origin:244px 412px;animation:sway 3.5s ease-in-out infinite alternate}
.crab{animation:crab 7s ease-in-out infinite alternate}
@keyframes crab{to{transform:translateX(140px)}}
.foam{animation:shimmer 4s ease-in-out infinite alternate}
.flag{transform-box:view-box;transform-origin:1274px 426px;animation:flag 6s ease-in-out infinite}
@keyframes flag{0%,40%{transform:rotate(-90deg)}50%,90%{transform:rotate(0)}100%{transform:rotate(-90deg)}}
.tree-top.g2{transform-origin:161px 540px}
.firefly{fill:var(--firefly);animation:float var(--fd,6s) ease-in-out infinite alternate}
@keyframes float{to{transform:translate(18px,-26px);opacity:.25}}

/* light-mode helpers */
.project,.tile,.t-card,.cert,.form,.palette-pop{box-shadow:var(--card-shadow)}
.av-desk-top{fill:var(--desk-top)}
.av-desk-front{fill:var(--desk-front)}
.av-steam path{stroke:var(--steam)}
.bubble{border:1px solid var(--line)}

/* ===== responsive ===== */
@media (max-width:1100px){
  .rail,.nav-mail{display:none}
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
