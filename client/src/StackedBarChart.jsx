import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

const StackedBarChart = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/dashbord/getdata"
      );

      const converted_data = response.data.dashbord.map((entry) => ({
        category: entry.sector,
        subcategory1: entry.intensity,
        subcategory2: entry.relevance,
        subcategory3: entry.likelihood,
      }));
      setData(converted_data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => d.subcategory1 + d.subcategory2 + d.subcategory3),
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal().range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    svg
      .selectAll("g.stack")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "stack")
      .attr("transform", (d) => `translate(${xScale(d.category)},0)`)
      .selectAll("rect")
      .data((d) =>
        Object.entries(d).filter(([key, value]) => key !== "category")
      )
      .enter()
      .append("rect")
      .attr("x", (d) => xScale.bandwidth() / 4)
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth() / 2)
      .attr("height", (d) => yScale(0) - yScale(d[1]))
      .style("fill", (d) => color(d[0]));

    // Add labels for subcategories
    svg
      .selectAll(".stack")
      .selectAll(".label")
      .data((d) =>
        Object.entries(d).filter(([key, value]) => key !== "category")
      )
      .enter()
      .append("text")
      .attr("class", "label")
      //.attr("x", (d) => xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d[1]) - 5) // Adjust label positioning
      //.attr("text-anchor", "middle")
      .style("fill", "#fff") // Set label text color to white for better visibility
      .text((d) => d[1]);

    const xAxis = d3.axisBottom(xScale);
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);
  }, [data]);

  return (
    <div>
      <h2>Stacked Bar Chart</h2>
      <svg ref={svgRef} width={600} height={400}>
        {/* Chart contents will be rendered here */}
      </svg>
    </div>
  );
};

export default StackedBarChart;
