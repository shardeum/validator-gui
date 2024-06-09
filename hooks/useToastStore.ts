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
  upgradeTimeout?: ReturnType<typeof setTimeout>;
}

export const DEFAULT_TOAST_DURATION = 7000; // in ms

const useToastStore = create((set: any) => ({
  currentToast: null,
  setCurrentToast: (currentToast: ToastInstance) => set((state: any) => {
    if (state.currentToast?.upgradeTimeout) {
      clearTimeout(state.currentToast?.upgradeTimeout);
    }
    const newTimeout = setTimeout(() => {
      if (currentToast.followupNotification) {
        useNotificationsStore.getState().addNotification(currentToast?.followupNotification)
      }
      state.resetToast();
    }, currentToast.duration || DEFAULT_TOAST_DURATION)
    currentToast.upgradeTimeout = newTimeout;
    return { ...state, currentToast };
  }),
  resetToast: () => set((state: any) => {
    if (state.currentToast?.upgradeTimeout) {
      clearTimeout(state.currentToast?.upgradeTimeout);
    }
    return ({ ...state, currentToast: null });
  })
}));

export default useToastStore;
