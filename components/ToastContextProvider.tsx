import { createContext, ReactNode, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const ToastContext = createContext<{
  open: boolean,
  setOpen: (open: boolean) => void,
  message: string,
  setMessage: (message: string) => void,
  severity: ToastSeverity,
  setSeverity: (severity: ToastSeverity) => void,
  showTemporarySuccessMessage: (message: string) => void,
  showTemporaryErrorMessage: (message: string) => void,
  showErrorMessage: (message: string) => void
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
  }
})

type ToastSeverity = "alert-success" | "alert-error" | "alert-warning" | "alert-info";


export default function ToastContextProvider({children}: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<ToastSeverity>("alert-success");

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

  function showTemporaryErrorMessage(message: string) {
    showErrorMessage(message);
    setTimeout(() => setOpen(false), 6000);
  }

  return <>
    {open && <div className="toast toast-top toast-center">
        <div className={`alert ${severity} rounded-lg max-w-[45rem] flex`}>
            <span className="flex-grow max-w-[80vw] w-max wrap-anywhere">{message}</span>
            <button onClick={() => setOpen(false)}><XMarkIcon className="h-5 w-5 inline ml-2"/></button>
        </div>
    </div>}
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
        showErrorMessage
      }}>
      {children}
    </ToastContext.Provider>
  </>
}
