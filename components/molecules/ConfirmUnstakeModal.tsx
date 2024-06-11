import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useModalStore from "../../hooks/useModalStore";
import { useUnstake } from "../../hooks/useUnstake";
import { ForceUnstakeSuccessModal } from "./ForceUnstakeSuccessModal";
import { MobileModalWrapper } from "../layouts/MobileModalWrapper";
import { useDevice } from "../../context/device";
import { UnstakeSuccessModal } from "./UnstakeSuccessModal";
import { useEffect } from "react";
import useToastStore, { ToastSeverity } from "../../hooks/useToastStore";

type ConfirmUnstakeModalProps = {
  nominator: string;
  nominee: string;
  isNormalUnstake: boolean;
  currentRewards: number;
  currentStake: number;
};

export const ConfirmUnstakeModal = ({
  nominator,
  nominee,
  isNormalUnstake,
  currentRewards,
  currentStake,
}: ConfirmUnstakeModalProps) => {
  const { setShowModal, setContent, resetModal } = useModalStore(
    (state: any) => ({
      setShowModal: state.setShowModal,
      setContent: state.setContent,
      resetModal: state.resetModal,
    })
  );
  const { isMobile } = useDevice();
  const { handleRemoveStake, isLoading } = useUnstake({
    nominator,
    nominee,
    force: isNormalUnstake,
  });

  const { setCurrentToast } = useToastStore((state: any) => ({
    setCurrentToast: state.setCurrentToast,
  }));

  useEffect(() => {
    if (isLoading) {
      setCurrentToast({
        severity: ToastSeverity.LOADING,
        title: "Processing  Unstake",
        description: "Your unstake transaction is in process.",
      });
    }
  }, [isLoading]);

  return (
    <div className="bg-white text-subtleFg flex flex-col p-4 max-w-lg w-full gap-y-3 rounded">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-subtleFg text-lg">
          Confirm Unstake
        </span>
        <XMarkIcon
          className="h-3 w-3 cursor-pointer"
          onClick={() => {
            resetModal();
          }}
        />
      </div>
      {isNormalUnstake && (
        <span className="break-words bodyFg text-sm leading-5 max-w-md">
          Please confirm your decision to unstake. Here&apos;s the breakdown of
          the total amount:
        </span>
      )}
      {!isNormalUnstake && (
        <span className="break-words bodyFg text-sm leading-5 max-w-md">
          Please confirm your decision to force remove stake. Here&apos;s the
          breakdown of the total amount:
        </span>
      )}
      <hr className="my-2" />
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span className="bodyFg text-sm">Total unstake amount</span>
          <span className="text-sm font-semibold">
            {(currentRewards + currentStake).toFixed(2)} SHM
          </span>
        </div>
        <div className="flex justify-end w-full">
          <span className="bodyFg text-sm">
            ({currentRewards.toFixed(2)} Rewards + {currentStake.toFixed(2)}{" "}
            Stake)
          </span>
        </div>
      </div>
      <hr className="my-1" />
      {!isNormalUnstake && (
        <>
          <div className="flex text-dangerFg gap-x-3">
            <div className="flex flex-col justify-start mt-1">
              <ExclamationTriangleIcon className="h-5 w-5" />
            </div>
            <span className="break-words text-sm leading-5 max-w-md basis-0 grow">
              It is not recommended to force remove stake while validating. You
              might lose{" "}
              <span className="font-semibold">
                {currentRewards.toFixed(0)} SHM
              </span>{" "}
              earned in the current cycle.
            </span>
          </div>
          <hr className="my-1" />
        </>
      )}
      <div className="flex justify-end gap-x-2 mt-2">
        {isLoading && (
          <button
            className="text-sm px-3 py-2 border border-bodyFg rounded max-w-[12rem] w-full flex items-center justify-center font-medium"
            disabled={true}
          >
            <div className="spinner flex items-center justify-center mr-3">
              <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
            </div>{" "}
            Confirming
          </button>
        )}
        {!isLoading && (
          <>
            <button
              className="text-primary text-sm px-3 py-2 border border-bodyFg rounded max-w-[12rem] w-full"
              onClick={() => {
                resetModal();
              }}
            >
              Don&apos;t Unstake
            </button>
            <button
              className={
                "text-sm px-3 py-2 border border-bodyFg rounded max-w-[12rem] w-full " +
                (isNormalUnstake
                  ? "text-primary"
                  : "text-dangerFg font-semibold")
              }
              onClick={async () => {
                const wasUnstakeSuccessful = await handleRemoveStake();
                resetModal();
                if (wasUnstakeSuccessful) {
                  if (!isNormalUnstake) {
                    setTimeout(() => {
                      setContent(
                        <MobileModalWrapper
                          closeButtonRequired={false}
                          contentOnTop={false}
                          wrapperClassName="fixed bottom-0 flex flex-col items-center justify-start p-3 rounded-t-2xl min-h-2/3 overflow-scroll bg-white w-screen dropdown-300 text-black"
                        >
                          <ForceUnstakeSuccessModal
                            stake={currentStake}
                            rewards={currentRewards}
                          />
                        </MobileModalWrapper>
                      );
                      setShowModal(true);
                    }, 1000);
                  } else if (isMobile) {
                    setTimeout(() => {
                      setContent(
                        <MobileModalWrapper
                          closeButtonRequired={false}
                          contentOnTop={false}
                        >
                          <UnstakeSuccessModal
                            stake={currentStake}
                            rewards={currentRewards}
                          />
                        </MobileModalWrapper>
                      );
                      setShowModal(true);
                    }, 1000);
                  }
                }
              }}
            >
              {isNormalUnstake ? "Confirm Unstake" : "Force Remove Stake"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
