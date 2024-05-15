import Head from "next/head";
import { ReactElement } from "react";

const Onboarding = () => {
  return (
    <div>
      <div className="flex flex-col">
        <span>Connect your wallet</span>
        <button
          className="bg-blue-400 w-32"
          onClick={() => {
            console.log("Connecting to wallet");
          }}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

Onboarding.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Shardeum Dashboard</title>
        <meta
          name="description"
          content="Dashboard to configure a Shardeum validator"
        />
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>{page}</div>
    </>
  );
};

export default Onboarding;
