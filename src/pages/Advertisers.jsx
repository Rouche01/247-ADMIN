import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import InfoBox from "../components/InfoBox";
import TableHeader from "../components/TableHeader";
import { useDateRange } from "../hooks/dateRange";
import { advertisers } from "../utils/dummyData";
import { usePagination } from "../hooks/pagination";
import DataTable from "../components/DataTable";
import { HiOutlineExternalLink } from "react-icons/hi";
import Checkbox from "../components/uiComponents/Checkbox";
import Pagination from "../components/uiComponents/Pagination";
import ColorTag from "../components/uiComponents/ColorTag";
import Button from "../components/uiComponents/Button";
import CenterModal from "../components/uiComponents/CenterModal";
import { Link } from "react-router-dom";
import history from "../utils/history";

const tableHeaders = [
  "",
  "Advertiser",
  "No. of Campaigns",
  "Total Impressions",
  "Total Interactions",
  "Ad Spend",
];

const AdvertiserModal = ({ modalIsOpen, setIsOpen, advertiser }) => {
  return (
    <CenterModal modalOpen={modalIsOpen} setModalOpen={setIsOpen}>
      <h2 className="text-5xl font-bold text-247-gray-accent2">
        {advertiser.name}
      </h2>
      <div className="mt-6">
        <h4 className="flex items-center text-247-gray-accent2 text-2xl font-bold">
          Campaigns{" "}
          <HiOutlineExternalLink
            onClick={() =>
              history.push(
                `/campaigns?advertiser=${advertiser.name
                  .toLowerCase()
                  .replace(" ", "-")}`,
                { advertiser: advertiser.name }
              )
            }
            className="ml-3 cursor-pointer"
          />
        </h4>
        <div className="flex items-center gap-5 mt-2">
          <ColorTag color="bg-247-green" tagName="Active: " tagValue="12" />
          <ColorTag color="bg-247-red" tagName="Blocked: " tagValue="4" />
          <ColorTag
            color="bg-247-gray-accent5"
            tagName="Pending: "
            tagValue="1"
          />
        </div>
      </div>
      <div className="mt-6">
        <h4 className="flex items-center text-247-gray-accent2 text-2xl font-bold">
          Analytics
        </h4>
        <div className="flex items-center gap-5 mt-2">
          <ColorTag
            tagName="Impressions: "
            tagValue={Number(advertiser.totalImpressions).toLocaleString(
              "en-US"
            )}
          />
          <ColorTag
            tagName="Interactions: "
            tagValue={Number(advertiser.totalInteractions).toLocaleString(
              "en-US"
            )}
          />
        </div>
      </div>
      <div className="mt-6">
        <h4 className="flex items-center text-247-gray-accent2 text-2xl font-bold">
          Total Ad Spend
        </h4>
        <p className="mt-2 text-247-gray-accent2 font-bold">
          {Number(advertiser.adSpend).toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
            // minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
      <Button
        type="submit"
        className={["bg-247-red", "block", "mt-12", "px-12"]}
      >
        Terminate
      </Button>
    </CenterModal>
  );
};

const Advertisers = () => {
  const { startDate, endDate, setDateRange } = useDateRange();
  const [checkedAdvertisers, setCheckedAdvertisers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [advertiserDetails, setAdvertiserDetails] = useState({});

  const { currentList, indexOfFirstItem, indexOfLastItem, pages } =
    usePagination(currentPage, shownRows, advertisers);

  const toggleAdvertiserCheck = (idx) => {
    if (checkedAdvertisers.includes(idx)) {
      const index = checkedAdvertisers.indexOf(idx);
      const newCheckedAdvertisers = [...checkedAdvertisers];
      newCheckedAdvertisers.splice(index, 1);
      setCheckedAdvertisers(newCheckedAdvertisers);
    } else {
      setCheckedAdvertisers([...checkedAdvertisers, idx]);
    }
  };

  return (
    <>
      <Dashboard pageTitle="Advertisers">
        <div className="grid grid-cols-3 gap-6 mt-16">
          <InfoBox infoTitle="Number of Advertisers" infoValue={1291} />
          <InfoBox
            infoTitle="Total Revenue"
            infoValue={8655247.87}
            isCurrency
          />
          <InfoBox infoTitle="Total Impressions" infoValue={27009} />
        </div>
        <div className="mt-10 rounded-md bg-247-secondary border-2 border-247-dark-text mb-10">
          <TableHeader
            startDate={startDate}
            endDate={endDate}
            setRange={setDateRange}
            tableTitle="Advertisers Info"
          />
          <DataTable headers={tableHeaders}>
            {currentList.map((advtr, idx) => (
              <tr
                className={
                  checkedAdvertisers.includes(idx)
                    ? "text-lg text-247-green"
                    : "text-lg"
                }
                key={`advertisers_${idx}`}
              >
                <td className="border border-247-dark-text px-3 py-2">
                  <Checkbox
                    checked={checkedAdvertisers.includes(idx) ? true : false}
                    iconColor="#CACACA"
                    name={advtr.name.toLowerCase()}
                    handleChange={() => toggleAdvertiserCheck(idx)}
                  />
                </td>
                <td className="border border-247-dark-text px-6 py-2">
                  <div
                    className="flex items-center hover:text-247-red cursor-pointer"
                    onClick={() => {
                      setIsOpen(true);
                      setAdvertiserDetails(advtr);
                    }}
                  >
                    {advtr.name} <HiOutlineExternalLink className="ml-3" />
                  </div>
                </td>
                <td className="border border-247-dark-text px-6 py-2">
                  <Link
                    to={{
                      pathname: "/campaigns",
                      search: `?advertiser=${advtr.name
                        .toLowerCase()
                        .replace(" ", "-")}`,
                      state: { advertiser: advtr.name },
                    }}
                  >
                    <div className="flex items-center hover:text-247-red cursor-pointer">
                      {Number(advtr.numOfCampaigns).toLocaleString("en-US")}{" "}
                      <HiOutlineExternalLink className="ml-3" />
                    </div>
                  </Link>
                </td>
                <td className="border border-247-dark-text px-6 py-2">
                  {Number(advtr.totalImpressions).toLocaleString("en-US")}
                </td>
                <td className="border border-247-dark-text px-6 py-2">
                  {Number(advtr.totalInteractions).toLocaleString("en-US")}
                </td>
                <td className="border border-247-dark-text px-6 py-2">
                  {Number(advtr.adSpend).toLocaleString("en-NG", {
                    currency: "NGN",
                    style: "currency",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </DataTable>
        </div>
        <div className="flex items-center justify-end mb-20">
          <Pagination
            activePage={currentPage}
            dataLength={advertisers.length}
            firstItem={indexOfFirstItem + 1}
            lastItem={indexOfLastItem}
            pages={pages}
            setActivePage={setCurrentPage}
            setVisibleRows={setShownRows}
            visibleRows={shownRows}
          />
        </div>
      </Dashboard>
      <AdvertiserModal
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
        advertiser={advertiserDetails}
      />
    </>
  );
};

export default Advertisers;
