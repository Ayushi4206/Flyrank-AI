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
    if (problemToAudit.trim().length < 10) return;

    // Reset previous audit state
    setToolState(null);
    setToolInput(null);
    setToolResult(null);
    setToolError(null);

    try {
      const response = await fetch(
        "/api/audit",
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
            "Unable to complete the decision audit."
        );

        return;
      }

      if (!response.body) {
        throw new Error(
          "The analysis service did not return a response stream."
        );
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
            try {
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
            } catch (error) {
              console.error(
                "Failed to parse analysis event:",
                error
              );
            }
          }
        });
      }
    } catch (error) {
      console.error("Audit request failed:", error);

      setToolState("output-error");

      setToolError(
        "Unable to connect to the analysis service. Please check your connection and try again."
      );
    }
  };

  const handleRetry = () => {
    if (problem.trim().length >= 10) {
      runAudit();
    }
  };

  const handleProductType = () => {
    setType("product");
  };

  const handleTechnicalType = () => {
    setType("technical");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">
            AI-POWERED DECISION AUDIT
          </span>

          <h2>DevBrief AI</h2>
        </div>

        <div
          className="system-status"
          aria-label="Analysis service status"
        >
          <span className="status-dot" />
          Analysis service online
        </div>
      </header>

      <section className="hero">
        <span className="eyebrow">
          PRODUCT & TECHNICAL DECISIONS
        </span>

        <h1>
          Turn uncertainty into
          <span> a decision you can defend.</span>
        </h1>

        <p>
          Describe a product idea or technical decision.
          DevBrief AI analyzes assumptions, identifies
          risks, and turns unstructured problems into
          clear, actionable next steps.
        </p>
      </section>

      <section
        className="audit-form"
        aria-label="Decision audit form"
      >
        <div
          className="type-selector"
          role="group"
          aria-label="Select decision type"
        >
          <button
            type="button"
            className={
              type === "product" ? "active" : ""
            }
            onClick={handleProductType}
            aria-pressed={type === "product"}
          >
            Product problem
          </button>

          <button
            type="button"
            className={
              type === "technical" ? "active" : ""
            }
            onClick={handleTechnicalType}
            aria-pressed={type === "technical"}
          >
            Technical decision
          </button>
        </div>

        <label
          htmlFor="problem-input"
          className="sr-only"
        >
          Describe the problem or decision you want to analyze
        </label>

        <textarea
          id="problem-input"
          value={problem}
          onChange={(event) =>
            setProblem(event.target.value)
          }
          placeholder={
            type === "product"
              ? "Describe the product problem you are trying to solve..."
              : "Describe the technical decision you are trying to make..."
          }
          aria-describedby="problem-help"
        />

        <div className="form-footer">
          <span id="problem-help">
            {type === "product"
              ? "Describe the user problem, your proposed solution, and any assumptions you are making."
              : "Describe the technical context, options, constraints, and trade-offs involved."}
          </span>

          <div className="button-group">
            <button
              type="button"
              className="failure-trigger"
              onClick={() => {
                const failureTest =
                  "fail audit for testing error handling";

                setProblem(failureTest);
                runAudit(failureTest);
              }}
            >
              Test error handling
            </button>

            <button
              type="button"
              className="audit-button"
              onClick={() => runAudit()}
              disabled={problem.trim().length < 10}
            >
              Run AI decision audit →
            </button>
          </div>
        </div>
      </section>

      <section
        className="results-area"
        aria-live="polite"
        aria-label="Decision audit results"
      >
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
              <AuditInput
                input={toolInput}
              />
            )}
          </>
        )}

        {toolState === "output-available" && (
          <>
            <ToolLifecycle
              state="output-available"
            />

            {toolInput && (
              <AuditInput
                input={toolInput}
              />
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
                  biggestAssumption={
                     toolResult.biggestAssumption
                   }
                  primaryRisk={
                    toolResult.primaryRisk
                  }
                  recommendedNextMove={
                    toolResult.recommendedNextMove
                  }
                />
              </>
            )}
          </>
        )}

        {toolState === "output-error" && (
          <>
            {toolInput && (
              <AuditInput
                input={toolInput}
              />
            )}

            <ToolError
              error={toolError}
              input={toolInput}
              onRetry={handleRetry}
            />
          </>
        )}

        {!toolState && (
          <div className="empty-state">
            <span className="eyebrow">
              STRUCTURED AI ANALYSIS
            </span>

            <h3>
              Get a decision audit, not another wall of AI text.
            </h3>

            <p>
              DevBrief AI converts your problem into
              structured findings, highlights weak
              assumptions, identifies key risks, and
              recommends the next action.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;