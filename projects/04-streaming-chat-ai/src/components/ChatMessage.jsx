function ChatMessage({ role, content, isStreaming }) {
  const isUser = role === "user";

  return (
    <div className={`message-row ${isUser ? "user-row" : "assistant-row"}`}>
      {!isUser && (
        <div className="message-avatar assistant-avatar">
          AI
        </div>
      )}

      <div className={`message ${isUser ? "user-message" : "assistant-message"}`}>
        <div className="message-label">
          {isUser ? "YOU" : "DEVBRIEF AI"}
        </div>

        <div className="message-content">
          {content}
          {isStreaming && <span className="streaming-cursor">▋</span>}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;