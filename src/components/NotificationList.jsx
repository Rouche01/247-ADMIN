import React from "react";
import classNames from "classnames";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import NotificationBox from "./uiComponents/NotificationBox";
import { mapNotificationTypeToAction } from "../utils/notification";

const NotificationList = ({
  notifications,
  show,
  handleNotificationClose,
  setShow,
}) => {
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
        const driverId = notif?.sender?.driverId || notif?.driverId;
        return (
          <NotificationBox
            key={notif.id}
            actionText={mapNotificationTypeToAction[notif.type].actionText}
            handleAction={() => {
              setShow(false);
              mapNotificationTypeToAction[notif.type].action(driverId, () =>
                handleNotificationClose(notif.id)
              );
            }}
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
