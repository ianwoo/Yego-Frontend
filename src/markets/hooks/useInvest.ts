import React, { useCallback } from 'react';

import {
  BigNumber,
  utils,
} from 'ethers';

import { Contract } from '@ethersproject/contracts';

import {
  getContract,
  getSigner,
} from '../../hooks/getContract';
import { Market } from '../../types';
import {
  Modal,
  ModalProps,
  Network,
} from '../../WaterfallDefi';

const invest = async (
  contract: Contract,
  amount: string,
  selectTrancheIdx: string,
  multicurrencyIdx: number,
  multicurrencyTokenCount: number,
  isUSDC: boolean,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>
) => {
  const _amount = !isUSDC
    ? utils.parseEther(amount)
    : utils.parseUnits(amount, 6);
  const _zero = !isUSDC ? utils.parseEther("0") : utils.parseUnits("0", 6);
  let tx;
  if (multicurrencyIdx === -1) {
    tx = await contract.invest(selectTrancheIdx, _amount.toString(), false);
  } else {
    const _amountArray: BigNumber[] = [];
    for (let index = 0; index < multicurrencyTokenCount; index++) {
      _amountArray.push(BigNumber.from(_zero.toString()));
    }
    _amountArray[multicurrencyIdx] = BigNumber.from(_amount.toString());
    tx = await contract.invest(selectTrancheIdx, [..._amountArray], false);
  }
  setModal({
    state: Modal.Txn,
    txn: tx.hash,
    status: "SUBMITTED",
    message: "Deposit Submitted",
  });
  const receipt = await tx.wait();

  if (receipt.status === 1) {
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

const useInvest = (
  network: Network,
  trancheMasterAddress: string,
  abi: any,
  multicurrencyIdx: number,
  multicurrencyTokenCount: number,
  isUSDC: boolean,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>,
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>
) => {
  const signer = getSigner();
  const contract = getContract(abi, trancheMasterAddress, network, signer);

  const handleInvest = useCallback(
    async (amount: string, selectTrancheIdx: string) => {
      const result = await invest(
        contract,
        amount,
        selectTrancheIdx,
        multicurrencyIdx,
        multicurrencyTokenCount,
        isUSDC,
        setModal
      );
      setMarkets(undefined);
      return result;
    },
    [contract, isUSDC, multicurrencyIdx, multicurrencyTokenCount, setModal, setMarkets]
  );

  return { onInvest: handleInvest };
};

export default useInvest;
