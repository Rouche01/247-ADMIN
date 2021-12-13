import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import DataTable from "../components/DataTable";
import InfoBox from "../components/InfoBox";
import TableHeader from "../components/TableHeader";
import { useDateRange } from "../hooks/dateRange";
import { usePagination } from "../hooks/pagination";
import { campaigns } from "../utils/dummyData";
import Checkbox from "../components/uiComponents/Checkbox";
import { HiOutlineExternalLink } from "react-icons/hi";
import Pagination from "../components/uiComponents/Pagination";
import { useLocation } from "react-router";

const tableHeaders = [
  "",
  "Status",
  "Campaign Name",
  "ID",
  "Impressions",
  "Interactions",
  "Vehicles",
];

const Campaign = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);
  const [checkedCampaigns, setCheckedCampaigns] = useState([]);

  const { state } = useLocation();
  console.log(state?.advertiser);

  const { startDate, endDate, setDateRange } = useDateRange();
  const { currentList, indexOfFirstItem, indexOfLastItem, pages } =
    usePagination(currentPage, shownRows, campaigns);

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
        <InfoBox infoTitle="Total Campaigns" infoValue="86675" />
        <InfoBox infoTitle="Active Campaigns" infoValue="84178" />
        <InfoBox infoTitle="Pending Campaigns" infoValue="2455" />
      </div>
      <div className="mt-10 bg-247-secondary rounded-md border-2 border-247-dark-text mb-10">
        <TableHeader
          startDate={startDate}
          endDate={endDate}
          setRange={setDateRange}
          tableTitle="Campaign Info"
        />
        <DataTable headers={tableHeaders}>
          {currentList.map((campaign, idx) => (
            <tr
              className={
                checkedCampaigns.includes(idx)
                  ? "text-lg text-247-green"
                  : "text-lg"
              }
              key={`campaign${campaign.id}`}
            >
              <td className="border border-247-dark-text px-3 py-2">
                <Checkbox
                  checked={checkedCampaigns.includes(idx) ? true : false}
                  iconColor="#CACACA"
                  name={campaign.id.toLowerCase()}
                  handleChange={() => toggleCampaignCheck(idx)}
                />
              </td>
              <td className="border border-247-dark-text px-6 py-2">
                <span
                  className={`${
                    campaign.status === "approved"
                      ? "bg-247-green"
                      : campaign.status === "stopped"
                      ? "bg-247-red"
                      : "bg-247-dark-accent2"
                  } rounded-full text-base text-white px-2.5 py-0.5`}
                >
                  {campaign.status}
                </span>
              </td>
              <td className="border border-247-dark-text px-6 py-2">
                <div className="flex items-center hover:text-247-red cursor-pointer">
                  {campaign.name} <HiOutlineExternalLink className="ml-3" />
                </div>
              </td>
              <td className="border border-247-dark-text px-6 py-2">
                {campaign.id}
              </td>
              <td className="border border-247-dark-text px-6 py-2">
                {Number(campaign.impressions).toLocaleString("en-US")}
              </td>
              <td className="border border-247-dark-text px-6 py-2">
                {Number(campaign.interactions).toLocaleString("en-US")}
              </td>
              <td className="border border-247-dark-text px-6 py-2">
                {Number(campaign.vehicles).toLocaleString("en-US")}
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
