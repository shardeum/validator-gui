import { ReactElement, useContext } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { GeistSans } from "geist/font";
import { authService } from "../../services/auth.service";
import Head from "next/head";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import loginAsideBg from "../../assets/login-aside-bg.svg";
import mobileLoginBg from "../../assets/mobile-login-bg.svg";
import { Logo } from "../../components/atoms/Logo";
import { Title } from "../../components/atoms/Title";
import { LoginForm } from "../../components/molecules/LoginForm";
import { useNodeVersion } from "../../hooks/useNodeVersion";
import { useDevice } from "../../context/device";

const Login = () => {
  const router = useRouter();
  const { publicVersion } = useNodeVersion();
  const { isMobile } = useDevice();

  useEffect(() => {
    // redirect to home if already logged in
    if (authService.isLogged) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <div className="h-screen w-screen flex center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <aside
          className="basis-0 grow max-sm:hidden w-full h-full bg-[#3042FB] text-white flex flex-col justify-end items-start"
          style={{
            backgroundImage: `url(${loginAsideBg.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "fill",
          }}
        >
          <div className="flex flex-col items-center mb-20 ml-20 gap-y-8">
            <span
              className={
                "break-normal max-w-sm font-medium text-xl " +
                GeistSans.className
              }
            >
              Thank you for helping make Shardeum more decentralized and stable
              by running a node
            </span>
            <div className="flex justify-start ml-3">
              <div className="max-w-[200px] break-normal flex flex-col justify-start">
                <CheckCircleIcon className="h-5 w-5 mb-2" />
                <span>Ensure shardeum is up almost all the time</span>
              </div>
              <div className="max-w-[200px] break-normal flex flex-col justify-start">
                <CheckCircleIcon className="h-5 w-5 mb-2" />
                <span>Keeps the network truly decentralized</span>
              </div>
            </div>
          </div>
        </aside>
        <div
          className="bg-[#FAFAFA] flex basis-0 grow text-stone-500 rounded-xl text-sm h-full"
          style={{
            backgroundImage: isMobile ? `url(${mobileLoginBg.src})` : "",
            backgroundRepeat: "no-repeat",
            backgroundSize: "fill",
            height: "100%",
            width: "100%",
          }}
        >
          <main className="grow p-20 h-full">
            <div className="flex flex-col gap-y-8 h-full">
              <Logo className="w-40 mb-4" />
              <Title
                text="Enter password to connect to the validator dashboard"
                className={
                  GeistSans.className +
                  " text-3xl font-semibold text-gray-900 max-w-[400px]"
                }
              />
              <div className="flex flex-col justify-between h-full">
                <LoginForm />
                <div className="flex justify-between w-full">
                  <span>
                    Validator Version : {publicVersion?.runningCliVersion}
                  </span>
                  <span>Running on Localhost</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
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

export default Login;
