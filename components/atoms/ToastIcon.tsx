import { NodesIcon } from "./NodesIcon";
import { ErrorIcon } from "./ErrorIcon";
import { ToastSeverity } from "../../hooks/useToastStore";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type ToastIconProps = {
  severity: ToastSeverity;
};

export const ToastIcon = ({ severity }: ToastIconProps) => {
  const iconClassName = "h-5 w-5";
  const fillColor = `${
    severity === ToastSeverity.SUCCESS
      ? "rgb(28, 118, 69)"
      : severity === ToastSeverity.ATTENTION
      ? "rgb(178, 161, 0)"
      : "rgb(199, 0, 0)"
  }`;

  return (
    <>
      {severity === ToastSeverity.SUCCESS ? (
        <CheckCircleIcon className={iconClassName + " text-green-700"} />
      ) : severity === ToastSeverity.ATTENTION ? (
        <NodesIcon className={iconClassName} fillColor={fillColor} />
      ) : (
        <ErrorIcon className={iconClassName} fillColor={fillColor} />
      )}
    </>
  );
};
