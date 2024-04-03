"use client"

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';


interface CurrentPricesProps {
    data: { [key: string]: number };
    width: number;
    height: number;
    svgRef: React.MutableRefObject<SVGSVGElement | null>;
}

const CurrentPricesMFLG:React.FC<CurrentPricesProps> = ({ data, width, height, svgRef }) => {

    useEffect(() => {
        const dataArray = Object.values(data); // Extract values from the object


        if (dataArray.length === 0) return;
        const margin = { top: 20, right: 50, bottom: 50, left: 2 };
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

        const boxHeight = yScale.bandwidth();


        Object.entries(data).forEach(([key, value]) => {
            // Skip drawing the circle if key is 'mflg'
            const jitter = Math.random() * 10 - 5;
            if (key === 'mflg')
                boxPlotGroup.append('circle')
                    .attr('cy', yScale('Box Plot'))
                    .attr('cx', xScale(value)) // Add jitter to x position
                    .attr('r', 12) // Circle radius
                    .attr('fill', 'green');
        });
        

    }, [data, width, height, svgRef]);

    return null;
}

export default CurrentPricesMFLG;