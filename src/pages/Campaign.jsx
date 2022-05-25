import React, { useMemo, useState } from "react";
import Dashboard from "../components/Dashboard";
import DataTable from "../components/DataTable";
import InfoBox from "../components/InfoBox";
import TableHeader from "../components/TableHeader";
import { usePagination } from "../hooks/pagination";
import { campaigns } from "../utils/dummyData";
import Checkbox from "../components/uiComponents/Checkbox";
import Pagination from "../components/uiComponents/Pagination";
import { useLocation } from "react-router";
import { formatNum } from "../utils/numFormatter";
import classNames from "classnames";
import startCase from "lodash/startCase";
import moment from "moment";

const tableHeaders = [
  "",
  "Campaign Name",
  "Status",
  "Advertiser",
  "Impressions",
  "Duration",
  "Ad Spend",
];

const statusFilters = [
  { label: "All", id: "all" },
  { label: "Active", id: "active" },
  { label: "Closed", id: "closed" },
  { label: "Paused", id: "paused" },
];

const typeFilters = [
  { label: "All Types", value: "all types" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
];

const Campaign = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);
  const [checkedCampaigns, setCheckedCampaigns] = useState([]);

  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState(typeFilters[0]);
  const [campaignDateRange, setCampaignDateRange] = useState([
    moment().subtract(12, "M"),
    moment(),
  ]);

  const { state } = useLocation();
  console.log(state?.advertiser);

  const filteredList = useMemo(() => {
    return selectedStatusFilter === "all"
      ? campaigns
      : campaigns.filter((item) => item.status === selectedStatusFilter);
  }, [selectedStatusFilter]);

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
    <Dashboard pageTitle="Campaigns" titleTag={state?.advertiser}>
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
  );
};

export default Campaign;
