import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import startCase from "lodash/startCase";
import Dashboard from "../components/Dashboard";
import DataTable from "../components/DataTable";
import InfoBox from "../components/InfoBox";
import DriversTableHeader from "../components/DriversTableHeader";
import { driverStatusFilters } from "../utils/constants";
import { drivers } from "../utils/dummyData";
import Checkbox from "../components/uiComponents/Checkbox";
import Pagination from "../components/uiComponents/Pagination";
import { usePagination } from "../hooks/pagination";
import { formatNum } from "../utils/numFormatter";

const tableHeaders = [
  "",
  "Driver",
  "Status",
  "Location",
  "Total Trips",
  "Total Earnings",
  "Pending Payout",
];

const Drivers = () => {
  const [checkedDrivers, setCheckedDrivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);

  const [selectedDriverFilter, setSelectedDriverFilter] = useState("all");

  const filteredList = useMemo(() => {
    return selectedDriverFilter === "all"
      ? drivers
      : drivers.filter((item) => item.status === selectedDriverFilter);
  }, [selectedDriverFilter]);

  const { currentList, indexOfFirstItem, indexOfLastItem, pages } =
    usePagination(currentPage, shownRows, filteredList);

  const toggleDriversCheck = (idx) => {
    if (checkedDrivers.includes(idx)) {
      const index = checkedDrivers.indexOf(idx);
      const newCheckedDrivers = [...checkedDrivers];
      newCheckedDrivers.splice(index, 1);
      setCheckedDrivers(newCheckedDrivers);
    } else {
      setCheckedDrivers([...checkedDrivers, idx]);
    }
  };

  const history = useHistory();

  return (
    <>
      <Dashboard pageTitle="Drivers">
        <div className="grid grid-cols-3 gap-6 mt-16">
          <InfoBox
            bgColor="bg-blue-gradient"
            infoTitle="Total No. of Drivers"
            infoValue={formatNum(800, false, true)}
          />
          <InfoBox
            bgColor="bg-green-gradient"
            infoTitle="Settled Payout"
            infoValue={formatNum(820557.45, true, true)}
          />
          <InfoBox
            bgColor="bg-yellow-gradient"
            infoTitle="Pending Payout"
            infoValue={formatNum(123760.87, true, true)}
          />
        </div>
        <div className="mt-10 bg-247-secondary rounded-md border-2 border-247-dark-text mb-10">
          <DriversTableHeader
            selectedStatusFilter={selectedDriverFilter}
            setSelectedStatusFilter={setSelectedDriverFilter}
            statusFilters={driverStatusFilters}
            navigateToPayoutRequests={() => history.push("/pending-payouts")}
          />
          <DataTable headers={tableHeaders}>
            {currentList.map((driver, idx) => (
              <tr
                className={
                  checkedDrivers.includes(idx)
                    ? "text-lg bg-gray-700 border border-247-dark-text cursor-pointer hover:bg-gray-700"
                    : "text-lg border border-247-dark-text odd:bg-247-dark-accent3 cursor-pointer hover:bg-gray-700"
                }
                key={`driver_${driver.id}`}
              >
                <td className="px-3 py-5">
                  <Checkbox
                    checked={checkedDrivers.includes(idx) ? true : false}
                    iconColor="#CACACA"
                    name={driver.id.toLowerCase()}
                    handleChange={() => toggleDriversCheck(idx)}
                  />
                </td>
                <td className="px-6 py-5">
                  <div>
                    {driver.name}
                    <span className="block text-sm font-light">
                      {driver.email}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={classNames(
                        "rounded-full",
                        "w-4",
                        "h-4",
                        {
                          "bg-active-gradient": driver.status === "active",
                        },
                        { "bg-closed-gradient": driver.status === "suspended" },
                        { "bg-paused-gradient": driver.status === "pending" }
                      )}
                    ></div>
                    {startCase(driver.status)}
                  </div>
                </td>
                <td className="px-6 py-5">{driver.location}</td>
                <td className="px-6 py-5">
                  {formatNum(driver.totalTrips, false, true)}
                </td>
                <td className="px-6 py-5">
                  {formatNum(driver.earnings, true, true)}
                </td>
                <td className="px-6 py-5">
                  {formatNum(driver.pendingPayout, true, true)}
                </td>
              </tr>
            ))}
          </DataTable>
        </div>
        <div className="flex items-center justify-end mb-20">
          <Pagination
            activePage={currentPage}
            dataLength={drivers.length}
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

export default Drivers;
