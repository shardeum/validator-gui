import useToastStore from "../../hooks/useToastStore";
import { ToastBox } from "../atoms/ToastBox";

type ToastWindowProps = {
  viewLogsOnClick: () => void;
  supportOnClick: () => void;
};

export const ToastWindow = ({
  viewLogsOnClick,
  supportOnClick,
}: ToastWindowProps) => {
  const { currentToast, resetToast } = useToastStore((state: any) => ({
    currentToast: state.currentToast,
    resetToast: state.resetToast,
  }));

  return (
    <div className="absolute top-19 max-md:w-full md:top-8 right-0 z-35">
      {currentToast && (
        <ToastBox
          toast={currentToast}
          onClose={() => {
            resetToast();
          }}
          viewLogsOnClick={viewLogsOnClick}
          supportOnClick={supportOnClick}
        />
      )}
    </div>
  );
};
