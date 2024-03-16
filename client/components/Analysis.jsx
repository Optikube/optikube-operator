// import React from "react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const GetRunningPodsChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400} minWidth={780}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="index"
          tick={{ fill: "black" }}
          type="number"
          domain={[0, "aotu"]} // Set domain to start from 0
        />
        <YAxis tick={{ fill: "black" }} />
        <Tooltip labelStyle={{ color: "black" }} />
        <Legend iconType="line" verticalAlign="bottom" height={36} />
        <Line
          type="monotone"
          dataKey="value"
          name="Number of Active Pods"
          stroke="black"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const Analysis = () => {
  const [runningPods, setRunningPods] = useState([]);

  const fetchNoPods = async () => {
    try {
      const response = await axios.get("/api/analysis/runningPods");
      setRunningPods((prevData) => [
        ...prevData,
        { index: prevData.length * 10, value: response.data },
      ]);
    } catch (error) {
      console.error("Error in fetchNoPods data: ", error);
    }
  };

  useEffect(() => {
    fetchNoPods(); // Initial fetch
    const intervalId = setInterval(fetchNoPods, 10000); // Fetch data every 10 seconds

    return () => {
      clearInterval(intervalId); // Clean up interval on component unmount
    };
  }, []);

  useEffect(() => {
    console.log(">>> current data into chart: ", runningPods);
  }, [runningPods]);


  return (
    <div className="flex flex-col relative items-center">
      <h1 className="font-bold text-lg mx-auto"> Figure 1. Number of Active Pods </h1>
      <GetRunningPodsChart className="flex relative align-middle" data={runningPods} />
    </div>
  );
};

export default Analysis;
