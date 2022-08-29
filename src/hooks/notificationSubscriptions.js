import { useEffect, useRef } from "react";
import io from "socket.io-client";

import { NOTIFIER_SOCKET_URL, NOTIFICATION_EVENTS } from "../utils/constants";

export const useNotifSubscription = (userId) => {
  const socketRef = useRef();

  const onDriverRequestApprove = (data) => {
    console.log(data);
  };

  useEffect(() => {
    socketRef.current = io(NOTIFIER_SOCKET_URL);

    socketRef.current.on("connect", () => {
      socketRef.current.emit(NOTIFICATION_EVENTS.JOIN, { userId });
    });

    socketRef.current.on(
      NOTIFICATION_EVENTS.DRIVER_REQUEST_APPROVE,
      onDriverRequestApprove
    );
  }, [userId]);

  const emitEvent = (event, data) => {
    socketRef.current.emit(event, data);
  };

  return { socket: socketRef.current, emitEvent };
};
