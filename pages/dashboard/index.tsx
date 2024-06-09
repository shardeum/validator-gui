import { ArrowRightOnRectangleIcon, BellIcon } from "@heroicons/react/24/solid";
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
import { NodeStatusRibbon } from "../../components/molecules/NodeStatusRibbon";
import { useAccount } from "wagmi";
import { MobileModalWrapper } from "../../components/layouts/MobileModalWrapper";
import useModalStore from "../../hooks/useModalStore";
import { MobileMenu } from "../../components/molecules/MobileMenu";
import { authService } from "../../services/auth.service";
import { useGlobals } from "../../utils/globals";
import { InformationPopupsDisplay } from "../../components/molecules/InformationPopupsDisplay";

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
  const setToSettingsDisplay = () => {
    setContentPane(Content.SETTINGS);
  };
  const setToLogsDisplay = () => {
    setContentPane(Content.LOGS);
  };
  const { isMobile } = useDevice();
  const { isConnected } = useAccount();
  const { setShowModal, setContent } = useModalStore((state: any) => ({
    setShowModal: state.setShowModal,
    setContent: state.setContent,
  }));
  const { apiBase } = useGlobals();

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
                  <button
                    className="fill-bg h-4 w-4"
                    onClick={setToLogsDisplay}
                    style={{
                      backgroundImage: `url(${notebookIcon.src})`,
                    }}
                  ></button>
                  <Cog6ToothIcon
                    onClick={setToSettingsDisplay}
                    className="w-5 h-5 text-black bg-white cursor-pointer"
                  />
                  <WalletConnectButton
                    toShowAddress={true}
                    label="Connect Wallet"
                  ></WalletConnectButton>
                  <ArrowRightOnRectangleIcon
                    className="h-5 w-5 text-black cursor-pointer tooltip tooltip-bottom"
                    data-tip="Logout"
                    onClick={async () => await authService.logout(apiBase)}
                  />
                  <ToastWindow
                    viewLogsOnClick={setToLogsDisplay}
                    supportOnClick={() => {
                      //pass
                    }}
                  />
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
          <div className="w-full flex flex-col text-black relative scroll-smooth">
            <div className="flex pr-[32rem]">
              {/* dashboard metrics */}
              <div className="grow h-screen pt-32 w-full flex flex-col justify-between">
                {contentPane === Content.MAIN && (
                  <>
                    <div className="px-16 flex flex-col gap-y-12">
                      <InformationPopupsDisplay />

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
          <nav className="px-4 shadow fixed top-0 bg-white w-full z-10 h-20">
            <div className="flex flex-col w-full">
              <div className="flex justify-between py-3 w-full">
                <Logo className="w-8" isMinimalLogo={true} />
                <div className="flex items-center gap-x-3 relative">
                  <WalletConnectButton
                    toShowAddress={true}
                    label="Connect Wallet"
                  ></WalletConnectButton>
                  <BellIcon
                    className="w-5 h-5 text-black cursor-pointer"
                    onClick={() => {
                      setShowWindow(true);
                      setContent(
                        <MobileModalWrapper
                          closeButtonRequired={false}
                          contentOnTop={false}
                          wrapperClassName="fixed bottom-0 flex flex-col pt-7 items-center justify-start rounded-t-2xl min-h-1/2 overflow-scroll bg-white w-screen dropdown-300 text-black"
                        >
                          <NotificationsWindow />
                        </MobileModalWrapper>
                      );
                      setShowModal(true);
                    }}
                  />
                  <ArrowRightOnRectangleIcon
                    className="h-5 w-5 text-black cursor-pointer tooltip tooltip-bottom"
                    data-tip="Logout"
                    onClick={async () => await authService.logout(apiBase)}
                  />
                  <Bars3Icon
                    className="h-5 w-5 text-black cursor-pointer"
                    onClick={() => {
                      setContent(
                        <MobileModalWrapper
                          closeButtonRequired={true}
                          contentOnTop={true}
                        >
                          <MobileMenu
                            logsOnClick={() => {
                              setToLogsDisplay();
                              setShowModal(false);
                            }}
                            settingsOnClick={() => {
                              setToSettingsDisplay();
                              setShowModal(false);
                            }}
                          />
                        </MobileModalWrapper>
                      );
                      setShowModal(true);
                    }}
                  />
                </div>
              </div>
              {contentPane !== Content.MAIN && (
                <button
                  className="flex gap-x-1 items-center rounded font-semibold text-sm ease-in-out duration-200"
                  onClick={() => {
                    setContentPane(Content.MAIN);
                  }}
                >
                  <ChevronLeftIcon className="h-3 w-3 text-black stroke-2" />
                  <span className="text-sm">Dashboard</span>
                </button>
              )}
            </div>
            <ToastWindow
              viewLogsOnClick={setToLogsDisplay}
              supportOnClick={() => {
                //pass
              }}
            />
          </nav>
          <NodeStatusRibbon isWalletConnected={isConnected} />
          {/* dashboard metrics */}
          <div className="grow h-screen pt-8 w-full flex flex-col justify-between">
            {contentPane === Content.MAIN && (
              <>
                <div className="px-4 flex flex-col gap-y-12">
                  <InformationPopupsDisplay />
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
            {contentPane === Content.SETTINGS && <SettingsDisplay />}
            {contentPane === Content.LOGS && <LogsDisplay />}
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
