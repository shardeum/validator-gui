import { createContext, ReactNode, useState } from 'react';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export const ToastContext = createContext<{
  open: boolean,
  setOpen: (open: boolean) => void,
  message: string,
  setMessage: (message: string) => void,
  severity: ToastSeverity,
  setSeverity: (severity: ToastSeverity) => void,
  showTemporarySuccessMessage: (message: string) => void,
  showTemporaryErrorMessage: (message: string) => void,
  showErrorMessage: (message: string) => void,
  showErrorDetails: (errorDetails: string) => void,
}>
({
  open: false,
  setOpen: () => false,
  message: "",
  setMessage: () => "",
  severity: "alert-success",
  setSeverity: () => "alert-success",
  showTemporarySuccessMessage: () => {
    return;
  },
  showTemporaryErrorMessage: () => {
    return;
  },
  showErrorMessage: () => {
    return;
  },
  showErrorDetails: () => {
    return;
  },
});

type ToastSeverity = "alert-success" | "alert-error" | "alert-warning" | "alert-info";


export default function ToastContextProvider({children}: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<ToastSeverity>("alert-success");
  const [detailedMessage, setDetailMessage] = useState<string | null>(null);

  function handleClose() {
    setOpen(false);
    setDetailMessage(null); // Clear the detailedMessage
  }

  function showTemporarySuccessMessage(message: string) {
    setSeverity('alert-success');
    setMessage(message);
    setOpen(true);
    setTimeout(() => setOpen(false), 6000);
  }

  // todo: right now we can only display one message at a time. if need arises to queue multiple messages, we can do that
  function showErrorMessage(message: string) {
    setSeverity('alert-error');
    setMessage(message);
    setOpen(true);
  }

  function showErrorDetails(errorDetails: string) {
    const detailedMessage = errorDetails;
    let displayMessage = errorDetails;

    // Check if the errorDetails contains a JSON object
    if (errorDetails.includes("[ethjs-rpc]")) {
      const regex = /{\s*"code":/;
      const match = regex.exec(errorDetails);

      if (match !== null) {
        console.log(match);
        const startIndex = match.index;
        let braceCount = 1;
        let endIndex = startIndex + match[0].length;

        // Iterate over the string to find where the JSON object ends
        for (let i = endIndex; i < errorDetails.length; i++) {
          // eslint-disable-next-line security/detect-object-injection
          if (errorDetails[i] === "{") {
            braceCount++;
            // eslint-disable-next-line security/detect-object-injection
          } else if (errorDetails[i] === "}") {
            braceCount--;
            if (braceCount === 0) {
              // Found the end of the JSON object
              endIndex = i;
              break;
            }
          }
        }

        const jsonStr = errorDetails.substring(startIndex, endIndex + 1);
        try {
          const jsonObj = JSON.parse(jsonStr);
          displayMessage =
            jsonObj.data && jsonObj.data.message ? jsonObj.data.message : null;
        } catch (e) {
          console.error("Error parsing JSON:", e);
          displayMessage =
            "Internal JSON-RPC error. Click the info button for more details.";
        }
      }
    }
    setSeverity("alert-error");
    setMessage(displayMessage);
    setDetailMessage(detailedMessage);
    setOpen(true);
  }

  function showTemporaryErrorMessage(message: string) {
    showErrorMessage(message);
    setTimeout(() => handleClose(), 6000);
  }

  return (
    <>
      {open && (
        <div className="toast toast-top toast-center">
          <div className={`alert ${severity} rounded-lg max-w-[45rem] flex`}>
            <span className="flex-grow max-w-[80vw] w-max wrap-anywhere" dangerouslySetInnerHTML={{__html: message}}/>
            {detailedMessage && message !== detailedMessage && (
              <button onClick={() => alert(detailedMessage)}>
                <InformationCircleIcon className="h-5 w-5 inline ml-2" />
              </button>
            )}
            <button onClick={handleClose}>
              <XMarkIcon className="h-5 w-5 inline ml-2" />
            </button>
          </div>
        </div>
      )}
      <ToastContext.Provider
        value={{
          open,
          setOpen,
          message,
          setMessage,
          severity,
          setSeverity,
          showTemporarySuccessMessage,
          showTemporaryErrorMessage,
          showErrorMessage,
          showErrorDetails,
        }}
      >
        {children}
      </ToastContext.Provider>
    </>
  );
}
