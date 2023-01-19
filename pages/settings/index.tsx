import { WalletIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import SignMessage from '../../components/SignMessage';
import { useNodeStatus } from '../../hooks/useNodeStatus';

export const getServerSideProps = () => ({
  props: { apiPort: process.env.PORT },
});

export default function Settings({ apiPort }: any) {
  const [haveMetamask, sethaveMetamask] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const {nodeStatus} = useNodeStatus(apiPort)

  useEffect(() => {
    // @ts-ignore
    const {ethereum} = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      } else sethaveMetamask(true);
    };
    checkMetamaskAvailability();
  }, []);

  const connectWallet = async () => {
    try {
      // @ts-ignore
      const {ethereum} = window;
      if (!ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      console.log("Account: ", ethereum.se);

      setAccountAddress(accounts[0]);

      console.log("Account2: ", accountAddress);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };
  return <>
    <h1 className="text-3xl mb-4">Settings</h1>

    <h2 className="text-2xl mb-4"><WalletIcon className="w-10 h-10 inline mr-4"/>Wallet</h2>
    {haveMetamask ? (
      isConnected ? (
        <div>
          <SignMessage nominator={accountAddress} nominee={nodeStatus?.nodeInfo?.publicKey}/>
        </div>
      ) : (
        <button className="border-2 border-b-white rounded-xl p-3" onClick={connectWallet}>
          Connect Metamask Wallet
        </button>
      )
    ) : (
      <div className="text-white">Please Install Metamask</div>
    )}

  </>
}
