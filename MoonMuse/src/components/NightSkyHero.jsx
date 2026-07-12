function NightSkyHero({ opacity = 1 }) {
  const stars = [
    { top: '15%', left: '8%', size: 2, delay: '0s' },
    { top: '10%', left: '22%', size: 1.5, delay: '0.3s' },
    { top: '25%', left: '35%', size: 2, delay: '0.6s' },
    { top: '8%', left: '55%', size: 1.5, delay: '0.9s' },
    { top: '20%', left: '68%', size: 2, delay: '1.2s' },
    { top: '12%', left: '85%', size: 1.5, delay: '0.4s' },
    { top: '30%', left: '92%', size: 2, delay: '0.8s' },
    { top: '35%', left: '15%', size: 1.5, delay: '1.5s' },
    { top: '5%', left: '40%', size: 1.5, delay: '1.1s' },
    { top: '18%', left: '75%', size: 2, delay: '0.2s' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity }}>
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, var(--moon-bg) 0%, var(--moon-glow) 160%)' }}
      />

      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size * 3}px`,
            height: `${star.size * 3}px`,
            backgroundColor: 'var(--moon-accent)',
            opacity: 0.6,
            animationDelay: star.delay,
          }}
        />
      ))}

      <div className="absolute rounded-full" style={{ top: '12%', left: '10%', width: '140px', height: '36px', backgroundColor: 'var(--moon-accent)', opacity: 0.15 }} />
      <div className="absolute rounded-full" style={{ top: '22%', right: '18%', width: '110px', height: '28px', backgroundColor: 'var(--moon-accent)', opacity: 0.15 }} />

      <div
        className="absolute rounded-full"
        style={{
          top: '10%',
          right: '12%',
          width: '90px',
          height: '90px',
          backgroundColor: 'var(--moon-glow)',
          border: '1.5px solid var(--moon-accent)',
          boxShadow: '0 0 60px 20px var(--moon-accent)',
          opacity: 0.9,
        }}
      />

      <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-40">
        <path d="M0,90 Q150,50 300,80 T600,70 T900,90 T1200,60 L1200,200 L0,200 Z" fill="var(--moon-accent)" opacity="0.18" />
        <path d="M0,130 Q200,90 400,120 T800,110 T1200,130 L1200,200 L0,200 Z" fill="var(--moon-accent)" opacity="0.3" />
      </svg>
    </div>
  )
}

export default NightSkyHero