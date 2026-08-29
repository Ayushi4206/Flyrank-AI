import formatDate from '../utils/formatDate'
import getPosterUrl from '../utils/getPosterUrl'

export default function MovieCard({ movie, onSelect }) {
  const posterUrl = getPosterUrl(movie?.poster_path)

  return (
    <button
      className="movie-card"
      type="button"
      onClick={() => onSelect(movie)}
    >
      {posterUrl ? (
        <img src={posterUrl} alt={movie?.title || 'Movie poster'} className="movie-poster" />
      ) : (
        <div className="poster-fallback">No image available</div>
      )}

      <div className="movie-card-body">
        <h3>{movie?.title || 'Untitled movie'}</h3>
        <p className="movie-meta">
          <span>⭐ {movie?.vote_average ?? 'N/A'}</span>
          <span>{formatDate(movie?.release_date)}</span>
        </p>
      </div>
    </button>
  )
}
