import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { fetchEntries } from '../utils/entriesApi'
import { MOODS } from '../utils/moods'
import {
  getCurrentStreak,
  getLongestStreak,
  getTotalWords,
  getMostUsedTags,
  getMoodDistribution,
  getMonthlyActivity,
  getGreeting,
} from '../utils/dashboardStats'
import MoonMascot from '../components/MoonMascot'
import StatCard from '../components/StatCard'

function Dashboard() {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    fetchEntries()
      .then((data) => setEntries(data.map((e) => ({ ...e, id: e._id }))))
      .catch(() => setEntries([]))
  }, [])

  const currentStreak = getCurrentStreak(entries)
  const longestStreak = getLongestStreak(entries)
  const totalWords = getTotalWords(entries)
  const topTags = getMostUsedTags(entries)
  const moodData = getMoodDistribution(entries)
  const activityData = getMonthlyActivity(entries)
  const greeting = getGreeting()

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header with mascot */}
      <div
        className="rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ backgroundColor: 'var(--moon-surface)' }}
      >
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--moon-accent)' }}>
            {greeting}! 🌙
          </h1>
          <p className="opacity-70 mb-4">Here's a look at your reflection journey so far.</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/journal"
              className="text-sm px-4 py-2 rounded-full border hover:opacity-100 opacity-80 transition"
              style={{ borderColor: 'var(--moon-accent)' }}
            >
              📖 Write Today's Entry
            </Link>
            <Link
              to="/calendar"
              className="text-sm px-4 py-2 rounded-full border hover:opacity-100 opacity-80 transition"
              style={{ borderColor: 'var(--moon-accent)' }}
            >
              📅 View Calendar
            </Link>
            <Link
              to="/capsules"
              className="text-sm px-4 py-2 rounded-full border hover:opacity-100 opacity-80 transition"
              style={{ borderColor: 'var(--moon-accent)' }}
            >
              ⏳ Time Capsules
            </Link>
          </div>
        </div>
        <MoonMascot />
      </div>

      {/* Stat cards */}
      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard icon="🔥" label="Current Streak" value={`${currentStreak} day${currentStreak === 1 ? '' : 's'}`} />
        <StatCard icon="🏆" label="Longest Streak" value={`${longestStreak} day${longestStreak === 1 ? '' : 's'}`} />
        <StatCard icon="📖" label="Total Entries" value={entries.length} />
        <StatCard icon="✍️" label="Total Words Written" value={totalWords.toLocaleString()} />
      </div>

      {entries.length === 0 ? (
        <div className="text-center opacity-50 py-16">
          Start journaling to see your insights come to life 🌙
        </div>
      ) : (
        <>
          {/* Activity chart */}
          <div className="rounded-2xl p-6 mb-8" style={{ backgroundColor: 'var(--moon-surface)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--moon-accent)' }}>
              📈 Writing Activity (Last 14 Days)
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--moon-accent)" opacity={0.1} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--moon-text, currentColor)' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--moon-text, currentColor)' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--moon-bg)', border: '1px solid var(--moon-accent)', borderRadius: '8px' }}
                />
                <Bar dataKey="entries" fill="var(--moon-accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Mood breakdown */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--moon-surface)' }}>
              <h2 className="font-semibold mb-4" style={{ color: 'var(--moon-accent)' }}>
                😊 Mood Breakdown
              </h2>
              <div className="space-y-2">
                {moodData.map(({ mood, count }) => {
                  const moodInfo = MOODS.find((m) => m.label === mood)
                  const percentage = Math.round((count / entries.length) * 100)
                  return (
                    <div key={mood} className="flex items-center gap-3">
                      <span className="text-lg">{moodInfo?.emoji}</span>
                      <span className="text-sm w-20 opacity-70">{mood}</span>
                      <div className="flex-1 h-2 rounded-full bg-black/10 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${percentage}%`, backgroundColor: 'var(--moon-accent)' }}
                        />
                      </div>
                      <span className="text-xs opacity-50 w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top tags */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--moon-surface)' }}>
              <h2 className="font-semibold mb-4" style={{ color: 'var(--moon-accent)' }}>
                🏷️ Most Used Tags
              </h2>
              {topTags.length === 0 ? (
                <p className="text-sm opacity-50">No tags used yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {topTags.map(({ tag, count }) => (
                    <span
                      key={tag}
                      className="text-sm px-3 py-1 rounded-full"
                      style={{ backgroundColor: 'var(--moon-glow)', color: 'var(--moon-accent)' }}
                    >
                      #{tag} <span className="opacity-60">({count})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard