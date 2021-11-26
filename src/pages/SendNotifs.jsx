import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import Button from "../components/uiComponents/Button";
import TextArea from "../components/uiComponents/TextArea";

const TabButton = ({ btnValue, clickFn, active }) => {
  return (
    <div
      className={`w-36 cursor-pointer text-xl flex justify-center items-center rounded-md border border-247-dark-text text-247-gray-accent2 py-2 ${
        active ? "bg-247-gray-accent3" : "bg-transparent"
      }`}
      onClick={clickFn}
    >
      {btnValue}
    </div>
  );
};

const SendNotifs = () => {
  const [userType, setUserType] = useState("all");

  const handleTabClick = (category) => {
    setUserType(category);
  };

  return (
    <Dashboard pageTitle="Send Notifs">
      <div className="mt-16 flex items-center gap-5">
        <TabButton
          btnValue="All"
          active={userType === "all"}
          clickFn={() => handleTabClick("all")}
        />
        <TabButton
          btnValue="Advertisers"
          active={userType === "advertisers"}
          clickFn={() => handleTabClick("advertisers")}
        />
        <TabButton
          btnValue="Drivers"
          active={userType === "drivers"}
          clickFn={() => handleTabClick("drivers")}
        />
      </div>
      <div className="mt-14">
        <TextArea name="notif-text" />
        <Button
          type="submit"
          className={["bg-247-red", "block", "mt-12", "px-10"]}
        >
          Send Notification
        </Button>
      </div>
    </Dashboard>
  );
};

export default SendNotifs;
