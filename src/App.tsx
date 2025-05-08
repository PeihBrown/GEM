import { useState } from 'react';
import UnitValueStepper, { UnitType } from './components/UnitValueStepper';

const App = () => {
  const [value, setValue] = useState<number>(1.0);
  const [unit, setUnit] = useState<UnitType>('%');

  const handleChange = (newValue: number, newUnit: UnitType) => {
    setValue(newValue);
    setUnit(newUnit);
    console.log(`Value: ${newValue}, Unit: ${newUnit}`);
  };

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
      <div className="w-[500px] bg-[#181818] p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-6">Unit Value Stepper Component</h2>
        <p className="mb-6 text-gray-400">Current value: {value}{unit}</p>

        <div className="flex">
          <UnitValueStepper
            initialValue={1.0}
            initialUnit="%"
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
