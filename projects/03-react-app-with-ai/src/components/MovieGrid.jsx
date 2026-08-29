import MovieCard from './MovieCard'

export default function MovieGrid({ movies, onSelect }) {
  if (!Array.isArray(movies) || movies.length === 0) {
    return <div className="empty-state">No movies to show yet.</div>
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onSelect={onSelect} />
      ))}
    </div>
  )
}
