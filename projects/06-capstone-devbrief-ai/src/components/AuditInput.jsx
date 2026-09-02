function AuditInput({ input }) {
  if (!input) return null;

  const typeLabel =
    input.type === "technical"
      ? "TECHNICAL DECISION"
      : "PRODUCT PROBLEM";

  return (
    <section className="audit-input-display">
      <div className="tool-section-header">
        <span className="eyebrow">TOOL INPUT AVAILABLE</span>
        <span className="input-status">Structured input received</span>
      </div>

      <div className="audit-input-card">
        <div className="input-meta">
          <span className="input-type">
            {typeLabel}
          </span>

          <span className="input-state">
            READY
          </span>
        </div>

        <p className="audit-problem">
          {input.problem}
        </p>
      </div>
    </section>
  );
}

export default AuditInput;