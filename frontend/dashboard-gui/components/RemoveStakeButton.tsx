import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Alert, CircularProgress, Snackbar } from '@mui/material';

export default function RemoveStakeButton({nominee}: { nominee: string }) {

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
      setOpenSnackbar(true);
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
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

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
          <button className="p-3 bg-blue-700 text-stone-200" onClick={() => removeStake()}>
            Remove Stake
            {!isLoading && <ArrowRightIcon className="h-5 w-5 inline ml-2"/>}
            {isLoading && <span className="h-5 w-5 inline ml-2"><CircularProgress size={15} sx={{color: 'white'}} /></span>}
          </button>
        </div>
      ) : (
        <div className="alert alert-error">Please Install Metamask</div>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose}
                anchorOrigin={{horizontal: 'center', vertical: 'top'}}>
        <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
          Remove stake successful!
        </Alert>
      </Snackbar>
    </>
  );
}
