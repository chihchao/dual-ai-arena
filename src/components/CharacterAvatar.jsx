export function AlphaAvatar({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Alpha">
      {/* Antenna */}
      <line x1="50" y1="12" x2="50" y2="6" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="5" r="3.5" fill="#D5CBF5" stroke="#1A1A2E" strokeWidth="2" />

      {/* Ear left */}
      <rect x="2" y="38" width="9" height="20" rx="4" fill="#D5CBF5" stroke="#1A1A2E" strokeWidth="2.5" />
      {/* Ear right */}
      <rect x="89" y="38" width="9" height="20" rx="4" fill="#D5CBF5" stroke="#1A1A2E" strokeWidth="2.5" />

      {/* Head fill */}
      <rect x="9" y="11" width="82" height="61" rx="18" fill="#EDE8F8" />

      {/* Face dome */}
      <path d="M 19,72 Q 19,24 50,24 Q 81,24 81,72 Z" fill="#89C4F0" stroke="#1A1A2E" strokeWidth="2.5" />
      {/* Dome gloss */}
      <ellipse cx="64" cy="34" rx="13" ry="8" fill="white" opacity="0.28" transform="rotate(-22 64 34)" />

      {/* Left eye */}
      <circle cx="35" cy="50" r="10" fill="white" stroke="#1A1A2E" strokeWidth="2.5" />
      <circle cx="35" cy="50" r="5" fill="#1A1A2E" />
      <circle cx="32" cy="47" r="2" fill="white" />

      {/* Right eye */}
      <circle cx="65" cy="50" r="10" fill="white" stroke="#1A1A2E" strokeWidth="2.5" />
      <circle cx="65" cy="50" r="5" fill="#1A1A2E" />
      <circle cx="62" cy="47" r="2" fill="white" />

      {/* Cheek blush */}
      <ellipse cx="26" cy="62" rx="6" ry="3.5" fill="#F9A8C4" opacity="0.5" />
      <ellipse cx="74" cy="62" rx="6" ry="3.5" fill="#F9A8C4" opacity="0.5" />

      {/* Smile */}
      <path d="M 38,62 Q 50,72 62,62" stroke="#1A1A2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Side indicator dots */}
      <circle cx="17" cy="37" r="2.5" fill="#1A1A2E" />
      <circle cx="17" cy="44" r="2.5" fill="#1A1A2E" />

      {/* Head outline on top (covers dome overflow) */}
      <rect x="9" y="11" width="82" height="61" rx="18" stroke="#1A1A2E" strokeWidth="3" />

      {/* Body / shoulders */}
      <path d="M 2,100 Q 8,77 26,74 L 74,74 Q 92,77 98,100 Z" fill="#EDE8F8" stroke="#1A1A2E" strokeWidth="3" />
      {/* Chest panel */}
      <rect x="35" y="82" width="30" height="13" rx="6.5" fill="#C8C0E8" stroke="#1A1A2E" strokeWidth="2" />
      {/* Indicator bar */}
      <rect x="40" y="86" width="20" height="5" rx="2.5" fill="#5DC8A8" stroke="#1A1A2E" strokeWidth="1.5" />
    </svg>
  )
}

export function OmegaAvatar({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Omega">
      {/* Antenna */}
      <line x1="50" y1="12" x2="50" y2="6" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="5" r="3.5" fill="#FFE0A0" stroke="#1A1A2E" strokeWidth="2" />

      {/* Ear left */}
      <rect x="2" y="38" width="9" height="20" rx="4" fill="#FFE0A0" stroke="#1A1A2E" strokeWidth="2.5" />
      {/* Ear right */}
      <rect x="89" y="38" width="9" height="20" rx="4" fill="#FFE0A0" stroke="#1A1A2E" strokeWidth="2.5" />

      {/* Head fill */}
      <rect x="9" y="11" width="82" height="61" rx="18" fill="#FFF0D8" />

      {/* Face dome */}
      <path d="M 19,72 Q 19,24 50,24 Q 81,24 81,72 Z" fill="#F5B84C" stroke="#1A1A2E" strokeWidth="2.5" />
      {/* Dome gloss */}
      <ellipse cx="64" cy="34" rx="13" ry="8" fill="white" opacity="0.28" transform="rotate(-22 64 34)" />

      {/* Left eye */}
      <circle cx="35" cy="50" r="10" fill="white" stroke="#1A1A2E" strokeWidth="2.5" />
      <circle cx="35" cy="50" r="5" fill="#1A1A2E" />
      <circle cx="32" cy="47" r="2" fill="white" />

      {/* Right eye */}
      <circle cx="65" cy="50" r="10" fill="white" stroke="#1A1A2E" strokeWidth="2.5" />
      <circle cx="65" cy="50" r="5" fill="#1A1A2E" />
      <circle cx="62" cy="47" r="2" fill="white" />

      {/* Cheek blush */}
      <ellipse cx="26" cy="62" rx="6" ry="3.5" fill="#F9A8C4" opacity="0.5" />
      <ellipse cx="74" cy="62" rx="6" ry="3.5" fill="#F9A8C4" opacity="0.5" />

      {/* Smile */}
      <path d="M 38,62 Q 50,72 62,62" stroke="#1A1A2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Side indicator dots */}
      <circle cx="17" cy="37" r="2.5" fill="#1A1A2E" />
      <circle cx="17" cy="44" r="2.5" fill="#1A1A2E" />

      {/* Head outline on top */}
      <rect x="9" y="11" width="82" height="61" rx="18" stroke="#1A1A2E" strokeWidth="3" />

      {/* Body / shoulders */}
      <path d="M 2,100 Q 8,77 26,74 L 74,74 Q 92,77 98,100 Z" fill="#FFF0D8" stroke="#1A1A2E" strokeWidth="3" />
      {/* Chest panel */}
      <rect x="35" y="82" width="30" height="13" rx="6.5" fill="#FFD090" stroke="#1A1A2E" strokeWidth="2" />
      {/* Indicator bar */}
      <rect x="40" y="86" width="20" height="5" rx="2.5" fill="#FF8C42" stroke="#1A1A2E" strokeWidth="1.5" />
    </svg>
  )
}
