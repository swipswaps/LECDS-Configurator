import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface YieldChartProps {
  data: {
    distillateYield: number;
  };
}

const YieldChart: React.FC<YieldChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
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
      .attr('rx', 4);

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
    <div className="w-full">
      <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider">Distillate Yield (L/m²/day)</h3>
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
};

export default YieldChart;
