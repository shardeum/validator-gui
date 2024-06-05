import {
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
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

type NodeStatusProps = {
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

export const NodeStatus = ({ isWalletConnected }: NodeStatusProps) => {
  const { nodeStatus, isLoading } = useNodeStatus();
  const state: NodeState = getNodeState(nodeStatus);
  const title = getTitle(state, isWalletConnected);

  const titleBgColor = getTitleBgColor(state, isWalletConnected);
  const titleTextColor = getTitleTextColor(state, isWalletConnected);

  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const { startNode, stopNode } = useNodeStatus();

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
    <Card>
      <div>
        {/* this hidden dom tree is here just to initialise the tw colors dynamically */}
        <div className="hidden">
          <span className="bg-successBg text-xl text-successFg">1</span>
          <span className="bg-severeBg text-xl text-severeFg">2</span>
          <span className="bg-attentionBg text-xl text-attentionFg">3</span>
          <span className="bg-subtleBg text-xl text-subtleFg">4</span>
          <span className="bg-dangerBg text-xl text-dangerFg">5</span>
        </div>
        <div className="flex flex-col text-subtleFg">
          <div
            className={`flex items-center gap-x-2 p-3 font-medium text-lg bg-${titleBgColor}`}
          >
            <span className={`text-${titleTextColor}`}>{title}</span>
            <InformationCircleIcon className="h-4 w-4 stroke-2 cursor-pointer" />
          </div>
          <div className="flex flex-col p-3 gap-y-2">
            <div className="flex justify-between">
              <span className="font-light text-xs">Previously active</span>
              <div className="flex flex-col">
                <span className="text-xs">{lastActiveDateTag}</span>
                <span className="text-xs flex justify-end">
                  {lastActiveTimeTag}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-x-1">
                <span className="font-light text-xs">Rotation index</span>
                <InformationCircleIcon className="h-3 w-3" />
              </div>
              <span className="text-xs font-medium">
                {nodeStatus?.lastRotationIndex || "NA"}
              </span>
            </div>
            <span>IS LOADING: {isLoading ? "TRUE" : "FALSE"}</span>
            <hr className="my-1" />
            <div className="flex flex-col gap-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">More Info</span>
                {!showMoreInfo && (
                  <ChevronDownIcon
                    className="h-3 w-3 cursor-pointer ease-out duration-200"
                    onClick={toggleShowMoreInfo}
                  />
                )}
                {showMoreInfo && (
                  <ChevronUpIcon
                    className="h-3 w-3 cursor-pointer ease-out duration-200"
                    onClick={toggleShowMoreInfo}
                  />
                )}
              </div>
              {showMoreInfo && (
                <div className="flex flex-col gap-y-2 text-subtleFg dropdown-300">
                  <div className="flex justify-between">
                    <span className="font-light text-xs">
                      Total validating time
                    </span>
                    <span className="text-xs font-medium">N/A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-light text-xs">
                      Total time this week
                    </span>
                    <span className="text-xs font-medium">02h 05m 01s</span>
                  </div>
                  {getNodeStatusHistoryChart(nodeStatusHistories)}
                </div>
              )}
              <div className="flex justify-end">
                {!isNodeStopped && !isLoading && (
                  <button
                    disabled={
                      nodeStatus?.state !== "standby" &&
                      nodeStatus?.state !== "need-stake"
                    }
                    className={
                      "border-bodyFg border text-sm px-3 py-2 rounded font-semibold " +
                      (state === NodeState.ACTIVE
                        ? "text-gray-400"
                        : "text-dangerFg")
                    }
                    onClick={() => {
                      stopNode();
                    }}
                  >
                    Stop Node
                  </button>
                )}
                {isNodeStopped && !isLoading && (
                  <button
                    className="text-white bg-primary text-sm px-3 py-2 rounded"
                    onClick={() => {
                      startNode();
                    }}
                  >
                    Start Node
                  </button>
                )}
                {isLoading && (
                  <button
                    className="mt-2 border border-gray-300 rounded px-3 py-2 flex items-center justify-center text-sm font-medium"
                    disabled={true}
                  >
                    <div className="spinner flex items-center justify-center mr-3">
                      <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
                    </div>{" "}
                    Confirming
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
