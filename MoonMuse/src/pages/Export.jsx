import { useState, useEffect } from 'react'
import { getEntries } from '../utils/storage'
import { exportAsJSON, exportAsMarkdown, exportAsPDF } from '../utils/exportUtils'

function Export() {
  const [entries, setEntries] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    setEntries(getEntries())
  }, [])

  function handleExport(exportFn, label) {
    if (entries.length === 0) {
      setMessage('No entries to export yet — write something first! 🌙')
      return
    }
    exportFn(entries)
    setMessage(`${label} downloaded successfully ✨`)
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--moon-accent)' }}>
        📤 Export & Backup
      </h1>
      <p className="opacity-70 mb-2">
        Download your {entries.length} journal {entries.length === 1 ? 'entry' : 'entries'} to keep safe or read elsewhere.
      </p>
      <p className="text-xs opacity-50 mb-10">
        Your entries currently live only in this browser — exporting is the safest way to back them up.
      </p>

      <div className="grid gap-4">
        <button
          onClick={() => handleExport(exportAsPDF, 'PDF')}
          className="rounded-xl p-5 text-left hover:opacity-90 transition"
          style={{ backgroundColor: 'var(--moon-surface)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="font-semibold" style={{ color: 'var(--moon-accent)' }}>Export as PDF</p>
              <p className="text-sm opacity-60">Polished, printable, easy to share</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleExport(exportAsMarkdown, 'Markdown')}
          className="rounded-xl p-5 text-left hover:opacity-90 transition"
          style={{ backgroundColor: 'var(--moon-surface)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <p className="font-semibold" style={{ color: 'var(--moon-accent)' }}>Export as Markdown</p>
              <p className="text-sm opacity-60">Plain text, readable anywhere, great for archiving</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleExport(exportAsJSON, 'JSON')}
          className="rounded-xl p-5 text-left hover:opacity-90 transition"
          style={{ backgroundColor: 'var(--moon-surface)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗂️</span>
            <div>
              <p className="font-semibold" style={{ color: 'var(--moon-accent)' }}>Export as JSON</p>
              <p className="text-sm opacity-60">Full data backup, machine-readable</p>
            </div>
          </div>
        </button>
      </div>

      {message && (
        <p className="mt-6 text-sm" style={{ color: 'var(--moon-accent)' }}>
          {message}
        </p>
      )}
    </div>
  )
}

export default Export