import React, { useState, useMemo, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import omitBy from "lodash/omitBy";
import format from "date-fns/format";
import { MdKeyboardBackspace } from "react-icons/md";
import { FiDownloadCloud } from "react-icons/fi";
import moment from "moment";
import classNames from "classnames/bind";
import startCase from "lodash/startCase";

import Dashboard from "../components/Dashboard";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import InfoBox from "../components/InfoBox";
import Checkbox from "../components/uiComponents/Checkbox";
import TableHeader from "../components/TableHeader";
import Spinner from "../components/uiComponents/Spinner";
import Pagination from "../components/uiComponents/Pagination";
import DataTable from "../components/DataTable";
import ErrorBox from "../components/uiComponents/ErrorBox";
import NoDataBox from "../components/uiComponents/NoDataBox";

import { Context as CamapignContext } from "../context/CampaignContext";
import { Context as AdvertiserContext } from "../context/AdvertiserContext";

import { typeFilters, statusFilters } from "../utils/constants";
import { convertKoboToNaira, formatNum } from "../utils/numFormatter";
import {
  calculateTotalAdSpend,
  calculateTotalImpression,
} from "../utils/transformAdvertiser";
import { calculateDistanceInDays } from "../utils/date";

import { usePagination } from "../hooks/pagination";
import {
  useMomentDateQueryParamWithDefaultValue,
  useQueryParamWithDefaultValue,
} from "../hooks/useQueryParam";
import { useToastError } from "../hooks/handleError";

import AdvertiserDetailLoading from "../components/loader/AdvertiserDetail.loader";
import OverlayLoader from "../components/uiComponents/OverlayLoader";

const tableHeaders = [
  "",
  "Campaign Name",
  "Status",
  "Advertiser",
  "Impressions",
  "Duration",
  "Ad Spend",
];

const TWELVE_MONTH_AGO = moment().subtract(12, "M");
const NOW = moment();

const CustomHeader = ({
  advertiserName,
  goToPrevPage,
  handleReportDownload,
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
            {advertiserName}
          </h3>
        </div>
      </div>
      <RoundedBtnWithIcon
        title="Download report"
        icon={<FiDownloadCloud className="mr-2" size={22} />}
        onBtnClick={handleReportDownload}
      />
    </div>
  );
};

const DEFAULT_FILTERS = {
  status: "all",
  type: "all",
  startDate: TWELVE_MONTH_AGO,
  endDate: NOW,
};

const AdvertiserDetail = () => {
  const history = useHistory();
  const { advertiserId } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);
  const [checkedCampaigns, setCheckedCampaigns] = useState([]);

  const [campaignStatus, setCampaignStatus] = useQueryParamWithDefaultValue(
    "status",
    DEFAULT_FILTERS.status
  );

  const [campaignType, setCampaignType] = useQueryParamWithDefaultValue(
    "type",
    DEFAULT_FILTERS.type
  );

  const [startDate, setStartDate] = useMomentDateQueryParamWithDefaultValue(
    "startDate",
    DEFAULT_FILTERS.startDate
  );

  const [endDate, setEndDate] = useMomentDateQueryParamWithDefaultValue(
    "endDate",
    DEFAULT_FILTERS.endDate
  );

  const {
    state: {
      loading: fetchingAdvertiser,
      advertiser,
      generatingReport,
      generateReportError,
    },
    fetchAdvertiserById,
    generateAdvertiserReport,
    clearError,
  } = useContext(AdvertiserContext);

  useEffect(() => {
    fetchAdvertiserById(advertiserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advertiserStat = useMemo(() => {
    if (advertiser) {
      return {
        totalAdSpend: calculateTotalAdSpend(advertiser),
        totalImpression: calculateTotalImpression(advertiser),
      };
    }
  }, [advertiser]);

  const filterValues = useMemo(
    () =>
      advertiser
        ? {
            status: campaignStatus,
            type: campaignType,
            advertiser: advertiser.id,
            startDate: format(startDate.toDate(), "yyyy/MM/dd"),
            endDate: format(endDate.toDate(), "yyyy/MM/dd"),
          }
        : {},
    [campaignStatus, campaignType, advertiser, startDate, endDate]
  );

  const paginationOptions = useMemo(
    () => ({
      limit: shownRows,
      skip: (currentPage - 1) * shownRows,
    }),
    [shownRows, currentPage]
  );

  const {
    fetchCampaigns,
    state: {
      loading: fetchingCampaigns,
      campaignSize,
      campaigns,
      retrieveErrorMsg,
    },
  } = useContext(CamapignContext);

  useEffect(() => {
    if (advertiser) {
      const sanitizedFilterValues = omitBy(
        filterValues,
        (item) => item && item === "all"
      );

      fetchCampaigns({ ...sanitizedFilterValues, ...paginationOptions });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues, paginationOptions, advertiser, startDate, endDate]);

  const { indexOfFirstItem, indexOfLastItem, pages } = usePagination(
    currentPage,
    shownRows,
    campaigns,
    campaignSize
  );

  useToastError(generateReportError, () => {
    clearError("generateReport");
  });

  const toggleCampaignCheck = (idx) => {
    if (checkedCampaigns.includes(idx)) {
      const index = checkedCampaigns.indexOf(idx);
      const newCheckedCampaigns = [...checkedCampaigns];
      newCheckedCampaigns.splice(index, 1);
      setCheckedCampaigns(newCheckedCampaigns);
    } else {
      setCheckedCampaigns([...checkedCampaigns, idx]);
    }
  };

  return (
    advertiser && (
      <Dashboard
        customHeader={
          <CustomHeader
            goToPrevPage={() => history.push("/advertisers")}
            advertiserName={advertiser?.companyName}
            handleReportDownload={() => {
              console.log("downloading advertiser report");
              generateAdvertiserReport(advertiser.id, advertiser.companyName);
            }}
          />
        }
      >
        {generatingReport && <OverlayLoader />}
        {fetchingAdvertiser ? (
          <AdvertiserDetailLoading />
        ) : (
          <>
            <div className="mt-20 grid grid-cols-3 gap-6">
              <InfoBox
                bgColor="bg-blue-gradient"
                infoTitle="Total No. of Campaigns"
                infoValue={advertiser?.campaigns.length}
              />
              <InfoBox
                bgColor="bg-green-gradient"
                infoTitle="Total Spend"
                infoValue={formatNum(
                  convertKoboToNaira(advertiserStat.totalAdSpend),
                  true,
                  true
                )}
              />
              <InfoBox
                bgColor="bg-yellow-gradient"
                infoTitle="Total Impressions"
                infoValue={formatNum(
                  advertiserStat.totalImpression,
                  false,
                  true
                )}
              />
            </div>
            <div className="mt-16 bg-black rounded-md border-2 border-247-dark-text mb-10">
              <TableHeader
                defaultFilters={DEFAULT_FILTERS}
                setSelectedStatusFilter={setCampaignStatus}
                setSelectedTypeFilter={setCampaignType}
                selectedStatusFilter={campaignStatus}
                selectedTypeFilter={campaignType}
                statusFilters={statusFilters}
                typeFilters={typeFilters}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
              <DataTable headers={tableHeaders} loadingData={fetchingCampaigns}>
                {fetchingCampaigns && (
                  <div className="flex items-center justify-center w-full absolute py-14">
                    <Spinner size="large" />
                  </div>
                )}
                {!fetchingCampaigns &&
                  campaigns.length > 0 &&
                  campaigns.map((campaign, idx) => {
                    const duration = calculateDistanceInDays(
                      campaign.duration[1],
                      campaign.duration[0]
                    );

                    return (
                      <tr
                        className={
                          checkedCampaigns.includes(idx)
                            ? "text-lg bg-gray-700 border border-247-dark-text cursor-pointer hover:bg-gray-700"
                            : "text-lg border border-247-dark-text odd:bg-247-dark-accent3 cursor-pointer hover:bg-gray-700"
                        }
                        key={`campaign${campaign.id}`}
                      >
                        <td className="px-3 py-5">
                          <Checkbox
                            checked={
                              checkedCampaigns.includes(idx) ? true : false
                            }
                            iconColor="#CACACA"
                            name={campaign.id.toLowerCase()}
                            handleChange={() => toggleCampaignCheck(idx)}
                          />
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center ">
                            {campaign.campaignName}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={classNames(
                                "rounded-full",
                                "w-4",
                                "h-4",
                                {
                                  "bg-active-gradient":
                                    campaign.status === "active",
                                },
                                {
                                  "bg-closed-gradient":
                                    campaign.status === "closed",
                                },
                                {
                                  "bg-paused-gradient":
                                    campaign.status === "paused",
                                }
                              )}
                            ></div>
                            {startCase(campaign.status)}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {campaign.advertiser.companyName}
                        </td>
                        <td className="px-6 py-5">
                          {Number(
                            campaign.campaignStat.impressions
                          ).toLocaleString("en-NG")}
                        </td>
                        <td className="px-6 py-5">
                          {`${duration} ${duration > 1 ? "days" : "day"}`}
                        </td>
                        <td className="px-6 py-5">
                          {Number(
                            convertKoboToNaira(
                              campaign?.campaignStat?.adSpend?.amountInKobo || 0
                            )
                          ).toLocaleString("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          })}
                        </td>
                      </tr>
                    );
                  })}
              </DataTable>
              {!fetchingCampaigns &&
                !retrieveErrorMsg &&
                campaigns.length === 0 && (
                  <div className="w-full py-9">
                    <NoDataBox
                      title="No Campaign Found"
                      subtitle="We cannot find any campaign that fits your criteria."
                    />
                  </div>
                )}
              {!fetchingCampaigns && retrieveErrorMsg && (
                <div className="w-full py-9">
                  <ErrorBox
                    title="Error Retrieving Campaigns"
                    subtitle={retrieveErrorMsg}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-end mb-20">
              {campaigns && campaigns.length > 0 && (
                <Pagination
                  activePage={currentPage}
                  dataLength={campaignSize}
                  firstItem={indexOfFirstItem + 1}
                  lastItem={indexOfLastItem}
                  pages={pages}
                  setActivePage={setCurrentPage}
                  setVisibleRows={setShownRows}
                  visibleRows={shownRows}
                />
              )}
            </div>
          </>
        )}
      </Dashboard>
    )
  );
};

export default AdvertiserDetail;
