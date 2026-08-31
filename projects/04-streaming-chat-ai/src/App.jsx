import { useRef, useState } from "react";

import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import ThinkingIndicator from "./components/ThinkingIndicator";
import JumpToLatest from "./components/JumpToLatest";
import useSmartScroll from "./hooks/useSmartScroll";

function App() {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const abortControllerRef = useRef(null);

  const { containerRef, isAtBottom, scrollToLatest } =
    useSmartScroll([messages, isThinking, isStreaming]);

  const handleSend = async (userInput) => {
    if (!userInput.trim() || isStreaming || isThinking) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userInput.trim(),
    };

    const assistantMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };

    const updatedMessages = [
      ...messages,
      userMessage,
      assistantMessage,
    ];

    setMessages(updatedMessages);
    setIsThinking(true);

    abortControllerRef.current = new AbortController();

    try {
      const conversationHistory = updatedMessages
        .filter(
          (message) =>
            message.role === "user" ||
            (message.role === "assistant" && message.content)
        )
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationHistory,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      if (!response.body) {
        throw new Error("Streaming is not supported");
      }

      setIsThinking(false);
      setIsStreaming(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });

        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  content: message.content + chunk,
                }
              : message
          )
        );
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);

        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  content:
                    message.content ||
                    "Something went wrong while generating the response.",
                }
              : message
          )
        );
      }
    } finally {
      setIsThinking(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">AI PRODUCT THINKING</p>
          <h1>DevBrief</h1>
        </div>

        <div className="status">
          <span className="status-dot" />
          Streaming Ready
        </div>
      </header>

      <section
        className="chat-container"
        ref={containerRef}
      >
        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p className="eyebrow">START A CONVERSATION</p>

              <h2>
                Turn rough ideas into
                <br />
                clear decisions.
              </h2>

              <p>
                Describe a product idea, feature, or technical
                problem. DevBrief will help you break it down
                into practical next steps.
              </p>

              <div className="suggestion-grid">
                <button
                  onClick={() =>
                    handleSend(
                      "I have a product idea but I am not sure what the MVP should include."
                    )
                  }
                >
                  Help me define an MVP for my product idea
                </button>

                <button
                  onClick={() =>
                    handleSend(
                      "Help me break down a technical problem into clear implementation steps."
                    )
                  }
                >
                  Break down a technical problem
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  isStreaming={
                    isStreaming &&
                    message.role === "assistant" &&
                    message ===
                      messages[messages.length - 1]
                  }
                />
              ))}

              {isThinking && <ThinkingIndicator />}
            </>
          )}
        </div>
      </section>

      {!isAtBottom && messages.length > 0 && (
        <JumpToLatest onClick={scrollToLatest} />
      )}

      <ChatInput
        onSend={handleSend}
        isStreaming={isStreaming || isThinking}
        onStop={handleStop}
      />
    </main>
  );
}

export default App;