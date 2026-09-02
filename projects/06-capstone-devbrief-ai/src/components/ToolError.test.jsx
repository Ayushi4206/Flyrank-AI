import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ToolError from "./ToolError";

describe("ToolError", () => {
  it("renders the error message", () => {
    render(
      <ToolError
        message="The AI service could not process the request."
        input={null}
        onRetry={() => {}}
      />
    );

    expect(
      screen.getByText(
        "The AI service could not process the request."
      )
    ).toBeInTheDocument();
  });

  it("shows the failed request when input is provided", () => {
    render(
      <ToolError
        message="Something went wrong."
        input={{
          problem:
            "Should we build an AI-powered platform for students?",
        }}
        onRetry={() => {}}
      />
    );

    expect(
      screen.getByText(
        "Should we build an AI-powered platform for students?"
      )
    ).toBeInTheDocument();
  });

  it("calls onRetry when the retry button is clicked", () => {
    const handleRetry = vi.fn();

    render(
      <ToolError
        message="Something went wrong."
        input={null}
        onRetry={handleRetry}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /retry analysis/i,
      })
    );

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});