import useToastStore from "../../hooks/useToastStore";
import { ToastBox } from "../atoms/ToastBox";

export const ToastWindow = () => {
  const { currentToast, resetToast } = useToastStore((state: any) => ({
    currentToast: state.currentToast,
    resetToast: state.resetToast,
  }));

  return (
    <div className="absolute top-8 right-0 z-35">
      {currentToast && (
        <ToastBox
          toast={currentToast}
          onClose={() => {
            resetToast();
          }}
        />
      )}
    </div>
  );
};
