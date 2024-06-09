import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  DEFAULT_TOAST_DURATION,
  ToastInstance,
  ToastSeverity,
} from "../../hooks/useToastStore";
import { ToastIcon } from "./ToastIcon";
import { useEffect, useState } from "react";

type ToastBoxProps = {
  toast: ToastInstance;
  onClose?: () => void;
  viewLogsOnClick: () => void;
  supportOnClick: () => void;
};

const INTERVAL_DURATION = 10; // in ms

export const ToastBox = ({
  toast,
  onClose,
  viewLogsOnClick,
  supportOnClick,
}: ToastBoxProps) => {
  const [widthPercentage, setWidthPercentage] = useState(100.0);
  const totalDuration = toast?.duration || DEFAULT_TOAST_DURATION;

  useEffect(() => {
    const startTime = Date.now();
    const widthSetterInterval = setInterval(() => {
      const decreasePercentage =
        ((Date.now() - startTime) / totalDuration) * 100.0;
      setWidthPercentage(100.0 - decreasePercentage);
    }, INTERVAL_DURATION);

    setTimeout(() => {
      clearInterval(widthSetterInterval);
    }, toast?.duration || DEFAULT_TOAST_DURATION);
  }, []);

  return (
    <div className="border rounded shadow">
      <div className="flex p-4 dropdown-300 bg-white text-black min-w-[20rem]">
        <div className="flex justify-between w-full">
          <div className="flex gap-x-2">
            <div className="flex flex-col justify-start">
              <ToastIcon severity={toast.severity} />
            </div>
            <div className="flex flex-col justify-start">
              <span className="text-sm font-semibold">{toast.title}</span>
              {toast.description && (
                <span className="text-xs">{toast.description}</span>
              )}
              {toast.severity === ToastSeverity.DANGER && (
                <div className="flex gap-x-3">
                  <button
                    className="text-sm font-semibold"
                    onClick={viewLogsOnClick}
                  >
                    View Logs
                  </button>
                  <button
                    className="text-sm font-semibold"
                    onClick={supportOnClick}
                  >
                    Get Help
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end items-start">
            <XMarkIcon
              className="h-4 w-4 cursor-pointer"
              onClick={() => {
                if (onClose) {
                  onClose();
                }
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={`h-0.5 rounded ${
          toast.severity === ToastSeverity.SUCCESS
            ? "bg-successFg"
            : toast.severity === ToastSeverity.ATTENTION
            ? "bg-attentionFg"
            : "bg-dangerFg"
        }`}
        style={{
          width: `${widthPercentage}%`,
        }}
      ></div>
    </div>
  );
};
