function DecisionScore({ score, risk, recommendation }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference - (score / 100) * circumference;

  return (
    <section className="decision-score">
      <div className="score-copy">
        <span className="eyebrow">
          DECISION SIGNAL
        </span>

        <h2>
          Your idea has a
          <span> {risk} implementation risk.</span>
        </h2>

        <p>
          This score measures how clearly the current request
          can be converted into a focused implementation decision.
        </p>

        <div className="focus-badge">
          <span>ANALYSIS FOCUS</span>

          <strong>
            {recommendation}
          </strong>
        </div>
      </div>

      <div className="score-visual">
        <svg viewBox="0 0 140 140">
          <circle
            className="score-track"
            cx="70"
            cy="70"
            r={radius}
          />

          <circle
            className="score-progress"
            cx="70"
            cy="70"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>

        <div className="score-number">
          <strong>{score}</strong>
          <span>/100</span>
        </div>
      </div>
    </section>
  );
}

export default DecisionScore;