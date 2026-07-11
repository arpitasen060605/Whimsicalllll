import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { MOODS } from './moods'

function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Strips emoji and other characters jsPDF's default fonts can't render
function stripEmoji(text) {
  return text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu, '').trim()
}

export function exportAsJSON(entries) {
  const json = JSON.stringify(entries, null, 2)
  triggerDownload(json, `moonmuse-journal-${format(new Date(), 'yyyy-MM-dd')}.json`, 'application/json')
}

export function exportAsMarkdown(entries) {
  const lines = ['# MoonMuse Journal Export', `Exported on ${format(new Date(), 'MMMM d, yyyy')}`, '']

  entries.forEach((entry) => {
    const moodData = MOODS.find((m) => m.label === entry.mood)
    lines.push(`## ${entry.title}`)
    lines.push(`**Date:** ${format(new Date(entry.createdAt), 'MMMM d, yyyy')}`)
    lines.push(`**Mood:** ${moodData ? `${moodData.emoji} ${moodData.label}` : entry.mood}`)
    if (entry.tags?.length > 0) {
      lines.push(`**Tags:** ${entry.tags.map((t) => `#${t}`).join(' ')}`)
    }
    lines.push('')
    lines.push(entry.content)
    lines.push('')
    lines.push('---')
    lines.push('')
  })

  triggerDownload(lines.join('\n'), `moonmuse-journal-${format(new Date(), 'yyyy-MM-dd')}.md`, 'text/markdown')
}

export function exportAsPDF(entries) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const maxWidth = pageWidth - margin * 2
  let y = 20

  doc.setFontSize(20)
  doc.text('MoonMuse Journal', margin, y)
  y += 8
  doc.setFontSize(10)
  doc.setTextColor(120)
  doc.text(`Exported on ${format(new Date(), 'MMMM d, yyyy')}`, margin, y)
  y += 15

  entries.forEach((entry, index) => {
    const moodData = MOODS.find((m) => m.label === entry.mood)

    if (y > 260) {
      doc.addPage()
      y = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(40)
    doc.text(stripEmoji(entry.title), margin, y)
    y += 7

    doc.setFontSize(9)
    doc.setTextColor(130)
    const metaLine = `${format(new Date(entry.createdAt), 'MMMM d, yyyy')} - Feeling ${entry.mood}${entry.tags?.length ? ' - Tags: ' + entry.tags.map((t) => `#${t}`).join(' ') : ''}`
    doc.text(stripEmoji(metaLine), margin, y)
    y += 8

    doc.setFontSize(11)
    doc.setTextColor(30)
    const contentLines = doc.splitTextToSize(stripEmoji(entry.content), maxWidth)

    contentLines.forEach((line) => {
      if (y > 280) {
        doc.addPage()
        y = 20
      }
      doc.text(line, margin, y)
      y += 6
    })

    y += 8
    if (index < entries.length - 1) {
      doc.setDrawColor(220)
      doc.line(margin, y, pageWidth - margin, y)
      y += 10
    }
  })

  doc.save(`moonmuse-journal-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}