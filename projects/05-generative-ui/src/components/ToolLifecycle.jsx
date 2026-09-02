function ToolLifecycle({ toolState }) {
  if (!toolState) return null;

  const { state, input } = toolState;

  if (state === "input-streaming") {
    return (
      <section className="tool-lifecycle tool-streaming">
        <div className="tool-status-row">
          <div className="pulse-indicator">
            <span />
            <span />
            <span />
          </div>

          <span className="tool-status-label">
            ANALYZING REQUEST
          </span>
        </div>

        <div className="streaming-content">
          <span className="streaming-label">
            Building tool input
          </span>

          <p>
            {input?.idea || "Preparing decision audit..."}
            <span className="typing-cursor">▋</span>
          </p>
        </div>

        <div className="scan-line" />
      </section>
    );
  }

  if (state === "input-available") {
    return (
      <section className="tool-lifecycle tool-input-ready">
        <div className="tool-status-row">
          <div className="status-icon ready-icon">
            ✓
          </div>

          <div>
            <span className="tool-status-label">
              AUDIT INPUT READY
            </span>

            <p className="status-description">
              The server has received the complete tool input.
            </p>
          </div>
        </div>

        <div className="tool-input-preview">
          <div>
            <span>FOCUS</span>
            <strong>{input?.focus || "product"}</strong>
          </div>

          <div>
            <span>REQUEST</span>
            <p>{input?.idea}</p>
          </div>
        </div>
      </section>
    );
  }

  return null;
}

export default ToolLifecycle;