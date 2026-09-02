# 🧠 DevBrief AI

### Turn uncertainty into a decision you can defend.

DevBrief AI is an AI-powered decision auditing application that analyzes **product ideas** and **technical decisions** before implementation.

Instead of generating another wall of AI text, DevBrief transforms a user's problem into a structured decision audit with actionable insights, risks, assumptions, and next steps.

> **Main Capstone Project — Frontend Development Internship at FlyRank AI**

---

## 🚀 Live Demo

🔗 **[Open DevBrief AI](https://devbrief-3vsrf9xhf-ayushi-projects1.vercel.app)**

---

## ✨ What It Does

Users describe a decision they are trying to make and choose between two contexts:

### 📦 Product Problem

Example:

> I want to build an AI-powered platform for students managing internship applications, but I am planning to build application tracking, resume feedback, job recommendations, interview preparation, networking, and reminders in the first version.

DevBrief analyzes the idea and identifies:

- 🎯 Decision readiness
- ⚠️ Implementation risk
- 🔍 Weak assumptions
- 📉 Missing evidence
- 🚧 Scope problems
- ➡️ Recommended next actions

### ⚙️ Technical Decision

Example:

> My React application currently stores all user data locally, but I expect to support multiple users, authentication, persistent history, and multiple devices.

DevBrief evaluates the technical context and highlights:

- Architecture concerns
- Scalability issues
- Technical trade-offs
- Implementation risks
- Recommended next steps

---

# 🖥️ How DevBrief Works

```text
User describes a decision
          │
          ▼
   React Frontend
          │
          ▼
   Server-Side API
          │
          ▼
   Zod Input Validation
          │
          ▼
   AI Decision Tool
          │
          ▼
      Gemini AI
          │
          ▼
 Structured JSON Response
          │
          ▼
   Zod Output Validation
          │
          ▼
 Streaming Lifecycle Events
          │
          ▼
   Generative UI Components
```

The core idea behind the project is simple:

> **AI output should behave like application data, not like a paragraph generator.**

Each part of the AI response is transformed into a dedicated interface.

---

# 🧩 Generative UI

DevBrief does not render the AI response as raw JSON or a large text block.

Instead, structured output becomes different UI components.

| AI Output | UI Representation |
|---|---|
| Decision Score | SVG circular visualization |
| Risk Level | Decision signal |
| Findings | Structured audit rows |
| Biggest Assumption | Insight card |
| Primary Risk | Dedicated risk section |
| Recommended Next Move | Action-focused insight |
| Tool Failure | Dedicated error interface |

---

# 🔄 AI Tool Lifecycle

The application visually represents the execution process.

```text
INPUT STREAMING
       ↓
INPUT AVAILABLE
       ↓
OUTPUT AVAILABLE
```

If the AI tool fails:

```text
INPUT STREAMING
       ↓
INPUT AVAILABLE
       ↓
OUTPUT ERROR
```

### 1️⃣ Input Streaming

The system is processing the submitted decision.

```text
DevBrief is reading the decision context...
```

### 2️⃣ Input Available

The validated input is displayed so the user can see exactly what the AI tool is analyzing.

### 3️⃣ Output Available

The completed audit is transformed into:

- Decision score
- Risk level
- Recommendation
- Audit findings
- Biggest assumption
- Primary risk
- Recommended next move
- Practical next steps

### 4️⃣ Output Error

Failures are treated as an explicit application state.

Instead of crashing the UI, DevBrief displays:

- Error status
- Error message
- Failed request
- Retry action

---

# 🧠 Structured AI Response

The server requests structured JSON from Gemini and validates the result before it reaches the frontend.

Example:

```js
{
  score: 78,

  risk: "High",

  recommendation:
    "Validate the core user problem before expanding the feature set.",

  biggestAssumption:
    "Multiple features will provide more value before validating what users actually need.",

  primaryRisk:
    "Building a large feature set before confirming real user demand.",

  recommendedNextMove:
    "Identify the single most painful problem users currently face.",

  findings: [
    {
      title: "Scope Problem",
      description:
        "The first version attempts to solve several different problems simultaneously."
    }
  ],

  nextSteps: [
    "Identify the highest-priority user problem.",
    "Validate the problem with potential users.",
    "Build the smallest version capable of testing the assumption."
  ]
}
```

The response passes through two validation layers:

```text
User Input
    ↓
Zod Validation
    ↓
AI Decision Tool
    ↓
Structured AI Output
    ↓
Zod Validation
    ↓
Generative UI
```

---

# 🛠️ Tech Stack

### Frontend

- React
- Vite
- CSS

### Backend

- Node.js
- Express

### AI

- Google Gemini
- Structured JSON generation

### Validation

- Zod

### Testing

- Vitest
- React Testing Library

### Deployment

- Vercel
- Serverless API Functions

---

# 🧪 Testing

The project includes automated tests for UI components and the AI decision tool.

| Component / Feature | Tests |
|---|---:|
| AuditInput | 3 |
| DecisionScore | 4 |
| FindingsTable | 5 |
| ToolError | 3 |
| auditDecision Tool | 4 |
| **Total** | **19** |

Run the complete test suite:

```bash
npm run test:run
```

Expected result:

```text
Test Files  5 passed
Tests      19 passed
```

---

# 🧹 Code Quality

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Full verification:

```bash
npm run lint
npm run test:run
npm run build
```

---

# ⚠️ Error Handling

DevBrief includes a deliberate failure path to test the application's error lifecycle.

Using:

```text
fail audit
```

causes the server-side tool to trigger a controlled failure.

The application then follows:

```text
User Request
      ↓
Tool Execution
      ↓
Controlled Failure
      ↓
output-error
      ↓
ToolError Component
      ↓
Retry Analysis
```

This demonstrates that AI failures are handled as part of the application's UX instead of being ignored or causing a crash.

---

# 🎯 Key Engineering Decisions

### Structured Output Over Raw AI Text

The AI response is treated as structured application data.

```text
Score → Visualization

Findings → Structured UI

Assumption → Insight Card

Risk → Dedicated Section

Next Move → Action Recommendation
```

### Server-Side AI Execution

The Gemini API key remains on the server side and is not exposed directly to the frontend.

### Validation Before and After AI Execution

Both user input and AI-generated output are validated with Zod.

```text
User → Validation → AI → Validation → UI
```

### Explicit Failure States

AI applications can fail because of:

- Invalid input
- Missing configuration
- API failures
- Rate limits
- Temporary service failures
- Invalid AI output

DevBrief treats these as explicit UI states.

---

# 🏁 Final Verification

The project was verified using:

```bash
npm run lint
npm run test:run
npm run build
```

Current test status:

```text
✓ 5 Test Files Passed
✓ 19 Tests Passed
✓ ESLint Passed
✓ Production Build Passed
```

---

# 📌 Capstone Summary

DevBrief AI demonstrates a complete AI-powered frontend workflow:

```text
User Decision
      ↓
React Interface
      ↓
Server-Side API
      ↓
Input Validation
      ↓
AI Decision Tool
      ↓
Gemini AI
      ↓
Structured JSON
      ↓
Output Validation
      ↓
Streaming Lifecycle Events
      ↓
Generative UI Components
      ↓
Structured Decision Audit
```

The project demonstrates how an AI-powered application can move beyond chat-style responses and convert AI output into a structured, interactive user experience.

---

**Built as the main capstone project for the Frontend Development Internship at FlyRank AI.**