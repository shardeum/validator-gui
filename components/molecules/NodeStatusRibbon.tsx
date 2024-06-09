import { useEffect } from "react";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import { NodeStatus as NodeStatusModel } from "../../model/node-status";
import useNotificationsStore from "../../hooks/useNotificationsStore";
import useToastStore, { ToastSeverity } from "../../hooks/useToastStore";
import { ExpansionArrow } from "../atoms/ExpansionArrow";
import useModalStore from "../../hooks/useModalStore";
import { OverviewSidebar } from "../organisms/OverviewSidebar";
import { MobileModalWrapper } from "../layouts/MobileModalWrapper";

export enum NodeState {
  ACTIVE = "ACTIVE",
  STANDBY = "STANDBY",
  STOPPED = "STOPPED",
  SYNCING = "SYNCING",
  NEED_STAKE = "NEED_STAKE",
  WAITING_FOR_NETWORK = "WAITING_FOR_NETWORK",
}

type DailyNodeStatus = {
  day: string;
  activeDuration: number; // in %of total time
  standbyDuration: number; // in %of total time -> includes time spent syncing
  stoppedDuration: number; // in %of total time
};

type NodeStatusRibbonProps = {
  isWalletConnected: boolean;
};

const previousNodeStateKey = "previousNodeState";

export const getNodeState = (
  nodeStatus: NodeStatusModel | undefined
): NodeState => {
  let nodeState: NodeState = NodeState.STOPPED;
  switch (nodeStatus?.state) {
    case "active":
      nodeState = NodeState.ACTIVE;
      break;
    case "standby":
      nodeState = NodeState.STANDBY;
      break;
    case "stopped":
      nodeState = NodeState.STOPPED;
      break;
    case "syncing":
      nodeState = NodeState.SYNCING;
      break;
    case "need-stake":
      nodeState = NodeState.NEED_STAKE;
      break;
    case "waiting-for-network":
      nodeState = NodeState.WAITING_FOR_NETWORK;
      break;
  }
  return nodeState;
};

const getTitle = (state: NodeState, isWalletConnected: boolean) => {
  if (!isWalletConnected) {
    return "Connect Wallet";
  }
  let title = "";
  switch (state) {
    case NodeState.ACTIVE:
      title = "Validating";
      break;
    case NodeState.STANDBY:
      title = "On Standby";
      break;
    case NodeState.STOPPED:
      title = "Stopped";
      break;
    case NodeState.SYNCING:
      title = "On Standby";
      break;
    case NodeState.NEED_STAKE:
      title = "No SHM Staked";
      break;
    case NodeState.WAITING_FOR_NETWORK:
      title = "Waiting for network";
      break;
    default:
      title = "";
  }
  return title;
};

const getTitleBgColor = (state: NodeState, isWalletConnected: boolean) => {
  if (!isWalletConnected) {
    return "subtleBg";
  }
  return state === NodeState.ACTIVE
    ? "successBg"
    : state === NodeState.STOPPED
    ? "dangerBg"
    : state === NodeState.NEED_STAKE
    ? "severeBg"
    : state === NodeState.WAITING_FOR_NETWORK
    ? "attentionBg"
    : "subtleBg";
};

const getTitleTextColor = (state: NodeState, isWalletConnected: boolean) => {
  if (!isWalletConnected) {
    return "subtleFg";
  }
  return state === NodeState.ACTIVE
    ? "successFg"
    : state === NodeState.STOPPED
    ? "dangerFg"
    : state === NodeState.NEED_STAKE
    ? "severeFg"
    : state === NodeState.WAITING_FOR_NETWORK
    ? "attentionFg"
    : "subtleFg";
};

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

export const getTimeTags = (dateStr: string) => {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(dateStr);
  let dateTag = `${weekday[date.getDay()]}, ${date.getDate()} ${
    month[date.getMonth()]
  } ${date.getFullYear()}`;
  let hour = date.getHours();
  let meridian = "AM";
  if (hour > 12) {
    hour -= 12;
    meridian = "PM";
  }
  let timeTag = `${date.getHours()}:${date.getMinutes()} ${meridian}`;
  if (!dateStr) {
    dateTag = "";
    timeTag = "";
  }
  return [dateTag, timeTag];
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

  useEffect(() => {
    const previousNodeState = localStorage.getItem(previousNodeStateKey);
    const currentNodeState = nodeStatus?.state || previousNodeState;
    if (previousNodeState !== currentNodeState) {
      switch (nodeStatus?.state) {
        case "active":
          // addNotification({
          //   type: NotificationType.NODE_STATUS,
          //   severity: NotificationSeverity.SUCCESS,
          //   title: "Your node status had been updated to: Validating",
          // });
          setCurrentToast({
            severity: ToastSeverity.SUCCESS,
            title: "Node Started Successfully",
          });
          break;
        case "standby":
        case "need-stake":
          // addNotification({
          //   type: NotificationType.NODE_STATUS,
          //   severity: NotificationSeverity.ATTENTION,
          //   title: "Your node status had been updated to: Standby",
          // });
          break;
        case "stopped":
          // addNotification({
          //   type: NotificationType.NODE_STATUS,
          //   severity: NotificationSeverity.DANGER,
          //   title: "Your node status had been updated to: Stopped",
          // });
          setCurrentToast({
            severity: ToastSeverity.SUCCESS,
            title: "Node Stopped Successfully",
          });
          break;
        default:
          break;
      }
      localStorage.setItem(previousNodeStateKey, currentNodeState || "");
    } else {
      resetToast();
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
