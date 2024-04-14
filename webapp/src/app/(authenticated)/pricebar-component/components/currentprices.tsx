"use client"

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CurrentPricesProps {
    data: { [key: string]: number };
    width: number;
    height: number;
    svgRef: React.MutableRefObject<SVGSVGElement | null>;
}

const CurrentPrices: React.FC<CurrentPricesProps> = ({ data, width, height, svgRef }) => {
    useEffect(() => {
        const dataArray = Object.values(data); // Extract values from the object

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

        const counts: { [key: string]: number } = {};
        
        const scale = d3.scaleQuantile()
            .domain(dataArray)
            .range(d3.range(0, 1.1, 0.1));
        
        const jitter_range =  Math.round((d3.max(dataArray)!-d3.min(dataArray)!) * 0.1)

        Object.entries(data).forEach(([key, value]) => {
            if (key === 'mflg') 

            for (let i = -jitter_range; i <= jitter_range; i++) {
                counts[(Math.floor(value)+i).toString()] = (counts[(Math.floor(value)+i).toString()] || 0) + 1;
            };


            const jitter_check = counts[Math.floor(value).toString()] ? (counts[Math.floor(value).toString()] / 2) : 0;
            const jitter = Number.isInteger(jitter_check) ? jitter_check * -3 : Math.ceil(jitter_check) * 3;
            
            
            for (let i = -jitter_range; i <= jitter_range; i++) {
                counts[(Math.floor(value) + i).toString()] = (counts[(Math.floor(value) + i).toString()] || 0) + 1;
            }
            
            boxPlotGroup.append('circle')
            .attr('cy', yScale('Box Plot') + jitter)
            .attr('cx', (d: any) => xScale(value))
            .attr('r', 3)
            .attr('fill', 'steelblue')
            .attr('fill-opacity', 0.5)
            .on('mouseover', function(event: MouseEvent, d: any) {
                d3.select(this)
                    .attr('fill', 'steelblue')
                    .attr('fill-opacity', 1);
        
                tooltip.transition()
                    .duration(100)
                    .style('opacity', .9);
                tooltip.html(`Product: ${key}<br>Current Price: ${value}`)
                    .style('left', (event.pageX) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mousemove', function(event: MouseEvent) {
                tooltip
                    .style('left', (event.pageX+40) + 'px')
                    .style('top', (event.pageY+40) + 'px');
            })
            .on('mouseout', function(event: MouseEvent, d: any) {
                d3.select(this)
                    .attr('fill', 'steelblue')
                    .attr('fill-opacity', 0.5);
        
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0);
            });
        
        });
        

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background-color', 'white')
            .style('border', '1px solid #ccc')
            .style('padding', '5px')
            .style('border-radius', '5px');

    }, [data, width, height, svgRef]);

    return null;
}

export default CurrentPrices;
