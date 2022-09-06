import classNames from "classnames";
import startCase from "lodash/startCase";
import React, { useState } from "react";
import { BiCaretLeft, BiCaretRight } from "react-icons/bi";

import { SETTLE_MODAL_TYPE } from "../../pages/DriverDetail";
import { transformTransactionDate } from "../../utils/date";
import { convertKoboToNaira, formatNum } from "../../utils/numFormatter";
import CenterModal from "./CenterModal";
import { usePagination } from "../../hooks/pagination";

const SHOWN_ROWS = 5;

const PayoutHistoryModal = ({
  isOpen,
  setIsOpen,
  payouts,
  setSettleModalOpen,
  setSelectedPayout,
  setPayoutHistoryQueryParam,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { currentList, pages } = usePagination(
    currentPage,
    SHOWN_ROWS,
    payouts,
    payouts.length
  );

  return (
    <CenterModal
      cb={() => setPayoutHistoryQueryParam("")}
      modalOpen={isOpen}
      setModalOpen={setIsOpen}
    >
      <h2 className="text-white text-center text-2xl font-semibold">
        Payout History
      </h2>
      <div className="mt-14 w-full">
        <ul>
          {currentList.map((item) => (
            <li className="odd:bg-247-dark-accent3 even:bg-black first:rounded-t-lg last:rounded-b-lg">
              <div className="py-4 px-7 grid grid-cols-4 items-center gap-4 ">
                <div className="col-span-2">
                  <h4 className="text-white text-base font-semibold">
                    {formatNum(convertKoboToNaira(item.amount), true, true)}
                  </h4>
                  <p className="text-247-timestamp-color text-sm font-semibold">
                    {transformTransactionDate(item.createdAt)}
                  </p>
                </div>
                <div className="col-span-1">
                  <button
                    className={classNames(
                      "text-base",
                      "px-4",
                      "py-2",
                      "rounded",
                      "text-white",
                      "bg-247-red-straight",
                      "disabled:bg-247-inactive-btn",
                      "disabled:cursor-not-allowed"
                    )}
                    disabled={
                      item.status === "success" || item.status === "failed"
                    }
                    onClick={() => {
                      setPayoutHistoryQueryParam("");
                      setIsOpen(false);
                      setSelectedPayout(item);
                      setSettleModalOpen({
                        open: true,
                        type: SETTLE_MODAL_TYPE.SINGLE,
                      });
                    }}
                  >
                    Settle
                  </button>
                </div>
                <div className="col-span-1">
                  <p
                    className={classNames("text-base", "font-bold", {
                      "text-247-red-straight": item.status === "pending",
                      "text-247-inactive-link": item.status === "failed",
                      "text-247-increment-green": item.status === "success",
                    })}
                  >
                    {startCase(item.status)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between mt-9">
        <button
          onClick={() => setIsOpen(false)}
          className="text-base text-white font-semibold py-3 px-5 rounded bg-247-red-straight"
        >
          Close
        </button>
        <div className="flex items-center gap-7">
          <span className="text-247-transparent">
            Page <span className="font-bold">{currentPage}</span> of {pages}
          </span>
          <div>
            <button
              onClick={() => {
                if (currentPage !== 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              className={classNames([
                "px-3",
                "rounded-l-md",
                "py-1",
                "border-2",
                "border-247-dark-text",
                "disabled:cursor-not-allowed",
              ])}
              disabled={currentPage === 1}
            >
              <BiCaretLeft
                size={20}
                color={currentPage === 1 ? "#CACACA" : "#FFFFFF"}
              />
            </button>
            <button
              onClick={() => {
                if (pages !== currentPage) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              className="px-3 rounded-r-md py-1 border-2 border-l-0 border-247-dark-text disabled:cursor-not-allowed"
              disabled={currentPage === pages}
            >
              <BiCaretRight
                size={20}
                color={currentPage === pages ? "#CACACA" : "#FFFFFF"}
              />
            </button>
          </div>
        </div>
      </div>
    </CenterModal>
  );
};

export default PayoutHistoryModal;
