import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AuditInput from "./AuditInput";

describe("AuditInput", () => {
  it("renders nothing when input is not provided", () => {
    const { container } = render(
      <AuditInput input={null} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a product problem correctly", () => {
    render(
      <AuditInput
        input={{
          type: "product",
          problem:
            "I want to build an app that helps students find internships.",
        }}
      />
    );

    expect(
      screen.getByText("TOOL INPUT AVAILABLE")
    ).toBeInTheDocument();

    expect(
      screen.getByText("PRODUCT PROBLEM")
    ).toBeInTheDocument();

    expect(
      screen.getByText("READY")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "I want to build an app that helps students find internships."
      )
    ).toBeInTheDocument();
  });

  it("renders a technical decision correctly", () => {
    render(
      <AuditInput
        input={{
          type: "technical",
          problem:
            "I need to decide whether to use a backend database for my application.",
        }}
      />
    );

    expect(
      screen.getByText("TECHNICAL DECISION")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "I need to decide whether to use a backend database for my application."
      )
    ).toBeInTheDocument();
  });
});