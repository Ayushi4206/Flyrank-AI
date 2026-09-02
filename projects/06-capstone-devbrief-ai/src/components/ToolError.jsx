function ToolError({ message, input, onRetry }) {
  return (
    <section
      className="tool-error"
      role="alert"
      aria-labelledby="error-title"
    >
      <div className="error-top">
        <div
          className="error-symbol"
          aria-hidden="true"
        >
          !
        </div>

        <div>
          <span className="eyebrow">
            ANALYSIS FAILED
          </span>

          <h2 id="error-title">
            The audit could not complete.
          </h2>

          <p>
            DevBrief AI could not complete this analysis.
            Your input has not been lost, and you can try again.
          </p>
        </div>
      </div>

      <div className="error-details">
        <div>
          <span>SERVICE</span>
          <strong>AI Decision Analysis</strong>
        </div>

        <div>
          <span>STATUS</span>
          <strong>output-error</strong>
        </div>
      </div>

      <div className="error-message">
        <span>ERROR MESSAGE</span>

        <p>
          {message ||
            "The AI decision analysis service could not process this request."}
        </p>
      </div>

      {input?.problem && (
        <div className="failed-request">
          <span>FAILED REQUEST</span>
          <p>{input.problem}</p>
        </div>
      )}

      <button
        type="button"
        className="retry-button"
        onClick={onRetry}
      >
        Retry analysis
      </button>
    </section>
  );
}

export default ToolError;