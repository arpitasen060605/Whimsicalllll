export function collectAllMedia(entries) {
  const items = []
  entries.forEach((entry) => {
    entry.media?.forEach((mediaItem, index) => {
      items.push({
        id: `${entry.id}-${index}`,
        entryId: entry.id,
        entryTitle: entry.title,
        createdAt: entry.createdAt,
        url: mediaItem.url,
        type: mediaItem.type,
      })
    })
  })
  return items
}