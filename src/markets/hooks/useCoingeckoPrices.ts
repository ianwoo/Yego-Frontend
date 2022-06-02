import ky from "ky";
import { useEffect, useState } from "react";
import { Market } from "../../types";

const getCoingeckoPrices = async () => {
  const result = await ky
    .get(
      "https://api.coingecko.com/api/v3/simple/price?vs_currencies=USD&ids=binancecoin,avalanche-2,wrapped-avax,wbnb"
    )
    .json()
    .then((res: any) => res);
  return result;
};

export const useCoingeckoPrices = (markets: Market[]) => {
  const [prices, setPrices] = useState({});

  //   const { slowRefresh } = useRefresh();
  useEffect(() => {
    const fetchBalance = async () => {
      const _prices = await getCoingeckoPrices();
      setPrices(_prices);
    };
    fetchBalance();
  }, [markets]);

  return prices;
};
