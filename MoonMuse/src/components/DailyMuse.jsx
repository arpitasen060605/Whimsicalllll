import { getDailyPrompt } from '../utils/prompts'

function DailyMuse() {
  const prompt = getDailyPrompt()

  return (
    <div className="max-w-xl mx-auto bg-white/5 border border-lavender/20 rounded-2xl p-5 text-center mb-8">
      <p className="text-xs uppercase tracking-wide text-lavender/60 mb-2">🌸 Today's Muse</p>
      <p className="text-moonlight/90 italic">"{prompt}"</p>
    </div>
  )
}

export default DailyMuse