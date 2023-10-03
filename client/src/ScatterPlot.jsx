import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

const ScatterPlot = () => {
  const svgRef = useRef();

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/dashbord/getdata"
      );
      const newData = response.data.dashbord
        .filter((result) => result.intensity && result.likelihood)
        .map((result) => ({ x: result.intensity, y: result.likelihood }));

      setData(newData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length === 0) return; // Don't execute D3 code if there's no data

    const svg = d3.select(svgRef.current);

    const width = 500;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.x)])
      .range([margin.left, width - margin.right]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y)])
      .range([height - margin.bottom, margin.top]);

    svg.selectAll("*").remove(); // Clear existing elements to prevent duplication

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 14)
      .attr("text-anchor", "middle")
      .text("Intensity");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", margin.left / 4)
      .attr("text-anchor", "middle")
      .text("Likelihood");

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 5);
  }, [data]);

  return (
    <div>
      <h1>Scatter Plot</h1>
      <svg ref={svgRef} width={600} height={600}></svg>
    </div>
  );
};

export default ScatterPlot;
