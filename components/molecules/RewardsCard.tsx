import { useEffect, useState } from "react";
import rewardsCardBg from "../../assets/rewards-card.png";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import { Card } from "../layouts/Card";
import { useAccount, useNetwork } from "wagmi";
import { useAccountStakeInfo } from "../../hooks/useAccountStakeInfo";
import { CHAIN_ID } from "../../pages/_app";
import { ConfirmUnstakeModal } from "./ConfirmUnstakeModal";
import useModalStore from "../../hooks/useModalStore";
import { ConfirmRedemptionModal } from "./ConfirmRedemptionModal";

function formatDate(date: Date) {
  // Define options for the date part
  const dateOptions = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  // Define options for the time part
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Format date and time separately
  const datePart = date.toLocaleDateString("en-US", dateOptions);
  const timePart = date.toLocaleTimeString("en-US", timeOptions);

  // Combine date and time parts
  return `${datePart} ${timePart}`;
}

export const RewardsCard = () => {
  const { setShowModal, setContent, resetModal } = useModalStore(
    (state: any) => ({
      setShowModal: state.setShowModal,
      setContent: state.setContent,
      resetModal: state.resetModal,
    })
  );
  const { nodeStatus } = useNodeStatus();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { stakeInfo } = useAccountStakeInfo(address);
  const [canRedeem, setCanRedeem] = useState(
    isConnected &&
      chain?.id === CHAIN_ID &&
      nodeStatus?.state !== "active" &&
      parseFloat(stakeInfo?.stake || "0") > 0
  );
  useEffect(() => {
    setCanRedeem(
      isConnected &&
        chain?.id === CHAIN_ID &&
        nodeStatus?.state !== "active" &&
        parseFloat(stakeInfo?.stake || "0") > 0
    );
  }, [nodeStatus?.state, stakeInfo?.stake, isConnected, chain?.id]);

  return (
    <Card>
      <div className="flex justify-between">
        <div className="flex flex-col px-5 py-4 gap-y-3 grow">
          <div className="flex w-full">
            <div className="flex justify-between w-full">
              <div className="flex flex-col w-full gap-y-2">
                <span className="font-semibold text-2xl flex gap-x-2">
                  <span>{nodeStatus?.currentRewards} SHM</span>
                  <span className="text-xs leading-9 bodyFg">(~0.00$)</span>
                </span>
                <div className="text-xs flex justify-between w-full bodyFg">
                  <span>Earned since last validating cycle</span>
                  {nodeStatus?.lastActive && (
                    <span className="max-md:hidden">
                      {formatDate(new Date(nodeStatus?.lastActive))}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-3" />
          <div className="flex justify-between">
            <span className="text-xs bodyFg">Total rewards earned</span>
            <span className="font-semibold text-xs">
              {nodeStatus?.lifetimeEarnings} SHM
            </span>
          </div>
          <div>
            <button
              className={
                `border border-gray-400 mt-3 px-3 py-1 text-sm rounded ` +
                (canRedeem ? "text-primary" : "text-gray-400 tooltip")
              }
              data-tip="It is not possible to redeem rewards while you are validating.
              If absolutely necessary, use the force stop option in settings (Not Recommended)."
              disabled={!canRedeem}
              onClick={() => {
                resetModal();
                setContent(
                  <ConfirmRedemptionModal
                    nominator={address?.toString() || ""}
                    nominee={nodeStatus?.nomineeAddress || ""}
                    currentRewards={parseFloat(
                      nodeStatus?.currentRewards || "0"
                    )}
                    currentStake={parseFloat(stakeInfo?.stake || "0")}
                  ></ConfirmRedemptionModal>
                );
                setShowModal(true);
              }}
            >
              Redeem Rewards
            </button>
          </div>
        </div>
        <div className="h-full max-md:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={rewardsCardBg.src} className="h-full max-h-48" />
        </div>
      </div>
    </Card>
  );
};
