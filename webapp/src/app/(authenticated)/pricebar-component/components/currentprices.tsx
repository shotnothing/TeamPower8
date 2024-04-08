"use client"

// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// interface CurrentPricesProps {
//     data: { [key: string]: number };
//     width: number;
//     height: number;
//     svgRef: React.MutableRefObject<SVGSVGElement | null>;
// }

// const CurrentPrices: React.FC<CurrentPricesProps> = ({ data, width, height, svgRef }) => {
//     useEffect(() => {
//         const dataArray = Object.values(data); // Extract values from the object

//         if (dataArray.length === 0) return;

//         const margin = { top: 20, right: 50, bottom: 50, left: 2 };
//         const innerWidth = width - margin.left - margin.right;
//         const innerHeight = height - margin.top - margin.bottom;

//         const svg = d3.select(svgRef.current)
//             .attr('width', width)
//             .attr('height', height)
//             .append('g')
//             .attr('transform', `translate(${margin.left}, ${margin.top})`);

//         const yScale = d3.scaleBand()
//             .domain(['Box Plot'])
//             .range([margin.top, innerHeight])
//             .padding(0.1);

//         const xScale = d3.scaleLinear()
//             .domain([d3.min(dataArray)!, d3.max(dataArray)!])
//             .nice()
//             .range([margin.left, innerWidth]);

//         const g = svg.append('g')
//             .attr('transform', `translate(${margin.left},${margin.top})`);

//         // Draw box plot
//         const boxPlotGroup = g.append('g');

//         const boxHeight = yScale.bandwidth();

//         const counts: { [key: string]: number } = {};

//         Object.entries(data).forEach(([key, value]) => {
//             if (key === 'mflg') 
            
//             for (let i = -4; i <= 4; i++) {
//                 counts[(Math.floor(value)+i).toString()] = (counts[(Math.floor(value)+i).toString()] || 0) + 1;
//             }
//             ;
//         });

//         Object.entries(data).forEach(([key, value]) => {
//             // Skip drawing the circle if key is 'mflg'
//             if (key === 'mflg') return;

//             const jitter_check = counts[Math.floor(value).toString()] ? (counts[Math.floor(value).toString()] / 2) : 0;
//             const jitter = Number.isInteger(jitter_check) ? jitter_check * -12: Math.ceil(jitter_check) * 12;
//             // counts[value.toString()] = (counts[value.toString()] || 0) + 1;
            
//             for (let i = -4; i <= 4; i++) {
//                 counts[(Math.floor(value)+i).toString()] = (counts[(Math.floor(value)+i).toString()] || 0) + 1;
//             }
            
//             const circle = boxPlotGroup.append('circle')
//                 .attr('cy', yScale('Box Plot')+jitter)
//                 .attr('cx', xScale(value)) // Add jitter to x position
//                 .attr('r', 6) // Circle radius
//                 .attr('fill', 'steelblue');
//         });

//     }, [data, width, height, svgRef]);

//     return null;
// }

// export default CurrentPrices;




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

        const counts: { [key: string]: number } = {};

        Object.entries(data).forEach(([key, value]) => {
            if (key === 'mflg') 
            
            for (let i = -4; i <= 4; i++) {
                counts[(Math.floor(value)+i).toString()] = (counts[(Math.floor(value)+i).toString()] || 0) + 1;
            }
            ;
        });

        Object.entries(data).forEach(([key, value]) => {
            // Skip drawing the circle if key is 'mflg'
            if (key === 'mflg') return;

            const jitter_check = counts[Math.floor(value).toString()] ? (counts[Math.floor(value).toString()] / 2) : 0;
            const jitter = Number.isInteger(jitter_check) ? jitter_check * -12: Math.ceil(jitter_check) * 12;
            // counts[value.toString()] = (counts[value.toString()] || 0) + 1;
            
            for (let i = -4; i <= 4; i++) {
                counts[(Math.floor(value)+i).toString()] = (counts[(Math.floor(value)+i).toString()] || 0) + 1;
            }
            
            const circle = boxPlotGroup.append('circle')
                .attr('cy', yScale('Box Plot')+jitter)
                .attr('cx', xScale(value)) // Add jitter to x position
                .attr('r', 6) // Circle radius
                .attr('fill', 'steelblue');
        });
        
        // Object.entries(data).forEach(([key, value]) => {
        //     // Skip drawing the circle if key is 'mflg'
        //     if (key === 'mflg') return;
        
        //     const jitter_check = counts[Math.floor(value).toString()] ? (counts[Math.floor(value).toString()] / 2) : 0;
        //     const jitter = Number.isInteger(jitter_check) ? jitter_check * -12 : Math.ceil(jitter_check) * 12;
            
        //     for (let i = -4; i <= 4; i++) {
        //         counts[(Math.floor(value) + i).toString()] = (counts[(Math.floor(value) + i).toString()] || 0) + 1;
        //     }
            
        //     const circle = boxPlotGroup.append('circle')
        //         .attr('cy', yScale('Box Plot') + jitter)
        //         .attr('cx', (d: any) => xScale(value)) // Arrow function to set cx attribute
        //         .attr('r', 6) // Circle radius
        //         .attr('fill', 'steelblue')
        //         .on('mouseover', function(event: MouseEvent, d: any) {
        //             tooltip.transition()
        //                 .duration(200)
        //                 .style('opacity', .9);
        //             tooltip.html(`Value: ${d}`)
        //                 .style('left', (event.pageX) + 'px')
        //                 .style('top', (event.pageY - 28) + 'px');
        //         })
        //         .on('mouseout', function(event: MouseEvent, d: any) {
        //             tooltip.transition()
        //                 .duration(500)
        //                 .style('opacity', 0);
        //         })
        //         .datum(value); // Pass the associated data to the circle element
        // });
        

        // const tooltip = d3.select('body').append('div')
        //     .attr('class', 'tooltip')
        //     .style('opacity', 0)
        //     .style('position', 'absolute')
        //     .style('background-color', 'white')
        //     .style('border', '1px solid #ccc')
        //     .style('padding', '5px')
        //     .style('border-radius', '5px');

    }, [data, width, height, svgRef]);

    return null;
}

export default CurrentPrices;
