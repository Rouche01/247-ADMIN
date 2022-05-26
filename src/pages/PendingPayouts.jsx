import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import DataTable from "../components/DataTable";
import Pagination from "../components/uiComponents/Pagination";
import Checkbox from "../components/uiComponents/Checkbox";
import InfoBox from "../components/InfoBox";
import { formatNum } from "../utils/numFormatter";
import { usePagination } from "../hooks/pagination";
import { drivers } from "../utils/dummyData";
import { MdKeyboardBackspace } from "react-icons/md";
import { IoIosCash } from "react-icons/io";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import SettlePayoutModal from "../components/uiComponents/SettlePayoutModal";
import ConfirmationModal from "../components/uiComponents/ConfirmationModal";

const tableHeaders = ["", "Driver", "Total Earning", "Pending Payout"];

const CustomHeader = ({ goToPrevPage }) => {
  return (
    <div className="flex items-center">
      <button
        onClick={goToPrevPage}
        className="bg-transparent border-0 outline-none focus:outline-none"
      >
        <MdKeyboardBackspace color="#f00" size={28} />
      </button>
      <h3 className="text-2xl text-247-gray font-semibold ml-14">
        Pending Payouts
      </h3>
    </div>
  );
};

const PendingPayouts = () => {
  const [checkedDrivers, setCheckedDrivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);

  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedDriverDeets, setSelectedDriverDeets] = useState();

  const history = useHistory();
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

  const handlePayoutBtn = (data) => {
    console.log(data, "confirming payout");
    setSettleModalOpen(false);
    setConfirmModalOpen(true);
  };

  const payoutDriver = () => {
    console.log("paying driver...");
    setConfirmModalOpen(false);
  };

  return (
    <Dashboard
      customHeader={<CustomHeader goToPrevPage={() => history.goBack()} />}
    >
      <div className="mt-16 grid grid-cols-3 gap-6">
        <InfoBox
          bgColor="bg-blue-gradient"
          infoTitle="Pending Payout"
          infoValue={formatNum(123760.87, true, true)}
        />
        <InfoBox
          bgColor="bg-green-gradient"
          infoTitle="Settled Payout"
          infoValue={formatNum(820557.45, true, true)}
        />
      </div>
      <div className="mt-10 bg-247-secondary rounded-md border-2 border-247-dark-text mb-10">
        <DataTable headers={tableHeaders}>
          {currentList.map((driver, idx) => (
            <tr
              className={
                checkedDrivers.includes(idx)
                  ? "text-lg bg-gray-700 border border-247-dark-text  hover:bg-gray-700"
                  : "text-lg border border-247-dark-text odd:bg-247-dark-accent3  hover:bg-gray-700"
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
                {formatNum(driver.pendingPayout, true, true)}
              </td>
              <td className="px-6 py-5">
                <RoundedBtnWithIcon
                  onBtnClick={() => {
                    setSelectedDriverDeets({
                      bankName: "Access Bank",
                      accountNumber: "2591678234",
                      accountName: driver.name,
                      pendingPayout: driver.pendingPayout,
                    });
                    setSettleModalOpen(true);
                  }}
                  title="Settle"
                />
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
      <SettlePayoutModal
        isOpen={settleModalOpen}
        setIsOpen={setSettleModalOpen}
        driverDeets={selectedDriverDeets}
        handlePayout={handlePayoutBtn}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        text={`Continue payout for ${selectedDriverDeets?.accountName}`}
        handleConfirmation={payoutDriver}
        icon={<IoIosCash size={32} color="#fff" />}
      />
    </Dashboard>
  );
};

export default PendingPayouts;
