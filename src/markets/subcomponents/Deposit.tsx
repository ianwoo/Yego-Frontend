import BigNumber from "bignumber.js";
import { Market } from "../../types";
import { Hill } from "../svgs/Hill";
import ApproveCardDefault from "./ApproveCardDefault";
import TrancheCard from "./TrancheCard";

const BIG_TEN = new BigNumber(10);

type Props = {
  selectedMarket: Market;
  coingeckoPrices: any;
  selectedDepositAssetIndex: number;
};

function Deposit(props: Props) {
  const { selectedMarket, coingeckoPrices, selectedDepositAssetIndex } = props;

  const deposited: BigNumber[] = [];
  const tokens = selectedMarket.tokens;
  const trancheInvest: { type: "BigNumber"; hex: string }[][] | undefined =
    selectedMarket.trancheInvests;
  if (trancheInvest) {
    selectedMarket.assets.forEach((a, i) =>
      deposited.push(
        trancheInvest
          .reduce(
            (acc: BigNumber, next) =>
              acc.plus(new BigNumber(next[i].hex.toString())),
            new BigNumber(0)
          )
          .dividedBy(BIG_TEN.pow(18))
      )
    );
  }
  const maxDeposits = tokens.map((t) =>
    new BigNumber(selectedMarket.totalTranchesTarget).multipliedBy(
      new BigNumber(t.percent.hex).dividedBy(BIG_TEN.pow(5))
    )
  );
  const remainingDepositable = new BigNumber(
    maxDeposits[selectedDepositAssetIndex]
  ).minus(deposited[selectedDepositAssetIndex]);
  const remainingDepositableSimul = maxDeposits.map((md, i) =>
    new BigNumber(md).minus(deposited[i])
  );
  const returnWidth = (assetIndex: number) =>
    deposited[assetIndex]
      ? deposited[assetIndex]
          .dividedBy(
            tokens.length > 0
              ? maxDeposits[assetIndex].toString()
              : new BigNumber(1)
          )
          .multipliedBy(100)
          .toString()
      : 0;
  const width = selectedMarket.isMulticurrency
    ? returnWidth(selectedDepositAssetIndex)
    : 1;
  const widths = selectedMarket.isMulticurrency
    ? selectedMarket.assets.map((a, i) => returnWidth(i))
    : [];
  const marketData = selectedMarket;

  //MOMENT.JS -> ??? keep or discard?

  // const handleReminder = (startTime: Number, endTime: Number) => {
  //   if (!window || !startTime || !endTime) return;
  //   const start = moment.unix(Number(startTime)).format("YYYYMMDDTHHmm");
  //   const end = moment.unix(Number(endTime)).format("YYYYMMDDTHHmm");
  //   window?.open(
  //     `https://calendar.google.com/calendar/u/0/r/eventedit?dates=${start}/${end}&text=Waterfall`,
  //     "_blank"
  //   );
  // };

  return (
    <div className="deposit">
      <div className="next-cycle-wrapper">
        <Hill />
        <div className="next-cycle">Next Cycle</div>
        <div className="active-cycle">Active Cycle</div>
        <div className="button">Remind Me</div>
      </div>
      <div className="top-bar">
        <div className="step-bar">
          <div className="step">1</div>
          <div className="step-name">Choose Tranche</div>
          <div className="line" />
          <div className="step">2</div>
          <div className="step-name">Deposit</div>
        </div>
        {selectedMarket.isMulticurrency ? (
          <div className="select-deposit-asset">
            <div className="step-name">0 Remaining</div>
            <div className="remaining-depositable-outer">
              <div className="remaining-depositable-inner" />
            </div>
          </div>
        ) : null}
      </div>
      <div className="deposit-item">
        <div className="tranches">
          {selectedMarket.tranches.map((t, i) => {
            return (
              <TrancheCard
                selectedMarket={selectedMarket}
                selectedDepositAssetIndex={selectedDepositAssetIndex}
                tranche={t}
                trancheIndex={i}
                coingeckoPrices={coingeckoPrices}
              />
            );
          })}
        </div>
        <ApproveCardDefault />
      </div>
    </div>
  );
}

export default Deposit;
