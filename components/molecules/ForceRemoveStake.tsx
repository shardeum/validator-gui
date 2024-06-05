import useModalStore from "../../hooks/useModalStore";
import { Card } from "../layouts/Card";
import { ConfirmUnstakeModal } from "./ConfirmUnstakeModal";

type ForceRemoveStakeProps = {
  nominator: string;
  nominee: string;
  isEnabled: boolean;
  currentRewards: number;
  currentStake: number;
};

export const ForceRemoveStake = ({
  nominator,
  nominee,
  currentRewards,
  currentStake,
  isEnabled,
}: ForceRemoveStakeProps) => {
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
              <span className="font-semibold">Force Remove Stake</span>
              <span className="bodyFg text-sm">
                This action will try to forcefully remove your stake.
              </span>
            </div>
            <button
              className={
                "h-10 border-gray-400 border text-sm px-3 rounded font-semibold " +
                (isEnabled ? "text-dangerFg" : "text-gray-400")
              }
              disabled={!isEnabled}
              onClick={() => {
                resetModal();
                setContent(
                  <ConfirmUnstakeModal
                    nominator={nominator}
                    nominee={nominee}
                    isNormalUnstake={false}
                    currentRewards={currentRewards}
                    currentStake={currentStake}
                  ></ConfirmUnstakeModal>
                );
                setShowModal(true);
              }}
            >
              Force Remove Stake
            </button>
          </div>
        </div>
      </Card>
      <div className="flex mt-1 ml-1">
        <span className="text-xs font-semibold text-dangerFg">
          Warning: &nbsp;
        </span>
        <span className="text-xs font-light bodyBg">
          This action is not recommended and only to be used in case of absolute
          emergency.
        </span>
      </div>
    </div>
  );
};
