import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout';
// import { appWithTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { NextPage } from 'next';
import ToastContextProvider from '../components/ToastContextProvider';
import { RouteGuard } from '../components/RouteGuard';

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
      <RouteGuard>
        <ToastContextProvider>
          {getLayout(<Component {...pageProps} />)}
        </ToastContextProvider>
      </RouteGuard>
    </>
  )
}

// export default appWithTranslation(App)
export default App
