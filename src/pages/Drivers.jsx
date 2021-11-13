import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import DataTable from "../components/DataTable";
import InfoBox from "../components/InfoBox";
import TableHeader from "../components/TableHeader";
import { useDateRange } from "../hooks/dateRange";
import { drivers } from "../utils/dummyData";
import Checkbox from "../components/uiComponents/Checkbox";
import { HiOutlineExternalLink } from "react-icons/hi";
import Pagination from "../components/uiComponents/Pagination";
import { usePagination } from "../hooks/pagination";

const tableHeaders = [
  "",
  "Driver",
  "Driver ID",
  "Total Trips",
  "Earnings",
  "Pending Payout",
];

const Drivers = () => {
  const { startDate, endDate, setDateRange } = useDateRange();
  const [checkedDrivers, setCheckedDrivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);

  const { currentList, indexOfFirstItem, indexOfLastItem, pages } =
    usePagination(currentPage, shownRows, drivers);

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

  return (
    <Dashboard pageTitle="Drivers">
      <div className="grid grid-cols-3 gap-6 mt-16">
        <InfoBox infoTitle="Number of Drivers" infoValue="197291" />
        <InfoBox infoTitle="Settled Payout" infoValue="820557.45" isCurrency />
        <InfoBox infoTitle="Pending Payout" infoValue="123760.87" isCurrency />
      </div>
      <div className="mt-10 rounded-md border-2 border-247-dark-text mb-10">
        <TableHeader
          endDate={endDate}
          startDate={startDate}
          setRange={setDateRange}
          tableTitle="Drivers Info"
        />
        <DataTable headers={tableHeaders}>
          {currentList.map((driver, idx) => (
            <tr
              className={
                checkedDrivers.includes(idx)
                  ? "text-lg text-247-green"
                  : "text-lg"
              }
              key={`driver_${driver.id}`}
            >
              <td className="border border-247-dark-text px-3 py-2">
                <Checkbox
                  checked={checkedDrivers.includes(idx) ? true : false}
                  iconColor="#CACACA"
                  name={driver.id.toLowerCase()}
                  handleChange={() => toggleDriversCheck(idx)}
                />
              </td>
              <td className="border border-247-dark-text px-6 py-2">
                <div className="flex items-center hover:text-247-red cursor-pointer">
                  {driver.name} <HiOutlineExternalLink className="ml-3" />
                </div>
              </td>
              <td className="border border-247-dark-text px-6 py-2">
                {driver.id}
              </td>
              <td className="border border-247-dark-text px-6 py-2">
                {Number(driver.totalTrips).toLocaleString("en-US")}
              </td>
              <td className="border border-247-dark-text px-6 py-2">
                {Number(driver.earnings).toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="border border-247-dark-text px-6 py-2">
                {Number(driver.pendingPayout).toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
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
  );
};

export default Drivers;
