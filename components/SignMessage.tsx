import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { ToastContext } from './ToastContextProvider';
import LoadingButton from './LoadingButton';

export default function SignMessage({
                                      nominator,
                                      nominee,
                                      stakeAmount,
                                      onStake
                                    }: { nominator: string, nominee: string, stakeAmount?: number, onStake?: () => void }) {
  const {showTemporarySuccessMessage} = useContext(ToastContext);

  const sendTransaction = async (e: any, blobData: any) => {
    setLoading(true);
    try {
      // @ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const [gasPrice, from, nonce] = await Promise.all([
        signer.getGasPrice(),
        signer.getAddress(),
        signer.getTransactionCount()
      ]);

      console.log("BLOB: ", blobData);

      const value = ethers.BigNumber.from(JSON.parse(blobData).stake);

      const params = {
        from,
        to: "0x0000000000000000000000000000000000000001",
        gasPrice,
        gasLimit: 30000000,
        value,
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(blobData)),
        nonce
      };
      console.log("Params: ", params);

      const {hash, data, wait} = await signer.sendTransaction(params);
      console.log("TX RECEIPT: ", {hash, data});

      const txConfirmation = await wait();
      console.log("TX CONFRIMED: ", txConfirmation);
      showTemporarySuccessMessage('Stake successful!');
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    onStake?.();
  };

  const signMessage = async ({setError, message}: any) => {
    try {
      // @ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const hash = ethers.utils.hashMessage(message);
      // const hash = hashPersonalMessage(Buffer.from(message, "utf8"));
      console.log("HASH: ", hash);
      const signature = await signer.signMessage(hash);
      console.log("SIGNATURE: ", signature);

      const from = await signer.getAddress();
      return {
        owner: from,
        hash,
        sig: signature
      };
    } catch (err: any) {
      setError(err.message);
    }
  };

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState({
    isInternalTx: true,
    internalTXType: 6,
    nominator: nominator.toLowerCase(),
    nominee,
    stake: stakeAmount,
    timestamp: Date.now()
  });

  useEffect(() => {
      setData({
        ...data,
        nominator: nominator.toLowerCase(),
        nominee,
        stake: stakeAmount
      });
    },
    [nominator, nominee]
  )

  // @ts-ignore
  window.ethereum.on("accountsChanged", (accounts: any) => {
    setData({...data, nominator: accounts[0].toLowerCase()});
  });

  console.log("DATA: ", data);
  let [isSigned, setSignedStatus] = useState(false);

  const handleSign = async (e: any) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target).get("message");

      const sign = await signMessage({
        setError,
        message: formData
      });
      if (sign!.sig) {
        setSignedStatus(true);
        // @ts-ignore
        setData({...data, sign});
        console.log("Data af Sig: ", data);
        // setSignatures([...signatures, sig]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSign}>
        <label htmlFor="rewardWallet" className="block">Stake Wallet Address</label>
        <input id="rewardWallet" value={data.nominator} type="text"
               className="bg-white text-black p-3 mt-2 w-full block border border-black"
               disabled/>
        <label className="block mt-4">
          Nominee Public Key
        </label>
        <input
          required
          type="text"
          name="nominee"
          className="bg-white text-black p-3 mt-2 w-full block border border-black"
          placeholder="Nominee Public Key"
          value={data.nominee}
          onChange={(e) =>
            //@ts-ignore
            setData({...data, nominee: e.target.value.toLowerCase()})
          }
        />
        <label className="block mt-4">
          Stake Amount (SHM)
        </label>
        <input
          required
          type="text"
          name="stake"
          className="bg-white text-black p-3 mt-2 w-full border border-black"
          placeholder="Stake Amount (SHM)"
          onChange={(e) =>
            setData({
              ...data,
              //@ts-ignore
              stake: ethers.utils
                .parseEther(e.target.value.toString())
                .toString()
            })
          }
        />
      </form>

      <div className="mt-5 float-right">
        <LoadingButton
          onClick={async (e) => sendTransaction(e, JSON.stringify(data))}
          isLoading={isLoading}
          className="btn btn-primary" disabled={isLoading}
        >
          Stake
          <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
        </LoadingButton>
      </div>
    </div>
  )
    ;
}
