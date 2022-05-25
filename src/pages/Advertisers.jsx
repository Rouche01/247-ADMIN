import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import InfoBox from "../components/InfoBox";
import { advertisers } from "../utils/dummyData";
import { usePagination } from "../hooks/pagination";
import DataTable from "../components/DataTable";
import Checkbox from "../components/uiComponents/Checkbox";
import Pagination from "../components/uiComponents/Pagination";
import { formatNum } from "../utils/numFormatter";
import kebabCase from "lodash/kebabCase";

const tableHeaders = [
  "",
  "Advertiser",
  "No. of Campaigns",
  "Total Impressions",
  "Total Spend",
  "Total Duration",
];

const Advertisers = () => {
  const [checkedAdvertisers, setCheckedAdvertisers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);

  const history = useHistory();

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
          <InfoBox
            bgColor="bg-blue-gradient"
            infoTitle="No. of Advertisers"
            infoValue={formatNum(1291)}
          />
          <InfoBox
            bgColor="bg-green-gradient"
            infoTitle="Total Revenue"
            infoValue={formatNum(12850000, true)}
          />
          <InfoBox
            bgColor="bg-yellow-gradient"
            infoTitle="Total Campaigns"
            infoValue={formatNum(27009, false, true)}
          />
        </div>
        <div className="mt-16 rounded-md bg-247-secondary border-2 border-247-dark-text mb-10">
          <DataTable headers={tableHeaders}>
            {currentList.map((advtr, idx) => (
              <tr
                onClick={() =>
                  history.push({
                    pathname: `/advertiser/${kebabCase(advtr.name)}`,
                    state: {
                      advtr,
                    },
                  })
                }
                className={
                  checkedAdvertisers.includes(idx)
                    ? "text-lg bg-gray-700 border border-247-dark-text cursor-pointer hover:bg-gray-700"
                    : "text-lg border border-247-dark-text odd:bg-247-dark-accent3 cursor-pointer hover:bg-gray-700"
                }
                key={`advertisers_${idx}`}
              >
                <td className="px-3 py-5">
                  <Checkbox
                    checked={checkedAdvertisers.includes(idx) ? true : false}
                    iconColor="#CACACA"
                    name={advtr.name.toLowerCase()}
                    handleChange={() => toggleAdvertiserCheck(idx)}
                  />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center">{advtr.name}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center">
                    {Number(advtr.numOfCampaigns).toLocaleString("en-US")}{" "}
                  </div>
                </td>
                <td className="px-6 py-5">
                  {Number(advtr.totalImpressions).toLocaleString("en-US")}
                </td>
                <td className="px-6 py-5">
                  {Number(advtr.totalSpend).toLocaleString("en-NG", {
                    currency: "NGN",
                    style: "currency",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-5">{advtr.totalDuration}</td>
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
    </>
  );
};

export default Advertisers;
