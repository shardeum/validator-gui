import { useAccount, useNetwork } from "wagmi";
import dashboardBg from "../../assets/dashboard-bg.svg";
import { useAccountStakeInfo } from "../../hooks/useAccountStakeInfo";
import { useSettings } from "../../hooks/useSettings";
import { AutoRestartNodeToggle } from "../molecules/AutoRestartNodeToggle";
import { ForceRemoveStake } from "../molecules/ForceRemoveStake";
import { ForceStopNode } from "../molecules/ForceStopNode";
import PasswordResetForm from "../molecules/PasswordResetForm";
import { CHAIN_ID } from "../../pages/_app";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import { useEffect, useState } from "react";

export const SettingsDisplay = () => {
  const {
    settings,
    updateSettings,
    isLoading: updateSettingsLoading,
  } = useSettings();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { stakeInfo } = useAccountStakeInfo(address);
  const { nodeStatus } = useNodeStatus();
  const [stopDirectly, setStopDirectly] = useState(
    !!(nodeStatus?.state === "standby" || nodeStatus?.state === "need-stake")
  );

  const toggleAutoRestart = async () => {
    await updateSettings({ ...settings, autoRestart: !settings?.autoRestart });
  };
  useEffect(() => {
    setStopDirectly(
      nodeStatus?.state === "standby" || nodeStatus?.state === "need-stake"
    );
  }, [nodeStatus?.state]);

  return (
    <div className="grow flex flex-col justify-between">
      <div className="md:px-16 px-4 flex flex-col gap-y-12">
        <div className="flex flex-col gap-y-2">
          <span className="text-2xl font-semibold">Settings</span>
          <span className="text-sm bodyFg">
            Change settings and configure your node from this panel.
          </span>
        </div>
        <AutoRestartNodeToggle
          isOn={settings?.autoRestart || false}
          onClick={toggleAutoRestart}
        />
        {nodeStatus && (
          <ForceRemoveStake
            isEnabled={
              isConnected &&
              chain?.id === CHAIN_ID &&
              (stakeInfo?.stake ?? "0.0") > "0.0"
            }
            nominator={address?.toString() || ""}
            nominee={stakeInfo?.nominee || ""}
            currentRewards={parseFloat(nodeStatus?.currentRewards || "0")}
            currentStake={parseFloat(stakeInfo?.stake || "0")}
          />
        )}
        {nodeStatus && (
          <ForceStopNode
            isEnabled={nodeStatus.state !== "stopped"}
            needsConfirmation={!stopDirectly}
          />
        )}
        <PasswordResetForm />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        src={dashboardBg.src}
        className="w-full"
        style={{
          backgroundImage: `url(${dashboardBg.src})`,
        }}
      ></img>
    </div>
  );
};
