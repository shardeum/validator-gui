import { ethers } from 'ethers';

export default function useStakeTransaction() {
  return {
    stakeTransaction: async (blobData: any) => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const [gasPrice, from, nonce] = await Promise.all([
          signer.getGasPrice(),
          signer.getAddress(),
          signer.getTransactionCount()
        ]);

        console.log("BLOB: ", blobData);

        const value = ethers.BigNumber.from(JSON.parse(blobData).stake);
        // console.log(value.toString());

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

        // Below is the function to "inject" tx (OLD Method)
        // const tx = await window.ethereum.request({
        //   method: "eth_sendRawTransaction",
        //   params: [JSON.parse(blobData)]
        // });

        const {hash, data, wait} = await signer.sendTransaction(params);
        console.log("TX RECEIPT: ", {hash, data});

        const txConfirmation = await wait();
        console.log("TX CONFRIMED: ", txConfirmation);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
