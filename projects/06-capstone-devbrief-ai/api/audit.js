import {
  auditDecisionSchema,
  executeAuditDecision,
} from "../server/tools/auditDecision.js";

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed.",
    });
  }

  try {
    const input = auditDecisionSchema.parse(req.body);

    res.setHeader(
      "Content-Type",
      "text/event-stream"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache, no-transform"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    const sendEvent = (event, data) => {
      res.write(
        `event: ${event}\ndata: ${JSON.stringify(
          data
        )}\n\n`
      );
    };

    // STATE 1: Input streaming
    sendEvent("tool-state", {
      state: "input-streaming",
      message:
        "DevBrief is reading the decision context...",
    });

    await delay(700);

    // STATE 2: Input available
    sendEvent("tool-state", {
      state: "input-available",
      input,
      message: "Decision context captured.",
    });

    await delay(500);

    try {
      const result =
        await executeAuditDecision(input);

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
    console.error(
      "Vercel API error:",
      error
    );

    if (!res.headersSent) {
      return res.status(400).json({
        error:
          error.message ||
          "Invalid request.",
      });
    }

    res.write(
      `event: tool-state\ndata: ${JSON.stringify({
        state: "output-error",
        error:
          error.message ||
          "Something went wrong.",
      })}\n\n`
    );

    res.end();
  }
}