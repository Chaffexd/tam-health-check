import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { VictoryPie } from "victory";
import styles from './pie.module.css';

const Pie = ({ contentTypes }: any) => {
  const pieData = [
    { x: "Content Types", y: contentTypes?.total, label: `${contentTypes?.total} Content Types`},
  ];

  useEffect(() => {
    const chart = (
      <VictoryPie
        data={pieData}
        colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
      />
    );
    ReactDOM.render(chart, document.getElementById("chartId"));
  }, [pieData]);

  console.log("Pie data", pieData);
  return <div id="chartId" className={styles.container}></div>;
};

export default Pie;
