import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import { MdKeyboardBackspace } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ImInfo } from "react-icons/im";
import { BiUserCheck } from "react-icons/bi";
import { FiCheckSquare } from "react-icons/fi";
import classNames from "classnames";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import ResourceMeta from "../components/uiComponents/ResourceMeta";
import ConfirmationModal from "../components/uiComponents/ConfirmationModal";
import InfoBox from "../components/InfoBox";
import { formatNum } from "../utils/numFormatter";
import startCase from "lodash/startCase";
import EditDriverInfoModal from "../components/uiComponents/EditDriverInfoModal";
import PayoutHistoryModal from "../components/uiComponents/PayoutHistoryModal";

// const mapStatusToColor = {
//   active: "#028307",
//   pending: "#EC5500",
//   suspended: "#E20000",
// };

const mapBtnTextToStatus = {
  active: {
    title: "Suspend Account",
    icon: <AiOutlineCloseCircle className="mr-2" size={22} />,
    action: "suspend",
  },
  pending: {
    title: "Activate Account",
    icon: <FiCheckSquare className="mr-2" size={22} />,
    action: "activate",
  },
  suspended: {
    title: "Reactivate Account",
    icon: <BiUserCheck className="mr-2" size={22} />,
    action: "reactivate",
  },
};

const CustomHeader = ({ goToPrevPage, name, status, accountAction }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={goToPrevPage}
          className="bg-transparent border-0 outline-none focus:outline-none"
        >
          <MdKeyboardBackspace color="#f00" size={28} />
        </button>
        <div className="ml-14">
          <h3 className="text-white text-2xl font-semibold">{name}</h3>
          <p className="text-white font-normal text-sm">
            Date created: 12/12/2021
          </p>
        </div>
        <div
          className={classNames(
            "flex",
            "items-center",
            "justify-center",
            "ml-10",
            "py-1",
            "px-4",
            "rounded-md",
            {
              "bg-active-gradient": status === "active",
            },
            { "bg-closed-gradient": status === "suspended" },
            { "bg-paused-gradient": status === "pending" }
          )}
        >
          <p className="text-white font-medium text-lg">{startCase(status)}</p>
        </div>
      </div>
      <RoundedBtnWithIcon
        title={mapBtnTextToStatus[status].title}
        icon={mapBtnTextToStatus[status].icon}
        onBtnClick={() => accountAction(mapBtnTextToStatus[status].action)}
      />
    </div>
  );
};

const DriverDetail = () => {
  const { state } = useLocation();
  const history = useHistory();

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [editInfoOpen, setEditInfoOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState({
    open: false,
    action: null,
  });

  const confirmAccountAction = (action) => {
    setConfirmModalOpen({ open: true, action });
  };

  const handleAccountSuspend = () => {
    console.log("suspending...");
    setConfirmModalOpen({ open: false, action: null });
  };

  const handleAccountActivate = () => {
    console.log("activating...");
    setConfirmModalOpen({ open: false, action: null });
  };

  const handleAccountReactivate = () => {
    console.log("reactivating...");
    setConfirmModalOpen({ open: false, action: null });
  };

  const mapAccountActionToValues = {
    suspend: {
      confirmText: "Are you sure you want to suspend this account?",
      action: handleAccountSuspend,
    },
    activate: {
      confirmText: "Are you sure you want to activate this account?",
      action: handleAccountActivate,
    },
    reactivate: {
      confirmText: "Are you sure you want to reactivate this account?",
      action: handleAccountReactivate,
    },
  };

  const handleDriverInfoEdit = (data) => {
    console.log(data, "Editing driver info...");
  };

  const editData = {
    firstName: state.driver?.name?.split(" ")[0],
    lastName: state.driver?.name?.split(" ")[1],
    emailAddress: state.driver?.email,
    phoneNumber: "08090023150",
    favouriteMeal: "Jollof Rice",
    hobby: "Football",
    askMeAbout: "Manchester United",
    vacationSpot: "Bahamas",
  };

  return (
    <Dashboard
      customHeader={
        <CustomHeader
          goToPrevPage={() => history.goBack()}
          name={state.driver.name}
          status={state.driver.status}
          accountAction={confirmAccountAction}
        />
      }
    >
      <div className="w-full mt-20 rounded-lg bg-247-campaign-preview">
        <div className="w-full bg-247-campaign-preview-title flex items-center justify-between px-12 py-4 rounded-t-lg">
          <h4 className="text-white text-xl font-medium">Personal Info</h4>
          <button
            onClick={() => setEditInfoOpen(true)}
            className="text-247-campaign-preview-title bg-white px-5 py-2 rounded-md font-medium"
          >
            Edit Info
          </button>
        </div>
        <div className="flex py-5 px-6">
          <img
            src="/assets/profile-img.png"
            alt="video ad"
            className="h-full drop-shadow-sm w-full object-cover rounded-md"
            style={{ maxWidth: "300px", maxHeight: "300px" }}
          />
          <div className="border-l border-white ml-14"></div>
          <div className="w-full flex justify-around pt-2">
            <div>
              <ResourceMeta
                label="First name"
                value={state.driver.name.split(" ")[0]}
              />
              <ResourceMeta label="Phone Number" value="08090023150" />
              <ResourceMeta label="Hobby" value="Football" />
              <ResourceMeta label="Date Created" value="12/12/2021" last />
            </div>
            <div>
              <ResourceMeta
                label="Last name"
                value={state.driver.name.split(" ")[1]}
              />
              <ResourceMeta label="City" value="Lagos" />
              <ResourceMeta label="Ask me about" value="Manchester United" />
              <ResourceMeta label="ID Type" value="Drivers License" last />
            </div>
            <div>
              <ResourceMeta label="Email Address" value={state.driver.email} />
              <ResourceMeta label="Favourite Meal" value="Jollof Rice" />
              <ResourceMeta label="Vacation Spot" value="Bahamas" />
              <ResourceMeta label="ID Upload" value="mydl.png" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-14 mb-24 rounded-lg bg-247-campaign-preview">
        <div className="w-full bg-247-campaign-preview-title flex items-center justify-between px-12 py-4 rounded-t-lg">
          <h4 className="text-white text-xl font-medium">Earnings</h4>
          <button
            onClick={() => setPayoutModalOpen(true)}
            className="text-247-campaign-preview-title bg-white px-5 py-2 rounded-md font-medium"
          >
            Payout History
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6 pt-16 pb-5 px-6">
          <InfoBox
            bgColor="bg-blue-gradient"
            infoTitle="Today's Earning"
            infoValue={formatNum(4557.45, true, true)}
          />
          <InfoBox
            bgColor="bg-green-gradient"
            infoTitle="Total Earning"
            infoValue={formatNum(147557.45, true, true)}
          />
          <InfoBox
            bgColor="bg-yellow-gradient"
            infoTitle="Pending Payout"
            infoValue={formatNum(20800.45, true, true)}
            btnText="Settle"
          />
        </div>
      </div>
      <ConfirmationModal
        open={confirmModalOpen.open}
        setOpen={setConfirmModalOpen}
        text={mapAccountActionToValues[confirmModalOpen?.action]?.confirmText}
        icon={<ImInfo size={28} color="#fff" />}
        handleConfirmation={
          mapAccountActionToValues[confirmModalOpen?.action]?.action
        }
      />
      <EditDriverInfoModal
        isOpen={editInfoOpen}
        setIsOpen={setEditInfoOpen}
        isEdit
        editData={editData}
        submitAction={handleDriverInfoEdit}
      />
      <PayoutHistoryModal
        isOpen={payoutModalOpen}
        setIsOpen={setPayoutModalOpen}
      />
    </Dashboard>
  );
};

export default DriverDetail;
