import React, { useContext, useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import differenceInSeconds from "date-fns/differenceInSeconds";
import Dashboard from "../components/Dashboard";
import InfoBox from "../components/InfoBox";
import { Context as AdvertiserContext } from "../context/AdvertiserContext";
import { usePagination } from "../hooks/pagination";
import DataTable from "../components/DataTable";
import Checkbox from "../components/uiComponents/Checkbox";
import Pagination from "../components/uiComponents/Pagination";
import Spinner from "../components/uiComponents/Spinner";
import NoDataBox from "../components/uiComponents/NoDataBox";
import ErrorBox from "../components/uiComponents/ErrorBox";
import { convertSecToHHMMSS, formatNum } from "../utils/numFormatter";
import {
  calculateTotalAdSpend,
  calculateTotalImpression,
} from "../utils/transformAdvertiser";

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

  const {
    state: {
      loading: fetchingAdvertisers,
      advertisers,
      advertiserSize,
      fetchError,
    },
    fetchAdvertisers,
  } = useContext(AdvertiserContext);

  const paginationOptions = useMemo(
    () => ({
      limit: shownRows,
      skip: (currentPage - 1) * shownRows,
    }),
    [shownRows, currentPage]
  );

  useEffect(() => {
    fetchAdvertisers({ ...paginationOptions });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationOptions]);

  console.log(advertisers);

  const { indexOfFirstItem, indexOfLastItem, pages } = usePagination(
    currentPage,
    shownRows,
    advertisers,
    advertiserSize
  );

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
        <div className="mt-16 rounded-md bg-black border-2 border-247-dark-text mb-10">
          <DataTable headers={tableHeaders} loadingData={fetchingAdvertisers}>
            {fetchingAdvertisers && (
              <div className="flex items-center justify-center w-full absolute py-14">
                <Spinner size="large" />
              </div>
            )}
            {!fetchingAdvertisers &&
              advertisers.length > 0 &&
              advertisers.map((advtr, idx) => {
                const impressions = calculateTotalImpression(advtr);
                const totalAdSpend = calculateTotalAdSpend(advtr);

                const totalDurationInSecs = advtr.campaigns
                  .map((campaign) =>
                    differenceInSeconds(
                      new Date(campaign.duration[1]),
                      new Date(campaign.duration[0])
                    )
                  )
                  .reduce((prev, curr) => prev + curr, 0);

                const formattedDuration =
                  convertSecToHHMMSS(totalDurationInSecs);

                return (
                  <tr
                    onClick={(ev) => {
                      if (!ev.target.closest(".toggle-check")) {
                        history.push({
                          pathname: `/advertiser/${advtr.advertiserId}`,
                        });
                      }
                    }}
                    className={
                      checkedAdvertisers.includes(idx)
                        ? "text-lg bg-gray-700 border border-247-dark-text cursor-pointer hover:bg-gray-700"
                        : "text-lg border border-247-dark-text odd:bg-247-dark-accent3 cursor-pointer hover:bg-gray-700"
                    }
                    key={advtr.id}
                  >
                    <td className="px-3 py-5 toggle-check">
                      <Checkbox
                        checked={
                          checkedAdvertisers.includes(idx) ? true : false
                        }
                        iconColor="#CACACA"
                        name={advtr.id.toLowerCase()}
                        handleChange={() => toggleAdvertiserCheck(idx)}
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        {advtr.companyName}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        {Number(advtr.campaigns.length).toLocaleString("en-US")}{" "}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {Number(impressions).toLocaleString("en-US")}
                    </td>
                    <td className="px-6 py-5">
                      {Number(totalAdSpend).toLocaleString("en-NG", {
                        currency: "NGN",
                        style: "currency",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-5">{formattedDuration}</td>
                  </tr>
                );
              })}
          </DataTable>
          {!fetchingAdvertisers && !fetchError && advertisers.length === 0 && (
            <div className="w-full py-9">
              <NoDataBox
                title="No Campaign Found"
                subtitle="We cannot find any campaign that fits your criteria."
              />
            </div>
          )}
          {!fetchingAdvertisers && fetchError && (
            <div className="w-full py-9">
              <ErrorBox
                title="Error Retrieving Campaigns"
                subtitle={fetchError}
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-end mb-20">
          {advertisers && advertisers.length > 0 && (
            <Pagination
              activePage={currentPage}
              dataLength={advertiserSize}
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
    </>
  );
};

export default Advertisers;
