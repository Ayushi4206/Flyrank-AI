import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DecisionScore from "./DecisionScore";

describe("DecisionScore", () => {
  it("renders the decision score", () => {
    render(
      <DecisionScore
        score={82}
        risk="Medium"
        recommendation="Start with a small prototype and validate the core problem."
      />
    );

    expect(
      screen.getByText("82")
    ).toBeInTheDocument();

    expect(
      screen.getByText("/100")
    ).toBeInTheDocument();
  });

  it("renders the implementation risk", () => {
    render(
      <DecisionScore
        score={65}
        risk="High"
        recommendation="Reduce the scope before investing in development."
      />
    );

    expect(
      screen.getByText(/High implementation risk/i)
    ).toBeInTheDocument();
  });

  it("renders the recommendation", () => {
    const recommendation =
      "Validate the problem with users before building additional features.";

    render(
      <DecisionScore
        score={90}
        risk="Low"
        recommendation={recommendation}
      />
    );

    expect(
      screen.getByText(recommendation)
    ).toBeInTheDocument();
  });

  it("renders different score values correctly", () => {
    render(
      <DecisionScore
        score={45}
        risk="High"
        recommendation="Gather more evidence before making the decision."
      />
    );

    expect(
      screen.getByText("45")
    ).toBeInTheDocument();
  });
});