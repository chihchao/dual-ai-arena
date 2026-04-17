export function AlphaAvatar({ className = 'w-10 h-10' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Alpha"
    >
      <defs>
        <radialGradient id="alpha-head" cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0a1628" />
        </radialGradient>
        <radialGradient id="alpha-iris" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="40%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </radialGradient>
        <radialGradient id="alpha-cheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Antenna */}
      <line x1="50" y1="14" x2="50" y2="7" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="5" r="4" fill="#38bdf8" />
      <circle cx="49" cy="4" r="1.5" fill="white" opacity="0.7" />

      {/* Head */}
      <rect x="12" y="13" width="76" height="76" rx="22" fill="url(#alpha-head)" />
      {/* Head highlight */}
      <ellipse cx="36" cy="23" rx="16" ry="7" fill="white" opacity="0.08" />

      {/* Face plate */}
      <rect x="20" y="28" width="60" height="52" rx="14" fill="#040f1e" opacity="0.65" />

      {/* Eyebrows — raised/cheerful */}
      <path d="M26 40 Q36 34 46 38" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M54 38 Q64 34 74 40" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Left eye */}
      <circle cx="37" cy="52" r="12" fill="white" />
      <circle cx="37" cy="52" r="10" fill="url(#alpha-iris)" />
      <circle cx="37" cy="52" r="6" fill="#01356b" />
      <circle cx="37" cy="52" r="4" fill="#000d20" />
      <circle cx="34" cy="49" r="2.5" fill="white" />
      <circle cx="40" cy="54" r="1" fill="white" opacity="0.5" />

      {/* Right eye */}
      <circle cx="63" cy="52" r="12" fill="white" />
      <circle cx="63" cy="52" r="10" fill="url(#alpha-iris)" />
      <circle cx="63" cy="52" r="6" fill="#01356b" />
      <circle cx="63" cy="52" r="4" fill="#000d20" />
      <circle cx="60" cy="49" r="2.5" fill="white" />
      <circle cx="66" cy="54" r="1" fill="white" opacity="0.5" />

      {/* Smile */}
      <path d="M32 70 Q50 82 68 70" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Cheek glow */}
      <circle cx="24" cy="65" r="10" fill="url(#alpha-cheek)" />
      <circle cx="76" cy="65" r="10" fill="url(#alpha-cheek)" />

      {/* Ear ports */}
      <circle cx="12" cy="51" r="7" fill="#071323" stroke="#1d4ed8" strokeWidth="1.5" />
      <circle cx="12" cy="51" r="2.5" fill="#38bdf8" />
      <circle cx="88" cy="51" r="7" fill="#071323" stroke="#1d4ed8" strokeWidth="1.5" />
      <circle cx="88" cy="51" r="2.5" fill="#38bdf8" />
    </svg>
  )
}

export function OmegaAvatar({ className = 'w-10 h-10' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Omega"
    >
      <defs>
        <radialGradient id="omega-head" cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#180700" />
        </radialGradient>
        <radialGradient id="omega-iris" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
      </defs>

      {/* Head */}
      <rect x="11" y="11" width="78" height="78" rx="22" fill="url(#omega-head)" />
      {/* Head highlight */}
      <ellipse cx="36" cy="22" rx="16" ry="7" fill="white" opacity="0.06" />

      {/* Face plate */}
      <rect x="19" y="27" width="62" height="54" rx="14" fill="#080200" opacity="0.65" />

      {/* Omega symbol — forehead */}
      <path d="M40 22 Q50 30 60 22" stroke="#f59e0b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <line x1="40" y1="22.5" x2="37.5" y2="27" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="60" y1="22.5" x2="62.5" y2="27" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />

      {/* Eyelids — half-closed, analytical */}
      <path d="M25 46 Q37 37 49 46" fill="#100400" />
      <path d="M51 46 Q63 37 75 46" fill="#100400" />

      {/* Eyebrows — furrowed/skeptical */}
      <path d="M26 41 Q37 36 48 40" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M52 40 Q63 36 74 41" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Left eye */}
      <circle cx="37" cy="52" r="11" fill="white" />
      <circle cx="37" cy="52" r="9" fill="url(#omega-iris)" />
      <circle cx="37" cy="52" r="5.5" fill="#7c2d12" />
      <circle cx="37" cy="52" r="3.5" fill="#0f0200" />
      <circle cx="34.5" cy="49.5" r="2" fill="white" />
      <circle cx="39" cy="54" r="0.8" fill="white" opacity="0.5" />

      {/* Right eye */}
      <circle cx="63" cy="52" r="11" fill="white" />
      <circle cx="63" cy="52" r="9" fill="url(#omega-iris)" />
      <circle cx="63" cy="52" r="5.5" fill="#7c2d12" />
      <circle cx="63" cy="52" r="3.5" fill="#0f0200" />
      <circle cx="60.5" cy="49.5" r="2" fill="white" />
      <circle cx="65" cy="54" r="0.8" fill="white" opacity="0.5" />

      {/* Neutral mouth — slight downturn */}
      <path d="M33 71 Q50 65 67 71" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Ear ports */}
      <circle cx="11" cy="50" r="7" fill="#1a0700" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="11" cy="50" r="2.5" fill="#f59e0b" />
      <circle cx="89" cy="50" r="7" fill="#1a0700" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="89" cy="50" r="2.5" fill="#f59e0b" />
    </svg>
  )
}
