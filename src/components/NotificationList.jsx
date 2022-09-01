import React from "react";
import classNames from "classnames";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import NotificationBox from "./uiComponents/NotificationBox";
import { mapNotificationTypeToAction } from "../utils/notification";

const NotificationList = ({ notifications, show, handleNotificationClose }) => {
  return (
    <div
      className={classNames([
        "w-2/6",
        "fixed",
        "top-0",
        "right-0",
        "mt-28",
        "mr-9",
        "z-50",
        { visible: show },
        { hidden: !show },
        { "opacity-0": !show },
        { "opacity-100": show },
      ])}
    >
      {notifications.map((notif) => {
        return (
          <NotificationBox
            key={notif.id}
            actionText={mapNotificationTypeToAction[notif.type].actionText}
            handleAction={() =>
              mapNotificationTypeToAction[notif.type].action(
                notif.sender.driverId,
                () => handleNotificationClose(notif.id)
              )
            }
            message={notif.notification}
            subject={notif.subject}
            time={formatDistanceToNow(new Date(notif.createdAt))}
            handleClose={() =>
              handleNotificationClose(notif.id || notif.notificationId)
            }
          />
        );
      })}
    </div>
  );
};

export default NotificationList;
