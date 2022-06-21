import { useCallback } from 'react';

import {
  BigNumber,
  utils,
} from 'ethers';

import { Contract } from '@ethersproject/contracts';

import {
  getContract,
  getSigner,
} from '../../hooks/getContract';
import {
  Modal,
  ModalProps,
  Network,
} from '../../WaterfallDefi';

const _invest = async (
  contract: Contract,
  amount: string[],
  selectTrancheIdx: string,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>
) => {
  const _amount = amount.map((a) =>
    BigNumber.from(utils.parseEther(a).toString()).toString()
  );
  const tx = await contract.investDirect(selectTrancheIdx, _amount, _amount);

  setModal({
    state: Modal.Txn,
    txn: tx.hash,
    status: "SUBMITTED",
    message: "Deposit Submitted",
  });

  const receipt = await tx.wait();

  if (receipt.status) {
    setModal({
      state: Modal.Txn,
      txn: tx.hash,
      status: "COMPLETED",
      message: "Deposit Success",
    });
  } else {
    setModal({
      state: Modal.Txn,
      txn: tx.hash,
      status: "REJECTED",
      message: "Deposit Failed",
    });
  }

  return receipt.status;
};

const useInvestDirectMCSimul = (
  network: Network,
  trancheMasterAddress: string,
  abi: any,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>
) => {
  const signer = getSigner();

  const contract = getContract(abi, trancheMasterAddress, network, signer);

  const handleInvestDirectMCSimul = useCallback(
    async (amount: string[], selectTrancheIdx: string) => {
      const result = await _invest(
        contract,
        amount,
        selectTrancheIdx,
        setModal
      );
      // dispatch(getMarkets(MarketList));
      return result;
    },
    [contract, setModal]
  );

  return { onInvestDirectMCSimul: handleInvestDirectMCSimul };
};

export default useInvestDirectMCSimul;
