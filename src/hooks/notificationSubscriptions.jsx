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
  closeNotification: () => {},
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

  const updateNotificationReadStatus = async (notificationId, data) => {
    await adverts247Api.patch(`/notifications/${notificationId}/read`, data, {
      headers: { Authorization: `Bearer ${resolveToken()}` },
    });
  };

  const [notifications, _setNotifications] = useState([]);
  const [notificationCount, _setNotificationCount] = useState(0);

  const notificationsRef = useRef(notifications);
  const notificationCountRef = useRef(notificationCount);

  const setNotifications = (data) => {
    notificationsRef.current = data;
    _setNotifications(data);
  };

  const setNotificationCount = (data) => {
    notificationCountRef.current = data;
    _setNotificationCount(data);
  };

  const socketRef = useRef();

  const onPayoutRequested = (data) => {
    console.log(data);
    const newNotifications = [data, ...notificationsRef.current];
    setNotifications(newNotifications);
    setNotificationCount(notificationCountRef.current + 1);
  };

  useEffect(() => {
    socketRef.current = io(NOTIFIER_SOCKET_URL);
    fetchNotifications().then((data) => {
      setNotifications(data.notifications);
      setNotificationCount(data.count);
    });

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

  const closeNotification = async (notificationId) => {
    const newNotifications = notifications.filter(
      (notif) => notif.id !== notificationId
    );

    setNotifications(newNotifications);
    setNotificationCount(newNotifications.length);
    await updateNotificationReadStatus(notificationId, { read: true });
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
        notifications,
        emitEvent,
        fetchNotifications,
        closeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
