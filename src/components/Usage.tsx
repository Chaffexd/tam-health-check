import React from "react";
import Chart from "./Chart";
import styles from './pie.module.css';

const UsageChart = ({ apiUsage }: any) => {
  if (!apiUsage || !apiUsage.items || !apiUsage.items.length) {
    return <p>Loading chart data...</p>;
  }

  return (
    <div style={{ display: "flex", gap: 10 }}>
      {apiUsage.items.map((item: any, index: number) => (
        <Chart
          key={index}
          title={item.metric.toLocaleUpperCase()}
          usagePerDay={item.usagePerDay}
          containerId={`chartId-${index}`}
        />
      ))}
    </div>
  );
};

export default UsageChart;
