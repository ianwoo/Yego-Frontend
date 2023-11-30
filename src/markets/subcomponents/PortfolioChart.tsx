import React, { useEffect, useState } from "react";
import { VictoryPie } from "victory";

type StrategyFarm = {
  farmName: string;
  shares: number;
};

type Props = {
  strategyFarms: StrategyFarm[];
};

const COLORS = [
  "rgb(51, 51, 51)",
  //stargate
  "#FFB0E3",
  //hop
  "#4A63B9",
  //curve
  "#85C872",
  //convex
  "#F7C05F",
  //stargate again
  "#FFB0E3",
];

function PortfolioChart(props: Props) {
  const { strategyFarms } = props;

  const [data, setData] = useState<StrategyFarm[]>([
    { farmName: "", shares: 1 },
    ...strategyFarms.map((f) => {
      return { ...f, shares: 0 };
    }),
  ]);
  const [loaded, setLoaded] = useState<boolean>(false);

  // const [hoveredSlice, setHoveredSlice] = useState<StrategyFarm>();

  useEffect(() => {
    if (!loaded) {
      setData([{ farmName: "", shares: 0 }, ...strategyFarms]);
      setLoaded(true);
    }
  }, [strategyFarms, loaded]);

  return (
    <div className="portfolio-chart">
      {data.map(
        (strat, i) =>
          strat.shares !== 0 && (
            <div className="strat" key={i}>
              <span className={"color" + i}>{strat.farmName}:</span>{" "}
              <span>{strat.shares === 0 ? "" : (strat.shares * 100).toString() + "%"}</span>
            </div>
          )
      )}
      <VictoryPie
        data={data}
        width={275}
        height={275}
        labels={data.map((strat) => (strat.shares === 0 ? "" : (strat.shares * 100).toString() + "%"))}
        labelRadius={35}
        y="shares"
        colorScale={COLORS}
        animate={{
          easing: "exp",
        }}
        style={{
          labels: {
            fontSize: 20,
            fill: "#FFFFFF",
          },
        }}
        // events={[
        //   {
        //     target: "data",
        //     eventHandlers: {
        //       onMouseOver: (props) => {
        //         console.log(props);
        //       },
        //     },
        //   },
        // ]}
      />
    </div>
  );
}

export default PortfolioChart;
