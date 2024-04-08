import React from 'react';
import './boxplot-legend.css';


interface LegendItem {
  label: string;
  color: string;
}

interface BoxPlotLegendProps {
  legendItems: LegendItem[];
}

const BoxPlotLegend: React.FC<BoxPlotLegendProps> = ({ legendItems }) => {
  return (
    <div className="legend">
      {legendItems.map((item, index) => (
        <div key={index} className="legend-item">
          <span className="circle" style={{ backgroundColor: item.color }}></span>
          <span className="label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BoxPlotLegend;
