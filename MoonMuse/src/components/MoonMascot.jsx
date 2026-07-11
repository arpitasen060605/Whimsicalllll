function MoonMascot() {
  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full moon-float">
        {/* twinkling stars */}
        <circle cx="25" cy="35" r="3" fill="var(--moon-accent)" className="twinkle" style={{ animationDelay: '0s' }} />
        <circle cx="175" cy="55" r="2" fill="var(--moon-accent)" className="twinkle" style={{ animationDelay: '0.6s' }} />
        <circle cx="165" cy="155" r="2.5" fill="var(--moon-accent)" className="twinkle" style={{ animationDelay: '1.2s' }} />
        <circle cx="20" cy="145" r="2" fill="var(--moon-accent)" className="twinkle" style={{ animationDelay: '0.3s' }} />

        {/* full round moon body */}
        <circle
          cx="100"
          cy="100"
          r="65"
          fill="var(--moon-glow)"
          stroke="var(--moon-accent)"
          strokeWidth="2"
        />

        {/* subtle shadow crescent for moon texture, clipped to the circle */}
        <clipPath id="moonClip">
          <circle cx="100" cy="100" r="65" />
        </clipPath>
        <ellipse
          cx="128"
          cy="80"
          rx="45"
          ry="55"
          fill="var(--moon-accent)"
          opacity="0.12"
          clipPath="url(#moonClip)"
        />

        {/* face group with dark outline pass beneath colored pass, for guaranteed contrast in any theme */}
        <g strokeLinecap="round" fill="none">
          {/* outline pass (dark, wider) */}
          <path d="M 78 95 Q 84 88 90 95" stroke="rgba(0,0,0,0.45)" strokeWidth="6" />
          <path d="M 110 95 Q 116 88 122 95" stroke="rgba(0,0,0,0.45)" strokeWidth="6" />
          <path d="M 85 112 Q 100 124 115 112" stroke="rgba(0,0,0,0.45)" strokeWidth="6" />

          {/* colored pass (on top, narrower) */}
          <path d="M 78 95 Q 84 88 90 95" stroke="var(--moon-text)" strokeWidth="3.5" />
          <path d="M 110 95 Q 116 88 122 95" stroke="var(--moon-text)" strokeWidth="3.5" />
          <path d="M 85 112 Q 100 124 115 112" stroke="var(--moon-text)" strokeWidth="3.5" />
        </g>

        {/* blush */}
        <circle cx="72" cy="108" r="7" fill="var(--moon-text)" opacity="0.3" />
        <circle cx="128" cy="108" r="7" fill="var(--moon-text)" opacity="0.3" />
      </svg>
    </div>
  )
}

export default MoonMascot
