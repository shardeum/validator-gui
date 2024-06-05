import useModalStore from "../../hooks/useModalStore";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import { Card } from "../layouts/Card";
import { ConfirmForceStopModal } from "./ConfirmForceStopModal";

type ForceStopNodeProps = {
  isEnabled: boolean;
  needsConfirmation: boolean;
};

export const ForceStopNode = ({
  isEnabled,
  needsConfirmation,
}: ForceStopNodeProps) => {
  const { stopNode, isLoading } = useNodeStatus();

  const { setShowModal, setContent, resetModal } = useModalStore(
    (state: any) => ({
      setShowModal: state.setShowModal,
      setContent: state.setContent,
      resetModal: state.resetModal,
    })
  );

  return (
    <div className="flex flex-col">
      <Card>
        <div className="p-5 flex flex-col gap-y-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-y-2">
              <span className="font-semibold">Force Stop Node</span>
              <span className="bodyFg text-sm">
                This action will try to forcefully stop your node out of
                validation queue.
              </span>
            </div>
            {!isLoading && (
              <button
                className={
                  "h-10 border-gray-400 border text-sm px-3 rounded font-semibold text-dangerFg " +
                  (isEnabled ? "" : "text-gray-400")
                }
                disabled={!isEnabled}
                onClick={() => {
                  if (!needsConfirmation) {
                    stopNode();
                  } else {
                    resetModal();
                    setContent(<ConfirmForceStopModal />);
                    setShowModal(true);
                  }
                }}
              >
                Force Stop Node
              </button>
            )}
            {isLoading && (
              <button
                className="h-10 text-sm px-3 border border-bodyFg rounded flex items-center justify-center font-medium"
                disabled={true}
              >
                <div className="spinner flex items-center justify-center mr-3">
                  <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
                </div>{" "}
                Stopping node
              </button>
            )}
          </div>
        </div>
      </Card>
      <div className="flex mt-1 ml-1">
        <span className="text-xs font-semibold text-dangerFg">
          Warning: &nbsp;
        </span>
        <span className="text-xs font-light bodyBg">
          Force stopping a node while it&apos;s validating will slash your
          rewards.
        </span>
      </div>
    </div>
  );
};
