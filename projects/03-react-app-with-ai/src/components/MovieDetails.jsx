import formatDate from '../utils/formatDate'
import getPosterUrl from '../utils/getPosterUrl'
import StatusMessage from './StatusMessage'

export default function MovieDetails({ movie, onClose, status = 'idle', error = '' }) {
  if (!movie && status === 'idle' && !error) {
    return null
  }

  const ratingLabel = movie?.vote_average != null ? movie.vote_average.toFixed(1) : null
  const releaseDateLabel = movie?.release_date ? formatDate(movie.release_date) : 'Unknown'
  const genres = movie?.genres?.length ? movie.genres : []
  const overviewLabel = movie?.overview?.trim() ? movie.overview : 'No overview available.'

  return (
    <section className="movie-details">
      <div className="details-header">
        <button type="button" onClick={onClose} className="back-button">
          Back to results
        </button>
        <div className="details-title-group">
          <h2>{movie?.title ?? 'Movie details'}</h2>
          {movie?.tagline ? <p className="details-tagline">{movie.tagline}</p> : null}
        </div>
      </div>

      {(status === 'loading' || status === 'error') && (
        <StatusMessage
          status={status}
          error={error}
          loadingMessage="Loading movie details…"
        />
      )}

      {status === 'idle' && movie && (
        <div className="details-content">
          <div className="details-poster-card">
            {getPosterUrl(movie.poster_path) ? (
              <img src={getPosterUrl(movie.poster_path)} alt={movie.title} className="details-poster" />
            ) : (
              <div className="poster-fallback">
                <span>No poster available</span>
              </div>
            )}
          </div>

          <div className="details-info">
            <div className="details-stats">
              <div className="details-score">
                <span className="rating-icon">★</span>
                <span>{ratingLabel ?? 'Not rated'}</span>
              </div>
              <div className="details-date">
                <span className="details-label">Release date</span>
                <p>{releaseDateLabel}</p>
              </div>
            </div>

            <div className="details-genres">
              {genres.length > 0 ? (
                genres.map((genre) => (
                  <span key={genre.id ?? genre.name} className="genre-pill">
                    {genre.name}
                  </span>
                ))
              ) : (
                <span className="genre-pill genre-pill--empty">No genres available</span>
              )}
            </div>

            <div className="details-overview-block">
              <h3>Overview</h3>
              <p>{overviewLabel}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
