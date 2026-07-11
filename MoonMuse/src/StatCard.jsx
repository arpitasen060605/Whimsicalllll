function StatCard({ icon, label, value }) {
  return (
    <div
      className="rounded-xl p-5 flex-1 min-w-[140px]"
      style={{ backgroundColor: 'var(--moon-surface)' }}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs opacity-60 mb-1">{label}</p>
      <p className="text-xl font-bold" style={{ color: 'var(--moon-accent)' }}>{value}</p>
    </div>
  )
}

export default StatCard