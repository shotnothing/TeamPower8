"use client"


// import React, { useRef, useEffect, useState } from 'react';
// import Boxplot from './components/boxplot';
// import CurrentPrices from './components/currentprices';
// import CurrentPricesMFLG from './components/currentprices-mflg';
// import OptimisedPrices from './components/optimisedprice';
// import OptimisedPriceDisplay from './components/optimisedpricedisplay';
// import DiscreteSlider from './components/slidebar'; // Import DiscreteSlider component
// import BoxPlotLegend from './components/boxplot-legend';
// import './pricebar.css';

// interface ProductData {
//     prices: number[];
//     product_price: number;
//     similar: number[];
//     similar_names: string[];
//     product_name : string;
// }

// function extractSimilarPrices(data: ProductData): { [key: string]: number } {
//     const prices: number[] = data.prices;
//     const similarIndices: number[] = data.similar;
//     const ProductNames: string[] = data.similar_names;
//     const productPrice: number = data.product_price;
//     const extractedData: { [key: string]: number } = {};

//     // Loop through similar indices and extract corresponding prices
//     for (let i = 0; i < prices.length; i++) {
//         // extractedData[similarIndices[i].toString()] = prices[i];
//         extractedData[ProductNames[i]] = prices[i];
//     };

//     // Add the product price under the key 'mflg'
//     extractedData['mflg'] = productPrice;


//     return extractedData;
// }

// interface PriceBarProps {
//     SimilarProducts: ProductData;
// }

// const PriceBar: React.FC<PriceBarProps> = ({ SimilarProducts }) => {

//     const extractedData = extractSimilarPrices(SimilarProducts);

//     const svgRef = useRef<SVGSVGElement>(null);
//     // const [data,setData] = useState({ e: 10, a: 30, mflg: 40, z:40, aw:43.95, y:40, x:40, f: 53, g: 70, az:53, i: 90, j: 200 , ah:92.5, ab:90, ac:90, ad:200, ax:51});
//     const [data,setData] = useState(extractedData);  
//     const [newData, setNewData] = useState({ k: 50 }); // State for newData
//     const [sliderValue, setSliderValue] = useState(50);// State for newData
//     const ProductName = SimilarProducts.product_name
//     const width = 1000;
//     const height = 200;
//     const legendItems = [
//         { label: 'MFLG product optimised price', color: 'red' },
//         { label: 'MFLG product current price', color: 'green' },
//         { label: 'Competitor product current price', color: 'steelblue' },
//     ];

//     const handleSliderChange = (newValue: number) => {
//         setSliderValue(newValue);
//     };

    

//     const handleUpdateData = () => {

//         // setData({});
//         // setNewData({});
    
//         const svg = svgRef.current;
//         if (svg) {
//             while (svg.firstChild) {
//                 svg.removeChild(svg.firstChild);
//             }
//         }
        
//         setData(extractedData);
//         // setData({ e: 10, a: 30, mflg: 40, z:40, aw:43.95, y:40, x:40, f: 53, g: 70, az:53, i: 90, j: 200 , ah:92.5, ab:90, ac:90, ad:200, ax:51});
//         setNewData({ k: sliderValue })
//     };

    

//     return (
//         <div className="container">
//             <div className="boxplot-container">
//                 <div className="content">
//                     <div className="prices">
//                         Slide to choose the percentile for optimised price of product.
//                         <div className="slider-button-container">
//                             <DiscreteSlider handleChange={handleSliderChange} />
//                             <button onClick={handleUpdateData}>Show optimised price</button>
//                             <OptimisedPriceDisplay data={data} newData={newData} />
//                         </div>
//                         <Boxplot data={data} svgRef={svgRef} width={width} height={height} />
//                         <CurrentPrices data={data} svgRef={svgRef} width={width} height={height} />
//                         <CurrentPricesMFLG data={data} svgRef={svgRef} width={width} height={height} productname={ProductName}/>
//                         <OptimisedPrices data={data} newData={newData} svgRef={svgRef} width={width} height={height} productname={ProductName}/>
//                         <BoxPlotLegend legendItems={legendItems} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default PriceBar;




import React, { useRef, useEffect, useState } from 'react';
import Boxplot from './components/boxplot';
import CurrentPrices from './components/currentprices';
import CurrentPricesMFLG from './components/currentprices-mflg';
import OptimisedPrices from './components/optimisedprice';
import OptimisedPriceDisplay from './components/optimisedpricedisplay';
import DiscreteSlider from './components/slidebar'; // Import DiscreteSlider component
import BoxPlotLegend from './components/boxplot-legend';
import './pricebar.css';


interface Analytics {
    prices: number[]; 
    product_price: number; 
    // original_price: number; 
    // discounted_price: number | null; 
    // similar: number[]; 
    similar_products: string[]; 
    product_name: string; 
    // rank: number; 
    // rank_normalized: number; 
}

// interface Product {
//     product_id: number; 
//     company: string; 
//     product_name: string; 
//     scrape_timestamp: string; 
//     description: string; 
//     original_price: number; 
//     discounted_price: number | null; 
//     source_url: string; 
//     remarks: string; 
//     image_url: string; 
//     tags: string; 
// }


function extractSimilarPrices(data: Analytics): { [key: string]: number } {
    const prices: number[] = data.prices;
    // const similarIndices: number[] = data.similar;
    // const ProductNames: string[] = data.similar_names;
    const productPrice: number = data.product_price;
    const extractedData: { [key: string]: number } = {};
    data.similar_products.forEach(productName => {
        const productPrice = prices[data.similar_products.indexOf(productName)]; 
        extractedData[productName] = productPrice;
    });
    
    extractedData['mflg'] = productPrice;


    return extractedData;
}

interface PriceBarProps {
    SimilarProducts: Analytics;
}

const PriceBar: React.FC<PriceBarProps> = ({ SimilarProducts }) => {
    const [data, setData] = useState({});
    

    useEffect(() => {
      const fetchData = async () => {
        try {
          const extractedData = await extractSimilarPrices(SimilarProducts);
          setData(extractedData);
        } catch (error) {
          // Handle errors if necessary
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
    }, [SimilarProducts]); // Include SimilarProducts in the dependency array if it's needed for data fetching
    
    console.log(data);
    
    const extractedData = extractSimilarPrices(SimilarProducts);
    console.log(extractedData);

    const svgRef = useRef<SVGSVGElement>(null);
    // const [data,setData] = useState(extractedData); 
    console.log(data); 
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
    // const ProductNumber = SimilarProducts.similar.length;

    const handleSliderChange = (newValue: number) => {
        setSliderValue(newValue);
    };
    

    const handleUpdateData = () => {

    
        const svg = svgRef.current;
        if (svg) {
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
        }

        setData(extractedData);
        setNewData({ k: sliderValue })
    };

    

    return (
        <>
        {Object.keys(data).length !== 1 &&(
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
        )}
    </>
    );
}

export default PriceBar;
