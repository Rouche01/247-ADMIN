import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import { FiChevronDown } from "react-icons/fi";
import { MdOutlineArrowUpward, MdOutlineArrowDownward } from "react-icons/md";
import ImpressionChart from "../components/ImpressionChart";
import DatePicker from "react-datepicker";
import Checkbox from "../components/uiComponents/Checkbox";
import { useDateRange } from "../hooks/dateRange";
import { impressionData } from "../utils/dummyData";
import { formatNum } from "../utils/numFormatter";
import ChartUpIndicator from "../components/uiComponents/ChartUpIndicator";
import ChartDownIndicator from "../components/uiComponents/ChartDownIndicator";

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

  const { startDate, endDate, setDateRange } = useDateRange();

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

  return (
    <Dashboard pageTitle="Overview">
      <div className="grid grid-cols-2 gap-8 mt-16">
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
            <div className="relative mr-8">
              <DatePicker
                className="z-20"
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
              />
              <FiChevronDown
                className="absolute top-1/4 right-3 cursor-pointer z-0"
                size={20}
                color="#979797"
              />
            </div>
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
