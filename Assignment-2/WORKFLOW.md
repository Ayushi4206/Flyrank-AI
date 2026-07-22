# AI Workflow Comparison: Vague vs. Precise Prompting

## Overview
This document evaluates the practical differences between building a feature using a single vague prompt ("vague-prompt-attempt" branch) versus a structured, context-rich prompt ("drill1-precise-prompt" branch).

## Round 1: The Vague Prompt Approach
When given a lazy prompt like "Build a settings form with validation," the AI produced a generic, basic implementation. 
- **Mistake Caught:** The AI omitted proper accessibility attributes (`aria-invalid`, `aria-describedby`), lacked structured state management for field blurring, and wrote fragile validation logic that only checked inputs upon submission rather than providing real-time feedback.
- **Review Effort:** Fixing the Round 1 code would have required rewriting nearly the entire component to meet modern standards for accessibility and user experience.

## Round 2: The Precise Prompt Approach
By specifying explicit file paths, framework constraints (React), explicit validation rules (minimum characters, regex patterns), error state handling, and a testing checklist, the output changed drastically.
- **Correctness & Accessibility:** The generated component included robust inline validation, proper `onBlur` handlers, and full screen-reader support out of the box.
- **Review Effort:** The code was clean, modular, and practically production-ready on the first try.

## Conclusion
Directing AI with precise specifications, explicit constraints, and clear verification steps transforms it from a guessing tool into a reliable engineering partner.