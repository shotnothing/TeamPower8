"use client"

import React, { useState, useRef } from 'react';
import Boxplot from '../../pricebar-component/components/boxplot';
import CurrentPricesMFLG from '../../pricebar-component/components/currentprices-mflg';

interface ProductData {
    prices: number[];
    product_price: number;
    ranking: number;
    similar: number[];
}

interface PriceBarProps {
    sampleSimilarProducts: ProductData;
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


const PriceBar: React.FC<PriceBarProps> = ({ sampleSimilarProducts }) => {
    const extractedData = extractSimilarPrices(sampleSimilarProducts);

    const svgRef = useRef<SVGSVGElement>(null);
    const data = extractedData;
    const width = 500;
    const height = 150;

    return (
      <div className="prices">
          <Boxplot data={data} svgRef={svgRef} width={width} height={height} />
          <CurrentPricesMFLG data={data} svgRef={svgRef} width={width} height={height} />
      </div>
    );
}

export default PriceBar;
