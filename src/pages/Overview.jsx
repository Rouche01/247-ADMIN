import React, { useEffect, useContext, useMemo } from "react";
import {
  MdOutlineArrowUpward,
  MdOutlineArrowDownward,
  MdOutlineCalendarToday,
} from "react-icons/md";
import $ from "jquery";
import moment from "moment";
import format from "date-fns/format";
import PlaceholderLoading from "react-placeholder-loading";

import { Context as CampaignContext } from "../context/CampaignContext";
import { Context as DriverContext } from "../context/DriverContext";
import { Context as RevenueContext } from "../context/RevenueContext";
import Dashboard from "../components/Dashboard";
import ImpressionChart from "../components/ImpressionChart";
import { convertKoboToNaira, formatNum } from "../utils/numFormatter";
import ChartUpIndicator from "../components/uiComponents/ChartUpIndicator";
import ChartDownIndicator from "../components/uiComponents/ChartDownIndicator";
import { useMomentDateQueryParamWithDefaultValue } from "../hooks/useQueryParam";
import { transformChartDate } from "../utils/date";
import { rangeEndDate, rangeStartDate } from "../utils/campaignStat";

const TWELVE_MONTH_AGO = moment().subtract(12, "M");
const NOW = moment();

const DEFAULT_FILTERS = {
  startDate: TWELVE_MONTH_AGO,
  endDate: NOW,
};

const StatBoxPlaceholder = () => {
  return (
    <div>
      <PlaceholderLoading
        width="100%"
        height="160px"
        shape="rect"
        colorEnd="#1A1C1F"
        colorStart="#1D2023"
      />
    </div>
  );
};

const StatBox = ({
  statName,
  statInfo,
  bgColor,
  statChange,
  indicatorColor,
}) => {
  return (
    <div
      className={`px-9 py-8 w-full bg-bottom ${bgColor} bg-cover rounded-md border border-247-box-border col-span-1 relative`}
    >
      <h3 className="text-white font-customRoboto text-2xl">{statName}</h3>
      <div className="mt-12 flex relative items-center">
        <h2 className="text-white font-bold text-5xl">{statInfo}</h2>
        {statChange > 0 ? (
          <MdOutlineArrowUpward
            className="absolute left-56 text-247-increment-green"
            size={48}
          />
        ) : (
          <MdOutlineArrowDownward
            className="absolute left-56 text-247-decrement-red"
            size={48}
          />
        )}
      </div>
      <div
        className="absolute top-1/2 right-10 mt-2"
        style={{ transform: "translateY(-50%)" }}
      >
        {statChange > 0 ? (
          <ChartUpIndicator color={indicatorColor} />
        ) : (
          <ChartDownIndicator color={indicatorColor} />
        )}
      </div>
    </div>
  );
};

const Overview = () => {
  const {
    state: {
      fetchingTotalSize,
      campaignTotalSize,
      activeCampaignsSize,
      fetchingActiveCampaigns,
      fetchingDailyStat,
      campaignDailyStat,
    },
    fetchTotalCampaignSize,
    fetchActiveCampaigns,
    fetchDailyCampaignStat,
  } = useContext(CampaignContext);

  const {
    state: { fetchingRevenue, totalRevenue },
    fetchRevenue,
  } = useContext(RevenueContext);

  const {
    state: { driverListSize, fetchingDrivers },
    fetchDrivers,
  } = useContext(DriverContext);

  const loadingStats = useMemo(
    () =>
      fetchingTotalSize ||
      fetchingActiveCampaigns ||
      fetchingDrivers ||
      fetchingRevenue ||
      fetchingDailyStat,
    [
      fetchingActiveCampaigns,
      fetchingDrivers,
      fetchingRevenue,
      fetchingTotalSize,
      fetchingDailyStat,
    ]
  );

  const impressionChartData = useMemo(
    () =>
      campaignDailyStat.map((stat) => ({
        impressions: stat.impressions,
        date: transformChartDate(stat.date),
      })),
    [campaignDailyStat]
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
      startDate: format(startDate.toDate(), "yyyy/MM/dd"),
      endDate: format(endDate.toDate(), "yyyy/MM/dd"),
    }),
    [startDate, endDate]
  );

  const fetchOverviewData = async (filterValues) => {
    await Promise.all([
      fetchActiveCampaigns({ ...filterValues }),
      fetchTotalCampaignSize({ ...filterValues }),
      fetchDrivers({ status: "approved", ...filterValues }),
      fetchRevenue(),
    ]);
  };

  useEffect(() => {
    fetchOverviewData(filterValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues]);

  // const handleCheckBoxes = () => {
  //   if (totalChecked) {
  //     setTotalChecked(false);
  //     setPerDayChecked(true);
  //   }
  //   if (perDayChecked) {
  //     setPerDayChecked(false);
  //     setTotalChecked(true);
  //   }
  // };

  useEffect(() => {
    $('button[name="daterange"]').daterangepicker(
      {
        opens: "left",
        ranges: {
          "Last 7 Days": [moment().subtract(6, "days"), moment()],
          "Last 14 Days": [moment().subtract(13, "days"), moment()],
          "Last 30 Days": [moment().subtract(29, "days"), moment()],
          "Last 3 months": [moment().subtract(3, "M"), moment()],
          "Last 12 months": [moment().subtract(12, "M"), moment()],
          "Month to date": [moment().startOf("month"), moment()],
          "All time": [moment().subtract(2, "Y"), moment()],
        },
        startDate: startDate,
        endDate: endDate,
        alwaysShowCalendars: true,
        applyButtonClasses: "range-apply-btn",
      },
      (start, end, _label) => {
        setStartDate(start);
        setEndDate(end);
      }
    );
    fetchDailyCampaignStat({
      startDate: rangeStartDate,
      endDate: rangeEndDate,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dashboard pageTitle="Overview">
      <div className="flex items-center w-full justify-between">
        <div className="mt-16 mb-8">
          <h2 className="text-4xl text-white">Hello, Welcome back</h2>
          <p className="text-white text-base">Today is Sunday, 22 February</p>
        </div>
        <div className="flex">
          <button
            className="bg-transparent px-5 py-3 rounded-md text-white border border-white flex items-center text-base"
            name="daterange"
          >
            <MdOutlineCalendarToday size={20} className="mr-3" />
            Set Date Filter
          </button>
        </div>
      </div>
      {loadingStats ? (
        <div className="grid grid-cols-2 gap-8">
          {Array.from({ length: 4 }, (_, i) => i + 1).map((val) => (
            <StatBoxPlaceholder key={val} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-8">
          <StatBox
            indicatorColor="#045684"
            bgColor="bg-blue-gradient"
            statChange={5.23}
            statInfo={formatNum(campaignTotalSize)}
            statName="Total Campaigns"
          />
          <StatBox
            indicatorColor="#035524"
            bgColor="bg-green-gradient"
            statChange={-1.08}
            statInfo={formatNum(activeCampaignsSize)}
            statName="Active Campaigns"
          />
          <StatBox
            indicatorColor="#000000"
            bgColor="bg-yellow-gradient"
            statChange={1.75}
            statInfo={formatNum(driverListSize)}
            statName="Active Drivers"
          />
          <StatBox
            indicatorColor="#21A0AA"
            bgColor="bg-orange-gradient"
            statChange={1.75}
            statInfo={formatNum(convertKoboToNaira(totalRevenue), true)}
            statName="Total Revenue"
          />
        </div>
      )}
      <div className="mt-10 mb-20 w-full bg-247-secondary rounded-md border-2 border-247-dark-text pl-6 pr-10 py-10">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-white font-customRoboto text-3xl font-medium">
            Impressions
          </h3>
          {/* <div className="flex items-center">
            <div className="flex items-center">
              <Checkbox
                checked={totalChecked}
                handleChange={handleCheckBoxes}
                name="total"
                value="Total"
                iconColor="#4FB81D"
              />
              <Checkbox
                checked={perDayChecked}
                handleChange={handleCheckBoxes}
                name="perDay"
                value="Per day"
                iconColor="#FF0000"
              />
            </div>
          </div> */}
        </div>
        <ImpressionChart
          data={impressionChartData}
          xDataKey="date"
          yDataKey="impressions"
        />
      </div>
    </Dashboard>
  );
};

export default Overview;
