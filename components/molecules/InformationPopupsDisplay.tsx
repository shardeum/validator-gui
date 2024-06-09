import { useEffect, useState } from "react";
import { useNodeVersion } from "../../hooks/useNodeVersion";
import Link from "next/link";
import { onboardingCompletedKey } from "../../pages/onboarding";
import { XMarkIcon } from "@heroicons/react/24/outline";
import greyLogo from "../../assets/grey-logo.svg";
import { useRouter } from "next/router";

const newGuiVersionAvailableKey = "newGuiVersionAvailable";
const newValidatorVersionAvailableKey = "newValidatorVersionAvailable";

const VERSION_UPDATE_REPOSTORY_URL =
  process.env.VERSION_UPDATE_REPOSTORY_URL ??
  "https://github.com/shardeum/validator-dashboard";

export const InformationPopupsDisplay = () => {
  const router = useRouter();
  const { version } = useNodeVersion();
  const [showGuiUpdatePrompt, setShowGuiUpdatePrompt] = useState(false);
  const [showValidatorUpdatePrompt, setShowValidatorUpdatePrompt] =
    useState(false);
  const [showGuiUpdated, setShowGuiUpdated] = useState(false);
  const [showValidatorUpdated, setShowValidatorUpdated] = useState(false);

  const isOnboardingCompleted =
    localStorage.getItem(onboardingCompletedKey) === "true";

  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(
    !isOnboardingCompleted
  );

  useEffect(() => {
    const newGuiAvailable = true;
    // (version?.runningGuiVersion || 0) < (version?.latestGuiVersion || 0);
    const newValidatorAvailable =
      (version?.runnningValidatorVersion || 0) <
      (version?.activeShardeumVersion || 0);

    if (newGuiAvailable) {
      const wasNewGuiVersionAvailable =
        localStorage.getItem(newGuiVersionAvailableKey) === "true";
      if (!wasNewGuiVersionAvailable) {
        // user viewing this for the first time
        setShowGuiUpdatePrompt(true);
        localStorage.setItem(newGuiVersionAvailableKey, "true");
        //TODO: if it's not in pending notifications, add it to pending notifications
      }
    } else {
      const wasNewGuiVersionAvailable =
        localStorage.getItem(newGuiVersionAvailableKey) === "true";
      if (wasNewGuiVersionAvailable) {
        localStorage.removeItem(newGuiVersionAvailableKey);
        setShowGuiUpdated(true);
      }
    }

    if (newValidatorAvailable) {
      const wasNewValidatorVersionAvailable =
        localStorage.getItem(newValidatorVersionAvailableKey) === "true";
      if (!wasNewValidatorVersionAvailable) {
        // user viewing this for the first time
        setShowValidatorUpdatePrompt(true);
        localStorage.setItem(newValidatorVersionAvailableKey, "true");
        //TODO: if it's not in pending notifications, add it to pending notifications
      }
    } else {
      const wasNewValidatorVersionAvailable =
        localStorage.getItem(newValidatorVersionAvailableKey) === "true";
      if (wasNewValidatorVersionAvailable) {
        localStorage.removeItem(newValidatorVersionAvailableKey);
        setShowValidatorUpdated(true);
      }
    }
  }, [version]);

  return (
    <div className="flex flex-col gap-y-3">
      {showOnboardingPrompt && (
        <div className="w-full h-full border shadow rounded p-4 bg-white max-md:hidden">
          <div className="flex">
            <div className="flex flex-col grow gap-x-3">
              <span className="text-sm font-semibold">
                Finish setting up your node
              </span>
              <span className="text-xs bodyFg font-light">
                Follow this step by step guide to setup your validator node.
              </span>
              <div className="flex justify-start mt-3">
                <button
                  className="text-primary border rounded px-3 py-1 bg-white text-sm"
                  onClick={() => {
                    router.push("/onboarding");
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center max-w-[7rem] w-full mx-3">
              <div
                className="fill-bg h-full w-full"
                style={{
                  backgroundImage: `url(${greyLogo.src})`,
                }}
              ></div>
            </div>
            <div className="flex flex-col justify-start">
              <XMarkIcon
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setShowOnboardingPrompt(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {!showOnboardingPrompt && (
        <span className="text-4xl font-semibold">Welcome Back!</span>
      )}
      {showValidatorUpdatePrompt && (
        <div className="w-full h-full shadow border border-attentionBorder bg-attentionBg rounded p-4">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="font-semibold text-xs">
                New validator version available
              </span>
              <span className="bodyFg font-light text-xs">
                A new validator version (V {version?.activeShardeumVersion}) is
                available and ready to update.
              </span>
            </div>
            <div className="flex justify-end gap-x-3 w-full mt-2">
              <button
                className="text-xs px-3 py-2"
                onClick={() => {
                  setShowValidatorUpdatePrompt(false);
                }}
              >
                Dismiss
              </button>
              <Link
                href={VERSION_UPDATE_REPOSTORY_URL}
                onClick={() => {
                  setShowValidatorUpdatePrompt(false);
                }}
                target="_blank"
                className="flex justify-center items-center bg-white border border-gray-300 rounded text-xs font-semibold w-24 py-1"
              >
                Update
              </Link>
            </div>
          </div>
        </div>
      )}
      {showGuiUpdatePrompt && (
        <div className="w-full h-full shadow border border-attentionBorder bg-attentionBg rounded p-4">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="font-semibold text-xs">
                New GUI version available
              </span>
              <span className="bodyFg font-light text-xs">
                A new GUI version (V {version?.latestGuiVersion}) is available
                and ready to update.
              </span>
            </div>
            <div className="flex justify-end gap-x-3 w-full mt-2">
              <button
                className="text-xs px-3 py-2"
                onClick={() => {
                  setShowGuiUpdatePrompt(false);
                }}
              >
                Dismiss
              </button>
              <Link
                href={VERSION_UPDATE_REPOSTORY_URL}
                onClick={() => {
                  setShowGuiUpdatePrompt(false);
                }}
                target="_blank"
                className="flex justify-center items-center bg-white border border-gray-300 rounded text-xs font-semibold w-24 py-1"
              >
                Update
              </Link>
            </div>
          </div>
        </div>
      )}
      {showValidatorUpdated && (
        <div className="w-full h-full shadow border border-successBorder bg-successBg rounded p-4">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="font-semibold text-xs">
                Validator version has been updated
              </span>
              <span className="bodyFg font-light text-xs">
                Your validator has been updated to Version{" "}
                {version?.runnningValidatorVersion} and is ready to be used.
              </span>
            </div>
            <div className="flex justify-end gap-x-3 w-full">
              <button
                className="text-xs px-3 py-2"
                onClick={() => {
                  setShowValidatorUpdated(false);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      {showGuiUpdated && (
        <div className="w-full h-full shadow border border-successBorder bg-successBg rounded p-4">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="font-semibold text-xs">
                GUI version has been updated
              </span>
              <span className="bodyFg font-light text-xs">
                Your validator has been updated to Version{" "}
                {version?.runningGuiVersion} and is ready to be used.
              </span>
            </div>
            <div className="flex justify-end gap-x-3 w-full">
              <button
                className="text-xs px-3 py-2"
                onClick={() => {
                  setShowGuiUpdated(false);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
