"use client"

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface OptimisedPricesProps {
    data: { [key: string]: number };
    newData: { [key: string]: number };
    width: number;
    height: number;
    svgRef: React.MutableRefObject<SVGSVGElement | null>;
}

const OptimisedPrices:React.FC<OptimisedPricesProps> = ({ data, newData, width, height, svgRef }) => {

    useEffect(() => {
        const dataArray = Object.values(data); // Extract values from the object
        const newDataArray = Object.values(newData);

        if (dataArray.length === 0) return;

        const margin = { top: 20, right: 50, bottom: 50, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const yScale = d3.scaleBand()
            .domain(['Box Plot'])
            .range([margin.top, innerHeight])
            .padding(0.1);

        const xScale = d3.scaleLinear()
            .domain([d3.min(dataArray)!, d3.max(dataArray)!])
            .nice()
            .range([margin.left, innerWidth]);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Draw box plot
        const boxPlotGroup = g.append('g');

        // const boxHeight = yScale.bandwidth();
        
        boxPlotGroup.append('circle')
            .attr('cy', yScale('Box Plot'))
            .attr('cx', xScale(newDataArray[0])) // x position for the new red circle
            .attr('r', 12) // red circle radius
            .attr('fill', 'red');

        
        }, [data, newData, width, height, svgRef]);

    return (
        <svg ref={svgRef}></svg>
    );
}

export default OptimisedPrices;

