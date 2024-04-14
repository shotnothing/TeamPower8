"use client"


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
    <Box sx={{ width: 500 }}>
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
