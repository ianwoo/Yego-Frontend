import { BigNumber } from "bignumber.js";
import numeral from "numeral";
import { useState } from "react";
import { Tranche } from "../../types";

type Props = {
  tranches: Tranche[];
  totalTranchesTarget: string;
};

const getPercentage = (num: string | undefined, total: string | undefined) => {
  if (!num || !total) return "0";
  return new BigNumber(num).dividedBy(new BigNumber(total)).times(100).toFormat(2).toString();
};

const COLORS: { [key: string]: string } = {
  Senior: "#FCB500",
  Mezzanine: "#00A14A",
  Junior: "#0066FF",
  Fixed: "#FCB500",
  Variable: "#0066FF",
};

function TrancheStructure(props: Props) {
  const { tranches, totalTranchesTarget } = props;

  const [hoveredTranche, setHoveredTranche] = useState<number>(-1);

  const values = [
    Number(getPercentage(tranches[0]?.target, totalTranchesTarget)),
    Number(getPercentage(tranches[1]?.target, totalTranchesTarget)),
    Number(getPercentage(tranches[2]?.target, totalTranchesTarget)),
  ];

  function getSubordination() {
    if (tranches.length === 3) {
      return hoveredTranche === 0 ? values[1] + values[2] : hoveredTranche === 1 ? values[2] : "";
    } else {
      return hoveredTranche === 0 ? Number(getPercentage(tranches[1]?.target, totalTranchesTarget)) : "";
    }
  }

  const payload =
    tranches.length === 3
      ? [
          {
            name: "Senior",
            value: values[0],
          },
          {
            name: "Mezzanine",
            value: values[1],
          },
          {
            name: "Junior",
            value: values[2],
          },
        ]
      : [
          {
            name: "Fixed",
            value: values[0],
          },
          {
            name: "Variable",
            value: values[1],
          },
        ];

  return (
    <div className={"chart-block tranche-structure"}>
      <div className="background left-br right-br">
        <h3>Tranche Structure</h3>
        <div className="tranche-chart">
          {hoveredTranche !== -1 ? (
            <div className="subordination" key="subordination">
              <span className={"tranche-name " + payload[hoveredTranche].name.toLowerCase()}>
                {payload[hoveredTranche].name}
              </span>
              <br />
              {/* {hoveredTranche !== payload.length - 1 && (
                <span className="label">Subordination Level (Sum of Lower Tranches):</span>
              )} */}
              {/* {hoveredTranche === payload.length - 1 && <span className="label">Variable Rate:</span>}
              <br /> */}
              {hoveredTranche === 0 && (
                <span className="comment">
                  Repayment of Interest and Principal is paid out to this segment first. {payload[hoveredTranche].name}{" "}
                  Tranche users have principal protection until the portfolio strategy experiences{" "}
                  {numeral(getSubordination().toString()).format("0,0.[0000]")}% loss or more.
                </span>
              )}
              {hoveredTranche === 1 && hoveredTranche !== payload.length - 1 && (
                <span className="comment">
                  Mezzanine Tranche: Repayment of Interest and Principal is paid after Senior Tranche. Mezzanine Tranche
                  users have principal protection until the portfolio strategy experiences{" "}
                  {numeral(getSubordination().toString()).format("0,0.[0000]")}% loss or more.
                </span>
              )}
              {hoveredTranche === payload.length - 1 && (
                <span className="comment">
                  Junior tranche receives all the residual return, after paying back Senior and Mezzanine tranches in
                  order. Junior tranches are subject to first loss should the portfolio experience any drawdowns.
                </span>
              )}
            </div>
          ) : null}
          {payload.map((t, i) => (
            <div
              key={i}
              onMouseEnter={() => {
                setHoveredTranche(i);
              }}
              className={"tranche-stack" + (hoveredTranche === i ? " hovered" : "")}
              style={{ height: t.value * 1.9 + "px", background: COLORS[t.name] }}
            >
              <span>{t.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrancheStructure;
