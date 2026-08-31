import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function buildDevBriefResponse(messages) {
  const latestUserMessage =
    messages
      .filter((message) => message.role === "user")
      .at(-1)?.content || "";

  const input = latestUserMessage.toLowerCase();

  // Detect the type of problem
  const isProductIdea =
    input.includes("product") ||
    input.includes("app") ||
    input.includes("platform") ||
    input.includes("mvp") ||
    input.includes("idea");

  const isTechnical =
    input.includes("technical") ||
    input.includes("architecture") ||
    input.includes("api") ||
    input.includes("database") ||
    input.includes("bug") ||
    input.includes("system");

  let response = "";

  if (isProductIdea) {
    response = `Here's how I would break this down.

1. THE REAL PROBLEM

Before deciding what to build, define the user problem in one sentence. A vague product idea usually fails because the feature list grows before anyone proves that a specific user actually needs the solution.

2. WEAK ASSUMPTION TO TEST

The assumption that needs evidence is that users will need every feature you are imagining. Do not build the full platform first.

Ask:
• Who is the first specific user?
• What problem do they currently solve badly?
• Why would they switch to your solution?

3. SMALLEST USEFUL MVP

Build only the flow that proves the core value:

User input
→ One important processing step
→ One useful result
→ Clear next action

Everything else should be delayed until users validate that loop.

4. TECHNICAL DECISION

Start with the simplest architecture you can explain and deploy. Avoid adding microservices, multiple databases, or complex AI pipelines before the core workflow works.

5. NEXT STEPS

• Define one target user.
• Write their main problem in one sentence.
• List every proposed feature.
• Mark only one feature as essential.
• Build and test that smallest workflow first.

The next useful step is to tell me your exact product idea, and I can challenge the feature list and define the MVP more precisely.`;
  } else if (isTechnical) {
    response = `Let's turn this technical problem into implementation decisions.

1. DEFINE THE FAILURE

The first mistake is usually trying to solve the architecture before defining exactly what is failing.

Write down:
• What should happen?
• What happens instead?
• Where does the failure occur?
• Can it be reproduced consistently?

2. ISOLATE THE SYSTEM

Break the problem into:

Input
→ Processing
→ State
→ External dependencies
→ Output

Test each boundary separately. Do not change five things at once.

3. SMALLEST FIX

Find the smallest change that proves your hypothesis. If the fix requires rewriting the whole system before you understand the bug, your diagnosis is weak.

4. TRADE-OFFS

Prefer the solution that is:

• Easier to debug
• Easier to test
• Cheap to reverse
• Simple enough for the current scale

Do not optimize for scale that you do not have yet.

5. IMPLEMENTATION PLAN

Step 1: Reproduce the issue.
Step 2: Log the relevant input and state.
Step 3: Identify the failing boundary.
Step 4: Test one hypothesis.
Step 5: Apply the smallest fix.
Step 6: Add a regression test.

Send me the specific technical problem and I can break down the architecture or debugging path in detail.`;
  } else {
    response = `Let's make this more concrete.

THE PROBLEM

"${latestUserMessage}"

The current description gives a starting point, but the main missing information is the actual outcome you want.

Before building anything, separate three things:

1. WHAT YOU WANT

Describe the final result in measurable terms.

2. WHAT IS BLOCKING YOU

Identify whether the problem is:
• Missing information
• A technical constraint
• Too many possible approaches
• A product decision
• An implementation bug

3. THE NEXT DECISION

Do not solve the entire problem at once. Find the next irreversible or high-impact decision and focus there first.

A useful approach is:

Current situation
→ Specific problem
→ Constraints
→ Options
→ Trade-offs
→ Smallest next action

Give me more context about what you are building or trying to solve, and I will break it into concrete implementation decisions.`;
  }

  return response;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Messages are required.",
      });
    }

    res.setHeader(
      "Content-Type",
      "text/plain; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache, no-transform"
    );

    res.setHeader("Connection", "keep-alive");

    const response = buildDevBriefResponse(messages);

    // Small delay so the thinking indicator is visible.
    await delay(700);

    // Stream the response word by word.
    const words = response.split(" ");

    for (let i = 0; i < words.length; i++) {
      const word =
        i === words.length - 1
          ? words[i]
          : `${words[i]} `;

      res.write(word);

      // Vary the delay slightly to make the stream natural.
      await delay(18 + Math.random() * 35);
    }

    res.end();
  } catch (error) {
    console.error("Streaming error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to generate a response.",
      });
    } else {
      res.end();
    }
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `DevBrief streaming server running on port ${PORT}`
  );
});