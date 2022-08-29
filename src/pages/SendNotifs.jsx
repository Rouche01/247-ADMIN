import React, { useContext } from "react";
import { useState } from "react";

import Dashboard from "../components/Dashboard";
import Button from "../components/uiComponents/Button";
import TextArea from "../components/uiComponents/TextArea";
import { Context as AuthContext } from "../context/AuthContext";

import { useNotifSubscription } from "../hooks/notificationSubscriptions";
import { NOTIFICATION_EVENTS } from "../utils/constants";

const SendNotifs = () => {
  const [inputValue, setInputValue] = useState("");

  const {
    state: { user },
  } = useContext(AuthContext);

  const { emitEvent } = useNotifSubscription(user.id);

  const handleNotificationBroadcast = () => {
    emitEvent(NOTIFICATION_EVENTS.DRIVER_BROADCAST, {
      message: inputValue,
      sender: user.id,
    });
    setInputValue("");
  };

  return (
    <Dashboard pageTitle="Send Notifs">
      <div className="mt-14">
        <TextArea
          name="notif-text"
          value={inputValue}
          handleChange={(ev) => setInputValue(ev.target.value)}
        />
        <Button
          type="submit"
          className={["bg-247-red", "block", "mt-12", "px-10"]}
          handleClick={handleNotificationBroadcast}
          disabled={false}
        >
          Send Notification
        </Button>
      </div>
    </Dashboard>
  );
};

export default SendNotifs;
