import useNotificationsStore, {
  NotificationInstance,
} from "../../hooks/useNotificationsStore";
import { NotificationBox } from "../atoms/NotificationBox";

export const NotificationsWindow = () => {
  const { showWindow, setShowWindow, notifications, resetNotifications } =
    useNotificationsStore((state: any) => ({
      showWindow: state.showWindow,
      setShowWindow: state.setShowWindow,
      notifications: state.notifications,
      resetNotifications: state.resetNotifications,
    }));

  return (
    <div className="absolute top-5 right-0 z-40">
      {showWindow && (
        <div className="flex flex-col bg-white border p-3 text-black rounded shadow min-w-[20rem] max-h-72 overflow-scroll">
          {/* header */}
          <div className="flex justify-between items-center px-1 mb-3">
            <div className="flex gap-x-2 items-center">
              <span className="text-sm font-semibold">Notifications</span>
              {notifications.length > 0 && (
                <span className="px-2 py-1 bg-accentBg text-xs text-accentFg rounded-md">
                  {notifications.length} new
                </span>
              )}
            </div>
            <span
              className="text-xs font-semibold cursor-pointer text-dangerFg hover:scale-105"
              onClick={() => {
                resetNotifications();
                setTimeout(() => {
                  setShowWindow(false);
                }, 1000);
              }}
            >
              Clear all
            </span>
          </div>
          {/* notifications */}
          <div className="flex flex-col-reverse gap-y-2">
            {notifications.map((notification: NotificationInstance) => {
              return (
                <NotificationBox
                  notification={notification}
                  key={notification.timestamp}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
