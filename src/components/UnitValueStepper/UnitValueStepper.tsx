import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { UnitType, UnitValueStepperProps } from './types';

/**
 * UnitValueStepper component that allows selecting a unit (% or px) and inputting a numeric value
 * with increment/decrement buttons.
 *
 * @param props - Component props
 * @returns React component
 */
const UnitValueStepper = ({
  initialUnit = '%',
  initialValue = 0,
  onChange,
}: UnitValueStepperProps) => {
  const [unit, setUnit] = useState<UnitType>(initialUnit);
  const [value, setValue] = useState<number>(initialValue);
  const [inputValue, setInputValue] = useState<string>(initialValue.toString());
  const [isInputHovered, setIsInputHovered] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const previousValueRef = useRef<number>(initialValue);

  /**
   * Handles unit change and enforces value constraints when switching from px to %
   *
   * @param newUnit - The new unit value
   */
  const handleUnitChange = (newUnit: UnitType) => {
    if (newUnit === unit) return;

    let newValue = value;

    // If switching from px to % and value > 100, cap at 100
    if (unit === 'px' && newUnit === '%' && value > 100) {
      newValue = 100;
      setValue(newValue);
      setInputValue('100');
    }

    setUnit(newUnit);

    if (onChange) {
      onChange(newValue, newUnit);
    }
  };

  /**
   * Validates and formats the input value
   *
   * @param input - The string input to validate and format
   * @returns The validated and formatted numeric value
   */
  const validateAndFormatInput = (input: string): number => {
    // Replace comma with period
    let formattedInput = input.replace(',', '.');

    // Handle special cases for character removal
    if (/^\d+[^\d.]+.*$/.test(formattedInput)) {
      // Case like "123a" or "12a3" - keep only the digits before the first non-numeric character
      formattedInput = formattedInput.match(/^\d+/)?.[0] || '';
    } else {
      // Remove any non-numeric characters except for the decimal point
      formattedInput = formattedInput.replace(/[^\d.-]/g, '');
    }

    // Parse the input as a float
    let numValue = parseFloat(formattedInput);

    // If parsing fails, return the previous valid value
    if (isNaN(numValue)) {
      return previousValueRef.current;
    }

    // Apply constraints based on unit
    if (unit === '%') {
      if (numValue < 0) numValue = 0;
      if (numValue > 100) numValue = previousValueRef.current;
    } else {
      if (numValue < 0) numValue = 0;
    }

    return numValue;
  };

  /**
   * Handles input change events
   *
   * @param e - Change event from the input field
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputStr = e.target.value;
    setInputValue(inputStr);

    // Store the current value as the last valid value before any new input
    if (inputStr.trim() !== '' && !isNaN(parseFloat(inputStr.replace(',', '.')))) {
      const numValue = parseFloat(inputStr.replace(',', '.'));

      // Only update if the value is valid for the current unit
      if (!(unit === '%' && numValue > 100)) {
        setValue(numValue);
        previousValueRef.current = numValue;

        if (onChange) {
          onChange(numValue, unit);
        }
      }
    }
  };

  /**
   * Handles input blur events to validate and format the value
   */
  const handleInputBlur = () => {
    const validatedValue = validateAndFormatInput(inputValue);

    setValue(validatedValue);
    setInputValue(validatedValue.toString());
    previousValueRef.current = validatedValue;

    if (onChange) {
      onChange(validatedValue, unit);
    }
  };

  /**
   * Increments the current value
   */
  const incrementValue = () => {
    const newValue = value + 1;

    // Don't increment beyond 100 if unit is %
    if (unit === '%' && newValue > 100) return;

    setValue(newValue);
    setInputValue(newValue.toString());
    previousValueRef.current = newValue;

    if (onChange) {
      onChange(newValue, unit);
    }
  };

  /**
   * Decrements the current value
   */
  const decrementValue = () => {
    const newValue = value - 1;

    // Don't decrement below 0
    if (newValue < 0) return;

    setValue(newValue);
    setInputValue(newValue.toString());
    previousValueRef.current = newValue;

    if (onChange) {
      onChange(newValue, unit);
    }
  };

  // Update the input value when the value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  return (
    <div className="flex flex-col gap-8">
      {/* Unit Row */}
      <div className="flex items-center">
        <div className="text-white text-2xl w-24">Unit</div>
        <div className="w-[200px] h-[55px] p-[1px] rounded-xl bg-[#212121]">
          <div className="flex w-full h-full relative">
            {/* Active background with rounded corners */}
            <div
              className={`absolute h-[calc(100%-6px)] top-[3px] rounded-lg transition-all duration-200 bg-[#3B3B3B]`}
              style={{
                width: 'calc(50% - 6px)',
                left: unit === '%' ? '3px' : 'calc(50% + 3px)'
              }}
            />

            {/* Buttons */}
            <button
              className={`flex-1 z-10 flex items-center justify-center text-xl font-medium ${
                unit === '%' ? 'text-white' : 'text-gray-400'
              } hover:text-white transition-colors relative`}
              onClick={() => handleUnitChange('%')}
            >
              %
            </button>
            <button
              className={`flex-1 z-10 flex items-center justify-center text-xl font-medium ${
                unit === 'px' ? 'text-white' : 'text-gray-400'
              } hover:text-white transition-colors relative`}
              onClick={() => handleUnitChange('px')}
            >
              px
            </button>
          </div>
        </div>
      </div>

      {/* Value Row */}
      <div className="flex items-center">
        <div className="text-white text-2xl w-24">Value</div>
        <div className={`w-[200px] h-[55px] flex rounded-xl overflow-hidden ${isInputFocused ? 'outline outline-2 outline-[#3C67FF]' : ''}`}>
          <button
            className={`w-[50%] h-full text-lg flex items-center justify-center ${
              isInputHovered ? 'bg-[#3B3B3B]' : 'bg-[#212121]'
            } hover:bg-[#3B3B3B] transition-colors text-lg font-medium ${
              value <= 0 ? 'text-[#AAAAAA]' : 'text-white'
            }`}
            onClick={decrementValue}
            disabled={value <= 0}
          >
            −
          </button>
          <input
            type="text"
            className="w-full h-full bg-[#212121] hover:bg-[#3B3B3B] focus:bg-[#212121] focus:outline-none text-center text-white text-lg font-medium transition-all"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={() => {
              handleInputBlur();
              setIsInputFocused(false);
            }}
            onFocus={() => setIsInputFocused(true)}
            onMouseEnter={() => setIsInputHovered(true)}
            onMouseLeave={() => setIsInputHovered(false)}
          />
          <button
            className={`w-[50%] h-full text-lg flex items-center justify-center ${
              isInputHovered ? 'bg-[#3B3B3B]' : 'bg-[#212121]'
            } hover:bg-[#3B3B3B] transition-colors text-lg font-medium ${
              unit === '%' && value >= 100 ? 'text-[#AAAAAA]' : 'text-white'
            }`}
            onClick={incrementValue}
            disabled={unit === '%' && value >= 100}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitValueStepper;
