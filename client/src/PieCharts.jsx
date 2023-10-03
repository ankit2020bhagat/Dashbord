import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
const PieChart = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const width = 400;
  const height = 400;
  const fetchData = async () => {
    const country = [];
    const countryCount = {};
    const data = [];
    try {
      const response = await axios.get(
        "http://localhost:8080/dashbord/getdata"
      );

      response.data.dashbord.forEach((result) => {
        if (result.country) {
          country.push(result.country);
        }
      });

      for (const c of country) {
        if (countryCount[c]) {
          countryCount[c] += 1;
        } else {
          countryCount[c] = 1;
        }
      }

      for (const country in countryCount) {
        data.push({ label: country, value: countryCount[country] });
      }

      setData(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d.value);

    const arc = d3
      .arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const label = d3
      .arc()
      .outerRadius(radius - 0)
      .innerRadius(radius - 160);

    const arcData = pie(data);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const arcGroup = g
      .selectAll(".arc")
      .data(arcData)
      .enter()
      .append("g")
      .attr("class", "arc");

    arcGroup
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label));

    arcGroup
      .append("text")
      .attr("transform", (d) => `translate(${label.centroid(d)})`)
      .attr("dy", "0.35em")
      .text((d) => `${d.data.label}`);
  }, [data, width, height]);

  return (
    <div>
      <h2>Pie charts</h2>
      <svg ref={svgRef} width={width} height={height}>
        {/* You can add a title or other SVG elements here */}
      </svg>
    </div>
  );
};

export default PieChart;
