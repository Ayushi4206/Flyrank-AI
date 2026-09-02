import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FindingsTable from "./FindingsTable";

describe("FindingsTable", () => {
  const findings = [
    {
      title: "Weak assumption",
      description:
        "You are assuming that students need all features in the first version.",
    },
    {
      title: "Primary risk",
      description:
        "Building too many features before validating demand increases development risk.",
    },
    {
      title: "Validation gap",
      description:
        "There is no evidence yet that users will use every proposed feature.",
    },
  ];

  const nextSteps = [
    "Interview potential users before building the full platform.",
    "Identify the single most important user problem.",
    "Build a smaller prototype and test it.",
  ];

  it("renders all findings", () => {
    render(
      <FindingsTable
        findings={findings}
        nextSteps={nextSteps}
      />
    );

    expect(
      screen.getByText("Weak assumption")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Primary risk")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Validation gap")
    ).toBeInTheDocument();
  });

  it("displays the biggest assumption", () => {
    render(
      <FindingsTable
        findings={findings}
        nextSteps={nextSteps}
      />
    );

    expect(
      screen.getByText(
        "You are assuming that students need all features in the first version."
      )
    ).toBeInTheDocument();
  });

  it("displays the primary risk", () => {
    render(
      <FindingsTable
        findings={findings}
        nextSteps={nextSteps}
      />
    );

    expect(
      screen.getByText(
        "Building too many features before validating demand increases development risk."
      )
    ).toBeInTheDocument();
  });

  it("displays the first next step as the recommended next move", () => {
    render(
      <FindingsTable
        findings={findings}
        nextSteps={nextSteps}
      />
    );

    expect(
      screen.getByText(
        "Interview potential users before building the full platform."
      )
    ).toBeInTheDocument();
  });

  it("renders fallback text when no matching assumption or risk exists", () => {
    render(
      <FindingsTable
        findings={[
          {
            title: "General finding",
            description: "A general observation.",
          },
        ]}
        nextSteps={[]}
      />
    );

    expect(
      screen.getByText(
        "No major assumption was identified."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "No major implementation risk was identified."
      )
    ).toBeInTheDocument();
  });
});