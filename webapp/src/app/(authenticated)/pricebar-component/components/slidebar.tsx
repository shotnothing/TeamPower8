"use client"

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Slider from '@mui/material/Slider';


// function valuetext(value: number) {
//   return `${value}`;
// }

// export default function DiscreteSlider() {
//   const handleChange = (event: Event, newValue: number | number[]) => {
//     // Handle the value change here
//     console.log(newValue); // For example, log the new value to the console
//   };

//   return (
//     <Box sx={{ width: 300 }}>
//       <Slider
//         aria-label="Temperature"
//         defaultValue={50}
//         getAriaValueText={valuetext}
//         valueLabelDisplay="auto"
//         onChange={handleChange} // Use the handleChange function
//         step={10}
//         marks={true}
//         min={0}
//         max={100}
//       />
//     </Box>
//   );
// }


import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

interface DiscreteSliderProps {
    handleChange: (newValue: number) => void;
}

function valuetext(value: number) {
  return `${value}`;
}

const DiscreteSlider: React.FC<DiscreteSliderProps> = ({ handleChange }) => {
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    // Forward the value change to the parent component
    if (typeof newValue === 'number') {
      handleChange(newValue);
    }
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        defaultValue={50}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        onChange={handleSliderChange}
        step={1}
        marks={false}
        min={0}
        max={100}
      />
    </Box>
  );
}

export default DiscreteSlider;
