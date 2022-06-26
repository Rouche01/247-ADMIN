import React, { useEffect, useMemo, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MdKeyboardBackspace } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { MdOutlinePauseCircle, MdOutlineRestartAlt } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import startCase from "lodash/startCase";
import find from "lodash/find";

import Dashboard from "../components/Dashboard";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import { Context as CampaignContext } from "../context/CampaignContext";
import { Context as AdvertiserContext } from "../context/AdvertiserContext";
import InfoBox from "../components/InfoBox";
import { convertSecToHHMMSS, formatNum } from "../utils/numFormatter";
import CampaignAnalyticsChart from "../components/CampaignAnalyticsChart";
import { impressionData } from "../utils/dummyData";
import ConfirmationModal from "../components/uiComponents/ConfirmationModal";
import CreateCampaignModal from "../components/uiComponents/CreateCampaignModal";
import ResourceMeta from "../components/uiComponents/ResourceMeta";
import { calculateDistance } from "../utils/date";
import CampaignDetailLoading from "../components/loader/CampaignDetail.loader";
import { useToastError } from "../hooks/handleError";
import { ADTYPES } from "../utils/constants";

const mapBtnTextAndActionToStatus = {
  active: [
    {
      text: "Pause",
      action: "pause",
      icon: <MdOutlinePauseCircle className="mr-2" size={22} />,
    },
    {
      text: "Terminate",
      action: "terminate",
      icon: <AiOutlineCloseCircle className="mr-2" size={22} />,
    },
  ],
  paused: [
    {
      text: "Resume",
      action: "resume",
      icon: <MdOutlineRestartAlt className="mr-2" size={22} />,
    },
    {
      text: "Terminate",
      action: "terminate",
      icon: <AiOutlineCloseCircle className="mr-2" size={22} />,
    },
  ],
  closed: [],
};

const CustomHeader = ({
  loadingState,
  handleCampaignAction,
  campaignName,
  campaignId,
  status,
  goToPrevPage,
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
        <div className="ml-14 flex items-center">
          <h3 className="text-2xl text-247-gray font-semibold">
            {campaignName}
          </h3>
          <span className="bg-247-dark-text text-247-gray-accent2 px-3 py-1 text-xl rounded-md ml-8">
            {campaignId}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center">
        {mapBtnTextAndActionToStatus[status].map((item) => (
          <div className="mx-3">
            <RoundedBtnWithIcon
              title={item.text}
              icon={item.icon}
              onBtnClick={() => handleCampaignAction(item.action)}
              isLoading={loadingState}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStatusToColor = {
  active: "#028307",
  paused: "#EC5500",
  closed: "#E20000",
};

const CampaignDetail = () => {
  const [confirmModalOpen, setConfirmModalOpen] = useState({
    open: false,
    action: null,
  });
  const [editCampaignOpen, setEditCampaignOpen] = useState(false);

  const { campaignId } = useParams();

  const {
    state: {
      loading: fetchingCampaign,
      campaign,
      updatingStatus,
      updateStatusError,
      updatingAttributes,
      updateAttributesError,
    },
    fetchCampaignById,
    updateCampaignStatus,
    updateCampaignAttributes,
    clearError,
  } = useContext(CampaignContext);

  const {
    state: { loading: fetchingAdvertisers, advertisers },
    fetchAdvertisers,
  } = useContext(AdvertiserContext);

  useToastError(updateStatusError, () => {
    clearError("updateStatus");
  });

  useToastError(updateAttributesError, () => {
    clearError("updateAttributes");
  });

  useEffect(() => {
    fetchAdvertisers({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(advertisers);

  useEffect(() => {
    fetchCampaignById(campaignId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(campaign);

  const initiateCampaignAttributesUpdate = async (data) => {
    await updateCampaignAttributes(data, campaignId, () => {
      toast.success(`Campaign has been updated successfully!`);
      return fetchCampaignById(campaignId);
    });
  };

  const history = useHistory();

  const handleCampaignTermination = async () => {
    await updateCampaignStatus(
      campaign.campaignID,
      { status: "closed", action: "terminate" },
      () => {
        toast.success(`Campaign has been terminated successfully!`);
        return fetchCampaignById(campaignId);
      }
    );
    setConfirmModalOpen(false);
  };

  const initiateCampaignPause = async () => {
    await updateCampaignStatus(
      campaign.campaignID,
      { status: "paused", action: "pause" },
      () => {
        toast.success(`Campaign has been paused successfully!`);
        return fetchCampaignById(campaignId);
      }
    );
    setConfirmModalOpen(false);
  };

  const initiateCampaignResume = async () => {
    await updateCampaignStatus(
      campaign.campaignID,
      { status: "active", action: "resume" },
      () => {
        toast.success(`Campaign has resumed successfully!`);
        return fetchCampaignById(campaignId);
      }
    );
    setConfirmModalOpen(false);
  };

  const mapCampaignActionToValues = {
    pause: {
      confirmText: "Are you sure you want to pause this campaign?",
      handleFn: initiateCampaignPause,
    },
    terminate: {
      confirmText: "Are you sure you want to terminate this campaign?",
      handleFn: handleCampaignTermination,
    },
    resume: {
      confirmText: "Are you sure you want to resume this campaign?",
      handleFn: initiateCampaignResume,
    },
  };

  const editData = {
    campaignName: campaign?.campaignName,
    advertiser: find(advertisers, {
      companyName: campaign?.advertiser.companyName,
    }),
    duration: campaign?.duration.map((date) => new Date(date)),
    adBudget: campaign?.adBudget.toLocaleString(),
    adType: find(ADTYPES, { value: campaign?.adType }),
    preview:
      campaign?.adType === "image"
        ? campaign?.campaignMedia
        : campaign?.videoThumbnail,
  };

  const duration = useMemo(
    () =>
      campaign && calculateDistance(campaign.duration[1], campaign.duration[0]),
    [campaign]
  );

  const confirmCampaignAction = (action) => {
    setConfirmModalOpen({ open: true, action });
  };

  return (
    campaign && (
      <Dashboard
        customHeader={
          <CustomHeader
            campaignId={campaign?.campaignID}
            campaignName={campaign?.campaignName}
            handleCampaignAction={confirmCampaignAction}
            goToPrevPage={() => history.push("/campaigns")}
            status={campaign?.status}
            loadingState={updatingStatus}
          />
        }
      >
        {fetchingCampaign || fetchingAdvertisers ? (
          <CampaignDetailLoading />
        ) : (
          <>
            <div className="w-full mt-20 rounded-lg bg-247-campaign-preview">
              <div className="w-full bg-247-campaign-preview-title flex items-center justify-between px-12 py-4 rounded-t-lg">
                <h4 className="text-white text-xl font-medium">
                  Campaign Information
                </h4>
                <button
                  onClick={() => setEditCampaignOpen(true)}
                  className="text-247-campaign-preview-title bg-white px-5 py-2 rounded-md font-medium"
                >
                  Edit Campaign
                </button>
              </div>
              <div className="flex py-5 px-6">
                <img
                  src={
                    campaign.adType === "image"
                      ? campaign.campaignMedia
                      : campaign.videoThumbnail
                  }
                  alt="ad preview"
                  className="h-64 drop-shadow-sm w-full object-cover rounded-md"
                  style={{ maxWidth: "450px" }}
                />
                <div className="border-l border-white ml-14"></div>
                <div className="w-full flex justify-around pt-2">
                  <div>
                    <ResourceMeta
                      label="Campaign name"
                      value={campaign?.campaignName}
                    />
                    <ResourceMeta
                      label="Advertiser"
                      value={campaign?.advertiser?.companyName}
                    />
                    <ResourceMeta
                      label="Ad Type"
                      value={startCase(campaign?.adType)}
                      last
                    />
                  </div>
                  <div>
                    <ResourceMeta
                      label="Ad Budget"
                      value={Number(campaign?.adBudget).toLocaleString(
                        "en-NG",
                        {
                          currency: "NGN",
                          style: "currency",
                        }
                      )}
                    />
                    <ResourceMeta label="Duration" value={duration} />
                    <ResourceMeta
                      label="Status"
                      value={startCase(campaign?.status)}
                      valueColor={mapStatusToColor[campaign?.status]}
                      last
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-14">
              <InfoBox
                bgColor="bg-blue-gradient"
                infoTitle="Campaign Playtime"
                infoValue={convertSecToHHMMSS(
                  campaign?.campaignStat?.playTimeInSeconds
                )}
              />
              <InfoBox
                infoTitle="Total Impressions"
                infoValue={formatNum(
                  campaign.campaignStat.impressions,
                  false,
                  true
                )}
                bgColor="bg-green-gradient"
              />
              <InfoBox
                infoTitle="Amount Spent"
                infoValue={formatNum(
                  campaign?.campaignStat?.adSpend,
                  true,
                  true
                )}
                bgColor="bg-yellow-gradient"
              />
            </div>
            <div className="w-full mb-32 bg-247-campaign-preview rounded-xl mt-14 px-9 py-8">
              <div className="flex items-center justify-between mb-14">
                <h3 className="text-3xl text-247-gray-accent2 font-medium">
                  Campaign Analytics
                </h3>
                <div className="flex gap-10">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full border-4 border-247-red-straight"></div>
                    <label className="text-247-gray-accent2 text-2xl ml-4">
                      Impressions
                    </label>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full border-4 border-247-green"></div>
                    <label className="text-247-gray-accent2 text-2xl ml-4">
                      Interactions
                    </label>
                  </div>
                </div>
              </div>
              <CampaignAnalyticsChart
                data={impressionData}
                interactionsDataKey="interactions"
                impressionDataKey="impressions"
                xDataKey="date"
              />
            </div>
            <ConfirmationModal
              open={confirmModalOpen.open}
              setOpen={setConfirmModalOpen}
              text={
                mapCampaignActionToValues[confirmModalOpen?.action]?.confirmText
              }
              icon={<FaRegTrashAlt size={28} color="#fff" />}
              handleConfirmation={
                mapCampaignActionToValues[confirmModalOpen?.action]?.handleFn
              }
            />
            <CreateCampaignModal
              modalIsOpen={editCampaignOpen}
              setIsOpen={setEditCampaignOpen}
              modalWidth={704}
              editData={editData}
              editFn={initiateCampaignAttributesUpdate}
              editing={updatingAttributes}
              isEdit
            />
          </>
        )}
      </Dashboard>
    )
  );
};

export default CampaignDetail;
