import React from 'react';
import { scaleLinear } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import { line } from 'd3-shape';
import { select } from 'd3-selection';

import { Box } from '../app/components';

type DataPoint = {
  x: number,
  y: number,
}

type QueuesData = {
  [date: string]: Array<DataPoint>,
}

type Props = {
  queuesData: QueuesData,
  size: [number, number],
}

export default class QueueChart extends React.Component<Props> {

  componentDidMount() {
    this.createBarChart.call(this);
  }

  componentDidUpdate() {
    this.createBarChart.call(this);
  }

  node: ?HTMLElement;

  createBarChart() {
    const queuesData = this.props.queuesData;
    const node = this.node;
    const svg = select(node);

    svg.selectAll('*').remove();

    const xScale = scaleLinear()
      .domain([0, 6])
      .range([0, 600]);

    const yScale = scaleLinear()
      .domain([0, 300])
      .range([300, 0]);

    const qline = line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    const xAxis = axisBottom()
      .scale(xScale);

    const yAxis = axisLeft()
      .scale(yScale);

    svg.append('g')
       .attr('transform', 'translate(30, 280)')
       .call(xAxis);

    svg.append('g')
       .attr('transform', 'translate(30, -20)')
       .call(yAxis);

    svg.selectAll('path')
       .attr('stroke', 'white')
       .attr('stroke-width', '1');

    svg.selectAll('line')
       .attr('stroke', 'white')
       .attr('stroke-width', '1');

    svg.selectAll('text')
       .attr('fill', 'white');

    Object.keys(queuesData).forEach((date) => {
      svg.append('path')
         .attr('d', qline(queuesData[date]))
         .attr('transform', 'translate(30, -20)')
         .attr('fill', 'none')
         .attr('stroke', 'white')
         .attr('stroke-width', '3');
    });
  }

  render() {
    return (
      <Box marginTop={2}>
        <svg
          ref={(node) => { this.node = node; }}
          width="600" height="300"
        />
      </Box>
    );
  }
}
