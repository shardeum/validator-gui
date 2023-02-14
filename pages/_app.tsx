import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app'
import Layout from '../components/Layout';
import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import ToastContextProvider from '../components/ToastContextProvider';
import { RouteGuard } from '../components/RouteGuard';
import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public'
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { injectedWallet, metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactElement<any, any> | null
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function getDefaultLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
}

export const RPC_URL = process.env.RPC_URL ?? 'https://sphinx.shardeum.org/';
export const CHAIN_ID = process.env.CHAIN_ID ? +process.env.CHAIN_ID : 8082;

export const devnet: Chain = {
  id: CHAIN_ID,
  name: 'Shardeum',
  network: 'shardeum_devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Shardeum',
    symbol: 'SHM',
  },
  rpcUrls: {
    default: {http: [RPC_URL]},
  }
}

const {chains, provider} = configureChains([devnet], [publicProvider()])

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({chains}),
      metaMaskWallet({chains}),
      walletConnectWallet({chains}),
    ],
  },
]);

const client = createClient({
  autoConnect: true,
  provider,
  connectors,
});


function App({Component, pageProps}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? getDefaultLayout
  return (
    <>
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains} modalSize="compact">
          <RouteGuard>
            <ToastContextProvider>
              {getLayout(<Component {...pageProps} />)}
            </ToastContextProvider>
          </RouteGuard>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  )
}

export default App
