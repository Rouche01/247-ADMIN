import React, { useContext, useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import differenceInSeconds from "date-fns/differenceInSeconds";
import PlaceholderLoading from "react-placeholder-loading";

import Dashboard from "../components/Dashboard";
import InfoBox from "../components/InfoBox";
import { Context as AdvertiserContext } from "../context/AdvertiserContext";
import { Context as RevenueContext } from "../context/RevenueContext";
import { Context as CampaignContext } from "../context/CampaignContext";
import { usePagination } from "../hooks/pagination";
import DataTable from "../components/DataTable";
import Checkbox from "../components/uiComponents/Checkbox";
import Pagination from "../components/uiComponents/Pagination";
import Spinner from "../components/uiComponents/Spinner";
import NoDataBox from "../components/uiComponents/NoDataBox";
import ErrorBox from "../components/uiComponents/ErrorBox";
import {
  convertKoboToNaira,
  convertSecToHHMMSS,
  formatNum,
} from "../utils/numFormatter";
import {
  calculateTotalAdSpend,
  calculateTotalImpression,
} from "../utils/transformAdvertiser";

const StatBoxPlaceholder = () => {
  return (
    <div>
      <PlaceholderLoading
        width="100%"
        height="140px"
        shape="rect"
        colorEnd="#1A1C1F"
        colorStart="#1D2023"
      />
    </div>
  );
};

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
    state: { fetchingTotalSize: fetchingTotalCampaigns, campaignTotalSize },
    fetchTotalCampaignSize,
  } = useContext(CampaignContext);

  const {
    state: { fetchingRevenue, totalRevenue },
    fetchRevenue,
  } = useContext(RevenueContext);

  const {
    state: {
      loading: fetchingAdvertisers,
      advertisers,
      advertiserSize,
      fetchError,
      advertiserTotalSize,
      fetchingTotalSize,
    },
    fetchAdvertisers,
    fetchTotalAdvertisersSize,
  } = useContext(AdvertiserContext);

  const loadingStats = useMemo(
    () => fetchingTotalSize || fetchingTotalCampaigns || fetchingRevenue,
    [fetchingTotalCampaigns, fetchingTotalSize, fetchingRevenue]
  );

  useEffect(() => {
    (async () => {
      await Promise.all([
        fetchTotalAdvertisersSize(),
        fetchTotalCampaignSize(),
        fetchRevenue(),
      ]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {loadingStats ? (
          <div className="grid grid-cols-3 gap-6 mt-16">
            {Array.from({ length: 3 }, (_, i) => i + 1).map((val) => (
              <StatBoxPlaceholder key={val} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 mt-16">
            <InfoBox
              bgColor="bg-blue-gradient"
              infoTitle="No. of Advertisers"
              infoValue={formatNum(advertiserTotalSize)}
            />
            <InfoBox
              bgColor="bg-green-gradient"
              infoTitle="Total Revenue"
              infoValue={formatNum(convertKoboToNaira(totalRevenue), true)}
            />
            <InfoBox
              bgColor="bg-yellow-gradient"
              infoTitle="Total Campaigns"
              infoValue={formatNum(campaignTotalSize, false, true)}
            />
          </div>
        )}
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
                      {Number(convertKoboToNaira(totalAdSpend)).toLocaleString(
                        "en-NG",
                        {
                          currency: "NGN",
                          style: "currency",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
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
