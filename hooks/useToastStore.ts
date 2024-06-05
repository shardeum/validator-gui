import { create } from 'zustand';

export enum ToastSeverity {
  DANGER = "DANGER",
  SUCCESS = "SUCCESS"
}

export type ToastInstance = {
  severity: ToastSeverity;
  title: string;
  description?: string;
}

const useToastStore = create((set) => ({
  currentToast: null,
  setCurrentToast: (currentToast: ToastInstance) => set((state: any) => {
    return { ...state, currentToast };
  }),
  resetToast: () => set((state: any) => {
    return ({ ...state, currentToast: null });
  })
}));

export default useToastStore;
