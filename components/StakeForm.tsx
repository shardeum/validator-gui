import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import { ethers } from "ethers";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { ToastContext } from "./ToastContextProvider";
import { useTXLogs } from "../hooks/useTXLogs";
import LoadingButton from "./LoadingButton";
import { isMetaMaskError } from "../utils/isMetaMaskError";
import { isEthersError } from "../utils/isEthersError";
import { useAccount } from "wagmi";
import {replacer} from "../utils/bigIntReplacer";

interface StakeData {
  isInternalTx: boolean;
  internalTXType: number;
  nominator: string;
  nominee: string;
  stake: string;
  timestamp: number;
}

type StakeFormProps = {
  nominee: string;
  stakeAmount: string;
  onStake?: () => void;
  totalStaked: number;
};

export default function StakeForm({
  nominee,
  stakeAmount,
  onStake,
  totalStaked,
}: StakeFormProps) {
  const { showTemporarySuccessMessage, showErrorDetails } =
    useContext(ToastContext);
  const requiredStake = ethers.parseEther(stakeAmount).toString() ?? '0';
  const ethereum = window.ethereum;
  const { writeStakeLog } = useTXLogs();
  const [isLoading, setLoading] = useState(false);
  const [isStakeOk, setStakeOk] = useState(true);
  const { address } = useAccount();
  const [data, setData] = useState<StakeData>({
    isInternalTx: true,
    internalTXType: 6,
    nominator: address?.toLowerCase() ?? '',
    nominee,
    stake: requiredStake,
    timestamp: Date.now(),
  });

  const createStakeLog = (
    _data: string,
    params: { data: unknown },
    hash: string,
    sender: string
  ) => {
    params.data = JSON.parse(_data);
    const logData = {
      tx: params,
      sender,
      txHash: hash,
    };

    return JSON.stringify(logData, replacer);
  };

  function setDataWithNominator(data: StakeData): void {
    return setData({
      ...data,
      nominator: address?.toLowerCase() ?? '',
    });
  }

  async function sendTransaction() {
    setLoading(true);
    let errorFlag = false;
    try {
      const dataWithNominator = {...data, nominator: address}
      const blobData: string = JSON.stringify(dataWithNominator);
      const provider = new ethers.BrowserProvider(ethereum!);
      const signer = await provider.getSigner();
      const from = await signer.getAddress()
      const nonce = await provider.getTransactionCount(from, 'latest');
      console.log("BLOB: ", blobData);
      console.log(stakeAmount,totalStaked);
      const value = BigInt(data.stake);

      const totalStakeBigNumber = BigInt(totalStaked);
      const stakeAmountBigNumber = ethers.parseUnits(stakeAmount, "ether")

      console.log(totalStakeBigNumber, stakeAmountBigNumber)
      if (totalStakeBigNumber < stakeAmountBigNumber && value < stakeAmountBigNumber) {
        errorFlag = true;
        throw new Error(
          "Stake Amount should be greater than the required stake"
        );
      }
      const params = {
        from,
        to: "0x0000000000000000000000000000000000010000",
        value,
        data: ethers.hexlify(ethers.toUtf8Bytes(blobData)),
        nonce,
      };
      console.log("Params: ", params);

      const txResponse = await signer.sendTransaction(params);
      console.log("TX RECEIPT: ", { hash: txResponse.hash, resultData: txResponse.data });
      await writeStakeLog(createStakeLog(blobData, params, txResponse.hash, from));

      const txConfirmation = await txResponse.wait();
      console.log("TX CONFRIMED: ", txConfirmation);
      showTemporarySuccessMessage("Stake successful!");
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = (error as Error)?.message || String(error);

      // 4001 is the error code for when a user rejects a transaction
      if (
        (isMetaMaskError(error) && error.code === 4001) ||
        (isEthersError(error) && error.code === "ACTION_REJECTED")
      ) {
        errorMessage = "Transaction rejected by user";
      }
      showErrorDetails(errorMessage);
      if (errorFlag) {
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    onStake?.();
  }

  function handleStakeChange(e: ChangeEvent<HTMLInputElement>) {
    try {
      const newValue = e.target.value.toString();
      const stake = ethers.parseEther(newValue).toString();
      setDataWithNominator({
        ...data,
        stake,
      });
      setStakeOk(true)
    } catch (e) {
      console.error(e);
      setDataWithNominator({
        ...data,
      });
      setStakeOk(false)
    }
  }

  return (
    <div>
      <label htmlFor="rewardWallet" className="block">
        Stake Wallet Address
      </label>
      <input
        id="rewardWallet"
        value={address}
        type="text"
        className="bg-white text-black p-3 mt-2 w-full block border border-black"
        disabled
      />
      <label className="block mt-4">Nominee Public Key</label>
      <input
        required
        type="text"
        name="nominee"
        className="bg-white text-black p-3 mt-2 w-full block border border-black"
        placeholder="Nominee Public Key"
        value={data.nominee}
        onChange={(e) =>
          setDataWithNominator({ ...data, nominee: e.target.value.toLowerCase() })
        }
      />
      <label className="block mt-4">Stake Amount (SHM)</label>
      <input
        required
        type="text"
        name="stake"
        className="bg-white text-black p-3 mt-2 w-full border border-black"
        placeholder="Stake Amount (SHM)"
        onChange={(e) => handleStakeChange(e)}
      />
      <div
        className={`flex items-center mb-5 ${
          !isStakeOk ? "text-red-500" : ""
        }`}
      >
        <div className="ml-2 font-semibold">
          Stake requirement: {stakeAmount}
        </div>
      </div>

      <div className="mt-5 float-right">
        <LoadingButton
          onClick={async () => sendTransaction()}
          isLoading={isLoading}
          className={`btn btn-primary ${
            isLoading || !isStakeOk ? "btn-disabled" : ""
          }`}
        >
          Stake
          <ArrowRightIcon className="h-5 w-5 inline ml-2" />
        </LoadingButton>
      </div>
    </div>
  );
}
