import { ReactElement } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { GeistSans } from "geist/font";
import { authService } from "../../services/auth.service";
import Head from "next/head";
import Image from "next/image";
import logoIconOtherBlocks from "../../assets/login-aside-other-blocks.svg";
import { Logo } from "../../components/atoms/Logo";
import { Title } from "../../components/atoms/Title";
import { LoginForm } from "../../components/molecules/LoginForm";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    // redirect to home if already logged in
    if (authService.isLogged) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen w-screen flex center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <aside className="w-full h-full grow basis-0 bg-[#3042FB] text-white">
        <Image
          src={logoIconOtherBlocks}
          alt="My SVG"
          className="h-full w-full"
        />
      </aside>
      <div className="bg-white grow text-stone-500 basis-0	rounded-xl text-sm">
        <main className="grow p-20">
          <div className="flex flex-col gap-y-10">
            <Logo className="w-36" />
            <Title
              text="Enter password to connect to the validator dashboard"
              className={
                GeistSans.className +
                " text-3xl font-semibold text-gray-900 max-w-[400px]"
              }
            />
            <LoginForm />
          </div>
        </main>
      </div>
    </div>
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
