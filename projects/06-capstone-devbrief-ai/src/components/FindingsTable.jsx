function FindingsTable({
  findings = [],
  nextSteps = [],
  biggestAssumption,
  primaryRisk,
  recommendedNextMove,
}) {
  return (
    <section className="findings-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">AUDIT FINDINGS</span>
          <h2>What the tool found</h2>
        </div>

        <span className="finding-count">
          {findings.length} signals
        </span>
      </div>

      <div className="findings-list">
        {findings.map((finding, index) => (
          <article
            className="finding-row"
            key={`${finding.title}-${index}`}
          >
            <span className="finding-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div>
              <h3>{finding.title}</h3>
              <p>{finding.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="insight-grid">
        <article className="insight-card assumption-card">
          <span className="eyebrow">
            BIGGEST ASSUMPTION
          </span>

          <p>
            {biggestAssumption ||
              "No major assumption was identified."}
          </p>
        </article>

        <article className="insight-card recommendation-card">
          <span className="eyebrow">
            RECOMMENDED NEXT MOVE
          </span>

          <p>
            {recommendedNextMove ||
              nextSteps[0] ||
              "Validate the problem before expanding the solution."}
          </p>
        </article>
      </div>

      <div className="risk-summary">
        <span className="eyebrow">
          PRIMARY RISK
        </span>

        <p>
          {primaryRisk ||
            "No major implementation risk was identified."}
        </p>
      </div>
    </section>
  );
}

export default FindingsTable;