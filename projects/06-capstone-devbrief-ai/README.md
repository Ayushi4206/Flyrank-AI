# DevBrief — Generative Decision UI

DevBrief is a tool-driven React application that turns vague product ideas and technical decisions into structured implementation guidance.

Instead of returning a long block of text, the application simulates a server-side AI/tool workflow and renders the result as dedicated UI components such as a decision score, findings interface, recommendation, and designed error state.

This project was built for **Assignment 5: Generative UI**.

---

## Preview

Run locally:

```bash
npm start
```

The application will be available at:

```text
http://localhost:5173
```

The Express tool server runs on:

```text
http://localhost:3001
```

---

## What the Application Does

A user can submit either:

- A **Product Problem**
- A **Technical Decision**

For example:

> I want to build an AI-powered platform that helps college students manage internship applications, but I am unsure which feature should be built first.

The application sends this structured input to a server-side decision audit tool.

The tool analyzes the request and returns structured data including:

- Decision score
- Implementation risk
- Recommendation
- Core problem
- Weak assumption
- Biggest risk
- Recommended next steps

The frontend then converts this structured output into dedicated UI components.

---

# Tool Contract

## Tool Name

```text
auditDecision
```

## Tool Definition File

```text
server/tools/auditDecision.js
```

The tool uses **Zod** to validate incoming data before executing the decision audit.

---

## Input Schema

The tool accepts the following structure:

```js
{
  problem: string,
  type: "product" | "technical"
}
```

The Zod schema is:

```js
export const auditDecisionSchema = z.object({
  problem: z
    .string()
    .min(
      10,
      "Please provide a more detailed problem description."
    )
    .describe(
      "The product idea or technical decision to audit."
    ),

  type: z
    .enum(["product", "technical"])
    .describe(
      "Whether this is a product problem or technical decision."
    ),
});
```

### Schema Fields

| Field | Type | Description |
|---|---|---|
| `problem` | `string` | The product idea or technical problem to analyze |
| `type` | `product \| technical` | Determines which decision context the tool should evaluate |

---

# Return Shape

The server-side tool returns structured data in the following format:

```js
{
  score: 78,
  risk: "High",
  recommendation:
    "Do not build multiple features at once.",

  findings: [
    {
      title: "Core problem",
      description:
        "The product scope needs to be narrowed before implementation."
    },
    {
      title: "Weak assumption",
      description:
        "More features will make the product more useful."
    },
    {
      title: "Biggest risk",
      description:
        "Building before validating which feature actually matters."
    }
  ],

  nextSteps: [
    "Define the smallest successful user outcome.",
    "Build only the minimum path required to test it.",
    "Measure where the first version breaks before expanding scope."
  ]
}
```

The frontend does not render this object as raw JSON.

Instead, each part of the result is transformed into a dedicated interface.

---

# Tool Lifecycle

The application visually represents the tool lifecycle as four distinct states.

## 1. Input Streaming

```text
input-streaming
```

The application indicates that the server-side tool is receiving and processing the user's input.

This state answers:

> What is happening right now?

---

## 2. Input Available

```text
input-available
```

The validated structured input is displayed back to the user.

The UI shows:

- Problem type
- Submitted problem
- Input status

This state answers:

> What information is the tool working with?

---

## 3. Output Available

```text
output-available
```

The completed decision audit is rendered as Generative UI components.

The result includes:

### Decision Score

Rendered as a visual score indicator.

```text
78 / 100
```

### Audit Findings

Rendered as structured finding rows:

```text
01  Core problem
02  Weak assumption
03  Biggest risk
```

### Insight Components

Additional findings are displayed as dedicated cards:

- Biggest Assumption
- Recommended Next Move
- Primary Risk

This state answers:

> What did the tool discover?

---

## 4. Output Error

```text
output-error
```

A failed tool execution does not crash the application.

Instead, a dedicated `ToolError` component displays a designed error state.

The project intentionally supports failure testing.

If the submitted problem contains:

```text
fail
```

the server-side tool throws an error.

For example:

```text
fail audit
```

This allows the application to demonstrate the complete error lifecycle.

---

# Generative UI Components

The application transforms structured tool output into dedicated React components.

## `ToolLifecycle.jsx`

Displays the current state of the tool execution.

Supported states:

```text
input-streaming
input-available
output-available
output-error
```

---

## `AuditInput.jsx`

Displays the validated structured input returned during the tool lifecycle.

It shows the submitted problem and its decision type.

---

## `DecisionScore.jsx`

Renders:

- Decision score
- Implementation risk
- Analysis focus

The score is displayed visually using an SVG circular progress indicator.

---

## `FindingsTable.jsx`

Transforms the tool's `findings` array into structured UI rows.

It also renders:

- Biggest Assumption
- Recommended Next Move
- Primary Risk

---

## `ToolError.jsx`

Provides a dedicated failure interface when the server-side tool cannot complete successfully.

The application remains functional instead of displaying a crash or raw server error.

---

# Project Structure

```text
05-generative-ui/
│
├── server/
│   ├── index.js
│   │
│   └── tools/
│       └── auditDecision.js
│
├── src/
│   ├── components/
│   │   ├── AuditInput.jsx
│   │   ├── DecisionScore.jsx
│   │   ├── FindingsTable.jsx
│   │   ├── ToolError.jsx
│   │   └── ToolLifecycle.jsx
│   │
│   ├── assets/
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── public/
│
├── package.json
├── vite.config.js
└── README.md
```

---

# Tech Stack

- React
- Vite
- Node.js
- Express
- Zod
- Server-Sent Events style streaming
- SVG for the decision score visualization

---

# Installation

Clone the repository and navigate to this project:

```bash
cd projects/05-generative-ui
```

Install dependencies:

```bash
npm install
```

---

# Running the Application

Start both the frontend and server:

```bash
npm start
```

This runs:

```text
Frontend → Vite
Backend → Express
```

Frontend:

```text
http://localhost:5173
```

Tool server:

```text
http://localhost:3001
```

---

# Testing

## Test 1 — Product Problem

Select:

```text
Product problem
```

Try:

```text
I want to build an AI-powered platform that helps college students manage internship applications. My plan is to include application tracking, AI resume feedback, job recommendations, interview preparation, networking suggestions, and automated reminders in the first version. I have not yet validated which problem students struggle with most. What should I build first?
```

Expected result:

- High implementation risk
- Decision score
- Core problem
- Weak assumption
- Biggest risk
- Recommended next move

---

## Test 2 — Technical Decision

Select:

```text
Technical decision
```

Try:

```text
I am building a React application that currently stores all user chat data locally. I expect the application to eventually support multiple users, persistent chat history, authentication, and access from different devices. I am unsure whether I should continue using local state or introduce a backend database and API now.
```

Expected result:

- Technical decision analysis
- Different score
- Architecture-focused recommendation
- Structured findings

---

## Test 3 — Failure State

Click:

```text
Test failure state
```

This sends:

```text
fail audit
```

The server intentionally throws an error and the frontend renders the designed `output-error` state.

---

# Assignment Requirements Covered

- [x] Server-side tool
- [x] Typed Zod schema
- [x] Tool execute function
- [x] Input streaming state
- [x] Input available state
- [x] Output available state
- [x] Output error state
- [x] Distinct UI treatment for each state
- [x] Tool result rendered as UI components
- [x] Decision score visualization
- [x] Findings component
- [x] Designed error state
- [x] Documented tool contract
- [x] Documented input schema
- [x] Documented return shape

---

## Key Design Decision

The main goal of this project is to demonstrate that a tool result should not automatically become a paragraph or JSON dump.

The server returns structured data, and the frontend decides how each part should be represented.

```text
User Input
    ↓
Server-Side Tool
    ↓
Zod Validation
    ↓
Structured Tool Result
    ↓
Tool Lifecycle States
    ↓
Generative UI Components
```

This separates the application's reasoning and data layer from its presentation layer, allowing structured tool output to become a real interface.