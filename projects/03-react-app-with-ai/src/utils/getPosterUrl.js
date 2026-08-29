const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w342'

export default function getPosterUrl(posterPath) {
  if (!posterPath) {
    return null
  }

  return `${POSTER_BASE_URL}${posterPath}`
}
