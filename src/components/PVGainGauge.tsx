import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PVGainGaugeProps {
  data: {
    efficiencyGain: number;
  };
}

const PVGainGauge: React.FC<PVGainGaugeProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 300;
    const height = 200;
    const radius = Math.min(width, height) / 2 - 20;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2 + 20})`);

    // Arc for gauge background
    const arc = d3.arc<any>()
      .innerRadius(radius - 30)
      .outerRadius(radius)
      .startAngle(-Math.PI / 1.8)
      .endAngle(Math.PI / 1.8);

    g.append('path')
      .datum({})
      .attr('d', arc)
      .attr('fill', '#f3f4f6');

    // Filled arc based on gain (0-20% range)
    const gainAngle = (data.efficiencyGain / 20) * Math.PI * 1.6 - Math.PI / 1.8;
    const filledArc = d3.arc<any>()
      .innerRadius(radius - 30)
      .outerRadius(radius)
      .startAngle(-Math.PI / 1.8)
      .endAngle(gainAngle);

    g.append('path')
      .datum({})
      .attr('d', filledArc)
      .attr('fill', '#f59e0b');

    // Text label
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('class', 'text-4xl font-bold fill-gray-800')
      .text(data.efficiencyGain.toFixed(1) + '%');

    // Subtitle
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '2.5em')
      .attr('class', 'text-xs font-medium fill-gray-400 uppercase tracking-widest')
      .text('Efficiency Gain');

  }, [data]);

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider">PV Efficiency Boost</h3>
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
};

export default PVGainGauge;
