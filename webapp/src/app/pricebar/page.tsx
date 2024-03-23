// import React from "react";

// const Pricebar = () => {
//     return(
//         <h1>Pricebar</h1>
//     )
// }

// export default Pricebar;

"use client"

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BoxPlot: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const data = { e: 10, a: 30, d: 40, f: 58, g: 70, i: 95, j: 100 }; // Sample data

    useEffect(() => {
        const dataArray = Object.values(data); // Extract values from the object

        if (dataArray.length === 0) return;

        const width = 400; // Example width
        const height = 200; // Example height
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

        const boxHeight = yScale.bandwidth();

        Object.entries(data).forEach(([key, value]) => {
            // For each key-value pair in the data object
            boxPlotGroup.append('rect')
                .attr('y', yScale('Box Plot') - 20)
                .attr('x', xScale(d3.quantile(dataArray, 0.25)))
                .attr('height', 40)
                .attr('width', xScale(d3.quantile(dataArray, 0.75)) - xScale(d3.quantile(dataArray, 0.25)))
                .attr('fill', 'rgba(0, 0, 0, 0.01)');
            // Draw circles
            const jitter = Math.random() * 10 - 5; // Generate random jitter within range [-5, 5]
            boxPlotGroup.append('circle')
                .attr('cy', yScale('Box Plot'))
                .attr('cx', xScale(value)) // Add jitter to x position
                .attr('r', key === 'a' ? 12 : 8) // 'a' has a bigger circle
                .attr('fill', 'steelblue');
        });


        boxPlotGroup.append('line')
            .attr('y1', yScale('Box Plot') - 20)
            .attr('y2', yScale('Box Plot') + 20)
            .attr('x1', xScale(d3.quantile(dataArray, 0.5)))
            .attr('x2', xScale(d3.quantile(dataArray, 0.5)))
            .attr('stroke', 'black');

        boxPlotGroup.append('line')
            .attr('y1', yScale('Box Plot') - 20)
            .attr('y2', yScale('Box Plot') + 20)
            .attr('x1', xScale(d3.min(dataArray)!))
            .attr('x2', xScale(d3.min(dataArray)!))
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5)
            .attr('stroke-dasharray', '3');

        boxPlotGroup.append('line')
            .attr('y1', yScale('Box Plot') - 20)
            .attr('y2', yScale('Box Plot') + 20)
            .attr('x1', xScale(d3.max(dataArray)!))
            .attr('x2', xScale(d3.max(dataArray)!))
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5)
            .attr('stroke-dasharray', '3');
        
        boxPlotGroup.append('line')
            .attr('y1', yScale('Box Plot') - 20)
            .attr('y2', yScale('Box Plot') + 20)
            .attr('x1', xScale(d3.quantile(dataArray, 0.25)))
            .attr('x2', xScale(d3.quantile(dataArray, 0.25)))
            .attr('stroke', 'black')

        
        boxPlotGroup.append('line')
            .attr('y1', yScale('Box Plot') - 20)
            .attr('y2', yScale('Box Plot') + 20)
            .attr('x1', xScale(d3.quantile(dataArray, 0.75)))
            .attr('x2', xScale(d3.quantile(dataArray, 0.75)))
            .attr('stroke', 'black')

        boxPlotGroup.append('line')
            .attr('y1', yScale('Box Plot'))
            .attr('y2', yScale('Box Plot'))
            .attr('x1', xScale(d3.min(dataArray)!))
            .attr('x2', xScale(d3.max(dataArray)!))
            .attr('stroke', 'black')
        
        boxPlotGroup.append('line')
            .attr('y1', yScale('Box Plot')-20)
            .attr('y2', yScale('Box Plot')-20)
            .attr('x1', xScale(d3.quantile(dataArray, 0.25)))
            .attr('x2', xScale(d3.quantile(dataArray, 0.75)))
            .attr('stroke', 'black')
        
        boxPlotGroup.append('line')
            .attr('y1', yScale('Box Plot')+20)
            .attr('y2', yScale('Box Plot')+20)
            .attr('x1', xScale(d3.quantile(dataArray, 0.25)))
            .attr('x2', xScale(d3.quantile(dataArray, 0.75)))
            .attr('stroke', 'black')

        
        const xAxis = d3.axisBottom(xScale);

        g.append('g')
            .attr('class', 'x-axis')
            .call(xAxis)
            .attr("transform", `translate(0, ${innerHeight})`);

    }, [data]);

    return (
        <svg ref={svgRef}></svg>
    );
}

export default BoxPlot;
