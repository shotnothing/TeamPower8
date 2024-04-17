"use client"


import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './optimisedpricedisplay.css';

interface OptimisedPricesProps {
    data: { [key: string]: number };
    newData: { [key: string]: number };
}

const OptimisedPriceDisplay: React.FC<OptimisedPricesProps> = ({ data, newData }) => {
    const [optimisedPrice, setOptimisedPrice] = useState<number | null>(null); // Initialize optimisedPrice state

    useEffect(() => {
        const dataArray = Object.values(data);
        const newDataArray = Object.values(newData);

        if (dataArray.length === 0) return;

        const calculatedOptimisedPrice = d3.quantile(dataArray, newDataArray[0] / 100);
        setOptimisedPrice(calculatedOptimisedPrice);

    }, [data, newData]);

    return (
        <div>
            {optimisedPrice !== null && ( // Check if optimisedPrice is not null before rendering
                <div className="display-price-container">
                    <span>Optimised Price:</span><br />
                    <span>${optimisedPrice.toFixed(2)}</span>
                    </div>
            )}
        </div>
    );
}

export default OptimisedPriceDisplay;
