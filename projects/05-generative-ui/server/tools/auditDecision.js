import { z } from "zod";

export const auditDecisionSchema = z.object({
  problem: z
    .string()
    .min(10, "Please provide a more detailed problem description.")
    .describe("The product idea or technical decision to audit."),

  type: z
    .enum(["product", "technical"])
    .describe(
      "Whether this is a product problem or technical decision."
    ),
});

export async function executeAuditDecision(input) {
  const validatedInput = auditDecisionSchema.parse(input);

  const { problem, type } = validatedInput;

  // Intentionally trigger a designed error state for testing.
  if (problem.toLowerCase().includes("fail")) {
    throw new Error(
      "The decision audit could not be completed. Try describing the problem with more concrete context."
    );
  }

  // Simulate tool processing.
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const lowerProblem = problem.toLowerCase();

  let score = 72;
  let risk = "Medium";

  let recommendation =
    "Start with the smallest testable implementation.";

  if (
    lowerProblem.includes("database") ||
    lowerProblem.includes("backend") ||
    lowerProblem.includes("architecture")
  ) {
    score = 84;
    risk = "Medium";

    recommendation =
      "Keep the first version simple, but introduce a backend boundary now so persistence can scale without rewriting the client.";
  }

  if (
    lowerProblem.includes("feature") ||
    lowerProblem.includes("product") ||
    lowerProblem.includes("idea")
  ) {
    score = 78;
    risk = "High";

    recommendation =
      "Do not build multiple features at once. Identify the single user action that proves the product is useful and build that first.";
  }

  return {
    score,
    risk,
    recommendation,

    findings: [
      {
        title: "Core problem",
        description:
          type === "product"
            ? "The product scope needs to be narrowed before implementation."
            : "The technical decision should be evaluated against future complexity, not just current convenience.",
      },
      {
        title: "Weak assumption",
        description:
          type === "product"
            ? "More features will make the product more useful."
            : "The simplest current implementation will remain simple as the application grows.",
      },
      {
        title: "Biggest risk",
        description:
          type === "product"
            ? "Building before validating which feature actually matters."
            : "Creating architecture that is either too temporary or unnecessarily complex.",
      },
    ],

    nextSteps: [
      "Define the smallest successful user outcome.",
      "Build only the minimum path required to test it.",
      "Measure where the first version breaks before expanding scope.",
    ],
  };
}