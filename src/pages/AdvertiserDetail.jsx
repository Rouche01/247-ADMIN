import React, { useState, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { FiDownloadCloud } from "react-icons/fi";
import Dashboard from "../components/Dashboard";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import InfoBox from "../components/InfoBox";
import Checkbox from "../components/uiComponents/Checkbox";
import TableHeader from "../components/TableHeader";
import Pagination from "../components/uiComponents/Pagination";
import DataTable from "../components/DataTable";
import { typeFilters, statusFilters } from "../utils/constants";
import { formatNum } from "../utils/numFormatter";
import { usePagination } from "../hooks/pagination";
import moment from "moment";
import classNames from "classnames/bind";
import kebabCase from "lodash/kebabCase";
import startCase from "lodash/startCase";

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

const AdvertiserDetail = () => {
  const history = useHistory();
  const { state } = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);
  const [checkedCampaigns, setCheckedCampaigns] = useState([]);

  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState(typeFilters[0]);
  const [campaignDateRange, setCampaignDateRange] = useState([
    moment().subtract(12, "M"),
    moment(),
  ]);

  const filteredList = useMemo(() => {
    return selectedStatusFilter === "all"
      ? state.advtr.campaigns
      : state.advtr.campaigns.filter(
          (item) => item.status === selectedStatusFilter
        );
  }, [selectedStatusFilter, state.advtr.campaigns]);

  const { currentList, indexOfFirstItem, indexOfLastItem, pages } =
    usePagination(currentPage, shownRows, filteredList);

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
    <Dashboard
      customHeader={
        <CustomHeader
          goToPrevPage={() => history.goBack()}
          advertiserName={state.advtr.name}
        />
      }
    >
      <div className="mt-20 grid grid-cols-3 gap-6">
        <InfoBox
          bgColor="bg-blue-gradient"
          infoTitle="Total No. of Campaigns"
          infoValue={formatNum(35)}
        />
        <InfoBox
          bgColor="bg-green-gradient"
          infoTitle="Total Spend"
          infoValue={formatNum(2300000, true)}
        />
        <InfoBox
          bgColor="bg-yellow-gradient"
          infoTitle="Total Impressions"
          infoValue={formatNum(2200000, false, true)}
        />
      </div>
      <div className="mt-16 bg-black rounded-md border-2 border-247-dark-text mb-10">
        <TableHeader
          setSelectedStatusFilter={setSelectedStatusFilter}
          setSelectedTypeFilter={setSelectedTypeFilter}
          selectedStatusFilter={selectedStatusFilter}
          selectedTypeFilter={selectedTypeFilter}
          statusFilters={statusFilters}
          typeFilters={typeFilters}
          dateFilter={campaignDateRange}
          setDateFilter={setCampaignDateRange}
        />
        <DataTable headers={tableHeaders}>
          {currentList.map((campaign, idx) => (
            <tr
              className={
                checkedCampaigns.includes(idx)
                  ? "text-lg bg-gray-700 border border-247-dark-text cursor-pointer hover:bg-gray-700"
                  : "text-lg border border-247-dark-text odd:bg-247-dark-accent3 cursor-pointer hover:bg-gray-700"
              }
              key={`campaign${campaign.id}`}
              onClick={() =>
                history.push({
                  pathname: `/campaign/${kebabCase(campaign.name)}-${
                    campaign.id
                  }`,
                  state: {
                    campaign,
                  },
                })
              }
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
                <div className="flex items-center ">{campaign.name}</div>
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
                      { "bg-closed-gradient": campaign.status === "closed" },
                      { "bg-paused-gradient": campaign.status === "paused" }
                    )}
                  ></div>
                  {startCase(campaign.status)}
                </div>
              </td>
              <td className="px-6 py-5">{campaign.advertiser}</td>
              <td className="px-6 py-5">
                {Number(campaign.impressions).toLocaleString("en-NG")}
              </td>
              <td className="px-6 py-5">{campaign.duration}</td>
              <td className="px-6 py-5">
                {Number(campaign.adSpend).toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
      <div className="flex items-center justify-end mb-20">
        <Pagination
          activePage={currentPage}
          dataLength={filteredList.length}
          firstItem={indexOfFirstItem + 1}
          lastItem={indexOfLastItem}
          pages={pages}
          setActivePage={setCurrentPage}
          setVisibleRows={setShownRows}
          visibleRows={shownRows}
        />
      </div>
    </Dashboard>
  );
};

export default AdvertiserDetail;
