import { createContext, useEffect, useRef, useContext, useState } from "react";
import io from "socket.io-client";

import { NOTIFIER_SOCKET_URL, NOTIFICATION_EVENTS } from "../utils/constants";
import { Context as AuthContext } from "../context/AuthContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const NotificationContext = createContext({
  notifications: [],
  notificationCount: 0,
  emitEvent: () => {},
  fetchNotifications: () => {},
  testNotif: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const {
    state: { user },
  } = useContext(AuthContext);

  const fetchNotifications = async () => {
    const response = await adverts247Api.get("/notifications", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
      params: {
        status: "unread",
        userId: user.id,
        sortBy: "createdAt",
        orderBy: "desc",
      },
    });

    return response.data;
  };

  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(NOTIFIER_SOCKET_URL);
    fetchNotifications().then((data) => {
      setNotifications(data.notifications);
      setNotificationCount(data.count);
    });

    const onPayoutRequested = (data) => {
      console.log(data);
      console.log(notifications, "before");
      setNotifications([data, ...notifications]);
      setNotificationCount(notificationCount + 1);
    };

    socketRef.current.on("connect", () => {
      console.log("connected");
      socketRef.current.emit(NOTIFICATION_EVENTS.JOIN, { userId: user.id });
    });

    socketRef.current.on(
      NOTIFICATION_EVENTS.DRIVER_PAYOUT_REQUEST,
      onPayoutRequested
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emitEvent = (event, data) => {
    socketRef.current.emit(event, data);
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
        notifications,
        emitEvent,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
