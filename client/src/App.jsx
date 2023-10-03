import React from "react";
import "./App.css";
import PieChart from "./PieCharts";
import LineChart from "./LineCharts";
import ScatterPlot from "./ScatterPlot";
import StackedBarChart from "./StackedBarChart";
import BarChart from "./Barcharts";
import RadarChart from "./Radar";

function App() {
  return (
    <div className="App">
      <BarChart />
      <PieChart />
      <LineChart />
      <ScatterPlot />
      <StackedBarChart />
      <RadarChart />
    </div>
  );
}

export default App;
