import { XMarkIcon } from "@heroicons/react/24/outline";
import { ToastInstance, ToastSeverity } from "../../hooks/useToastStore";
import { ToastIcon } from "./ToastIcon";

type ToastBoxProps = {
  toast: ToastInstance;
  onClose?: () => void;
  viewLogsOnClick: () => void;
  supportOnClick: () => void;
};

export const ToastBox = ({
  toast,
  onClose,
  viewLogsOnClick,
  supportOnClick,
}: ToastBoxProps) => {
  return (
    <div
      className={`border rounded flex p-4 dropdown-300 bg-white text-black min-w-[20rem] ${
        toast.severity === ToastSeverity.SUCCESS
          ? "border-b-successFg"
          : "border-b-dangerFg"
      }`}
    >
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
  );
};
