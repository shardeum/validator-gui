import { useAccount } from "wagmi";
import { NodeStatus } from "../molecules/NodeStatus";
import { StakeDisplay } from "../molecules/StakeDisplay";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { useNodeVersion } from "../../hooks/useNodeVersion";
import { useRef, useState } from "react";
import { SupportOptions } from "../molecules/SupportOptions";
import { SupportDisplay } from "../molecules/SupportDisplay";

export const OverviewSidebar: React.FC = () => {
  const renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;

  const { isConnected, address } = useAccount();
  const { version } = useNodeVersion();
  const [areSupportOptionsVisible, setAreSupportOptionsVisible] =
    useState(false);

  return (
    <div className="flex flex-col gap-y-10 scroll-smooth">
      <div className="flex flex-col gap-y-2">
        <span className="font-semibold">Node Status</span>
        <div className="flex flex-col shadow border border-gray-200 rounded">
          <NodeStatus isWalletConnected={isConnected} address={address || ""} />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <span className="font-semibold">Your Stake</span>
        <div className="flex flex-col shadow border border-gray-200 rounded">
          <StakeDisplay />
        </div>
      </div>
      <div className="flex flex-col gap-y-1 font-light text-black">
        <span className="text-xs font-medium">Version Info</span>
        <div className="flex mt-1 justify-between items-center">
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
              <div className="bg-successBorder rounded-full h-2 w-2 flex items-center justify-center">
                <div className="bg-successFg rounded-full h-1 w-1"></div>
              </div>
              <span className="font-light text-xs">
                GUI Version <u>{version?.runningGuiVersion}</u>
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="bg-severeBorder rounded-full h-2 w-2 flex items-center justify-center">
                <div className="bg-severeFg rounded-full h-1 w-1"></div>
              </div>
              <span className="font-light text-xs">
                Validator Version <u>{version?.runnningValidatorVersion}</u>
              </span>
            </div>
          </div>
          <div className="flex justify-center items-center relative">
            <QuestionMarkCircleIcon
              className="h-10 w-10 cursor-pointer"
              onClick={() => {
                setAreSupportOptionsVisible((prevState) => !prevState);
              }}
            />
            <SupportDisplay
              isVisible={areSupportOptionsVisible}
              onClose={() => {
                setAreSupportOptionsVisible(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
