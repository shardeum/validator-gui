import { XMarkIcon } from "@heroicons/react/24/outline";
import useNotificationsStore, {
  NotificationInstance,
} from "../../hooks/useNotificationsStore";
import { NotificationIcon } from "./NotificationIcon";

type NotificationBoxProps = {
  notification: NotificationInstance;
  deleteNotificationOnClosing?: boolean;
  onClose?: () => void;
};

export const timeSince = (timestamp: number) => {
  const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};

export const NotificationBox = ({
  notification,
  deleteNotificationOnClosing = true,
  onClose,
}: NotificationBoxProps) => {
  const { removeNotification } = useNotificationsStore((state: any) => ({
    removeNotification: state.removeNotification,
  }));

  return (
    <div className="border rounded flex py-2 px-3 dropdown-300">
      <div className="flex justify-between w-full">
        <div className="flex gap-x-2">
          <div className="flex flex-col justify-start">
            <NotificationIcon
              notificationType={notification.type}
              severity={notification.severity}
            />
          </div>
          <div className="flex flex-col justify-start">
            <span className="text-xs font-semibold">{notification.title}</span>
            <span className="bodyFg text-xs">
              {timeSince(notification.timestamp)} ago
            </span>
          </div>
        </div>
        <div className="flex justify-end items-start">
          <XMarkIcon
            className="h-3 w-3 cursor-pointer"
            onClick={() => {
              if (deleteNotificationOnClosing) {
                removeNotification(notification);
              }
              if (onClose) {
                onClose();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
