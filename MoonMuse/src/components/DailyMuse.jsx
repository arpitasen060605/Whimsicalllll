import { getDailyPrompt } from '../utils/prompts'

function DailyMuse() {
  const prompt = getDailyPrompt()

  return (
    <div
      className="max-w-xl mx-auto rounded-2xl p-5 text-center mb-8 border"
      style={{
        backgroundColor: 'var(--moon-surface)',
        borderColor: 'var(--moon-accent)',
        borderOpacity: 0.2,
      }}
    >
      <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--moon-accent)', opacity: 0.7 }}>
        🌸 Today's Muse
      </p>
      <p className="italic" style={{ opacity: 0.9 }}>"{prompt}"</p>
    </div>
  )
}

export default DailyMuse