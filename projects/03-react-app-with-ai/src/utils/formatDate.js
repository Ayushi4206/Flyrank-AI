export default function formatDate(dateString) {
  if (!dateString) {
    return 'Unknown'
  }

  const date = new Date(dateString)
  if (Number.isNaN(date.valueOf())) {
    return 'Unknown'
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
