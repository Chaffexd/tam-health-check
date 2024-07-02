import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
  VictoryLine,
  VictoryTheme,
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
} from "victory";
import styles from './pie.module.css';

interface ChartProps {
  title: string[];
  usagePerDay: Record<string, number>;
  containerId: string;
}

const Chart: React.FC<ChartProps> = ({ title, usagePerDay, containerId }) => {
  const usageData = Object.entries(usagePerDay).map(([date, usage]) => ({
    x: date,
    y: usage,
  }));

  useEffect(() => {
    const chart = (
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLabel
          text={title}
          x={225}
          y={30}
          textAnchor="middle"
          style={{ fontSize: 10, fontWeight: 'bold' }}
        />
        <VictoryAxis
          tickLabelComponent={<VictoryLabel angle={90} textAnchor="start" />}
        />
        <VictoryAxis dependentAxis />
        <VictoryLine
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" },
          }}
          data={usageData}
        />
      </VictoryChart>
    );
    ReactDOM.render(chart, document.getElementById(containerId));
  }, [usageData, title, containerId]);

  return <div id={containerId} className={styles.container}></div>;
};

export default Chart;
