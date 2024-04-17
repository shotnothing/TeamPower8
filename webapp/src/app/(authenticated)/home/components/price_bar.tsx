// "use client"

// import React, { useState, useRef } from 'react';
// import Boxplot from '../../pricebar-component/components/boxplot';
// import CurrentPricesMFLG from '../../pricebar-component/components/currentprices-mflg';

// interface ProductData {
//     prices: number[];
//     product_price: number;
//     similar: number[];
//     product_name : string;
// }

// interface PriceBarProps {
//     sampleSimilarProducts: ProductData;
// }


// function extractSimilarPrices(data: ProductData): { [key: string]: number } {
//   const prices: number[] = data.prices;
//   const similarIndices: number[] = data.similar;
//   const productPrice: number = data.product_price;
//   const extractedData: { [key: string]: number } = {};

//   // Loop through similar indices and extract corresponding prices
//   for (let i = 0; i < prices.length; i++) {
//       extractedData[similarIndices[i].toString()] = prices[i];
//   };

//   // Add the product price under the key 'mflg'
//   extractedData['mflg'] = productPrice;


//   return extractedData;
// }


// const PriceBar: React.FC<PriceBarProps> = ({ sampleSimilarProducts }) => {
//     const extractedData = extractSimilarPrices(sampleSimilarProducts);

//     const svgRef = useRef<SVGSVGElement>(null);
//     const data = extractedData;
//     const width = 500;
//     const height = 150;

//     return (
//       <div className="prices">
//           <Boxplot data={data} svgRef={svgRef} width={width} height={height} />
//           <CurrentPricesMFLG data={data} svgRef={svgRef} width={width} height={height} />
//       </div>
//     );
// }

// export default PriceBar;

"use client"

import React, { useState, useRef } from 'react';
import Boxplot from '../../pricebar-component/components/boxplot';
import CurrentPricesMFLG from '../../pricebar-component/components/currentprices-mflg';

interface ProductData {
    prices: number[]; 
    product_price: number; 
    original_price: number; 
    discounted_price: number | null; 
    similar: number[]; 
    similar_products: SimilarProduct[]; 
    product_name: string; 
    rank: number; 
    rank_normalized: number; 
}

interface SimilarProduct {
    product_id: number; 
    company: string; 
    product_name: string; 
    scrape_timestamp: string; 
    description: string; 
    original_price: number; 
    discounted_price: number | null; 
    source_url: string; 
    remarks: string; 
    image_url: string; 
    tags: string; 
}

interface PriceBarProps {
    SimilarProducts: ProductData;
}


function extractSimilarPrices(data: ProductData): { [key: string]: number } {
    const prices: number[] = data.prices;
    const similarIndices: number[] = data.similar;
    const productPrice: number = data.product_price;
    const extractedData: { [key: string]: number } = {};
    if (data.similar_products) {
        data.similar_products.forEach(similarProduct => {
          const productName = similarProduct.product_name;
          const productPrice = prices[data.similar_products.indexOf(similarProduct)]; 
          extractedData[productName] = productPrice;
        });
      }
    

    extractedData['mflg'] = productPrice;


    return extractedData;
}


const PriceBar: React.FC<PriceBarProps> = ({SimilarProducts }) => {
    const extractedData = extractSimilarPrices(SimilarProducts);

    const svgRef = useRef<SVGSVGElement>(null);
    const data = extractedData;
    const width = 500;
    const height = 150;
    const ProductName = SimilarProducts.product_name

    return (
      <div className="prices">
          <Boxplot data={data} svgRef={svgRef} width={width} height={height} />
          <CurrentPricesMFLG data={data} svgRef={svgRef} width={width} height={height} productname={ProductName}/>
      </div>
    );
}

export default PriceBar;
