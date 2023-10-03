import React from "react";
import "./App.css";
import PieChart from "./PieCharts";
import LineChart from "./LineCharts";
import ScatterPlot from "./ScatterPlot";
import StackedBarChart from "./StackedBarChart";
import BarChart from "./Barcharts";
const data = [
  { label: "Category 1", value: 30 },
  { label: "Category 2", value: 50 },
  { label: "Category 3", value: 20 },
];

function App() {
  return (
    <div className="App">
      <BarChart />
      <PieChart />
      <LineChart />
      <ScatterPlot />
      <StackedBarChart />
    </div>
  );
}

export default App;
