DevBrief AI — AI-Powered Decision Audit

DevBrief AI is an AI-powered decision auditing application that helps users evaluate product ideas and technical decisions before committing to implementation.

Instead of returning an unstructured wall of AI-generated text, DevBrief AI converts a user's problem into a structured decision audit containing:

Decision readiness score
Overall risk level
Critical findings
Biggest assumption
Primary risk
Recommended next move
Practical next steps

The application combines a React frontend, server-side AI execution, Gemini integration, structured JSON generation, Zod validation, streaming lifecycle states, error handling, automated testing, and deployment.

This project is the main capstone project of my Frontend Development Internship at FlyRank AI.

Live Demo

Deployed Application:
👉 PASTE YOUR VERCEL LINK HERE

Run the project locally:

npm install
npm start

The application runs with:

Frontend → http://localhost:5173
Backend → http://localhost:3001
What DevBrief AI Does

Users can submit one of two decision types:

Product Problem

For example:

I want to build an AI-powered platform that helps college students manage internship applications. I am planning to include application tracking, AI resume feedback, job recommendations, interview preparation, networking suggestions, and automated reminders in the first version. I have not yet validated which problem students struggle with most. What should I build first?

DevBrief AI analyzes the idea and identifies:

Scope problems
Weak assumptions
Missing evidence
Implementation risks
Recommended next actions
Technical Decision

For example:

I am building a React application that currently stores all user chat data locally. I expect the application to eventually support multiple users, persistent chat history, authentication, and access from different devices. I am unsure whether I should continue using local state or introduce a backend database and API now.

The system evaluates the technical context and returns structured guidance based on the constraints and trade-offs described.

Application Architecture
User Input
    │
    ▼
React Frontend
    │
    │ POST Request
    ▼
Server-Side API
    │
    ▼
Zod Input Validation
    │
    ▼
AI Decision Audit Tool
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
Streaming Tool Lifecycle Events
    │
    ▼
Generative UI Components

The core design principle is that AI-generated data should not simply be displayed as a paragraph or raw JSON.

Instead, structured output is mapped to dedicated UI components.

Tool Lifecycle

DevBrief AI represents the AI execution process through distinct lifecycle states.

1. Input Streaming
input-streaming

The application indicates that the submitted decision context is being processed.

Example message:

DevBrief is reading the decision context...
2. Input Available
input-available

The validated structured input becomes available to the frontend.

The UI displays:

Decision type
Submitted problem
Input status

This makes it clear what information the AI tool is analyzing.

3. Output Available
output-available

The completed AI analysis is received and transformed into dedicated UI components.

The output includes:

Decision score
Overall risk
Recommendation
Audit findings
Biggest assumption
Primary risk
Recommended next move
Practical next steps
4. Output Error
output-error

If the AI tool fails, the application does not crash or expose raw implementation details.

Instead, DevBrief AI renders a dedicated error interface containing:

Error status
Error message
Failed request
Retry functionality
Tool Contract

The main server-side decision tool is located at:

server/tools/auditDecision.js

The tool validates incoming requests before processing them.

Input
{
  problem: string,
  type: "product" | "technical"
}
Input Validation

The application uses Zod to validate the submitted decision.

export const auditDecisionSchema = z.object({
  problem: z
    .string()
    .min(
      10,
      "Please provide a more detailed problem description."
    ),

  type: z.enum([
    "product",
    "technical",
  ]),
});

This prevents invalid or incomplete input from reaching the AI tool.

Structured AI Response

The AI is instructed to return structured JSON rather than unstructured text.

The response contains:

{
  score: 78,

  risk: "High",

  recommendation:
    "Validate the core user problem before expanding the feature set.",

  biggestAssumption:
    "The assumption that multiple features will provide more value before validating which problem matters most.",

  primaryRisk:
    "Building a large feature set before confirming actual user demand.",

  recommendedNextMove:
    "Identify the single most painful problem students face during internship applications.",

  findings: [
    {
      title: "Scope problem",
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

The response is validated again using Zod before being returned to the frontend.

This creates two validation layers:

User Input
    ↓
Zod Validation
    ↓
AI Tool
    ↓
Structured AI Output
    ↓
Zod Validation
    ↓
Frontend UI
Generative UI Components

The application does not display the AI response as a single text block.

Each part of the structured response is rendered using dedicated React components.

ToolLifecycle.jsx

Displays the current lifecycle state of the AI tool.

Supported states:

input-streaming
input-available
output-available
output-error
AuditInput.jsx

Displays the validated input received by the server.

It shows:

Decision category
Submitted problem
Input status
DecisionScore.jsx

Displays the decision readiness score using an SVG circular progress indicator.

It also presents:

Overall risk level
Main recommendation
Analysis focus

Example:

78 / 100
High Implementation Risk
FindingsTable.jsx

Transforms structured findings into a readable audit interface.

It displays:

Individual findings
Biggest assumption
Recommended next move
Primary risk
ToolError.jsx

Handles failed AI execution.

Instead of crashing the application, it displays a structured failure state with a retry action.

Error Handling

The project includes deliberate error testing.

Submitting a problem containing:

fail audit

triggers a controlled failure in the server-side tool.

This allows the application to demonstrate the complete failure lifecycle:

User Request
    ↓
Tool Execution
    ↓
Controlled Failure
    ↓
output-error Event
    ↓
ToolError Component
    ↓
Retry Analysis

The retry action allows the user to submit the request again without manually rebuilding the application state.

API

For deployment, the project includes a serverless API endpoint:

api/audit.js

The endpoint:

Receives the user's decision.
Validates the request with Zod.
Sends lifecycle events to the frontend.
Executes the AI decision audit.
Streams the structured result.
Handles AI or validation failures.

The frontend processes the streamed events and updates the UI according to the current lifecycle state.

Streaming Flow

The backend sends events representing the tool lifecycle.

Example:

input-streaming
        ↓
input-available
        ↓
output-available

If execution fails:

input-streaming
        ↓
input-available
        ↓
output-error

The frontend reads the response stream and updates the application state dynamically.

Testing

The project includes automated tests using Vitest.

The following components and functionality are covered:

Component / Feature	Tests
AuditInput	3
DecisionScore	4
FindingsTable	5
ToolError	3
auditDecision tool	4
Total	19

Run all tests:

npm run test:run

Example result:

Test Files  5 passed
Tests       19 passed
Code Quality

The project uses ESLint for static code analysis.

Run:

npm run lint

The project was verified with:

npm run lint
npm run test:run
npm run build

The production build is generated using:

npm run build
Project Structure
06-capstone-devbrief-ai/
│
├── api/
│   └── audit.js
│
├── server/
│   ├── index.js
│   │
│   └── tools/
│       ├── auditDecision.js
│       └── auditDecision.test.js
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── AuditInput.jsx
│   │   ├── AuditInput.test.jsx
│   │   ├── DecisionScore.jsx
│   │   ├── DecisionScore.test.jsx
│   │   ├── FindingsTable.jsx
│   │   ├── FindingsTable.test.jsx
│   │   ├── ToolError.jsx
│   │   ├── ToolError.test.jsx
│   │   └── ToolLifecycle.jsx
│   │
│   ├── test/
│   │   └── setup.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── public/
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
Tech Stack
Frontend
React
Vite
CSS
Backend
Node.js
Express
AI
Google Gemini
Structured JSON generation
Validation
Zod
Testing
Vitest
React Testing Library
Deployment
Vercel
Serverless API functions
Installation

Clone the repository:

git clone YOUR_REPOSITORY_URL

Navigate to the project:

cd projects/06-capstone-devbrief-ai

Install dependencies:

npm install

Create a .env file:

GEMINI_API_KEY=your_api_key_here

Start the complete local application:

npm start
Available Scripts
Command	Purpose
npm start	Runs the frontend and backend together
npm run dev	Starts the Vite development server
npm run server	Starts the Express server
npm run test:run	Runs the automated test suite
npm run lint	Runs ESLint
npm run build	Creates a production build
npm run preview	Previews the production build locally
Testing the Application
Product Decision

Select:

Product problem

Try:

I want to build an AI-powered platform that helps college students manage internship applications. My plan is to include application tracking, AI resume feedback, job recommendations, interview preparation, networking suggestions, and automated reminders in the first version. I have not yet validated which problem students struggle with most. What should I build first?

The expected output should analyze:

Feature scope
Assumptions
User validation gaps
Implementation risk
Recommended next action
Technical Decision

Select:

Technical decision

Try:

I am building a React application that currently stores all user chat data locally. I expect the application to eventually support multiple users, persistent chat history, authentication, and access from different devices. I am unsure whether I should continue using local state or introduce a backend database and API now.

The expected output should focus on:

Architecture
Scalability
Trade-offs
Technical risks
Recommended next steps
Error State

Click:

Test error handling

The application submits a controlled failure request.

Expected lifecycle:

input-streaming
        ↓
input-available
        ↓
output-error

The dedicated error interface should appear with a retry option.

Key Design Decisions
Structured Output Instead of Raw AI Text

The AI returns structured data that is validated before rendering.

This allows different parts of the response to be represented appropriately:

Score
  → Visual indicator

Findings
  → Structured rows

Assumption
  → Insight card

Primary risk
  → Dedicated risk section

Next move
  → Action-focused recommendation
Server-Side AI Execution

The Gemini API key remains on the server side.

The frontend does not directly expose the AI service credentials.

Validation Before and After AI Execution

The application validates:

Incoming user input.
AI-generated structured output.

This reduces the risk of invalid data reaching the interface.

Explicit Failure States

AI applications can fail because of:

Invalid input
Missing configuration
API failures
Rate limits
Temporary service errors
Invalid AI responses

DevBrief AI treats failure as an explicit UI state rather than allowing the application to silently fail or crash.

Final Verification

Before deployment, the project was checked using:

npm run lint
npm run test:run
npm run build

Current automated test result:

Test Files  5 passed
Tests       19 passed
Capstone Summary

DevBrief AI demonstrates a complete AI-powered frontend workflow:

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

The project focuses on a central principle:

AI output should be treated as structured application data, not automatically displayed as a wall of generated text.

By combining structured AI responses, validation, lifecycle-aware UI states, dedicated components, error recovery, automated testing, and deployment, DevBrief AI functions as a complete AI-powered decision analysis application and serves as the final capstone project for my Frontend Development Internship at FlyRank AI.