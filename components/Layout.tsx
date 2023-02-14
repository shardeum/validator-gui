import Link from 'next/link';
import Head from 'next/head';
import { PropsWithChildren } from 'react';
import Toggle from './Toggle';
import { useRouter } from 'next/router';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import { authService } from '../services/auth.service';

export default function Layout({children}: PropsWithChildren) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Shardeum Dashboard</title>
        <meta name="description" content="Dashboard to configure a Shardeum validator"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className="py-10 px-20 ml-auto mr-auto max-w-[75rem]">
        {/* Navigation bar */}
        <nav className="text-gray-400 py-2">
          {/* Logo */}
          <div className="flex">
            <img src="logo.png" alt="Logo" className="w-40"/>
            <span className="flex-grow"></span>
            <Toggle/>
          </div>

          {/* Navigation links */}
          <div className="flex flex-direction-column">

            <ul className="flex-grow flex mb-3 mt-10 border-b-2 border-b-gray-500 h-10 items-stretch">
              <li className={router.pathname == "/" ? "border-b-2 border-b-white px-5 -mb-0.5 text-white" : "px-5"}>
                <Link href='/'>Overview</Link></li>
              <li
                className={router.pathname == "/performance" ? "border-b-2 border-b-white px-5 -mb-0.5 text-white" : "px-5"}>
                <Link href='/performance'>Performance</Link>
              </li>
              <li
                className={router.pathname == "/maintenance" ? "border-b-2 border-b-white px-5 -mb-0.5 text-white" : "px-5"}>
                <Link href='/maintenance'>Maintenance</Link>
              </li>
              <li
                className={router.pathname == "/network" ? "border-b-2 border-b-white px-5 -mb-0.5 text-white" : "px-5"}>
                <Link href='/network'>Network</Link></li>
              <li
                className={router.pathname == "/alert-info" ? "border-b-2 border-b-white px-5 -mb-0.5 text-white" : "px-5"}>
                <Link href='/alert-info'>Alert Info</Link></li>
              <li
                className={router.pathname == "/settings" ? "border-b-2 border-b-white px-5 -mb-0.5 text-white" : "px-5"}>
                <Link href='/settings'>Settings</Link></li>
            </ul>
            <button title='Logout' className="hover:text-stone-200" onClick={() => authService.logout()}>
                 <ArrowRightOnRectangleIcon className='h-5 w-5 inline ml-2' onClick={()=>authService.logout()}/></button>
          </div>

        </nav>

        {/* Dynamic content */}
        <div className="p-4">
          <main>{children}</main>
        </div>

      </main>
      <div className="w-[26rem] h-[28rem] absolute top-32 right-0 -z-10" style={{
        'background':
          'radial-gradient(circle at right 20% bottom 40%, purple, transparent 50%),' +
          'radial-gradient(circle at right 20% top 40%, blue, transparent 50%)',
        opacity: 0.7
      }}></div>
    </>
  )
}
