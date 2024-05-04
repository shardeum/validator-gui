import Link from 'next/link';
import Head from 'next/head';
import { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import { authService } from '../services/auth.service';
import { useGlobals } from '../utils/globals';

export default function Layout({children}: PropsWithChildren) {
  const router = useRouter();
  const { apiBase } = useGlobals();
  
  return (
    <>
      <Head>
        <title>Shardeum Dashboard</title>
        <meta name="description" content="Dashboard to configure a Shardeum validator"/>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className="py-5 md:py-10 px-5 sm:px-10 lg:px-20 ml-auto mr-auto max-w-[75rem]">
        {/* Navigation bar */}
        <nav className="text-gray-400 py-2">
          {/* Logo */}
          <div className="flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Shardeum" className="w-40"/>
            <span className="flex-grow"></span>
          </div>

          {/* Navigation links */}
          <div className="flex flex-row items-start">

            <ul className="flex-grow flex flex-col sm:flex-row mb-3 mt-5 lg:mt-10 sm:border-b-2 border-b-gray-500 sm:h-10 items-stretch">
              <li className={router.pathname == "/" ? "border-b-2 border-b-white px-2 md:px-5 sm:-mb-0.5 text-white" : "px-2 md:px-5"}>
                <Link href='/'>Overview</Link></li>
              <li
                className={router.pathname == "/performance" ? "border-b-2 border-b-white px-1 md:px-5 sm:-mb-0.5 text-white" : "px-2 md:px-5"}>
                <Link href='/performance'>Performance</Link>
              </li>
              <li
                className={router.pathname == "/maintenance" ? "border-b-2 border-b-white px-1 md:px-5 sm:-mb-0.5 text-white" : "px-2 md:px-5"}>
                <Link href='/maintenance'>Maintenance</Link>
              </li>
              <li
                className={router.pathname == "/network" ? "border-b-2 border-b-white px-1 md:px-5 sm:-mb-0.5 text-white" : "px-2 md:px-5"}>
                <Link href='/network'>Network</Link></li>
              <li
                className={router.pathname == "/alert-info" ? "border-b-2 border-b-white px-1 md:px-5 sm:-mb-0.5 text-white" : "px-2 md:px-5"}>
                <Link href='/alert-info'>Alert Info</Link></li>
              <li
                className={router.pathname == "/settings" ? "border-b-2 border-b-white px-1 md:px-5 sm:-mb-0.5 text-white" : "px-2 md:px-5"}>
                <Link href='/settings'>Settings</Link></li>
            </ul>
            <button title='Logout' className="hover:text-stone-200 mt-5 lg:mt-10" onClick={async () => await authService.logout(apiBase)}>
                 <ArrowRightOnRectangleIcon className='h-5 w-5 inline ml-2' onClick={async () => await authService.logout(apiBase)}/></button>
          </div>

        </nav>

        {/* Dynamic content */}
        <div className="py-4 sm:p-4">
          <main>{children}</main>
        </div>

      </main>
      <div className="w-full sm:w-[26rem] h-[28rem] absolute top-0 sm:top-32 right-0 -z-10" style={{
        'background':
          'radial-gradient(circle at right 20% bottom 40%, purple, transparent 50%),' +
          'radial-gradient(circle at right 20% top 40%, blue, transparent 50%)',
        opacity: 0.7
      }}></div>
    </>
  )
}
