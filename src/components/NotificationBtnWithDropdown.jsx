import React, { forwardRef } from "react";
import { MdNotifications } from "react-icons/md";

import withClickOutside from "../hoc/withClickOutside";
import NotificationList from "./NotificationList";

const NotificationBtnWithDropdown = forwardRef(
  ({ open, setOpen, count, notifications, onNotificationRead }, ref) => {
    return (
      <div ref={ref} className="relative cursor-pointer">
        <div
          onClick={() => {
            setOpen(!open);
          }}
        >
          <MdNotifications color="#979797" size={28} />
          {count > 0 && (
            <div className="w-5 h-5 flex items-center justify-center border-2 border-247-main rounded-full bg-red-500 absolute -top-2 -right-1">
              <span className="text-xs text-247-transparent">{count}</span>
            </div>
          )}
        </div>
        <NotificationList
          notifications={notifications}
          show={open}
          handleNotificationClose={onNotificationRead}
          setShow={setOpen}
        />
      </div>
    );
  }
);

export default withClickOutside(NotificationBtnWithDropdown);
