import React, { useContext, useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { IoIosCash } from "react-icons/io";
import PlaceholderLoading from "react-placeholder-loading";

import Dashboard from "../components/Dashboard";
import DataTable from "../components/DataTable";
import Pagination from "../components/uiComponents/Pagination";
import Checkbox from "../components/uiComponents/Checkbox";
import Spinner from "../components/uiComponents/Spinner";
import InfoBox from "../components/InfoBox";
import { convertKoboToNaira, formatNum } from "../utils/numFormatter";
import { usePagination } from "../hooks/pagination";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import SettlePayoutModal from "../components/uiComponents/SettlePayoutModal";
import ConfirmationModal from "../components/uiComponents/ConfirmationModal";
import NoDataBox from "../components/uiComponents/NoDataBox";
import ErrorBox from "../components/uiComponents/ErrorBox";
import { Context as PayoutContext } from "../context/PayoutContext";

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

  const {
    state: {
      fetchingTotalSettled,
      totalSettled,
      fetchingTotalPending,
      totalPending,
      fetchingPayouts,
      payoutRequests,
      payoutsListSize,
      fetchPayoutsError,
    },
    getTotalSettledPayouts,
    getTotalPendingPayouts,
    fetchPayoutRequests,
  } = useContext(PayoutContext);

  const loadingStats = useMemo(
    () => fetchingTotalSettled || fetchingTotalPending,
    [fetchingTotalSettled, fetchingTotalPending]
  );

  const { indexOfFirstItem, indexOfLastItem, pages } = usePagination(
    currentPage,
    shownRows,
    payoutRequests,
    payoutsListSize
  );

  useEffect(() => {
    (async () => {
      await Promise.all([
        getTotalSettledPayouts(),
        getTotalPendingPayouts(),
        fetchPayoutRequests({ status: "pending" }),
      ]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {loadingStats ? (
        <div className="mt-16 grid grid-cols-3 gap-6">
          {Array.from({ length: 2 }, (_, i) => i + 1).map((val) => (
            <StatBoxPlaceholder key={val} />
          ))}
        </div>
      ) : (
        <div className="mt-16 grid grid-cols-3 gap-6">
          <InfoBox
            bgColor="bg-blue-gradient"
            infoTitle="Pending Payout"
            infoValue={formatNum(convertKoboToNaira(totalPending), true, true)}
          />
          <InfoBox
            bgColor="bg-green-gradient"
            infoTitle="Settled Payout"
            infoValue={formatNum(convertKoboToNaira(totalSettled), true, true)}
          />
        </div>
      )}
      <div className="mt-10 bg-247-secondary rounded-md border-2 border-247-dark-text mb-10">
        <DataTable headers={tableHeaders} loadingData={fetchingPayouts}>
          {fetchingPayouts && (
            <div className="flex items-center justify-center w-full absolute py-14">
              <Spinner size="large" />
            </div>
          )}
          {!fetchingPayouts &&
            payoutRequests.length > 0 &&
            payoutRequests.map((request, idx) => (
              <tr
                className={
                  checkedDrivers.includes(idx)
                    ? "text-lg bg-gray-700 border border-247-dark-text  hover:bg-gray-700"
                    : "text-lg border border-247-dark-text odd:bg-247-dark-accent3  hover:bg-gray-700"
                }
                key={`payout_${request.id}`}
              >
                <td className="px-3 py-5">
                  <Checkbox
                    checked={checkedDrivers.includes(idx) ? true : false}
                    iconColor="#CACACA"
                    name={request.id.toLowerCase()}
                    handleChange={() => toggleDriversCheck(idx)}
                  />
                </td>
                <td className="px-6 py-5">
                  <div>
                    {request?.driver?.name}
                    <span className="block text-sm font-light">
                      {request?.driver?.email}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {formatNum(convertKoboToNaira(request?.amount), true, true)}
                </td>
                <td className="px-6 py-5">
                  <RoundedBtnWithIcon
                    onBtnClick={() => {
                      setSelectedDriverDeets({
                        bankName: request?.driver?.bankInformation?.bank?.name,
                        accountNumber:
                          request?.driver?.bankInformation?.accountNumber,
                        accountName:
                          request?.driver?.bankInformation?.accountName,
                        pendingPayout: convertKoboToNaira(request?.amount),
                      });
                      setSettleModalOpen(true);
                    }}
                    title="Settle"
                  />
                </td>
              </tr>
            ))}
        </DataTable>
        {!fetchingPayouts && !fetchPayoutsError && payoutRequests.length === 0 && (
          <div className="w-full py-9">
            <NoDataBox
              title="No Campaign Found"
              subtitle="We cannot find any campaign that fits your criteria."
            />
          </div>
        )}
        {!fetchingPayouts && fetchPayoutsError && (
          <div className="w-full py-9">
            <ErrorBox
              title="Error Retrieving Campaigns"
              subtitle={fetchPayoutsError}
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-end mb-20">
        {payoutRequests && payoutsListSize > 0 && (
          <Pagination
            activePage={currentPage}
            dataLength={payoutsListSize}
            firstItem={indexOfFirstItem + 1}
            lastItem={indexOfLastItem}
            pages={pages}
            setActivePage={setCurrentPage}
            setVisibleRows={setShownRows}
            visibleRows={shownRows}
          />
        )}
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
