"use client"

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface OptimisedPricesProps {
    data: { [key: string]: number };
    newData: { [key: string]: number };
    width: number;
    height: number;
    svgRef: React.MutableRefObject<SVGSVGElement | null>;
    productname: string;
}

const OptimisedPrices:React.FC<OptimisedPricesProps> = ({ data, newData, width, height, svgRef , productname}) => {

    useEffect(() => {
        const dataArray = Object.values(data); // Extract values from the object
        const newDataArray = Object.values(newData);

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

        boxPlotGroup.append('circle')
            .attr('cy', yScale('Box Plot'))
            .attr('cx', xScale(d3.quantile(dataArray, newDataArray[0]/100))) // x position for the new red circle
            .attr('r', 5) // red circle radius
            .attr('fill', 'red')
            .on('mouseover', function(event: MouseEvent, d:any) {
                tooltip.transition()
                    .duration(100)
                    .style('opacity', .9);
                tooltip.html(`Product: ${productname}<br>Optimised Price: ${d3.quantile(dataArray, newDataArray[0]/100).toFixed(2)}`)
                    .style('left', (event.pageX) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mousemove', function(event: MouseEvent) {
                tooltip
                    .style('left', (event.pageX+30) + 'px')
                    .style('top', (event.pageY+30) + 'px');
            })
            .on('mouseout', function(event: MouseEvent) {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0);
            });

            const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background-color', 'white')
            .style('border', '1px solid #ccc')
            .style('padding', '5px')
            .style('border-radius', '5px');

            
        
        }, [data, newData, width, height, svgRef, productname]);

    return null;
}

export default OptimisedPrices;

