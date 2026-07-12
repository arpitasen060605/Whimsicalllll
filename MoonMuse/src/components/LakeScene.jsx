function LakeScene() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '280px' }}>
      {/* water gradient background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, var(--moon-glow) 0%, var(--moon-bg) 100%)' }}
      />

      {/* distant hill silhouettes reflected on the horizon line */}
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-14">
        <path d="M0,40 Q150,10 300,30 T600,20 T900,35 T1200,15 L1200,60 L0,60 Z" fill="var(--moon-accent)" opacity="0.25" />
      </svg>

      {/* moon reflection: soft vertical glow column shimmering on the water */}
      <div
        className="absolute lake-shimmer"
        style={{
          top: '20px',
          right: '14%',
          width: '70px',
          height: '260px',
          background: 'linear-gradient(180deg, var(--moon-accent) 0%, transparent 90%)',
          opacity: 0.35,
          filter: 'blur(6px)',
        }}
      />

      {/* moon sitting at the horizon */}
      <div
        className="absolute rounded-full"
        style={{
          top: '4px',
          right: 'calc(14% + 5px)',
          width: '60px',
          height: '60px',
          backgroundColor: 'var(--moon-glow)',
          border: '1.5px solid var(--moon-accent)',
          boxShadow: '0 0 40px 12px var(--moon-accent)',
        }}
      />

      {/* animated ripple lines across the water */}
      <svg viewBox="0 0 1200 220" preserveAspectRatio="none" className="absolute top-14 left-0 w-full" style={{ height: '220px' }}>
        <path className="ripple ripple-1" d="M0,30 Q100,20 200,30 T400,30 T600,30 T800,30 T1000,30 T1200,30" stroke="var(--moon-accent)" strokeWidth="1.5" fill="none" opacity="0.3" />
        <path className="ripple ripple-2" d="M0,70 Q100,58 200,70 T400,70 T600,70 T800,70 T1000,70 T1200,70" stroke="var(--moon-accent)" strokeWidth="1.5" fill="none" opacity="0.25" />
        <path className="ripple ripple-3" d="M0,115 Q100,102 200,115 T400,115 T600,115 T800,115 T1000,115 T1200,115" stroke="var(--moon-accent)" strokeWidth="1.5" fill="none" opacity="0.2" />
        <path className="ripple ripple-4" d="M0,160 Q100,146 200,160 T400,160 T600,160 T800,160 T1000,160 T1200,160" stroke="var(--moon-accent)" strokeWidth="1.5" fill="none" opacity="0.18" />
      </svg>
    </div>
  )
}

export default LakeScene