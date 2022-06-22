import React, { useState, useMemo, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import omitBy from "lodash/omitBy";
import { MdKeyboardBackspace } from "react-icons/md";
import { FiDownloadCloud } from "react-icons/fi";
import Dashboard from "../components/Dashboard";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import InfoBox from "../components/InfoBox";
import Checkbox from "../components/uiComponents/Checkbox";
import TableHeader from "../components/TableHeader";
import Spinner from "../components/uiComponents/Spinner";
import Pagination from "../components/uiComponents/Pagination";
import { Context as CamapignContext } from "../context/CampaignContext";
import { Context as AdvertiserContext } from "../context/AdvertiserContext";
import DataTable from "../components/DataTable";
import ErrorBox from "../components/uiComponents/ErrorBox";
import NoDataBox from "../components/uiComponents/NoDataBox";
import { typeFilters, statusFilters } from "../utils/constants";
import { formatNum } from "../utils/numFormatter";
import { usePagination } from "../hooks/pagination";
import moment from "moment";
import classNames from "classnames/bind";
import startCase from "lodash/startCase";
import { useQueryParamWithDefaultValue } from "../hooks/useQueryParam";
import {
  calculateTotalAdSpend,
  calculateTotalImpression,
} from "../utils/transformAdvertiser";

const tableHeaders = [
  "",
  "Campaign Name",
  "Status",
  "Advertiser",
  "Impressions",
  "Duration",
  "Ad Spend",
];

const CustomHeader = ({ advertiserName, goToPrevPage }) => {
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
        onBtnClick={() => console.log("Handle report downloading")}
      />
    </div>
  );
};

const DEFAULT_FILTERS = {
  status: "all",
  type: "all",
};

const AdvertiserDetail = () => {
  const history = useHistory();
  const { advertiserId } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);
  const [checkedCampaigns, setCheckedCampaigns] = useState([]);

  const [campaignDateRange, setCampaignDateRange] = useState([
    moment().subtract(12, "M"),
    moment(),
  ]);

  const [campaignStatus, setCampaignStatus] = useQueryParamWithDefaultValue(
    "status",
    DEFAULT_FILTERS.status
  );

  const [campaignType, setCampaignType] = useQueryParamWithDefaultValue(
    "type",
    DEFAULT_FILTERS.type
  );

  const {
    state: { loading: fetchingAdvertiser, advertiser },
    fetchAdvertiserById,
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
          }
        : {},
    [campaignStatus, campaignType, advertiser]
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
    state: { loading: fetchingCampaigns, campaigns, retrieveErrorMsg },
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
  }, [filterValues, paginationOptions, advertiser]);

  const { indexOfFirstItem, indexOfLastItem, pages } = usePagination(
    currentPage,
    shownRows,
    campaigns
  );

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

  // will improve this later
  if (fetchingAdvertiser && !advertiser) return <Spinner />;

  return (
    advertiser && (
      <Dashboard
        customHeader={
          <CustomHeader
            goToPrevPage={() => history.push("/advertisers")}
            advertiserName={advertiser?.companyName}
          />
        }
      >
        <div className="mt-20 grid grid-cols-3 gap-6">
          <InfoBox
            bgColor="bg-blue-gradient"
            infoTitle="Total No. of Campaigns"
            infoValue={advertiser?.campaigns.length}
          />
          <InfoBox
            bgColor="bg-green-gradient"
            infoTitle="Total Spend"
            infoValue={formatNum(advertiserStat.totalAdSpend, true)}
          />
          <InfoBox
            bgColor="bg-yellow-gradient"
            infoTitle="Total Impressions"
            infoValue={formatNum(advertiserStat.totalImpression, false, true)}
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
            dateFilter={campaignDateRange}
            setDateFilter={setCampaignDateRange}
          />
          <DataTable headers={tableHeaders} loadingData={fetchingCampaigns}>
            {fetchingCampaigns && (
              <div className="flex items-center justify-center w-full absolute py-14">
                <Spinner size="large" />
              </div>
            )}
            {!fetchingCampaigns &&
              campaigns.length > 0 &&
              campaigns.map((campaign, idx) => (
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
                      checked={checkedCampaigns.includes(idx) ? true : false}
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
                            "bg-active-gradient": campaign.status === "active",
                          },
                          {
                            "bg-closed-gradient": campaign.status === "closed",
                          },
                          { "bg-paused-gradient": campaign.status === "paused" }
                        )}
                      ></div>
                      {startCase(campaign.status)}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {campaign.advertiser.companyName}
                  </td>
                  <td className="px-6 py-5">
                    {Number(campaign.campaignStat.impressions).toLocaleString(
                      "en-NG"
                    )}
                  </td>
                  <td className="px-6 py-5">{10}</td>
                  <td className="px-6 py-5">
                    {Number(campaign.campaignStat.adSpend).toLocaleString(
                      "en-NG",
                      {
                        style: "currency",
                        currency: "NGN",
                      }
                    )}
                  </td>
                </tr>
              ))}
          </DataTable>
          {!fetchingCampaigns && !retrieveErrorMsg && campaigns.length === 0 && (
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
          <Pagination
            activePage={currentPage}
            dataLength={campaigns.length}
            firstItem={indexOfFirstItem + 1}
            lastItem={indexOfLastItem}
            pages={pages}
            setActivePage={setCurrentPage}
            setVisibleRows={setShownRows}
            visibleRows={shownRows}
          />
        </div>
      </Dashboard>
    )
  );
};

export default AdvertiserDetail;
