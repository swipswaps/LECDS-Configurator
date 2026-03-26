import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface YieldChartProps {
  data: {
    distillateYield: number;
  };
}

const YieldChart: React.FC<YieldChartProps> = ({ data }) => {
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

    const width = 300;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(['Base', 'Current'])
      .range([0, width - margin.left - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, Math.max(3, (data.distillateYield || 0) * 1.2)])
      .range([height - margin.top - margin.bottom, 0]);

    g.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x))
      .attr('class', 'text-gray-400');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}L`))
      .attr('class', 'text-gray-400');

    // Bars
    g.selectAll<SVGRectElement, { label: string; value: number }>('rect')
      .data([
        { label: 'Base', value: 1.2 },
        { label: 'Current', value: data.distillateYield }
      ])
      .enter()
      .append('rect')
      .attr('x', d => x(d.label)!)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d: { label: string; value: number }) => height - margin.top - margin.bottom - y(d.value))
      .attr('fill', (d: { label: string; value: number }) => (d.label === 'Current' ? '#10b981' : '#9ca3af'))
      .attr('rx', 4)
      .attr('class', 'cursor-pointer transition-all duration-200')
      .on('mouseover', function(event, d: { label: string; value: number }) {
        d3.select(this).attr('opacity', 0.8).attr('stroke', '#10b981').attr('stroke-width', 2);
        
        tooltip.style('visibility', 'visible')
          .html(`
            <div class="font-bold text-gray-900">${d.label} Yield</div>
            <div class="text-green-600 font-semibold">${d.value.toFixed(2)} L/m²/day</div>
          `);
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current);
        tooltip.style('top', (my - 60) + 'px').style('left', (mx + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1).attr('stroke', 'none');
        tooltip.style('visibility', 'hidden');
      });

    // Labels
    g.selectAll<SVGTextElement, { label: string; value: number }>('.label')
      .data([
        { label: 'Base', value: 1.2 },
        { label: 'Current', value: data.distillateYield }
      ])
      .enter()
      .append('text')
      .attr('x', d => x(d.label)! + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-bold fill-gray-600')
      .text((d: { label: string; value: number }) => d.value.toFixed(2));

  }, [data]);

  return (
    <div className="w-full relative" ref={containerRef}>
      <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider">Distillate Yield (L/m²/day)</h3>
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
};

export default YieldChart;
