import { createContext, ReactNode, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const ToastContext = createContext<{
  open: boolean,
  setOpen: (open: boolean) => void,
  message: string,
  setMessage: (message: string) => void,
  severity: ToastSeverity,
  setSeverity: (severity: ToastSeverity) => void,
  showTemporarySuccessMessage: (message: string) => void
}>
({
  open: false,
  setOpen: () => false,
  message: "",
  setMessage: () => "",
  severity: "success",
  setSeverity: () => "success",
  showTemporarySuccessMessage: () => {
  }
})

type ToastSeverity = "success" | "error" | "warning" | "info";


export default function ToastContextProvider({children}: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<ToastSeverity>("success");

  function showTemporarySuccessMessage(message: string) {
    setSeverity('success');
    setMessage(message);
    setOpen(true);
    setTimeout(() => setOpen(false), 6000);
  }

  return <>
    {open && <div className="toast toast-top toast-center">
        <div className="alert alert-success rounded-lg w-[20rem] flex">
            <span className="flex-grow">{message}</span>
            <button onClick={() => setOpen(false)}><XMarkIcon className="h-5 w-5 inline ml-2"/></button>
        </div>
    </div>}
    <ToastContext.Provider
      value={{open, setOpen, message, setMessage, severity, setSeverity, showTemporarySuccessMessage}}>
      {children}
    </ToastContext.Provider>
  </>
}
