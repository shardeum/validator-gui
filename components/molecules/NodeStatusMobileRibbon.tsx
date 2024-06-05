import {
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Card } from "../layouts/Card";
import { useEffect, useState } from "react";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import { NodeStatus as NodeStatusModel } from "../../model/node-status";
import useNotificationsStore, {
  NotificationSeverity,
  NotificationType,
} from "../../hooks/useNotificationsStore";
import useToastStore from "../../hooks/useToastStore";
import { ExpansionArrow } from "../atoms/ExpansionArrow";
import useModalStore from "../../hooks/useModalStore";
import { OverviewSidebar } from "../organisms/OverviewSidebar";

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

type NodeStatusMobileRibbonProps = {
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

const getNodeStatusHistoryChart = (nodeStatusHistories: DailyNodeStatus[]) => {
  return (
    <div className="flex bg-subtleBg p-2 h-full">
      <div className="w-full h-20 flex justify-around gap-x-5">
        {nodeStatusHistories.map((nodeStatusHistory) => {
          return (
            <div
              className="flex flex-col gap-y-2 items-center"
              key={nodeStatusHistory.day}
            >
              <div className="h-20 w-2 flex flex-col-reverse gap-y-0.5">
                <div
                  className="bg-successFg tooltip dropdown-400"
                  data-tip={`${nodeStatusHistory.activeDuration}%`}
                  style={{
                    height: `${nodeStatusHistory.activeDuration}%`,
                  }}
                ></div>
                <div
                  className="bg-attentionBorder tooltip dropdown-500"
                  data-tip={`${nodeStatusHistory.standbyDuration}%`}
                  style={{
                    height: `${nodeStatusHistory.standbyDuration}%`,
                  }}
                ></div>
                <div
                  className="bg-severeFg tooltip dropdown-600"
                  data-tip={`${nodeStatusHistory.stoppedDuration}%`}
                  style={{
                    height: `${nodeStatusHistory.stoppedDuration}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs font-medium">
                {nodeStatusHistory.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
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

export const NodeStatusMobileRibbon = ({
  isWalletConnected,
}: NodeStatusMobileRibbonProps) => {
  const { nodeStatus, startNode, stopNode, isLoading } = useNodeStatus();
  const state: NodeState = getNodeState(nodeStatus);
  const title = getTitle(state, isWalletConnected);

  const titleBgColor = getTitleBgColor(state, isWalletConnected);
  const titleTextColor = getTitleTextColor(state, isWalletConnected);
  const borderColor = getBorderColor(state, isWalletConnected);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const { showModal, setShowModal, resetModal, content, setContent } =
    useModalStore((state: any) => ({
      showModal: state.showModal,
      setShowModal: state.setShowModal,
      resetModal: state.resetModal,
      content: state.content,
      setContent: state.setContent,
    }));

  const { addNotification } = useNotificationsStore((state: any) => ({
    addNotification: state.addNotification,
  }));
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
          addNotification({
            type: NotificationType.NODE_STATUS,
            severity: NotificationSeverity.SUCCESS,
            title: "Your node status had been updated to: Validating",
          });
          setCurrentToast({
            type: NotificationType.NODE_STATUS,
            severity: NotificationSeverity.SUCCESS,
            title: "Node Started Successfully",
          });
          break;
        case "standby":
        case "need-stake":
          addNotification({
            type: NotificationType.NODE_STATUS,
            severity: NotificationSeverity.ATTENTION,
            title: "Your node status had been updated to: Standby",
          });
          break;
        case "stopped":
          addNotification({
            type: NotificationType.NODE_STATUS,
            severity: NotificationSeverity.DANGER,
            title: "Your node status had been updated to: Stopped",
          });
          setCurrentToast({
            type: NotificationType.NODE_STATUS,
            severity: NotificationSeverity.SUCCESS,
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

  const toggleShowMoreInfo = () => {
    setShowMoreInfo((prevState: boolean) => !prevState);
  };

  const nodeStatusHistories: DailyNodeStatus[] = [
    {
      day: "Sun",
      activeDuration: 10,
      standbyDuration: 30,
      stoppedDuration: 25,
    },
    {
      day: "Mon",
      activeDuration: 20,
      standbyDuration: 0,
      stoppedDuration: 0,
    },
    {
      day: "Tue",
      activeDuration: 0,
      standbyDuration: 0,
      stoppedDuration: 0,
    },
    {
      day: "Wed",
      activeDuration: 25,
      standbyDuration: 0,
      stoppedDuration: 70,
    },
    {
      day: "Thu",
      activeDuration: 10,
      standbyDuration: 40,
      stoppedDuration: 30,
    },
    {
      day: "Fri",
      activeDuration: 15,
      standbyDuration: 50,
      stoppedDuration: 35,
    },
    {
      day: "Sat",
      activeDuration: 10,
      standbyDuration: 30,
      stoppedDuration: 20,
    },
  ];
  const isNodeStopped = state === NodeState.STOPPED;

  const [lastActiveDateTag, lastActiveTimeTag] = getTimeTags(
    nodeStatus?.lastActive || ""
  );

  return (
    <div className="mt-14">
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
                  <div className="flex flex-col items-center justify-between h-full">
                    <div className="fixed top-0 flex flex-col py-5 px-7 rounded-b-2xl h-4/5 overflow-scroll bg-white w-screen dropdown-300 text-black">
                      <OverviewSidebar />
                    </div>
                    <button
                      className="flex items-center px-3 py-1 gap-x-2 bg-gray-800 text-gray-300 rounded-full fixed bottom-4"
                      onClick={() => {
                        resetModal();
                      }}
                    >
                      <span>Close</span>
                      <XMarkIcon className="text-gray-300 h-5 w-5" />
                    </button>
                  </div>
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
