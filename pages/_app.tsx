import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app'
import Layout from '../components/Layout';
import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import ToastContextProvider from '../components/ToastContextProvider';
import { Chain, configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public'
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { injectedWallet, metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import ConfirmModalContextProvider from '../components/ConfirmModalContextProvider';
import RouteGuard from '../components/RouteGuard';
import FetcherContextProvider from '../components/FetcherContextProvider';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactElement | null
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function getDefaultLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
}

export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? 'https://sphinx.shardeum.org/';
export const EXPLORER_URL = process.env.NEXT_EXPLORER_URL ?? 'https://explorer-sphinx.shardeum.org/';
export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID ? +process.env.NEXT_PUBLIC_CHAIN_ID : 8082;

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
    public: {http: [RPC_URL]},
  },
  blockExplorers: {default: {name: 'Sphinx Explorer', url: EXPLORER_URL}},
}

const {chains, publicClient} = configureChains([devnet], [publicProvider()])

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({chains}),
      metaMaskWallet({chains, projectId: 'shm-dashboard'}),
      walletConnectWallet({chains, projectId: 'shm-dashboard'}),
    ],
  },
]);

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors,
});


function App({Component, pageProps}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? getDefaultLayout
  return (
    <>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains} modalSize="compact">
          <RouteGuard>
            <ConfirmModalContextProvider>
              <ToastContextProvider>
                <FetcherContextProvider>
                  {getLayout(<Component {...pageProps} />)}
                </FetcherContextProvider>
              </ToastContextProvider>
            </ConfirmModalContextProvider>
          </RouteGuard>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  )
}

export default App
