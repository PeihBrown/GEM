import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import App from "../App";

it("renders UnitValueStepper component", () => {
  render(<App />);

  // Check if unit buttons are rendered
  expect(screen.getByText('%')).toBeInTheDocument();
  expect(screen.getByText('px')).toBeInTheDocument();

  // Check if value input is rendered
  expect(screen.getByRole('textbox')).toBeInTheDocument();

  // Check if increment/decrement buttons are rendered
  expect(screen.getByText('−')).toBeInTheDocument();
  expect(screen.getByText('+')).toBeInTheDocument();
});
