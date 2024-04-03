"use client"


import React, { useRef, useEffect, useState } from 'react';
import Boxplot from './components/boxplot';
import CurrentPrices from './components/currentprices';
import CurrentPricesMFLG from './components/currentprices-mflg';
import OptimisedPrices from './components/optimisedprice';
import DiscreteSlider from './components/slidebar'; // Import DiscreteSlider component
import BoxPlotLegend from './components/boxplot-legend';
import './pricebar.css';

const PriceBar = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [data,setData] = useState({ e: 10, a: 30, mflg: 40, f: 53, g: 70, i: 90, j: 200 }); 
    const [newData, setNewData] = useState({ k: 50 }); // State for newData
    const [sliderValue, setSliderValue] = useState(50);// State for newData
    const width = 500;
    const height = 150;
    const legendItems = [
        { label: 'MFLG product optimised price', color: 'red' },
        { label: 'MFLG product current price', color: 'green' },
        { label: 'Competitor product current price', color: 'blue' },
      ];

    const handleSliderChange = (newValue: number) => {
        setSliderValue(newValue);
    };

    const handleUpdateData = () => {

        setData({});
        setNewData({});
    
        const svg = svgRef.current;
        if (svg) {
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
        }
        setData({ e: 10, a: 30, mflg: 40, f: 53, g: 70, i: 90, j: 200 });
        setNewData({ k: sliderValue })
    };
    
    

    return (
        <div className="container">
            <div className="boxplot-container">
                <div className="content">
                    <div className="prices">
                        <h5>Slide to choose percentile</h5>
                        <div className="slider-button-container">
                            <DiscreteSlider handleChange={handleSliderChange} />
                            <button onClick={handleUpdateData}>Show optimised price</button>
                        </div>
                        <Boxplot data={data} svgRef={svgRef} width={width} height={height} />
                        <CurrentPrices data={data} svgRef={svgRef} width={width} height={height} />
                        <CurrentPricesMFLG data={data} svgRef={svgRef} width={width} height={height} />
                        <OptimisedPrices data={data} newData={newData} svgRef={svgRef} width={width} height={height}/>
                        <BoxPlotLegend legendItems={legendItems} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PriceBar;
