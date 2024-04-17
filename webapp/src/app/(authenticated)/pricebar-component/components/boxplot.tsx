"use client"

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BoxPlotProps {
    data: { [key: string]: number };
    width: number;
    height: number;
    svgRef: React.MutableRefObject<SVGSVGElement | null>;
}

const BoxPlot: React.FC<BoxPlotProps> = ({ data, width, height, svgRef }) => {
    useEffect(() => {
        if (!svgRef.current) return;

        const dataArray = Object.values(data);
        if (dataArray.length === 0) return;

        const margin = { top: 30, right: 50, bottom: 50, left: 2 };
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


        boxPlotGroup.append('rect')
            .attr('y', yScale('Box Plot') - 20)
            .attr('x', xScale(d3.quantile(dataArray, 0.25)))
            .attr('height', 40)
            .attr('width', xScale(d3.quantile(dataArray, 0.75)) - xScale(d3.quantile(dataArray, 0.25)))
            .attr('fill', 'rgba(0, 0, 0, 0.05)');


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
            .attr('x2', xScale(d3.quantile(dataArray, 0.25)))
            .attr('stroke', 'black')
        
        boxPlotGroup.append('line')
            .attr('y1', yScale('Box Plot'))
            .attr('y2', yScale('Box Plot'))
            .attr('x1', xScale(d3.quantile(dataArray, 0.75)))
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

    }, [data, width, height, svgRef]);

    return (
        <svg ref={svgRef}></svg>
    );
}

export default BoxPlot;