// RadarChart.js
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

function RadarChart() {
  const svgRef = useRef();

  const [years, setYear] = useState([]);
  const [data, setData] = useState([[]]);

  const fetchData = async () => {
    const year = [];
    const data = [];
    try {
      const response = await axios.get(
        "http://localhost:8080/dashbord/getdata"
      );
      response.data.dashbord.forEach((result) => {
        if (result.end_year && result.intensity) {
          data.push([result.intensity, result.relevance, result.likelihood]);
          year.push(result.end_year);
        }
      });
      console.log(year);
      console.log(data);
      setData(data);
      setYear(year);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Dimensions and margins
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const centerX = width / 2 + margin.left;
    const centerY = height / 2 + margin.top;

    // Create an SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Calculate the number of data points (variables)
    const numDataPoints = data[0].length; // Assuming all data arrays have the same length

    // Create a scale for the radar chart based on the data domain
    const maxDataValue = d3.max(data.flat()); // Find the maximum data value
    const radius = Math.min(width, height) / 2;
    const angleSlice = (Math.PI * 2) / numDataPoints;
    const rScale = d3
      .scaleLinear()
      .domain([0, maxDataValue])
      .range([0, radius]);

    // Create the radial axis lines
    const axisGrid = svg.append("g").attr("class", "axisWrapper");

    for (let i = 0; i < numDataPoints; i++) {
      const angle = i * angleSlice;
      axisGrid
        .append("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", centerX + Math.cos(angle) * radius)
        .attr("y2", centerY + Math.sin(angle) * radius)
        .attr("class", "axis");
    }

    // Create a function to calculate the coordinates of each data point
    const radarLine = d3
      .line()
      .x((d, i) => centerX + rScale(d.value) * Math.cos(i * angleSlice))
      .y((d, i) => centerY + rScale(d.value) * Math.sin(i * angleSlice));

    // Create the data points and labels
    for (let i = 0; i < years.length; i++) {
      const yearData = data[i];
      const lineData = yearData.map((d, j) => ({
        axis: j,
        value: d,
      }));

      svg
        .append("path")
        .datum(lineData)
        .attr("class", "radarArea")
        .attr("d", radarLine)
        .style("fill", "rgba(0, 120, 150, 0.3)"); // Customize the fill color

      // Add labels for each spoke (year)
      svg
        .append("text")
        .attr("class", "axisLabel")
        .attr("x", centerX + Math.cos(i * angleSlice) * (radius + 10))
        .attr("y", centerY + Math.sin(i * angleSlice) * (radius + 10))
        .text(years[i])
        .style("font-size", "14px")
        .style("text-anchor", "middle")
        
    }

    // Add a legend or tooltip as needed
  }, [data, years]);

  return (
    <div>
      <h2>Radar charts</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default RadarChart;
