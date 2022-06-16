import { useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import { getContract, getSigner } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";
import WTFRewards from "../../config/abis/WTFRewards.json";
import {
  FeeRewardsAddressAVAX,
  FeeRewardsAddressBNB,
} from "../../config/address";
import { NETWORKS } from "../../types";

const useFeeRewardsContract = (network: Network) => {
  const signer = getSigner();

  return useMemo(
    () =>
      getContract(
        WTFRewards.abi,
        //incoming from Kirill:
        network === Network.AVAX
          ? FeeRewardsAddressBNB[NETWORKS.MAINNET]
          : FeeRewardsAddressAVAX[NETWORKS.MAINNET],
        network,
        signer
      ),
    [network, signer]
  );
};

const claimFeeRewards = async (contract: Contract) => {
  const tx = await contract.claimRewards();
  const receipt = await tx.wait();
  return receipt.status;
};

const useClaimFeeRewards = (network: Network) => {
  const { account } = useWeb3React();
  const contract = useFeeRewardsContract(network);
  const handleClaimReward = useCallback(async () => {
    const result = await claimFeeRewards(contract);
    //   dispatch();
    return result;
  }, [account, contract]);

  return { claimFeeRewards: handleClaimReward };
};

export default useClaimFeeRewards;