/**
 * Unit type for the UnitValueStepper component
 */
export type UnitType = '%' | 'px';

/**
 * Props for the UnitValueStepper component
 */
export interface UnitValueStepperProps {
  /**
   * Initial unit value
   * @default '%'
   */
  initialUnit?: UnitType;
  
  /**
   * Initial numeric value
   * @default 0
   */
  initialValue?: number;
  
  /**
   * Callback function called when the value changes
   */
  onChange?: (value: number, unit: UnitType) => void;
}
