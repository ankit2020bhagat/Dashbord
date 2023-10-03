// LineChart.js
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

function LineChart() {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const svgRef = useRef();

  const fetchData = async () => {
    const intensity = [];
    const year = [];

    try {
      const response = await axios.get(
        "http://localhost:8080/dashbord/getdata"
      );
      response.data.dashbord.forEach((result) => {
        if (result.intensity && result.end_year) {
          intensity.push(result.intensity); // Convert to numbers
          year.push(result.end_year);
        }
      });
      setData(intensity);
      setYears(year);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length === 0 || years.length === 0) {
      return; // Don't render the chart if data or years are empty
    }

    // Dimensions and margins
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create an SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales for x and y axes
    const x = d3.scaleBand().domain(years).range([0, width]).padding(0.1); // Add padding
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .nice()
      .range([height, 0]);

    // Create a line generator
    const line = d3
      .line()
      .x((d, i) => x(years[i]) + x.bandwidth() / 2) // Adjust x position
      .y((d) => y(d));

    // Create the line chart
    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .style("fill", "none")
      .style("stroke", "steelblue");

    // Create x and y axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Append x-axis and y-axis to the chart
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    svg.append("g").attr("class", "y-axis").call(yAxis);

    // Add x-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 20)
      .style("text-anchor", "middle")
      .text("Year");

    // Add y-axis label
    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Intensity");
  }, [data, years]);

  return (
    <div>
      <h2>Line charts</h2>
      <svg ref={svgRef}></svg>;
    </div>
  );
}

export default LineChart;
