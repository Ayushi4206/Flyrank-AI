export default function StatusMessage({ status, error, emptyMessage, loadingMessage }) {
  if (status === 'loading') {
    return <div className="status-message">{loadingMessage || 'Loading movies…'}</div>
  }

  if (status === 'error') {
    return <div className="status-message status-error">{error || 'Something went wrong.'}</div>
  }

  if (status === 'empty') {
    return <div className="status-message">{emptyMessage || 'No movies found.'}</div>
  }

  return null
}
