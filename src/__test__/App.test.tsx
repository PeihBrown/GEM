import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import App from "../App";

it("renders UnitValueStepper component", () => {
  render(<App />);

  // Check if unit buttons are rendered
  expect(screen.getByText('%')).toBeDefined();
  expect(screen.getByText('px')).toBeDefined();

  // Check if value input is rendered
  expect(screen.getByRole('textbox')).toBeDefined();

  // Check if increment/decrement buttons are rendered
  expect(screen.getByText('−')).toBeDefined();
  expect(screen.getByText('+')).toBeDefined();
});
