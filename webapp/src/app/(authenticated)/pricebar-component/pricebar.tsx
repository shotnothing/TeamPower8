"use client"


import React, { useRef, useEffect, useState } from 'react';
import Boxplot from './components/boxplot';
import CurrentPrices from './components/currentprices';
import CurrentPricesMFLG from './components/currentprices-mflg';
import OptimisedPrices from './components/optimisedprice';
import OptimisedPriceDisplay from './components/optimisedpricedisplay';
import DiscreteSlider from './components/slidebar'; // Import DiscreteSlider component
import BoxPlotLegend from './components/boxplot-legend';
import './pricebar.css';

// interface ProductData {
//     prices: number[];
//     product_price: number;
//     ranking: number;
//     similar: number[];
// }

// function extractSimilarPrices(data: ProductData): { [key: string]: number } {
//     const prices: number[] = data.prices;
//     const similarIndices: number[] = data.similar;
//     const productPrice: number = data.product_price;
//     const extractedData: { [key: string]: number } = {};


interface ProductData {
    prices: number[];
    product_price: number;
    similar: number[];
    similar_names: string[];
    product_name : string;
}

function extractSimilarPrices(data: ProductData): { [key: string]: number } {
    const prices: number[] = data.prices;
    const similarIndices: number[] = data.similar;
    const ProductNames: string[] = data.similar_names;
    const productPrice: number = data.product_price;
    const extractedData: { [key: string]: number } = {};

    // Loop through similar indices and extract corresponding prices
    for (let i = 0; i < prices.length; i++) {
        // extractedData[similarIndices[i].toString()] = prices[i];
        extractedData[ProductNames[i]] = prices[i];
    };

    // Add the product price under the key 'mflg'
    extractedData['mflg'] = productPrice;


    return extractedData;
}

// async function fetchAnalyticsData(apiEndpoint: string): Promise<ProductData> {
//     try {
//         const response = await fetch(apiEndpoint);
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         return data;
//     } catch (error: any) {
//         throw new Error('There was a problem with the fetch operation: ' + error.message);
//     }
// }
   
interface PriceBarProps {
    SimilarProducts: ProductData;
}

const PriceBar: React.FC<PriceBarProps> = ({ SimilarProducts }) => {
    // const SimilarProducts: ProductData = {
    //         "prices": [10.0, 12.0, 13.0, 24.5, 26.0, 40.0],
    //         "product_price": 25.0,
    //         "similar": [3, 5, 6, 20, 35, 49],
    //         "similar_names": ["a","b","c","d","e","f"],
    //         "product_name" : "Splashtopia @ Sentosa Palawan Green"
    //     };

    // const [SimilarProducts, setSimilarProducts] = useState(
        // {
        //     "prices": [10.0, 12.0, 13.0, 24.5, 26.0, 40.0],
        //     "product_price": 25.0,
        //     "similar": [3, 5, 6, 20, 35, 49],
        //     "similar_names": ["a","b","c","d","e","f"],
        //     "product_name" : "Splashtopia @ Sentosa Palawan Green"
        // }
    // );

    // const sampleSimilarProducts = fetchAnalyticsData('http://13.250.110.218/api/analytics/p/5/');
    // const fetchData = async () => {
    //     try {
    //         const data = await fetchAnalyticsData('http://13.250.110.218/api/analytics/p/5/');
    //         setSimilarProducts(data);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };
    
    // useEffect(() => {
    //     fetchData();
    // }, []);
    


    const extractedData = extractSimilarPrices(SimilarProducts);

    const svgRef = useRef<SVGSVGElement>(null);
    // const [data,setData] = useState({ e: 10, a: 30, mflg: 40, z:40, aw:43.95, y:40, x:40, f: 53, g: 70, az:53, i: 90, j: 200 , ah:92.5, ab:90, ac:90, ad:200, ax:51});
    const [data,setData] = useState(extractedData);  
    const [newData, setNewData] = useState({ k: 50 }); // State for newData
    const [sliderValue, setSliderValue] = useState(50);// State for newData
    const ProductName = SimilarProducts.product_name
    const width = 1000;
    const height = 200;
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
                        <h5>Slide to choose the percentile for optimised price of product</h5>
                        <div className="slider-button-container">
                            <DiscreteSlider handleChange={handleSliderChange} />
                            <button onClick={handleUpdateData}>Show optimised price</button>
                            <OptimisedPriceDisplay data={data} newData={newData} />
                        </div>
                        <Boxplot data={data} svgRef={svgRef} width={width} height={height} />
                        <CurrentPrices data={data} svgRef={svgRef} width={width} height={height} />
                        <CurrentPricesMFLG data={data} svgRef={svgRef} width={width} height={height} productname={ProductName}/>
                        <OptimisedPrices data={data} newData={newData} svgRef={svgRef} width={width} height={height} productname={ProductName}/>
                        <BoxPlotLegend legendItems={legendItems} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PriceBar;

