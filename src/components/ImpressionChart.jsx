import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const ImpressionChart = ({ data, yDataKey, xDataKey }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey={yDataKey} stroke="#4FB81D" />
        <CartesianGrid stroke="#4d4d4d" strokeDasharray="5 5" />
        <XAxis dataKey={xDataKey} />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ImpressionChart;
