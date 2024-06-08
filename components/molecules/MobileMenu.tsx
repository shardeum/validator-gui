import { ChevronRightIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import notebookIcon from "../../assets/notebook-icon.svg";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";

type MobileMenuProps = {
  logsOnClick: () => void;
  settingsOnClick: () => void;
};

export const MobileMenu = ({
  logsOnClick,
  settingsOnClick,
}: MobileMenuProps) => {
  return (
    <div className="flex flex-col mt-5">
      <span className="text-2xl font-semibold">Menu</span>
      <div className="flex flex-col gap-y-4 mt-8 text-lg">
        {/* logs */}
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={logsOnClick}
        >
          <div className="flex items-center gap-x-2">
            <button
              className="fill-bg h-6 w-6"
              style={{
                backgroundImage: `url(${notebookIcon.src})`,
              }}
            ></button>
            <span className="text-lg font-semibold">Logs</span>
          </div>
          <ChevronRightIcon className="h-4 w-4 stroke-2" />
        </div>
        {/* settings */}
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={settingsOnClick}
        >
          <div className="flex items-center gap-x-2">
            <Cog6ToothIcon className="h-6 w-6" onClick={settingsOnClick} />
            <span className="text-lg font-semibold">Settings</span>
          </div>
          <ChevronRightIcon className="h-4 w-4 stroke-2" />
        </div>
        {/* support */}
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={logsOnClick}
        >
          <div className="flex items-center gap-x-2">
            <QuestionMarkCircleIcon className="h-6 w-6" />
            <span className="text-lg font-semibold">Support</span>
          </div>
          <ChevronRightIcon className="h-4 w-4 stroke-2" />
        </div>
      </div>
    </div>
  );
};
