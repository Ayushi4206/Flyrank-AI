import "dotenv/config";
import express from "express";
import cors from "cors";
import {
  auditDecisionSchema,
  executeAuditDecision,
} from "./tools/auditDecision.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/audit", async (req, res) => {
  try {
    // Validate that the request exists.
    const input = auditDecisionSchema.parse(req.body);

    // We stream lifecycle events to the frontend.
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const sendEvent = (event, data) => {
      res.write(
        `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
      );
    };

    // STATE 1: Input streaming
    sendEvent("tool-state", {
      state: "input-streaming",
      message: "DevBrief is reading the decision context...",
    });

    await new Promise((resolve) => setTimeout(resolve, 700));

    // STATE 2: Input available
    sendEvent("tool-state", {
      state: "input-available",
      input,
      message: "Decision context captured.",
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Run the actual server-side tool.
      const result = await executeAuditDecision(input);

      // STATE 3: Output available
      sendEvent("tool-state", {
        state: "output-available",
        result,
        message: "Decision audit complete.",
      });
    } catch (toolError) {
      // STATE 4: Output error
      sendEvent("tool-state", {
        state: "output-error",
        error:
          toolError.message ||
          "The decision audit could not be completed.",
      });
    }

    res.end();
  } catch (error) {
    console.error("Server error:", error);

    if (!res.headersSent) {
      res.status(400).json({
        error: error.message || "Invalid request.",
      });
    } else {
      res.write(
        `event: tool-state\ndata: ${JSON.stringify({
          state: "output-error",
          error: error.message || "Something went wrong.",
        })}\n\n`
      );

      res.end();
    }
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `DevBrief Generative UI server running on port ${PORT}`
  );
});