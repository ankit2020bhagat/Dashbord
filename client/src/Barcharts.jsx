import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
const BarChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const fetchData = async () => {
    let intensity = 0;
    let likelihood = 0;
    let relevance = 0;
    try {
      const response = await axios.get(
        "http://localhost:8080/dashbord/getdata"
      );

      response.data.dashbord.forEach((result) => {
        intensity += result.intensity;
        likelihood += result.likelihood;
        relevance += result.relevance;
      });

      // Update the state with the new data
      setData([
        { category: "Intensity", value: intensity },
        { category: "Likelihood", value: likelihood },
        { category: "Relevance", value: relevance },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Chart dimensions and margins
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    // Create SVG element
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Data scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height, 0]);

    // Create bars
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.category))
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.value))
      .attr("fill", "steelblue");

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add y-axis
    svg.append("g").call(d3.axisLeft(yScale));
  }, [data]);

  return (
    <div className="chart-container">
      <h2>Bar charts</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
