"use client"

import React, { useState, useRef } from 'react';
import Boxplot from '../../pricebar-component/components/boxplot';
import CurrentPricesMFLG from '../../pricebar-component/components/currentprices-mflg';

interface Analytics {
    product_price: number; 
    similar_products: string[]; 
    product_name: string; 
}

interface PriceBarProps {
    SimilarProducts: Analytics;
}


function extractSimilarPrices(data: Analytics): { [key: string]: number } {
    const productPrice: number = data.product_price;
    const extractedData: { [key: string]: number } = {};
    data.similar_products.forEach(item => {
        const productName = item.product_name;
        const productPrice = item.original_price; // Use discounted price if available, otherwise use original price
        extractedData[productName] = productPrice;
      });
    
    extractedData['mflg'] = productPrice;

    console.log(extractedData)


    return extractedData;
}



const PriceBar: React.FC<PriceBarProps> = ({ SimilarProducts }) => {
    const extractedData = extractSimilarPrices(SimilarProducts);
    const productName = SimilarProducts.product_name
    const svgRef = useRef<SVGSVGElement>(null);
    const data = extractedData;
    const width = 450;
    const height = 150;
    console.log(SimilarProducts)
    console.log(extractedData)
    const svg = svgRef.current;
    if (svg) {
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }
    };

    return (
      <div className="prices">
          <Boxplot data={data} svgRef={svgRef} width={width} height={height} />
          <CurrentPricesMFLG data={data} svgRef={svgRef} width={width} height={height} productname={productName} />
      </div>
    );
}

export default PriceBar;
