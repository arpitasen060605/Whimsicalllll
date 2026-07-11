export const DAILY_PROMPTS = [
  "What made today meaningful?",
  "Describe today's sky in one paragraph.",
  "What would your future self thank you for today?",
  "What are you learning about yourself?",
  "What's a small moment from today you don't want to forget?",
  "Who or what are you grateful for right now?",
  "What emotion visited you most today, and why?",
  "If today had a title, what would it be?",
  "What's something you're proud of, even if small?",
  "What do you wish you'd said today, but didn't?",
  "What's weighing on your mind tonight?",
  "Describe a moment today when you felt fully present.",
  "What would you tell a friend who had your exact day?",
  "What's one thing you want to let go of before sleeping?",
  "What surprised you today?",
]

export function getDailyPrompt(date = new Date()) {
  // Use the date itself to deterministically pick a prompt,
  // so it stays the same all day but changes daily.
  const dayOfYear = Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  )
  const index = dayOfYear % DAILY_PROMPTS.length
  return DAILY_PROMPTS[index]
}