import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import format from "date-fns/format";
import Dashboard from "../components/Dashboard";
import DataTable from "../components/DataTable";
import InfoBox from "../components/InfoBox";
import TableHeader from "../components/TableHeader";
import { usePagination } from "../hooks/pagination";
import {
  useMomentDateQueryParamWithDefaultValue,
  useQueryParamWithDefaultValue,
} from "../hooks/useQueryParam";
import Checkbox from "../components/uiComponents/Checkbox";
import Pagination from "../components/uiComponents/Pagination";
import { Context as CampaignContext } from "../context/CampaignContext";
import { formatNum } from "../utils/numFormatter";
import { typeFilters, statusFilters } from "../utils/constants";
import classNames from "classnames";
import startCase from "lodash/startCase";
import omitBy from "lodash/omitBy";
import moment from "moment";
import Spinner from "../components/uiComponents/Spinner";
import NoDataBox from "../components/uiComponents/NoDataBox";
import ErrorBox from "../components/uiComponents/ErrorBox";
import { calculateDistance } from "../utils/date";

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

const DEFAULT_FILTERS = {
  status: "all",
  type: "all",
  startDate: TWELVE_MONTH_AGO,
  endDate: NOW,
};

const Campaign = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);
  const [checkedCampaigns, setCheckedCampaigns] = useState([]);

  const history = useHistory();

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

  const filterValues = useMemo(
    () => ({
      status: campaignStatus,
      type: campaignType,
      startDate: format(startDate.toDate(), "yyyy/MM/dd"),
      endDate: format(endDate.toDate(), "yyyy/MM/dd"),
    }),
    [campaignStatus, campaignType, startDate, endDate]
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
      campaigns,
      campaignSize,
      retrieveErrorMsg,
    },
  } = useContext(CampaignContext);

  const loadCampaigns = async () => {
    const sanitizedFilterValues = omitBy(
      filterValues,
      (item) => item && item === "all"
    );
    fetchCampaigns({ ...sanitizedFilterValues, ...paginationOptions });
  };

  useEffect(() => {
    loadCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues, paginationOptions]);

  const { indexOfFirstItem, indexOfLastItem, pages } = usePagination(
    currentPage,
    shownRows,
    campaigns,
    campaignSize
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

  return (
    <Dashboard fetchCampaignsFn={loadCampaigns}>
      <div className="grid grid-cols-3 gap-6 mt-16">
        <InfoBox
          bgColor="bg-blue-gradient"
          infoTitle="Total Revenue"
          infoValue={formatNum(12850000, true)}
          statChange={2.4}
        />
        <InfoBox
          infoTitle="Active Campaigns"
          infoValue={formatNum(5500)}
          bgColor="bg-green-gradient"
          statChange={-2.5}
        />
        <InfoBox
          infoTitle="Total Campaigns"
          infoValue={formatNum(1200)}
          bgColor="bg-yellow-gradient"
          statChange={2.4}
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
              const duration = calculateDistance(
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
                  key={`campaign${campaign.campaignID}`}
                  onClick={(ev) => {
                    if (!ev.target.closest(".toggle-check")) {
                      history.push({
                        pathname: `/campaign/${campaign.campaignID}`,
                      });
                    }
                  }}
                >
                  <td className="px-3 py-5 toggle-check">
                    <Checkbox
                      checked={checkedCampaigns.includes(idx) ? true : false}
                      iconColor="#CACACA"
                      name={campaign.id.toLowerCase()}
                      handleChange={(ev) => {
                        toggleCampaignCheck(idx);
                      }}
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
                  <td className="px-6 py-5">{duration}</td>
                  <td className="px-6 py-5">
                    {Number(campaign.adBudget).toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </td>
                </tr>
              );
            })}
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
    </Dashboard>
  );
};

export default Campaign;
