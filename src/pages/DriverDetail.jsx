import React, { useMemo, useState, useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import format from "date-fns/format";
import toast from "react-hot-toast";
import { MdKeyboardBackspace } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ImInfo } from "react-icons/im";
import { BiUserCheck } from "react-icons/bi";
import { FiCheckSquare } from "react-icons/fi";
import { IoIosCash } from "react-icons/io";
import classNames from "classnames";
import pickBy from "lodash/pickBy";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";

import Dashboard from "../components/Dashboard";
import { Context as DriverContext } from "../context/DriverContext";
import { Context as EarningContext } from "../context/EarningContext";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as PayoutContext } from "../context/PayoutContext";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import ResourceMeta from "../components/uiComponents/ResourceMeta";
import ConfirmationModal from "../components/uiComponents/ConfirmationModal";
import InfoBox from "../components/InfoBox";
import { convertKoboToNaira, formatNum } from "../utils/numFormatter";
import startCase from "lodash/startCase";
import EditDriverInfoModal from "../components/uiComponents/EditDriverInfoModal";
import PayoutHistoryModal from "../components/uiComponents/PayoutHistoryModal";
import SettlePayoutModal from "../components/uiComponents/SettlePayoutModal";
import { useToastError } from "../hooks/handleError";
import DriverDetailLoading from "../components/loader/DriverDetail.loader";
import IDViewerModal from "../components/uiComponents/IDViewerModal";
import { useQueryParam } from "../hooks/useQueryParam";
import { useNotification } from "../hooks/notificationSubscriptions";
import { NOTIFICATION_EVENTS } from "../utils/constants";
import OverlayLoader from "../components/uiComponents/OverlayLoader";

export const SETTLE_MODAL_TYPE = {
  SINGLE: "single",
  BULK: "bulk",
};

const mapBtnTextToStatus = {
  approved: {
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

const CustomHeader = ({
  goToPrevPage,
  name,
  status,
  accountAction,
  createdDate,
}) => {
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
            Date created: {createdDate}
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
              "bg-active-gradient": status === "approved",
              "bg-closed-gradient": status === "suspended",
              "bg-paused-gradient": status === "pending",
            }
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

const mapActionToStatusAndEvent = {
  suspend: {
    status: "suspended",
    successEvent: NOTIFICATION_EVENTS.DRIVER_SUSPENDED,
    sucessEventTitle: "Account Suspended",
    successEventMessage: `Your account has been suspended based on breaking the guidelines. You can contact support for help`,
  },
  activate: {
    status: "approved",
    successEvent: NOTIFICATION_EVENTS.DRIVER_APPROVED,
    sucessEventTitle: "Account Approved",
    successEventMessage: `Your account has been approved. Log in and start earning from your trips`,
  },
  reactivate: {
    status: "approved",
    successEvent: NOTIFICATION_EVENTS.DRIVER_APPROVED,
    sucessEventTitle: "Account Re-Approved",
    successEventMessage: `Your account has been re-approved. Log in and start earning from your trips`,
  },
};

const DriverDetail = () => {
  const history = useHistory();
  const { driverId } = useParams();

  const { emitEvent } = useNotification();

  const [settleModalOpen, setSettleModalOpen] = useState({
    open: false,
    type: SETTLE_MODAL_TYPE.BULK,
  });
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [editInfoOpen, setEditInfoOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState({
    open: false,
    action: null,
  });
  const [confirmPayoutModalOpen, setConfirmPayoutModalOpen] = useState(false);
  const [idViewerOpen, setIdViewerOpen] = useState(false);

  const [payoutPayload, setPayoutPayload] = useState();
  const [selectedPayout, setSelectedPayout] = useState();

  const {
    state: { user },
  } = useContext(AuthContext);

  const {
    state: {
      payoutRequests,
      fetchingPayouts,
      settlingSinglePayout,
      singlePayoutError,
      settlingBulkPayout,
      bulkPayoutError,
    },
    fetchPayoutRequests,
    settleSinglePayoutRequest,
    settleBulkPayoutRequest,
    clearError: clearPayoutError,
  } = useContext(PayoutContext);

  const {
    state: {
      fetchingSingleDriver,
      driver,
      updatingDriverStatus,
      updateStatusError,
      updatingAttributes,
      updateAttributesError,
    },
    fetchDriverById,
    updateDriverStatus,
    updateDriverAttributes,
    clearError,
  } = useContext(DriverContext);

  const {
    state: {
      fetchingLifetimeEarning,
      fetchingDayEarning,
      lifetimeEarning,
      dayEarning,
    },
    getDriverLifetimeEarning,
    getDriverDayEarning,
  } = useContext(EarningContext);

  const loadingStats = useMemo(
    () =>
      fetchingLifetimeEarning ||
      fetchingDayEarning ||
      fetchingSingleDriver ||
      fetchingPayouts,
    [
      fetchingLifetimeEarning,
      fetchingDayEarning,
      fetchingSingleDriver,
      fetchingPayouts,
    ]
  );

  const [payoutHistoryOpen, setPayoutHistoryOpen] =
    useQueryParam("payoutModalOpen");

  useEffect(() => {
    if (payoutHistoryOpen === "true") {
      setPayoutModalOpen(true);
    }
    (async () => {
      await Promise.all([
        getDriverDayEarning(driverId),
        getDriverLifetimeEarning(driverId),
        fetchDriverById(driverId),
        fetchPayoutRequests({ driver: driverId }),
      ]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useToastError(updateStatusError, () => clearError("updateStatus"));
  useToastError(updateAttributesError, () => clearError("updateAttributes"));
  useToastError(singlePayoutError, () => clearPayoutError("settleSingle"));
  useToastError(bulkPayoutError, () => clearPayoutError("settleBulk"));

  const confirmAccountAction = (action) => {
    setConfirmModalOpen({ open: true, action });
  };

  const statusUpdateCallback = () => {
    emitEvent(mapActionToStatusAndEvent[confirmModalOpen.action].successEvent, {
      sender: user.id,
      recipient: driver.id,
      title:
        mapActionToStatusAndEvent[confirmModalOpen.action].sucessEventTitle,
      message:
        mapActionToStatusAndEvent[confirmModalOpen.action].successEventMessage,
    });
    toast.success(
      `Driver is ${
        mapActionToStatusAndEvent[confirmModalOpen.action].status
      } successfully!`
    );
    return fetchDriverById(driverId);
  };

  const handleAccountSuspend = async () => {
    console.log("suspending...");
    await updateDriverStatus(
      driverId,
      mapActionToStatusAndEvent[confirmModalOpen.action].status,
      statusUpdateCallback
    );
    setConfirmModalOpen({ open: false, action: null });
  };

  const handleAccountActivate = async () => {
    console.log("activating...");
    await updateDriverStatus(
      driverId,
      mapActionToStatusAndEvent[confirmModalOpen.action].status,
      statusUpdateCallback
    );
    setConfirmModalOpen({ open: false, action: null });
  };

  const handleAccountReactivate = async () => {
    console.log("reactivating...");
    await updateDriverStatus(
      driverId,
      mapActionToStatusAndEvent[confirmModalOpen.action].status,
      statusUpdateCallback
    );
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

  const handleDriverPayout = (data) => {
    console.log(data, driver, "confirming payout");

    let payload;

    if (data.settlementType === "single") {
      payload = {
        payoutData: {
          recepientCode: data.recipientCode,
          driver: data.driverId,
        },
        requestId: data.requestId,
        settlementType: data.settlementType,
      };
    } else {
      const pendingPayoutList = payoutRequests
        .filter((request) => request.status === "pending")
        .map((request) => ({
          requestId: request.id,
          driver: driver.id,
          recepientCode: driver?.bankInformation?.recipientCode,
          amount: request.amount,
        }));

      payload = {
        settlementType: data.settlementType,
        payoutData: pendingPayoutList,
      };
    }

    setPayoutPayload(payload);

    setSettleModalOpen(false);
    setConfirmPayoutModalOpen(true);
  };

  const payoutEarningToDriver = async () => {
    const payoutAmount =
      settleModalOpen.type === SETTLE_MODAL_TYPE.BULK
        ? convertKoboToNaira(
            driver?.driverStat?.pendingPayout || 0
          ).toLocaleString()
        : convertKoboToNaira(selectedPayout?.amount || 0).toLocaleString();

    const successCb = () => {
      emitEvent(NOTIFICATION_EVENTS.DRIVER_PAYOUT_SUCCESS, {
        sender: user.id,
        recipient: driver.id,
        payoutRequest: payoutPayload.requestId || payoutPayload.payoutData,
        title: "Payout Success",
        message: `Your pending payout request for ${payoutAmount} was settled to your bank account successfully.`,
      });
      toast.success(`Successfully settled payout request(s)`);
      return fetchDriverById(driverId);
    };

    const errorCb = () => {
      emitEvent(NOTIFICATION_EVENTS.DRIVER_PAYOUT_FAIL, {
        sender: user.id,
        recipient: driver.id,
        payoutRequest: payoutPayload.requestId || payoutPayload.payoutData,
        title: "Payout Failed",
        message: `Settlement for your pending payout request for ${payoutAmount} has failed. Please make another request or contact support`,
      });
      return fetchDriverById(driverId);
    };

    payoutPayload.settlementType === "single"
      ? await settleSinglePayoutRequest(
          payoutPayload.payoutData,
          payoutPayload.requestId,
          successCb,
          errorCb
        )
      : await settleBulkPayoutRequest(
          payoutPayload.payoutData,
          successCb,
          errorCb
        );
    setConfirmPayoutModalOpen(false);
  };

  const editData = {
    firstName: driver?.name?.split(" ")[0],
    lastName: driver?.name?.split(" ")[1],
    emailAddress: driver?.email,
    phoneNumber: driver?.phoneNumber ? `0${driver.phoneNumber}` : "",
    favouriteMeal: driver?.extraInfo?.favouriteMeal,
    hobby: driver?.extraInfo?.favouriteHobby,
    askMeAbout: driver?.extraInfo?.askMeAbout,
    vacationSpot: driver?.extraInfo.vacationSpot,
  };

  const handleDriverInfoEdit = async (data) => {
    const diff = pickBy(data, (val, key) => !isEqual(editData[key], val));

    if (isEmpty(diff)) {
      toast.error("You haven't made any changes!");
      return;
    }

    await updateDriverAttributes(data, driverId, () => {
      setEditInfoOpen(false);
      toast.success(`Updated driver information successfully!`);
      return fetchDriverById(driverId);
    });
  };

  const dateCreated = useMemo(
    () =>
      driver?.createdAt
        ? format(new Date(driver.createdAt), "dd/MM/yyyy")
        : "12/12/2021",
    [driver]
  );

  return (
    driver && (
      <Dashboard
        customHeader={
          <CustomHeader
            goToPrevPage={() => history.push("/drivers")}
            name={driver.name}
            status={driver.status}
            accountAction={confirmAccountAction}
            createdDate={dateCreated}
          />
        }
      >
        {(updatingDriverStatus ||
          settlingBulkPayout ||
          settlingSinglePayout) && <OverlayLoader />}
        {loadingStats ? (
          <DriverDetailLoading />
        ) : (
          <>
            <div className="w-full mt-20 rounded-lg bg-247-campaign-preview">
              <div className="w-full bg-247-campaign-preview-title flex items-center justify-between px-12 py-4 rounded-t-lg">
                <h4 className="text-white text-xl font-medium">
                  Personal Info
                </h4>
                <button
                  onClick={() => setEditInfoOpen(true)}
                  className="text-247-campaign-preview-title bg-white px-5 py-2 rounded-md font-medium"
                >
                  Edit Info
                </button>
              </div>
              <div className="flex py-5 px-6">
                <img
                  src={driver.profilePhoto}
                  alt="profile"
                  className="h-full drop-shadow-sm w-full object-cover rounded-md"
                  style={{ maxWidth: "300px", maxHeight: "300px" }}
                />
                <div className="border-l border-white ml-14"></div>
                <div className="w-full flex justify-around pt-2">
                  <div>
                    <ResourceMeta
                      label="First name"
                      value={driver.name.split(" ")[0]}
                    />
                    <ResourceMeta
                      label="Phone Number"
                      value={`0${driver.phoneNumber}`}
                    />
                    <ResourceMeta
                      label="Hobby"
                      value={driver.extraInfo.favouriteHobby}
                    />
                    <ResourceMeta
                      label="Date Created"
                      value={dateCreated}
                      last
                    />
                  </div>
                  <div>
                    <ResourceMeta
                      label="Last name"
                      value={driver.name.split(" ")[1]}
                    />
                    <ResourceMeta label="City" value={driver.city} />
                    <ResourceMeta
                      label="Ask me about"
                      value={driver.extraInfo.askMeAbout}
                    />
                    <ResourceMeta
                      label="ID Type"
                      value="Drivers License"
                      last
                    />
                  </div>
                  <div>
                    <ResourceMeta label="Email Address" value={driver.email} />
                    <ResourceMeta
                      label="Favourite Meal"
                      value={driver.extraInfo.favouriteMeal}
                    />
                    <ResourceMeta
                      label="Vacation Spot"
                      value={driver.extraInfo.vacationSpot}
                    />
                    <ResourceMeta
                      label="ID Upload"
                      value="Open ID"
                      btnAction={() => setIdViewerOpen(true)}
                      isButton
                    />
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
                  infoValue={formatNum(
                    convertKoboToNaira(dayEarning),
                    true,
                    true
                  )}
                />
                <InfoBox
                  bgColor="bg-green-gradient"
                  infoTitle="Total Earning"
                  infoValue={formatNum(
                    convertKoboToNaira(lifetimeEarning),
                    true,
                    true
                  )}
                />
                <InfoBox
                  bgColor="bg-yellow-gradient"
                  infoTitle="Pending Payout"
                  infoValue={formatNum(
                    convertKoboToNaira(driver?.driverStat?.pendingPayout),
                    true,
                    true
                  )}
                  btnActive={driver?.driverStat?.pendingPayout > 0}
                  btnText="Settle"
                  btnAction={() =>
                    setSettleModalOpen({
                      open: true,
                      type: SETTLE_MODAL_TYPE.BULK,
                    })
                  }
                />
              </div>
            </div>
          </>
        )}
        <ConfirmationModal
          open={confirmModalOpen.open}
          setOpen={setConfirmModalOpen}
          text={mapAccountActionToValues[confirmModalOpen?.action]?.confirmText}
          icon={<ImInfo size={28} color="#fff" />}
          handleConfirmation={
            mapAccountActionToValues[confirmModalOpen?.action]?.action
          }
        />
        <ConfirmationModal
          open={confirmPayoutModalOpen}
          setOpen={setConfirmPayoutModalOpen}
          text={`Continue payout for ${driver?.name}`}
          handleConfirmation={payoutEarningToDriver}
          handleReject={() => {
            setConfirmPayoutModalOpen(false);
          }}
          icon={<IoIosCash size={32} color="#fff" />}
          processingConfirm={settlingSinglePayout || settlingBulkPayout}
        />
        <EditDriverInfoModal
          isOpen={editInfoOpen}
          setIsOpen={setEditInfoOpen}
          isEdit
          loading={updatingAttributes}
          editData={editData}
          submitAction={handleDriverInfoEdit}
        />
        <PayoutHistoryModal
          isOpen={payoutModalOpen}
          setIsOpen={setPayoutModalOpen}
          setPayoutHistoryQueryParam={setPayoutHistoryOpen}
          payouts={payoutRequests}
          setSettleModalOpen={setSettleModalOpen}
          setSelectedPayout={setSelectedPayout}
        />
        <SettlePayoutModal
          isOpen={settleModalOpen.open}
          setIsOpen={setSettleModalOpen}
          driverDeets={{
            bankName: driver?.bankInformation?.bank?.name,
            accountNumber: driver?.bankInformation?.accountNumber,
            accountName: driver?.bankInformation?.accountName,
            requestId: selectedPayout?.id,
            driverId: driver.id,
            recipientCode: driver?.bankInformation?.recipientCode,
            settlementType: settleModalOpen.type,
            pendingPayout:
              settleModalOpen.type === SETTLE_MODAL_TYPE.BULK
                ? convertKoboToNaira(
                    driver?.driverStat?.pendingPayout || 0
                  ).toLocaleString()
                : convertKoboToNaira(
                    selectedPayout?.amount || 0
                  ).toLocaleString(),
          }}
          handlePayout={handleDriverPayout}
        />
        <IDViewerModal
          open={idViewerOpen}
          setOpen={setIdViewerOpen}
          idUrl={driver?.driversValidId}
        />
      </Dashboard>
    )
  );
};

export default DriverDetail;
