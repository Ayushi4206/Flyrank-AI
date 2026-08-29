import { useState, useRef } from "react";

import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import ThinkingIndicator from "./components/ThinkingIndicator";
import JumpToLatest from "./components/JumpToLatest";
import useSmartScroll from "./hooks/useSmartScroll";

function App() {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamTimeoutRef = useRef(null);

const {
  containerRef,
  isAtBottom,
  scrollToLatest,
} = useSmartScroll([messages, isThinking]);
  const generateResponse = (userMessage) => {
    return `Here is how I would break this down.

The first thing to define is the actual problem you are solving. Your idea should not start with features or technology. Start with who has the problem and why the current approach is not good enough.

From there, I would identify the smallest useful version of the product, decide what needs to happen on the frontend, and separate the essential functionality from features that can wait.

The main risk is building too much before validating the core workflow. I would start with one clear user journey and make that work properly before adding complexity.`;
  };

  const handleSend = (userMessage) => {
    if (isStreaming || isThinking) return;

    const userMessageObject = {
      id: Date.now(),
      role: "user",
      content: userMessage,
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessageObject,
    ]);

    setIsThinking(true);

    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "",
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantMessage,
      ]);

      setIsThinking(false);
      setIsStreaming(true);

      const fullResponse = generateResponse(userMessage);
      let currentIndex = 0;

      const streamNextWord = () => {
        if (currentIndex >= fullResponse.length) {
          setIsStreaming(false);
          streamTimeoutRef.current = null;
          return;
        }

        const nextChunk = fullResponse.slice(
          currentIndex,
          currentIndex + 3
        );

        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  content: message.content + nextChunk,
                }
              : message
          )
        );

        currentIndex += 3;

        streamTimeoutRef.current = setTimeout(
          streamNextWord,
          25
        );
      };

      streamNextWord();
    }, 700);
  };

  const handleStop = () => {
    if (streamTimeoutRef.current) {
      clearTimeout(streamTimeoutRef.current);
      streamTimeoutRef.current = null;
    }

    setIsThinking(false);
    setIsStreaming(false);
  };

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">AI WORKSPACE</p>
          <h1>DevBrief</h1>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          Streaming ready
        </div>
      </header>

      <section
  className="chat-container"
  ref={containerRef}
      >
        {messages.length === 0 && !isThinking && (
          <div className="empty-state">
            <p className="eyebrow">FROM IDEA TO EXECUTION</p>

            <h2>
              Start with the messy version.
              <br />
              We'll find the structure.
            </h2>

            <p>
              Describe a product idea, feature, or technical
              problem. DevBrief will help break it into
              decisions you can actually act on.
            </p>

            <div className="suggestion-grid">
              <button
                onClick={() =>
                  handleSend(
                    "I want to build a platform for students to find hackathon teammates."
                  )
                }
              >
                I have a product idea but no clear feature list
              </button>

              <button
                onClick={() =>
                  handleSend(
                    "I am stuck deciding how to structure my React project."
                  )
                }
              >
                Help me make a technical decision
              </button>
            </div>
          </div>
        )}

        <div className="messages">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              isStreaming={
                isStreaming &&
                message.role === "assistant" &&
                index === messages.length - 1
              }
            />
          ))}

          {isThinking && <ThinkingIndicator />}
        </div>
      </section>

      {!isAtBottom && messages.length > 0 && (
  <JumpToLatest onClick={scrollToLatest} />
)}

      <ChatInput
        onSend={handleSend}
        onStop={handleStop}
        isLoading={isThinking || isStreaming}
      />
    </main>
  );
}

export default App;