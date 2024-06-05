import { BellIcon } from "@heroicons/react/24/solid";
import { Logo } from "../../components/atoms/Logo";
import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import { WalletConnectButton } from "../../components/molecules/WalletConnectButton";
import { ReactElement, useRef, useState } from "react";
import { OverviewSidebar } from "../../components/organisms/OverviewSidebar";
import { TabButton } from "../../components/atoms/TabButton";
import Head from "next/head";
import dashboardBg from "../../assets/dashboard-bg.svg";
import notebookIcon from "../../assets/notebook-icon.svg";
import { PerformanceDisplay } from "../../components/molecules/PerformanceDisplay";
import { RewardsCard } from "../../components/molecules/RewardsCard";
import { NetworkSizeCard } from "../../components/molecules/NetworkSizeCard";
import { SettingsDisplay } from "../../components/organisms/SettingsDisplay";
import { Bars3Icon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { LogsDisplay } from "../../components/organisms/LogsDisplay";
import { NotificationsWindow } from "../../components/molecules/NotificationsWindow";
import useNotificationsStore from "../../hooks/useNotificationsStore";
import { ToastWindow } from "../../components/molecules/ToastWindow";
import { useDevice } from "../../context/device";
import { NodeStatusMobileRibbon } from "../../components/molecules/NodeStatusMobileRibbon";
import { useAccount } from "wagmi";

enum Content {
  MAIN = "MAIN",
  SETTINGS = "SETTINGS",
  LOGS = "LOGS",
}

const Dashboard = () => {
  const overviewSectionRef = useRef(null);
  const networkSizeSectionRef = useRef(null);
  const performanceSectionRef = useRef(null);

  const { showWindow, setShowWindow } = useNotificationsStore((state: any) => ({
    showWindow: state.showWindow,
    setShowWindow: state.setShowWindow,
  }));

  const [contentPane, setContentPane] = useState<Content>(Content.MAIN);
  const toggleSettingsDisplay = () => {
    if (contentPane !== Content.SETTINGS) {
      setContentPane(Content.SETTINGS);
    } else {
      setContentPane(Content.MAIN);
    }
  };
  const toggleLogsDisplay = () => {
    if (contentPane !== Content.LOGS) {
      setContentPane(Content.LOGS);
    } else {
      setContentPane(Content.MAIN);
    }
  };
  const { isMobile } = useDevice();
  const { isConnected } = useAccount();

  return (
    <>
      {!isMobile && (
        <>
          {/* navbar */}
          <nav className="px-12 shadow fixed top-0 bg-white w-full z-10">
            <div className="flex flex-col w-full">
              <div className="flex justify-between py-3 w-full">
                <Logo className="w-32" />
                <div className="flex items-center gap-x-4 relative">
                  <div className="relative">
                    <BellIcon
                      className="w-5 h-5 text-black cursor-pointer"
                      onClick={() => {
                        setShowWindow(!showWindow);
                      }}
                    />
                    <NotificationsWindow />
                  </div>
                  {/* TODO: find an appropriate icon */}
                  <button
                    className="fill-bg h-4 w-4"
                    onClick={toggleLogsDisplay}
                    style={{
                      backgroundImage: `url(${notebookIcon.src})`,
                    }}
                  ></button>
                  <Cog6ToothIcon
                    onClick={toggleSettingsDisplay}
                    className="w-5 h-5 text-black bg-white cursor-pointer"
                  />
                  <WalletConnectButton
                    toShowAddress={true}
                    label="Connect Wallet"
                  ></WalletConnectButton>
                  <ToastWindow />
                </div>
              </div>
              <div className="flex justify-start gap-x-3 text-black text-xs mb-2">
                {contentPane === Content.MAIN && (
                  <>
                    <TabButton
                      toRef={overviewSectionRef}
                      preClick={() => setContentPane(Content.MAIN)}
                      text="Overview"
                    ></TabButton>
                    <TabButton
                      toRef={networkSizeSectionRef}
                      preClick={() => setContentPane(Content.MAIN)}
                      text="Network Size"
                    ></TabButton>
                    <TabButton
                      toRef={performanceSectionRef}
                      preClick={() => setContentPane(Content.MAIN)}
                      text="Performance"
                    ></TabButton>
                  </>
                )}
                {contentPane !== Content.MAIN && (
                  <button
                    className="flex gap-x-1 p-2 items-center rounded hover:font-semibold text-sm ease-in-out duration-200"
                    onClick={() => {
                      setContentPane(Content.MAIN);
                    }}
                  >
                    <ChevronLeftIcon className="h-3 w-3 text-black stroke-2" />
                    <span className="text-sm">Dashboard</span>
                  </button>
                )}
              </div>
            </div>
          </nav>

          {/* content */}
          <div
            className={
              "w-full flex flex-col text-black relative scroll-smooth " +
              (contentPane === Content.SETTINGS ? "bg-subtleBg" : "")
            }
          >
            <div className="flex pr-[32rem]">
              {/* dashboard metrics */}
              <div className="grow h-screen pt-32 w-full flex flex-col justify-between">
                {contentPane === Content.MAIN && (
                  <>
                    <div className="px-16 flex flex-col gap-y-12">
                      <span className="font-medium text-3xl">
                        Welcome Back!
                      </span>
                      {/* Rewards */}
                      <section
                        id="overview"
                        ref={overviewSectionRef}
                        className="flex flex-col w-full"
                      >
                        <span className="font-medium text-base mb-1">
                          Your Rewards
                        </span>
                        <RewardsCard />
                      </section>

                      {/* Network Size */}
                      <section
                        id="network-size"
                        ref={networkSizeSectionRef}
                        className="flex flex-col w-full"
                      >
                        <span className="font-medium text-base mb-1">
                          Network Size
                        </span>
                        <NetworkSizeCard />
                      </section>

                      {/* Performance */}
                      <section id="performance" ref={performanceSectionRef}>
                        <div className="flex items-center gap-x-3">
                          <span className="font-medium text-base mb-1">
                            Performance
                          </span>
                          <span className="text-xs text-gray-500">
                            Average Usage*
                          </span>
                        </div>
                        <PerformanceDisplay />
                      </section>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                    <img
                      src={dashboardBg.src}
                      className="w-full"
                      style={{
                        backgroundImage: `url(${dashboardBg.src})`,
                      }}
                    ></img>
                  </>
                )}
                {contentPane === Content.LOGS && <LogsDisplay />}
                {contentPane === Content.SETTINGS && <SettingsDisplay />}
              </div>

              {/* overview sidebar */}
              <div className="max-w-lg h-screen w-full px-12 pt-32 bg-white fixed right-0 border overflow-scroll hidden-scrollar scroll-smooth pb-48">
                <OverviewSidebar />
              </div>
            </div>
          </div>
        </>
      )}
      {isMobile && (
        <div className="flex flex-col text-black">
          {/* navbar */}
          <nav className="px-4 shadow fixed top-0 bg-white w-full z-10 h-14">
            <div className="flex flex-col w-full">
              <div className="flex justify-between py-3 w-full">
                <Logo className="w-8" isMinimalLogo={true} />
                <div className="flex items-center gap-x-4 relative">
                  <WalletConnectButton
                    toShowAddress={true}
                    label="Connect Wallet"
                  ></WalletConnectButton>
                  <BellIcon
                    className="w-5 h-5 text-black cursor-pointer"
                    onClick={() => {
                      setShowWindow(!showWindow);
                    }}
                  />
                  <Bars3Icon className="h-5 w-5 text-black cursor-pointer" />
                </div>
              </div>
            </div>
          </nav>
          <NodeStatusMobileRibbon isWalletConnected={isConnected} />
          {/* dashboard metrics */}
          <div className="grow h-screen pt-8 w-full flex flex-col justify-between">
            <>
              <div className="px-4 flex flex-col gap-y-12">
                <span className="font-medium text-3xl">Welcome Back!</span>
                {/* Rewards */}
                <section
                  id="overview"
                  ref={overviewSectionRef}
                  className="flex flex-col w-full"
                >
                  <span className="font-medium text-base mb-1">
                    Your Rewards
                  </span>
                  <RewardsCard />
                </section>

                {/* Network Size */}
                <section
                  id="network-size"
                  ref={networkSizeSectionRef}
                  className="flex flex-col w-full"
                >
                  <span className="font-medium text-base mb-1">
                    Network Size
                  </span>
                  <NetworkSizeCard />
                </section>

                {/* Performance */}
                <section id="performance" ref={performanceSectionRef}>
                  <div className="flex items-center gap-x-3">
                    <span className="font-medium text-base mb-1">
                      Performance
                    </span>
                    <span className="text-xs text-gray-500">
                      Average Usage*
                    </span>
                  </div>
                  <PerformanceDisplay />
                </section>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
              <img
                src={dashboardBg.src}
                className="w-full"
                style={{
                  backgroundImage: `url(${dashboardBg.src})`,
                }}
              ></img>
            </>
          </div>
        </div>
      )}
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
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
      <body>
        <div className="bg-[$FAFAFA] relative">{page}</div>
      </body>
    </>
  );
};
export default Dashboard;
