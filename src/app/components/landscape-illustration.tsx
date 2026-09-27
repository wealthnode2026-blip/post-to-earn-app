type Palette = {
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  sun: string;
  seaTop: string;
  seaBottom: string;
  mountainFar: string;
  mountainNear: string;
};

const PALETTES: Palette[] = [
  {
    // Neon viola/magenta
    skyTop: "#1a0f2e",
    skyMid: "#a855f7",
    skyBottom: "#ff36e0",
    sun: "#fff2c9",
    seaTop: "#2be8b0",
    seaBottom: "#0c3327",
    mountainFar: "#2a1a45",
    mountainNear: "#14112c",
  },
  {
    // Neon oro/magenta
    skyTop: "#14112c",
    skyMid: "#ff36e0",
    skyBottom: "#ffcf4d",
    sun: "#fff2c9",
    seaTop: "#26e6ff",
    seaBottom: "#0b2a33",
    mountainFar: "#3a2f1c",
    mountainNear: "#14112c",
  },
  {
    // Neon notte ciano
    skyTop: "#07050f",
    skyMid: "#0c0a1e",
    skyBottom: "#a855f7",
    sun: "#dfe6ff",
    seaTop: "#26e6ff",
    seaBottom: "#0b2a33",
    mountainFar: "#14112c",
    mountainNear: "#07050f",
  },
  {
    // Neon corallo/teal
    skyTop: "#14112c",
    skyMid: "#ff36e0",
    skyBottom: "#ffb199",
    sun: "#fff0d6",
    seaTop: "#2be8b0",
    seaBottom: "#0c3327",
    mountainFar: "#2a1a45",
    mountainNear: "#14112c",
  },
];

export function LandscapeIllustration({
  className,
  variant = 0,
}: {
  className?: string;
  variant?: number;
}) {
  const p = PALETTES[Math.abs(variant) % PALETTES.length];

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyTop} />
          <stop offset="45%" stopColor={p.skyMid} />
          <stop offset="100%" stopColor={p.skyBottom} />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.seaTop} />
          <stop offset="100%" stopColor={p.seaBottom} />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="400" height="300" fill="url(#sky)" />
      <circle cx="300" cy="80" r="34" fill={p.sun} opacity="0.95" />

      <path d="M0 190 L60 120 L110 175 L160 90 L210 190 Z" fill={p.mountainFar} opacity="0.9" />
      <path d="M120 200 L190 130 L250 195 L320 110 L400 200 Z" fill={p.mountainNear} opacity="0.95" />

      <rect x="0" y="195" width="400" height="105" fill="url(#sea)" />
      <path d="M0 205 Q50 198 100 205 T200 205 T300 205 T400 205 V300 H0 Z" fill="#134b56" opacity="0.6" />

      <circle cx="90" cy="60" r="2.4" fill="#fff" opacity="0.9" />
      <circle cx="140" cy="40" r="1.8" fill="#fff" opacity="0.8" />
      <circle cx="200" cy="55" r="2" fill="#fff" opacity="0.85" />
      <circle cx="60" cy="45" r="1.6" fill="#fff" opacity="0.7" />
    </svg>
  );
}
