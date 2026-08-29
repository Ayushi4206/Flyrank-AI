function ThinkingIndicator() {
  return (
    <div className="thinking-message">
      <div className="thinking-avatar">AI</div>

      <div className="thinking-content">
        <span className="thinking-dot"></span>
        <span>Analyzing your brief</span>
      </div>
    </div>
  );
}

export default ThinkingIndicator;