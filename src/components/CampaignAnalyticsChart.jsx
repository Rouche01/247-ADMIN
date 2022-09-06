import React from "react";
import {
  LineChart,
  ResponsiveContainer,
  Line,
  XAxis,
  CartesianGrid,
  YAxis,
  Tooltip,
} from "recharts";

const CampaignAnalyticsChart = ({ data, impressionDataKey, xDataKey }) => {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid stroke="#4d4d4d" strokeDasharray="5 5" />

        <Line type="monotone" dataKey={impressionDataKey} stroke="#4FB81D" />
        <YAxis axisLine={false} />
        <XAxis dataKey={xDataKey} />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CampaignAnalyticsChart;
