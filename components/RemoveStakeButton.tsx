import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { ToastContext } from './ToastContextProvider';
import { useTXLogs } from "../hooks/useTXLogs";
import LoadingButton from './LoadingButton';
import { ConfirmModalContext } from './ConfirmModalContextProvider';
import { isMetaMaskError } from '../utils/isMetaMaskError';
import { isEthersError } from '../utils/isEthersError';
import { NodeStatus } from '../model/node-status'
import {useAccount} from "wagmi";

export default function RemoveStakeButton({nominee, force = false, nodeStatus}: { nominee: string, force?: boolean, nodeStatus: NodeStatus['state'] }) {
  const {showTemporarySuccessMessage, showErrorDetails} = useContext(ToastContext);
  const { address } = useAccount();
  const {writeUnstakeLog} = useTXLogs()
  const {openModal} = useContext(ConfirmModalContext);
  const ethereum = window.ethereum;

  const createUnstakeLog = (data: unknown, params: { data: unknown }, hash: string, sender: string) => {
    params.data = data
    const logData = {
      tx: params,
      sender,
      txHash: hash
    }

    return JSON.stringify(logData)
  }

  const sendTransaction = async (nominator: string, nominee: string, force: boolean) => {
    if (!ethereum) {
      throw new Error('MetaMask not found');
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const from = await signer.getAddress()
      const nonce = await provider.getTransactionCount(from, 'latest');

      const unstakeData = {
        isInternalTx: true,
        internalTXType: 7,
        nominator,
        timestamp: Date.now(),
        nominee,
        force
      };
      console.log("Unstake Data", unstakeData);

      const params = {
        from,
        to: '0x0000000000000000000000000000000000010000',
        data: ethers.hexlify(
          ethers.toUtf8Bytes(JSON.stringify(unstakeData))
        ),
        nonce
      };
      console.log("Params: ", params);

      const {hash, data, wait} = await signer.sendTransaction(params);
      console.log("TX RECEIPT: ", {hash, data});
      await writeUnstakeLog(createUnstakeLog(unstakeData, params, hash, from))

      const txConfirmation = await wait();
      console.log("TX CONFRIMED: ", txConfirmation);
      showTemporarySuccessMessage('Remove stake successful!');
      setLoading(false);
    } catch (error) {
      console.error(error);
      let errorMessage = (error as Error)?.message || String(error);

      // 4001 is the error code for when a user rejects a transaction
      if ((isMetaMaskError(error) && error.code === 4001)
      || (isEthersError(error) && error.code === 'ACTION_REJECTED')) {
        errorMessage = 'Transaction rejected by user';
      }
      showErrorDetails(errorMessage);
    }
    setLoading(false);
  };

  const [haveMetamask, sethaveMetamask] = useState(false);
  const [accountAddress, setAccountAddress] = useState<string>('');

  useEffect(() => {
    const checkWalletAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      } else sethaveMetamask(true);
    };
    checkWalletAvailability();
  }, [ethereum]);

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      if (!address || address.length === 0) {
        console.error("No accounts returned from Ethereum provider.");
        return;
      }

      setAccountAddress(accounts[0]!);

      console.log("Account2: ", accountAddress);
      await sendTransaction(address, nominee, force);
    } catch (error) {
      setLoading(false);
    }
  };

  const [isLoading, setLoading] = useState(false);

  async function removeStake() {
    setLoading(true);
    await connectWallet();
  }

  const handleRemoveStake = () => {
    if (force) {
      openModal({
        header: 'Force Remove Stake',
        modalBody: (
          <>
            You are about to force remove your staked funds. This can be used to retrieve stake that is otherwise
             stuck.
            <br/>
            <span className='font-semibold'>WARNING</span>: Pending rewards can get lost when using this option!
          </>
        ),
        onConfirm: () => removeStake()
      });
    } else {
      removeStake()
    }
  }

  return (
    <>
      {haveMetamask ? (
        <>
          <div>
            <LoadingButton className="btn btn-primary"
              isLoading={isLoading}
              disabled={!force && (nodeStatus === 'waiting-for-network' || nodeStatus === 'standby' || nodeStatus === 'syncing' || nodeStatus === 'active')}
              onClick={() => handleRemoveStake()}>
              Remove Stake
              <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
            </LoadingButton>
          </div>
        </>
      ) : (
        <div className="text-red-500">Please install a Web3 Wallet</div>
      )}
    </>
  );
}
