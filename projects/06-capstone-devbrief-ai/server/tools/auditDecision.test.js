import { describe, expect, it } from "vitest";
import { auditDecisionSchema } from "./auditDecision.js";

describe("auditDecisionSchema", () => {
  it("accepts a valid product problem", () => {
    const input = {
      problem:
        "I want to build an AI tool that helps students plan their study schedule.",
      type: "product",
    };

    const result = auditDecisionSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("accepts a valid technical decision", () => {
    const input = {
      problem:
        "I need to decide whether the application should use a separate backend service.",
      type: "technical",
    };

    const result = auditDecisionSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects a problem that is too short", () => {
    const input = {
      problem: "Bad idea",
      type: "product",
    };

    const result = auditDecisionSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects an invalid decision type", () => {
    const input = {
      problem:
        "I want to build an application for managing university projects.",
      type: "random",
    };

    const result = auditDecisionSchema.safeParse(input);

    expect(result.success).toBe(false);
  });
});