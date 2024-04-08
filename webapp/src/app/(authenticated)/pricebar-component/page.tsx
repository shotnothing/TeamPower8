"use client"


import React, { useRef, useEffect, useState } from 'react';
import Boxplot from './components/boxplot';
import CurrentPrices from './components/currentprices';
import CurrentPricesMFLG from './components/currentprices-mflg';
import OptimisedPrices from './components/optimisedprice';
import DiscreteSlider from './components/slidebar'; // Import DiscreteSlider component
import BoxPlotLegend from './components/boxplot-legend';
import './pricebar.css';

interface ProductData {
    prices: number[];
    product_price: number;
    ranking: number;
    similar: number[];
}

function extractSimilarPrices(data: ProductData): { [key: string]: number } {
    const prices: number[] = data.prices;
    const similarIndices: number[] = data.similar;
    const productPrice: number = data.product_price;
    const extractedData: { [key: string]: number } = {};

    // Loop through similar indices and extract corresponding prices
    for (let i = 0; i < prices.length; i++) {
        extractedData[similarIndices[i].toString()] = prices[i];
    };

    // Add the product price under the key 'mflg'
    extractedData['mflg'] = productPrice;


    return extractedData;
}



const PriceBar = () => {
    const sample_similar_products: ProductData = {
        "prices": [10.0, 12.0, 13.0, 24.5, 26.0, 40.0],
        "product_price": 25.0,
        "ranking": 0.82,
        "similar": [3, 5, 6, 20, 35, 49]
    };

    const extractedData = extractSimilarPrices(sample_similar_products);

    const svgRef = useRef<SVGSVGElement>(null);
    // const [data,setData] = useState({ e: 10, a: 30, mflg: 40, z:40, aw:43.95, y:40, x:40, f: 53, g: 70, az:53, i: 90, j: 200 , ah:92.5, ab:90, ac:90, ad:200, ax:51});
    const [data,setData] = useState(extractedData);  
    const [newData, setNewData] = useState({ k: 50 }); // State for newData
    const [sliderValue, setSliderValue] = useState(50);// State for newData
    const width = 500;
    const height = 150;
    const legendItems = [
        { label: 'MFLG product optimised price', color: 'red' },
        { label: 'MFLG product current price', color: 'green' },
        { label: 'Competitor product current price', color: 'steelblue' },
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
        setData(extractedData);
        // setData({ e: 10, a: 30, mflg: 40, z:40, aw:43.95, y:40, x:40, f: 53, g: 70, az:53, i: 90, j: 200 , ah:92.5, ab:90, ac:90, ad:200, ax:51});
        setNewData({ k: sliderValue })
    };
    
    // const handleSliderChange = (newValue: number) => {
    //     setSliderValue(newValue);


    //     setData({});
    //     setNewData({});
    
    //     const svg = svgRef.current;
    //     if (svg) {
    //         while (svg.firstChild) {
    //             svg.removeChild(svg.firstChild);
    //         }
    //     }
    //     setData(extractedData);
    //     // setData({ e: 10, a: 30, mflg: 40, z:40, aw:43.95, y:40, x:40, f: 53, g: 70, az:53, i: 90, j: 200 , ah:92.5, ab:90, ac:90, ad:200, ax:51});
    //     setNewData({ k: newValue })
    // };
    

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
