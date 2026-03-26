import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  pos: number;
  temp: number;
}

interface TemperatureProfileProps {
  data: DataPoint[];
}

const TemperatureProfile: React.FC<TemperatureProfileProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 300;
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, 20])
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleLinear()
      .domain([
        (d3.min(data, (d: DataPoint) => d.temp) || 0) - 5,
        (d3.max(data, (d: DataPoint) => d.temp) || 100) + 5
      ])
      .range([height - margin.top - margin.bottom, 0]);

    // Line generator
    const line = d3.line<DataPoint>()
      .x(d => x(d.pos))
      .y(d => y(d.temp))
      .curve(d3.curveMonotoneX);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(10).tickFormat(d => `${d} cm`))
      .attr('class', 'text-gray-400');

    g.append('g')
      .call(d3.axisLeft(y).tickFormat(d => `${d}°C`))
      .attr('class', 'text-gray-400');

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(y).tickSize(-(width - margin.left - margin.right)).tickFormat(() => ''));

    // Zone highlights
    g.append('rect')
      .attr('x', x(0))
      .attr('y', 0)
      .attr('width', x(12))
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', '#3b82f6')
      .attr('opacity', 0.05);
    
    g.append('text')
      .attr('x', x(6))
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-medium fill-blue-500')
      .text('Hydrogel Zone');

    g.append('rect')
      .attr('x', x(12))
      .attr('y', 0)
      .attr('width', x(4))
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', '#10b981')
      .attr('opacity', 0.05);

    g.append('text')
      .attr('x', x(14))
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-medium fill-green-500')
      .text('Wicking');

    g.append('rect')
      .attr('x', x(16))
      .attr('y', 0)
      .attr('width', x(4))
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', '#f59e0b')
      .attr('opacity', 0.05);

    g.append('text')
      .attr('x', x(18))
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-medium fill-amber-500')
      .text('Diode');

    // Path
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Data points
    g.selectAll<SVGCircleElement, DataPoint>('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d: DataPoint) => x(d.pos))
      .attr('cy', (d: DataPoint) => y(d.temp))
      .attr('r', 4)
      .attr('fill', '#3b82f6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

  }, [data]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Temperature Profile Along 20cm Channel</h3>
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
};

export default TemperatureProfile;
