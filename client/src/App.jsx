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
    <>
    <div className="row">
      <div className="col barchart m-3 p-3">
        <BarChart />
        </div>
      <div className="col piechart m-3 p-3">
        <PieChart />
      </div>
      <div className="col linechart m-3 p-3">
        <LineChart />
        </div>
      </div>
      <div className="row">
      <div className="col scatterplot m-3 pt-5">
        <ScatterPlot />
        </div>
        <div className="col radarchart m-3 pt-5">
        <RadarChart/>
        </div>
      
      </div>
      <div className="row">
      <div className="col stackedbarchart m-3 pt-5">
        <StackedBarChart/>
        </div>
      </div>
      </>
  );
}

export default App;
