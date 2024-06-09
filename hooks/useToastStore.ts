import { create } from 'zustand';
import { NotificationInstance, useNotificationsStore } from './useNotificationsStore';

export enum ToastSeverity {
  DANGER = "DANGER",
  ATTENTION = "ATTENTION",
  LOADER = "LOADER",
  SUCCESS = "SUCCESS"
}

export type ToastInstance = {
  severity: ToastSeverity;
  title: string;
  description?: string;
  duration?: number;
  followupNotification?: NotificationInstance;
}

export const DEFAULT_TOAST_DURATION = 7000; // in ms

const useToastStore = create((set: any) => ({
  currentToast: null,
  setCurrentToast: (currentToast: ToastInstance) => set((state: any) => {
    setTimeout(() => {
      if (currentToast.followupNotification) {
        useNotificationsStore.getState().addNotification(currentToast?.followupNotification)
      }
      state.resetToast();
    }, currentToast.duration || DEFAULT_TOAST_DURATION)
    return { ...state, currentToast };
  }),
  resetToast: () => set((state: any) => {
    return ({ ...state, currentToast: null });
  })
}));

export default useToastStore;
