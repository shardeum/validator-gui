import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout';
// import { appWithTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { NextPage } from 'next';
import ToastContextProvider from '../components/ToastContextProvider';

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
    <>
      <ToastContextProvider>
        {getLayout(<Component {...pageProps} />)}
      </ToastContextProvider>
    </>
  )
}

// export default appWithTranslation(App)
export default App
