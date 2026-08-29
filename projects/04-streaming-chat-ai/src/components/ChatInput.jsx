import { useState } from "react";

function ChatInput({ onSend, onStop, isLoading }) {
  const [input, setInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    onSend(trimmedInput);
    setInput("");
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Describe what you want to build..."
        rows="1"
        disabled={false}
      />

      {isLoading ? (
        <button
          type="button"
          className="stop-button"
          onClick={onStop}
        >
          Stop
        </button>
      ) : (
        <button
          type="submit"
          className="send-button"
          disabled={!input.trim()}
        >
          Send ↗
        </button>
      )}
    </form>
  );
}

export default ChatInput;