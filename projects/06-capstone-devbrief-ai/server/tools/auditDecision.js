import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

export const auditDecisionSchema = z.object({
  problem: z
    .string()
    .min(
      10,
      "Please provide a more detailed problem description."
    ),

  type: z.enum(["product", "technical"]),
});

const auditResultSchema = z.object({
  score: z.number().int().min(0).max(100),

  risk: z.enum(["Low", "Medium", "High"]),

  recommendation: z.string().min(10),

  biggestAssumption: z.string().min(10),

  primaryRisk: z.string().min(10),

  recommendedNextMove: z.string().min(10),

  findings: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .min(3)
    .max(5),

  nextSteps: z
    .array(z.string())
    .min(3)
    .max(5),
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const responseSchema = {
  type: "object",

  properties: {
    score: {
      type: "integer",
      description:
        "Decision readiness score from 0 to 100.",
    },

    risk: {
      type: "string",
      enum: ["Low", "Medium", "High"],
      description:
        "Overall risk level of the decision.",
    },

    recommendation: {
      type: "string",
      description:
        "The main recommendation for the user.",
    },

    biggestAssumption: {
      type: "string",
      description:
        "The single biggest assumption the user is making.",
    },

    primaryRisk: {
      type: "string",
      description:
        "The single most important risk in the decision.",
    },

    recommendedNextMove: {
      type: "string",
      description:
        "The single most useful action the user should take next.",
    },

    findings: {
      type: "array",

      items: {
        type: "object",

        properties: {
          title: {
            type: "string",
          },

          description: {
            type: "string",
          },
        },

        required: [
          "title",
          "description",
        ],
      },

      minItems: 3,
      maxItems: 5,
    },

    nextSteps: {
      type: "array",

      items: {
        type: "string",
      },

      minItems: 3,
      maxItems: 5,
    },
  },

  required: [
    "score",
    "risk",
    "recommendation",
    "biggestAssumption",
    "primaryRisk",
    "recommendedNextMove",
    "findings",
    "nextSteps",
  ],
};

export async function executeAuditDecision(input) {
  const validatedInput =
    auditDecisionSchema.parse(input);

  const { problem, type } = validatedInput;

  // Deliberate failure path for testing error handling.
  if (
    problem
      .toLowerCase()
      .includes("fail audit")
  ) {
    throw new Error(
      "The decision audit could not be completed. This is a controlled error used to test the application's failure state."
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "The AI service is not configured. GEMINI_API_KEY is missing."
    );
  }

  const prompt = `
You are DevBrief AI, an AI-powered decision auditor.

Your job is to critically analyze a user's decision.

You are NOT a generic chatbot.

You must identify weak assumptions, missing evidence,
scope problems, technical risks, and the most useful
next action.

DECISION TYPE:
${type}

USER'S PROBLEM:
${problem}

Analyze the decision using these rules:

1. Give a decision readiness score from 0 to 100.

2. Assign exactly one overall risk level:
Low, Medium, or High.

3. Give one specific overall recommendation.

4. Identify the SINGLE biggest assumption being made.
Do not say that no assumption exists unless the user's
problem genuinely contains no assumption.

5. Identify the SINGLE most important risk.
Do not say that no risk exists unless there is genuinely
no meaningful risk.

6. Give the SINGLE most useful next move the user should
take before expanding or committing to the decision.

7. Return between 3 and 5 findings.

8. Each finding must identify something concrete:
a problem, weak assumption, missing evidence,
risk, trade-off, scope issue, or important constraint.

9. Do not invent facts that the user did not provide.

10. Provide between 3 and 5 practical next steps.

11. Be critical, specific, concise, and actionable.

Avoid generic responses such as:
"Do more research"
"Consider the risks"
"It depends"

Base every conclusion on the user's actual problem.
`;

  try {
    let response;
    let lastError;

    const maxAttempts = 3;

    for (
      let attempt = 1;
      attempt <= maxAttempts;
      attempt++
    ) {
      try {
        response =
          await ai.models.generateContent({
            model: "gemini-3.6-flash",

            contents: prompt,

            config: {
              responseMimeType:
                "application/json",

              responseSchema,
            },
          });

        break;
      } catch (error) {
        lastError = error;

        const isTemporaryError =
          error.status === 429 ||
          error.status === 500 ||
          error.status === 503;

        if (
          !isTemporaryError ||
          attempt === maxAttempts
        ) {
          throw error;
        }

        const delay =
          attempt * 1500;

        console.log(
          `Gemini request failed. Retrying in ${delay}ms...`
        );

        await new Promise(
          (resolve) =>
            setTimeout(resolve, delay)
        );
      }
    }

    if (!response) {
      throw (
        lastError ||
        new Error(
          "The AI service did not return a response."
        )
      );
    }

    if (!response.text) {
      throw new Error(
        "The AI service returned an empty response."
      );
    }

    const result =
      JSON.parse(response.text);

    return auditResultSchema.parse(result);

  } catch (error) {
  console.error(
    "AI decision audit error:",
    error
  );

  if (error instanceof z.ZodError) {
    throw new Error(
      "The AI returned a response in an invalid format.",
      {
        cause: error,
      }
    );
  }

    throw new Error(
      error.message ||
      "The AI decision audit could not be completed.",
      {
        cause: error,
      }
    );
  }
}