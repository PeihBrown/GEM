import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UnitValueStepper from './UnitValueStepper';

describe('UnitValueStepper', () => {
  it('renders with default values', () => {
    render(<UnitValueStepper />);

    // Check if unit buttons are rendered
    expect(screen.getByText('%')).toBeDefined();
    expect(screen.getByText('px')).toBeDefined();

    // Check if value input is rendered with default value
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('0');

    // Check if increment/decrement buttons are rendered
    expect(screen.getByText('−')).toBeDefined();
    expect(screen.getByText('+')).toBeDefined();
  });

  it('renders with custom initial values', () => {
    render(<UnitValueStepper initialUnit="px" initialValue={50} />);

    // Check if value input has the initial value
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('50');
  });

  it('handles unit change correctly', () => {
    const onChange = vi.fn();
    render(<UnitValueStepper initialValue={150} onChange={onChange} />);

    const percentButton = screen.getByText('%');
    const pxButton = screen.getByText('px');

    // Switch to px unit
    fireEvent.click(pxButton);
    expect(onChange).toHaveBeenCalledWith(150, 'px');

    // Switch back to % unit, value should be capped at 100
    fireEvent.click(percentButton);
    expect(onChange).toHaveBeenCalledWith(100, '%');

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('100');
  });

  it('handles increment and decrement correctly', () => {
    const onChange = vi.fn();
    render(<UnitValueStepper initialValue={50} onChange={onChange} />);

    const incrementButton = screen.getByText('+');
    const decrementButton = screen.getByText('−');

    // Increment
    fireEvent.click(incrementButton);
    expect(onChange).toHaveBeenCalledWith(51, '%');

    // Decrement
    fireEvent.click(decrementButton);
    expect(onChange).toHaveBeenCalledWith(50, '%');
  });

  it('disables decrement button when value is 0', () => {
    render(<UnitValueStepper initialValue={0} />);

    const decrementButton = screen.getByText('−') as HTMLButtonElement;
    expect(decrementButton.disabled).toBe(true);
  });

  it('disables increment button when value is 100 and unit is %', () => {
    render(<UnitValueStepper initialValue={100} />);

    const incrementButton = screen.getByText('+') as HTMLButtonElement;
    expect(incrementButton.disabled).toBe(true);
  });

  it('allows increment beyond 100 when unit is px', () => {
    const onChange = vi.fn();
    render(<UnitValueStepper initialUnit="px" initialValue={100} onChange={onChange} />);

    const incrementButton = screen.getByText('+') as HTMLButtonElement;
    expect(incrementButton.disabled).toBe(false);

    fireEvent.click(incrementButton);
    expect(onChange).toHaveBeenCalledWith(101, 'px');
  });

  it('handles input change correctly', () => {
    const onChange = vi.fn();
    render(<UnitValueStepper onChange={onChange} />);

    const input = screen.getByRole('textbox');

    // Valid input
    fireEvent.change(input, { target: { value: '42' } });
    expect(onChange).toHaveBeenCalledWith(42, '%');

    // Input with comma
    fireEvent.change(input, { target: { value: '12,5' } });
    expect(onChange).toHaveBeenCalledWith(12.5, '%');
  });

  it('handles invalid input on blur', () => {
    render(<UnitValueStepper initialValue={50} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Invalid input
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);

    // Should revert to previous valid value
    expect(input.value).toBe('50');

    // Negative input
    fireEvent.change(input, { target: { value: '-10' } });
    fireEvent.blur(input);

    // Should reset to 0
    expect(input.value).toBe('0');
  });

  it('caps value at 100 when unit is %', () => {
    render(<UnitValueStepper initialValue={50} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Input greater than 100
    fireEvent.change(input, { target: { value: '150' } });
    fireEvent.blur(input);

    // Should revert to previous valid value (50)
    expect(input.value).toBe('50');
  });

  it('handles input with characters in the middle correctly', () => {
    render(<UnitValueStepper initialValue={50} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Input with characters in the middle
    fireEvent.change(input, { target: { value: '12a3' } });
    fireEvent.blur(input);

    // Should keep only the digits before the first non-numeric character
    expect(input.value).toBe('12');
  });

  it('handles input with characters at the beginning correctly', () => {
    render(<UnitValueStepper initialValue={50} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Input with characters at the beginning
    fireEvent.change(input, { target: { value: 'a123' } });
    fireEvent.blur(input);

    // Should revert to previous valid value
    expect(input.value).toBe('50');
  });

  it('handles input with characters at the end correctly', () => {
    render(<UnitValueStepper initialValue={50} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Input with characters at the end
    fireEvent.change(input, { target: { value: '123a' } });
    fireEvent.blur(input);

    // Should keep only the digits
    expect(input.value).toBe('123');
  });
});
