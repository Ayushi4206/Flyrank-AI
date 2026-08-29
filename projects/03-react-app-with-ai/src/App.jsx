import { useEffect, useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import MovieGrid from './components/MovieGrid'
import MovieDetails from './components/MovieDetails'
import StatusMessage from './components/StatusMessage'
import { fetchMovieDetails, fetchPopularMovies, searchMovies } from './api/tmdbService'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [selectedMovieId, setSelectedMovieId] = useState(null)
  const [movieDetails, setMovieDetails] = useState(null)
  const [status, setStatus] = useState('loading')
  const [detailStatus, setDetailStatus] = useState('idle')
  const [error, setError] = useState('')
  const [detailError, setDetailError] = useState('')

  useEffect(() => {
    async function loadPopularMovies() {
      setStatus('loading')
      setError('')

      try {
        const popularMovies = await fetchPopularMovies()
        setMovies(popularMovies)
        setStatus(popularMovies.length === 0 ? 'empty' : 'idle')
      } catch (fetchError) {
        setError(fetchError.message)
        setStatus('error')
      }
    }

    loadPopularMovies()
  }, [])

  useEffect(() => {
    window.history.replaceState({ selectedMovieId: null }, '')

    function handlePopState(event) {
      setSelectedMovieId(event.state?.selectedMovieId ?? null)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (!selectedMovieId) {
      setMovieDetails(null)
      setDetailError('')
      setDetailStatus('idle')
      return
    }

    async function loadMovieDetails() {
      setDetailStatus('loading')
      setDetailError('')
      setMovieDetails(null)

      try {
        const details = await fetchMovieDetails(selectedMovieId)
        setMovieDetails(details)
        setDetailStatus('idle')
      } catch (fetchError) {
        setDetailError(fetchError.message)
        setDetailStatus('error')
      }
    }

    loadMovieDetails()
  }, [selectedMovieId])

  async function handleSearch(nextQuery) {
    setQuery(nextQuery)
    setSelectedMovieId(null)

    if (!nextQuery) {
      setStatus('loading')
      setError('')

      try {
        const popularMovies = await fetchPopularMovies()
        setMovies(popularMovies)
        setStatus(popularMovies.length === 0 ? 'empty' : 'idle')
      } catch (fetchError) {
        setError(fetchError.message)
        setStatus('error')
      }

      return
    }

    setStatus('loading')
    setError('')

    try {
      const searchResults = await searchMovies(nextQuery)
      setMovies(searchResults)
      setStatus(searchResults.length === 0 ? 'empty' : 'idle')
    } catch (fetchError) {
      setError(fetchError.message)
      setStatus('error')
    }
  }

  function handleSelect(movie) {
    window.history.pushState({ selectedMovieId: movie?.id ?? null }, '')
    setMovieDetails(null)
    setDetailError('')
    setDetailStatus('loading')
    setSelectedMovieId(movie?.id || null)
  }

  function handleCloseDetails() {
    window.history.back()
  }

  return (
    <div className="app-shell">
      <Header />
      <main>
        <SearchBar query={query} onSearch={handleSearch} />
        <StatusMessage
          status={status}
          error={error}
          emptyMessage={query ? 'No movies found for that search.' : 'No movies available yet.'}
        />
        <MovieDetails
          movie={movieDetails}
          onClose={handleCloseDetails}
          status={detailStatus}
          error={detailError}
        />
        <MovieGrid movies={movies} onSelect={handleSelect} />
      </main>
    </div>
  )
}

export default App
