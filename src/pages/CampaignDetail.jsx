import React, { useEffect, useMemo, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import Dashboard from "../components/Dashboard";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import { Context as CampaignContext } from "../context/CampaignContext";
import InfoBox from "../components/InfoBox";
import { formatNum } from "../utils/numFormatter";
import CampaignAnalyticsChart from "../components/CampaignAnalyticsChart";
import { impressionData } from "../utils/dummyData";
import ConfirmationModal from "../components/uiComponents/ConfirmationModal";
import startCase from "lodash/startCase";
import CreateCampaignModal from "../components/uiComponents/CreateCampaignModal";
import ResourceMeta from "../components/uiComponents/ResourceMeta";
import { calculateDistance } from "../utils/date";
import CampaignDetailLoading from "../components/loader/CampaignDetail.loader";

const CustomHeader = ({
  handleTerminateClick,
  campaignName,
  campaignId,
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
      <RoundedBtnWithIcon
        title="Terminate"
        icon={<AiOutlineCloseCircle className="mr-2" size={22} />}
        onBtnClick={handleTerminateClick}
      />
    </div>
  );
};

const mapStatusToColor = {
  active: "#028307",
  paused: "#EC5500",
  closed: "#E20000",
};

const CampaignDetail = () => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [editCampaignOpen, setEditCampaignOpen] = useState(false);

  const { campaignId } = useParams();

  const {
    state: { loading: fetchingCampaign, campaign },
    fetchCampaignById,
  } = useContext(CampaignContext);

  useEffect(() => {
    fetchCampaignById(campaignId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const history = useHistory();
  const handleCampaignTermination = () => {
    console.log("Terminating");
    setConfirmModalOpen(false);
  };

  const editData = {
    campaignName: campaign?.campaignName,
    advertiserName: campaign?.advertiser.companyName,
    adBudget: campaign?.adBudget,
    adType: { label: "Video", value: "video" },
  };

  const duration = useMemo(
    () =>
      campaign && calculateDistance(campaign.duration[1], campaign.duration[0]),
    [campaign]
  );

  return (
    campaign && (
      <Dashboard
        customHeader={
          <CustomHeader
            campaignId={campaign?.campaignID}
            campaignName={campaign?.campaignName}
            handleTerminateClick={() => setConfirmModalOpen(true)}
            goToPrevPage={() => history.push("/campaigns")}
          />
        }
      >
        {fetchingCampaign ? (
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
                  src={campaign.videoThumbnail}
                  alt="video ad"
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
                      label="Ad Spend"
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
                infoValue="25:06:32"
              />
              <InfoBox
                infoTitle="Total Impressions"
                infoValue={formatNum(27009, false, true)}
                bgColor="bg-green-gradient"
              />
              <InfoBox
                infoTitle="Amount Spent"
                infoValue={formatNum(campaign?.adBudget, true, true)}
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
              open={confirmModalOpen}
              setOpen={setConfirmModalOpen}
              text="Are you sure you want to terminate this ad?"
              icon={<FaRegTrashAlt size={28} color="#fff" />}
              handleConfirmation={handleCampaignTermination}
            />
            <CreateCampaignModal
              modalIsOpen={editCampaignOpen}
              setIsOpen={setEditCampaignOpen}
              modalWidth={704}
              editData={editData}
              isEdit
            />
          </>
        )}
      </Dashboard>
    )
  );
};

export default CampaignDetail;
