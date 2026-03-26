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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = d3.select(containerRef.current);
    
    // Remove existing tooltip if any
    container.selectAll('.tooltip').remove();
    
    // Create tooltip
    const tooltip = container.append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', '1px solid #e2e8f0')
      .style('padding', '8px 12px')
      .style('border-radius', '8px')
      .style('box-shadow', '0 4px 6px -1px rgb(0 0 0 / 0.1)')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '50');

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
    const hydrogelZone = g.append('rect')
      .attr('x', x(0))
      .attr('y', 0)
      .attr('width', x(12))
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', '#3b82f6')
      .attr('opacity', 0.05)
      .attr('class', 'zone-hydrogel transition-opacity duration-200');
    
    g.append('text')
      .attr('x', x(6))
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-medium fill-blue-500')
      .text('Hydrogel Zone');

    const wickingZone = g.append('rect')
      .attr('x', x(12))
      .attr('y', 0)
      .attr('width', x(4))
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', '#10b981')
      .attr('opacity', 0.05)
      .attr('class', 'zone-wicking transition-opacity duration-200');

    g.append('text')
      .attr('x', x(14))
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-medium fill-green-500')
      .text('Wicking');

    const diodeZone = g.append('rect')
      .attr('x', x(16))
      .attr('y', 0)
      .attr('width', x(4))
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', '#f59e0b')
      .attr('opacity', 0.05)
      .attr('class', 'zone-diode transition-opacity duration-200');

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
      .attr('class', 'dot cursor-pointer transition-all duration-200')
      .attr('cx', (d: DataPoint) => x(d.pos))
      .attr('cy', (d: DataPoint) => y(d.temp))
      .attr('r', 4)
      .attr('fill', '#3b82f6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d: DataPoint) {
        d3.select(this).attr('r', 7).attr('fill', '#2563eb');
        
        // Highlight zone
        if (d.pos <= 12) hydrogelZone.attr('opacity', 0.15);
        else if (d.pos <= 16) wickingZone.attr('opacity', 0.15);
        else diodeZone.attr('opacity', 0.15);

        tooltip.style('visibility', 'visible')
          .html(`
            <div class="font-bold text-gray-900">${d.temp.toFixed(2)}°C</div>
            <div class="text-gray-500">Position: ${d.pos}cm</div>
            <div class="mt-1 text-[10px] font-semibold uppercase tracking-wider ${d.pos <= 12 ? 'text-blue-500' : d.pos <= 16 ? 'text-green-500' : 'text-amber-500'}">
              ${d.pos <= 12 ? 'Hydrogel Zone' : d.pos <= 16 ? 'Wicking Zone' : 'Diode Zone'}
            </div>
          `);
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current);
        tooltip.style('top', (my - 80) + 'px').style('left', (mx + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 4).attr('fill', '#3b82f6');
        hydrogelZone.attr('opacity', 0.05);
        wickingZone.attr('opacity', 0.05);
        diodeZone.attr('opacity', 0.05);
        tooltip.style('visibility', 'hidden');
      });

  }, [data]);

  return (
    <div className="w-full relative" ref={containerRef}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Temperature Profile Along 20cm Channel</h3>
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
};

export default TemperatureProfile;
