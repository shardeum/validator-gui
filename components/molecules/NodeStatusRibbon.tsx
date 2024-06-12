import { useEffect } from "react";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import {
  NotificationSeverity,
  NotificationType,
} from "../../hooks/useNotificationsStore";
import useToastStore, { ToastSeverity } from "../../hooks/useToastStore";
import { ExpansionArrow } from "../atoms/ExpansionArrow";
import useModalStore from "../../hooks/useModalStore";
import { OverviewSidebar } from "../organisms/OverviewSidebar";
import { MobileModalWrapper } from "../layouts/MobileModalWrapper";
import { wasLoggedOutKey } from "../../services/auth.service";
import {
  getNodeState,
  getTitle,
  getTitleBgColor,
  getTitleTextColor,
} from "./NodeStatus";
import useStatusUpdateStore from "../../hooks/useStatusUpdateStore";

export enum NodeState {
  ACTIVE = "ACTIVE",
  STANDBY = "STANDBY",
  STOPPED = "STOPPED",
  SYNCING = "SYNCING",
  NEED_STAKE = "NEED_STAKE",
  WAITING_FOR_NETWORK = "WAITING_FOR_NETWORK",
}

type NodeStatusRibbonProps = {
  isWalletConnected: boolean;
};

const previousNodeStateKey = "previousNodeState";

const getBorderColor = (state: NodeState, isWalletConnected: boolean) => {
  if (!isWalletConnected) {
    return "subtleFg";
  }
  return state === NodeState.ACTIVE
    ? "successBorder"
    : state === NodeState.STOPPED
    ? "dangerBorder"
    : state === NodeState.NEED_STAKE
    ? "severeBorder"
    : state === NodeState.WAITING_FOR_NETWORK
    ? "attentionBorder"
    : "subtleBg";
};

export const NodeStatusRibbon = ({
  isWalletConnected,
}: NodeStatusRibbonProps) => {
  const { nodeStatus } = useNodeStatus();
  const state: NodeState = getNodeState(nodeStatus);
  const title = getTitle(state, isWalletConnected);

  const titleBgColor = getTitleBgColor(state, isWalletConnected);
  const titleTextColor = getTitleTextColor(state, isWalletConnected);
  const borderColor = getBorderColor(state, isWalletConnected);
  const { showModal, setShowModal, setContent } = useModalStore(
    (state: any) => ({
      showModal: state.showModal,
      setShowModal: state.setShowModal,
      resetModal: state.resetModal,
      content: state.content,
      setContent: state.setContent,
    })
  );
  const { setCurrentToast, resetToast } = useToastStore((state: any) => ({
    setCurrentToast: state.setCurrentToast,
    resetToast: state.resetToast,
  }));

  const { setCurrentStatus } = useStatusUpdateStore((state: any) => ({
    setCurrentStatus: state.setCurrentStatus,
  }));

  useEffect(() => {
    const previousNodeState = localStorage.getItem(previousNodeStateKey);
    const currentNodeState = nodeStatus?.state || previousNodeState;
    resetToast();
    if (previousNodeState !== currentNodeState) {
      const wasLoggedOut = localStorage.getItem(wasLoggedOutKey) === "true";
      if (
        wasLoggedOut &&
        ["active", "stopped", "waiting-for-network", "need-stake"].includes(
          nodeStatus?.state || ""
        )
      ) {
        if (wasLoggedOut) {
          setCurrentStatus(nodeStatus?.state || "");
          localStorage.removeItem(wasLoggedOutKey);
        }
      }

      switch (nodeStatus?.state) {
        case "active":
          setCurrentToast({
            severity: ToastSeverity.SUCCESS,
            title: "Node Started Successfully",
            followupNotification: {
              type: NotificationType.NODE_STATUS,
              severity: NotificationSeverity.SUCCESS,
              title: "Your node status had been updated to: Validating",
            },
          });
          break;
        case "standby":
        case "need-stake":
          setCurrentToast({
            severity: ToastSeverity.ATTENTION,
            title: "Node is on standby",
            followupNotification: {
              type: NotificationType.NODE_STATUS,
              severity: NotificationSeverity.ATTENTION,
              title: "Your node status had been updated to: Standby",
            },
          });
          break;
        case "stopped":
          setCurrentToast({
            severity: ToastSeverity.SUCCESS,
            title: "Node Stopped Successfully",
            followupNotification: {
              type: NotificationType.NODE_STATUS,
              severity: NotificationSeverity.DANGER,
              title: "Your node status had been updated to: Stopped",
            },
          });
          break;
        default:
          break;
      }
      localStorage.setItem(previousNodeStateKey, currentNodeState || "");
    }
  }, [nodeStatus?.state]);

  return (
    <div className="mt-20">
      {/* this hidden dom tree is here just to initialise the tw colors dynamically */}
      <div className="hidden">
        <span className="bg-successBg text-xl text-successFg border border-b-successBorder">
          1
        </span>
        <span className="bg-severeBg text-xl text-severeFg border border-b-severeBorder">
          2
        </span>
        <span className="bg-attentionBg text-xl text-attentionFg border border-b-attentionBorder">
          3
        </span>
        <span className="bg-subtleBg text-xl text-subtleFg border border-b-subtleBg">
          4
        </span>
        <span className="bg-dangerBg text-xl text-dangerFg border border-b-dangerBorder">
          5
        </span>
      </div>
      <div
        className={`h-12 shadow flex items-center bg-${titleBgColor} border border-b-${borderColor}`}
      >
        <div
          className={`flex justify-between w-full items-center text-xs gap-x-2 p-3 font-semibold`}
        >
          <span className="text-subtleFg">
            Node Status: {showModal ? "true" : "false"}
          </span>
          <div className={`flex items-center gap-x-2 text-${titleTextColor}`}>
            <span>{title}</span>
            <ExpansionArrow
              isUp={showModal}
              toReverseDirection={false}
              onClick={() => {
                setContent(
                  <MobileModalWrapper
                    closeButtonRequired={true}
                    contentOnTop={true}
                  >
                    <OverviewSidebar />
                  </MobileModalWrapper>
                );
                setShowModal(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
