import { XMarkIcon } from "@heroicons/react/24/outline";
import useStatusUpdateStore from "../../hooks/useStatusUpdateStore";

const getStatusUpdateText = (status: string) => {
  let statusUpdateText = "";
  switch (status) {
    case "active":
      statusUpdateText =
        "Hey there! While you were away, you were moved into the validating queue.";
      break;
    case "stopped":
      statusUpdateText =
        "Your node stopped unexpectedly while you were away. Please start the node to start earning rewards.";
      break;
    case "need-stake":
      statusUpdateText =
        "Your node is on standby as you do not have any staked SHM. Please stake a minimum of 10 SHM to start validating.";
      break;
    case "waiting-for-network":
      statusUpdateText =
        "Your node is trying to connect to the Shardeum network. If this status persists please reach out to us.";
      break;
    default:
      break;
  }
  return statusUpdateText;
};

const getBgColor = (state: string) => {
  return state === "active"
    ? "successBg"
    : state === "stopped"
    ? "dangerBg"
    : state === "waiting-for-network"
    ? "attentionBg"
    : state === "need-stake"
    ? "severeBg"
    : "subtleBg";
};

const getBorderColor = (state: string) => {
  return state === "active"
    ? "successBorder"
    : state === "stopped"
    ? "dangerBorder"
    : state === "waiting-for-network"
    ? "attentionBorder"
    : state === "need-stake"
    ? "severeBorder"
    : "subtleBorder";
};

export const NodeStatusUpdate = () => {
  const { currentStatus, reset } = useStatusUpdateStore((state: any) => ({
    currentStatus: state.currentStatus,
    reset: state.reset,
  }));

  return (
    <div>
      <div className="hidden">
        <span className="bg-successBg text-xl border-successBorder text-successFg">
          1
        </span>
        <span className="bg-severeBg text-xl border-severeBorder text-severeFg">
          2
        </span>
        <span className="bg-attentionBg text-xl border-attentionBorder text-attentionFg">
          3
        </span>
        <span className="bg-subtleBg text-xl border-subtleBorder text-subtleFg">
          4
        </span>
        <span className="bg-dangerBg text-xl border-dangerBorder text-dangerFg">
          5
        </span>
      </div>
      {currentStatus && (
        <div
          className={`absolute top-0 left-10 flex gap-x-2 items-center px-4 py-2 rounded bg-${getBgColor(
            currentStatus
          )} border border-${getBorderColor(currentStatus)} border-t-0`}
        >
          <span className="bodyFg font-light text-xs ">
            {getStatusUpdateText(currentStatus)}
          </span>
          <div>
            <XMarkIcon className="h-3 w-3 cursor-pointer" onClick={reset} />
          </div>
        </div>
      )}
    </div>
  );
};
