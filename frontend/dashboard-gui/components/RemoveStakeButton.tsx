import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { ToastContext } from './ToastContextProvider';

export default function RemoveStakeButton({nominee}: { nominee: string }) {
  const {showTemporarySuccessMessage} = useContext(ToastContext);

  const sendTransaction = async (nominator: string, nominee: string) => {
    try {
      // @ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const [gasPrice, from, nonce] = await Promise.all([
        signer.getGasPrice(),
        signer.getAddress(),
        signer.getTransactionCount()
      ]);

      const unstakeData = {
        isInternalTx: true,
        internalTXType: 7,
        nominator,
        timestamp: Date.now(),
        nominee,
      };
      console.log("Unstake Data", unstakeData);

      const params = {
        from,
        to: "0x0000000000000000000000000000000000000001",
        gasPrice,
        gasLimit: 30000000,
        data: ethers.utils.hexlify(
          ethers.utils.toUtf8Bytes(JSON.stringify(unstakeData))
        ),
        nonce
      };
      console.log("Params: ", params);

      const {hash, data, wait} = await signer.sendTransaction(params);
      console.log("TX RECEIPT: ", {hash, data});

      const txConfirmation = await wait();
      console.log("TX CONFRIMED: ", txConfirmation);
      showTemporarySuccessMessage('Remove stake successful!');
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [haveMetamask, sethaveMetamask] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

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
      await sendTransaction(accounts[0], nominee);
    } catch (error) {
      setIsConnected(false);
      setLoading(false);
    }
  };
  // const resultBox = useRef();
  // const [signatures, setSignatures] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState({
    isInternalTx: true,
    internalTXType: 7,
    nominator: accountAddress,
    timestamp: Date.now()
  });

  // @ts-ignore
  window.ethereum.on("accountsChanged", (accounts: any) => {
    setData({...data, nominator: accounts[0]});
  });

  async function removeStake() {
    setLoading(true);
    await connectWallet();
  }

  return (
    <>
      {haveMetamask ? (
        <div>
          <button className="p-3 bg-blue-700 text-stone-200 flex" onClick={() => removeStake()}>
            Remove Stake
            {!isLoading && <ArrowRightIcon className="h-5 w-5 inline ml-2"/>}
            {isLoading && <span className="h-5 w-5 inline ml-2">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            </span>}
          </button>
        </div>
      ) : (
        <div className="alert alert-error">Please Install Metamask</div>
      )}
    </>
  );
}
