import { useState } from "react";
import "./App.css";

import AuditInput from "./components/AuditInput";
import ToolLifecycle from "./components/ToolLifecycle";
import DecisionScore from "./components/DecisionScore";
import Findings from "./components/FindingsTable";
import ToolError from "./components/ToolError";

function App() {
  const [problem, setProblem] = useState("");
  const [type, setType] = useState("product");

  const [toolState, setToolState] = useState(null);
  const [toolInput, setToolInput] = useState(null);
  const [toolResult, setToolResult] = useState(null);
  const [toolError, setToolError] = useState(null);

  const runAudit = async (problemToAudit = problem) => {
    if (problemToAudit.trim().length < 1) return;

    // Reset previous audit
    setToolState(null);
    setToolInput(null);
    setToolResult(null);
    setToolError(null);

    try {
      const response = await fetch(
        "http://localhost:3001/api/audit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problem: problemToAudit,
            type,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        setToolState("output-error");

        setToolError(
          errorData.error ||
            "Unable to start the decision audit."
        );

        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const events = buffer.split("\n\n");

        buffer = events.pop() || "";

        events.forEach((eventBlock) => {
          const lines = eventBlock.split("\n");

          let eventName = "";
          let eventData = "";

          lines.forEach((line) => {
            if (line.startsWith("event:")) {
              eventName = line
                .replace("event:", "")
                .trim();
            }

            if (line.startsWith("data:")) {
              eventData = line
                .replace("data:", "")
                .trim();
            }
          });

          if (
            eventName === "tool-state" &&
            eventData
          ) {
            const data = JSON.parse(eventData);

            setToolState(data.state);

            if (data.input) {
              setToolInput(data.input);
            }

            if (data.result) {
              setToolResult(data.result);
            }

            if (data.error) {
              setToolError(data.error);
            }
          }
        });
      }
    } catch (error) {
      setToolState("output-error");

      setToolError(
        "Could not connect to the DevBrief tool server. Check that the server is running."
      );
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">
            GENERATIVE DECISION UI
          </span>

          <h2>DevBrief</h2>
        </div>

        <div className="system-status">
          <span className="status-dot" />
          Tool system online
        </div>
      </header>

      <section className="hero">
        <span className="eyebrow">
          DECISION AUDIT
        </span>

        <h1>
          Turn a vague idea into
          <span> a decision you can defend.</span>
        </h1>

        <p>
          Describe a product idea or technical problem.
          DevBrief inspects the assumptions, identifies
          the biggest risk, and recommends the next
          implementation decision.
        </p>
      </section>

      <section className="audit-form">
        <div className="type-selector">
          <button
            className={
              type === "product" ? "active" : ""
            }
            onClick={() => setType("product")}
          >
            Product problem
          </button>

          <button
            className={
              type === "technical" ? "active" : ""
            }
            onClick={() => setType("technical")}
          >
            Technical decision
          </button>
        </div>

        <textarea
          value={problem}
          onChange={(event) =>
            setProblem(event.target.value)
          }
          placeholder="Describe the problem you are trying to solve..."
        />

        <div className="form-footer">
          <span>
            Be specific enough to challenge your assumptions.
          </span>

          <div className="button-group">
            <button
              type="button"
              className="failure-trigger"
              onClick={() => {
                setProblem("fail audit");
                runAudit("fail audit");
              }}
            >
              Test failure state
            </button>

            <button
              className="audit-button"
              onClick={() => runAudit()}
              disabled={problem.trim().length < 10}
            >
              Run decision audit →
            </button>
          </div>
        </div>
      </section>

      <section className="results-area">
        {toolState === "input-streaming" && (
          <ToolLifecycle
            state="input-streaming"
          />
        )}

        {toolState === "input-available" && (
          <>
            <ToolLifecycle
              state="input-available"
            />

            {toolInput && (
              <AuditInput input={toolInput} />
            )}
          </>
        )}

        {toolState === "output-available" && (
          <>
            <ToolLifecycle
              state="output-available"
            />

            {toolInput && (
              <AuditInput input={toolInput} />
            )}

            {toolResult && (
              <>
                <DecisionScore
                  score={toolResult.score}
                  risk={toolResult.risk}
                  recommendation={
                    toolResult.recommendation
                  }
                />

                <Findings
                  findings={toolResult.findings}
                  nextSteps={toolResult.nextSteps}
                />
              </>
            )}
          </>
        )}

        {toolState === "output-error" && (
          <>
            {toolInput && (
              <AuditInput input={toolInput} />
            )}

            <ToolError
              message={toolError}
            />
          </>
        )}

        {!toolState && (
          <div className="empty-state">
            <span className="eyebrow">
              TOOL-DRIVEN ANALYSIS
            </span>

            <h3>
              The result will appear as an interface,
              not a paragraph.
            </h3>

            <p>
              DevBrief exposes the Decision Audit
              lifecycle and turns structured server
              output into dedicated UI components.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;