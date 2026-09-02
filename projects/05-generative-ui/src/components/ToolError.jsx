function ToolError({ error, input, onRetry }) {
  return (
    <section className="tool-error">
      <div className="error-top">
        <div className="error-symbol">!</div>

        <div>
          <span className="eyebrow">
            TOOL EXECUTION FAILED
          </span>

          <h2>The audit could not complete.</h2>

          <p>
            The server received the request, but the
            Decision Audit tool returned an execution error.
          </p>
        </div>
      </div>

      <div className="error-details">
        <div>
          <span>TOOL</span>
          <strong>decisionAudit</strong>
        </div>

        <div>
          <span>STATUS</span>
          <strong>output-error</strong>
        </div>
      </div>

      <div className="error-message">
        <span>ERROR MESSAGE</span>
        <p>
          {error ||
            "The Decision Audit service could not process this request."}
        </p>
      </div>

      {input?.idea && (
        <div className="failed-request">
          <span>FAILED REQUEST</span>
          <p>{input.idea}</p>
        </div>
      )}

      <button
        type="button"
        className="retry-button"
        onClick={onRetry}
      >
        Retry audit
      </button>
    </section>
  );
}

export default ToolError;
