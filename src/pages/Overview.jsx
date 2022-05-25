import React, { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import {
  MdOutlineArrowUpward,
  MdOutlineArrowDownward,
  MdOutlineCalendarToday,
} from "react-icons/md";
import ImpressionChart from "../components/ImpressionChart";
import Checkbox from "../components/uiComponents/Checkbox";
import { impressionData } from "../utils/dummyData";
import { formatNum } from "../utils/numFormatter";
import ChartUpIndicator from "../components/uiComponents/ChartUpIndicator";
import ChartDownIndicator from "../components/uiComponents/ChartDownIndicator";
import $ from "jquery";
import moment from "moment";

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
  const [totalChecked, setTotalChecked] = useState(true);
  const [perDayChecked, setPerDayChecked] = useState(false);

  const [dateRange, setDateRange] = useState([
    moment().subtract(12, "M"),
    moment(),
  ]);

  const handleCheckBoxes = () => {
    if (totalChecked) {
      setTotalChecked(false);
      setPerDayChecked(true);
    }
    if (perDayChecked) {
      setPerDayChecked(false);
      setTotalChecked(true);
    }
  };

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
        startDate: dateRange[0],
        endDate: dateRange[1],
        alwaysShowCalendars: true,
        applyButtonClasses: "range-apply-btn",
      },
      (start, end, _label) => {
        setDateRange([start, end]);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dashboard pageTitle="Overview">
      <div className="flex items-center w-full justify-between">
        <div className="mt-16 mb-8">
          <h2 className="text-4xl text-white">Hello, Welcome back</h2>
          <p className="text-white text-base">Today is Sunday, 22 February</p>
        </div>
        <button
          className="bg-transparent px-5 py-3 rounded-md text-white border border-white flex items-center text-base"
          name="daterange"
        >
          <MdOutlineCalendarToday size={20} className="mr-3" />
          Set Date Filter
        </button>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <StatBox
          indicatorColor="#045684"
          bgColor="bg-blue-gradient"
          statChange={5.23}
          statInfo={formatNum(1200)}
          statName="Total Campaigns"
        />
        <StatBox
          indicatorColor="#035524"
          bgColor="bg-green-gradient"
          statChange={-1.08}
          statInfo={formatNum(680)}
          statName="Active Campaigns"
        />
        <StatBox
          indicatorColor="#000000"
          bgColor="bg-yellow-gradient"
          statChange={1.75}
          statInfo={formatNum(800)}
          statName="Active Drivers"
        />
        <StatBox
          indicatorColor="#21A0AA"
          bgColor="bg-orange-gradient"
          statChange={1.75}
          statInfo={formatNum(12850000, true)}
          statName="Total Revenue"
        />
      </div>
      <div className="mt-10 mb-20 w-full bg-247-secondary rounded-md border-2 border-247-dark-text pl-6 pr-10 py-10">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-white font-customRoboto text-2xl font-medium">
            Impressions
          </h3>
          <div className="flex items-center">
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
          </div>
        </div>
        <ImpressionChart
          data={impressionData}
          xDataKey="date"
          yDataKey="impressions"
        />
      </div>
    </Dashboard>
  );
};

export default Overview;
