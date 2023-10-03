import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Heatmaps = () => {
  const data = [
    [10, 20, 30, 40, 50],
    [20, 30, 40, 50, 60],
    [30, 40, 50, 60, 70],
    [40, 50, 60, 70, 80],
    [50, 60, 70, 80, 90],
  ];
  const width = 500;
  const height = 500;

  const svgRef = useRef();

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const colorScale = d3
      .scaleSequential(d3.interpolateYlOrRd)
      .domain([d3.min(data, (d) => d3.min(d)), d3.max(data, (d) => d3.max(d))]);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * (width / data[0].length))
      .attr("y", (d, i, j) => j * (height / data.length))
      .attr("width", width / data[0].length)
      .attr("height", height / data.length)
      .style("fill", (d) => colorScale(d));

    svg
      .selectAll("text")
      .data(data)
      .enter()
      .selectAll("text")
      .data((d) => d)
      .enter()
      .append("text")
      .attr(
        "x",
        (d, i) => i * (width / data[0].length) + width / data[0].length / 2
      )
      .attr(
        "y",
        (d, i, j) => j * (height / data.length) + height / data.length / 2
      )
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .text((d) => d);
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default Heatmaps;
