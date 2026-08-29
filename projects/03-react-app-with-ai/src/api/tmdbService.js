const BASE_URL = 'https://api.themoviedb.org/3'
const API_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN

async function tmdbRequest(path, params = {}) {
  if (!API_TOKEN) {
    throw new Error('TMDB access token is not configured.')
  }

  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const statusText = response.statusText || 'Unknown error'
    throw new Error(`TMDB request failed: ${response.status} ${statusText}`)
  }

  let data
  try {
    data = await response.json()
  } catch (error) {
    throw new Error('Failed to parse TMDB response as JSON.')
  }

  return data
}

export async function fetchPopularMovies() {
  const data = await tmdbRequest('/movie/popular')
  return Array.isArray(data.results) ? data.results : []
}

export async function searchMovies(query) {
  if (!query) {
    return []
  }

  const data = await tmdbRequest('/search/movie', { query })
  return Array.isArray(data.results) ? data.results : []
}

export async function fetchMovieDetails(movieId) {
  if (!movieId) {
    throw new Error('Movie ID is required to fetch details.')
  }

  return await tmdbRequest(`/movie/${movieId}`)
}
