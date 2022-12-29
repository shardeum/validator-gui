import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layouts';
import { appWithTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { NextPage } from 'next';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactElement<any, any> | null
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function getDefaultLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
}

function App({Component, pageProps}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? getDefaultLayout
  return (
    getLayout(<Component {...pageProps} />)
  )
}

export default appWithTranslation(App)
