import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import { HiOutlineExternalLink } from "react-icons/hi";
import { FiChevronDown } from "react-icons/fi";
import ImpressionChart from "../components/ImpressionChart";
import DatePicker from "react-datepicker";
import Checkbox from "../components/uiComponents/Checkbox";
import sub from "date-fns/sub";

const impressionData = [
  {
    date: "31/01",
    impressions: 730,
    interactions: 240,
  },
  {
    date: "01/02",
    impressions: 1560,
    interactions: 350,
  },
  {
    date: "02/02",
    impressions: 722,
    interactions: 190,
  },
  {
    date: "03/02",
    impressions: 3000,
    interactions: 780,
  },
  {
    date: "04/02",
    impressions: 750,
    interactions: 320,
  },
  {
    date: "05/02",
    impressions: 1510,
    interactions: 488,
  },
  {
    date: "06/02",
    impressions: 2880,
    interactions: 590,
  },
  {
    date: "07/02",
    impressions: 889,
    interactions: 286,
  },
];

const StatBox = ({
  statName,
  statChange,
  statInfo,
  statBg,
  bgVector,
  statBtn,
}) => {
  return (
    <div
      className={`px-8 py-6 w-full bg-bottom ${bgVector} bg-cover rounded-md ${statBg} border-2 border-247-dark-text col-span-1`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-white font-customRoboto text-2xl">{statName}</h3>
        <p className="text-white text-lg text-opacity-40">{statChange}</p>
      </div>
      {statBtn ? (
        <Link className="bg-247-dark-accent1 text-white px-8 py-2 mt-8 inline-flex items-center rounded-md text-xl border border-247-dark-text">
          {statBtn}
          <span className="ml-2">
            <HiOutlineExternalLink />
          </span>
        </Link>
      ) : (
        <h2 className="text-4xl mt-8 text-white font-bold">{statInfo}</h2>
      )}
    </div>
  );
};

const Overview = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [totalChecked, setTotalChecked] = useState(false);
  const [perDayChecked, setPerDayChecked] = useState(false);

  useEffect(() => {
    const today = new Date();
    const minus7days = sub(today, { days: 7 });
    setDateRange([minus7days, today]);
  }, []);

  return (
    <Dashboard pageTitle="Overview">
      <div className="grid grid-cols-2 gap-8 mt-16">
        <StatBox
          statBg="bg-247-accent1"
          bgVector="bg-subtle-curve"
          statChange="+ 5.23%"
          statInfo="1, 291"
          statName="Advertisers"
        />
        <StatBox
          statBg="bg-247-accent1"
          bgVector="bg-subtle-curve"
          statChange="+ 1.08%"
          statInfo="197, 291"
          statName="Drivers"
        />
        <StatBox
          statBg="bg-247-accent1"
          bgVector="bg-subtle-curve"
          statChange="- 1.75%"
          statInfo="86, 675"
          statName="Campaigns"
        />
        <StatBox
          statBg="bg-247-red"
          bgVector="bg-subtle-red-curve"
          statInfo="86, 675"
          statName="Schedule Ad Play"
          statBtn="Schedule"
        />
      </div>
      <div className="mt-10 mb-20 w-full bg-247-accent1 rounded-md border-2 border-247-dark-text pl-6 pr-10 py-10">
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
                setChecked={setTotalChecked}
                name="total"
                value="Total"
                iconColor="#4FB81D"
              />
              <Checkbox
                checked={perDayChecked}
                setChecked={setPerDayChecked}
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
