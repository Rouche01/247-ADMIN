import React from "react";
import RoundedBtnWithIcon from "./uiComponents/RoundedBtnWithIcon";
import TabFilters from "./uiComponents/TabFilters";

const DriversTableHeader = ({
  statusFilters,
  selectedStatusFilter,
  setSelectedStatusFilter,
  navigateToPayoutRequests,
}) => {
  return (
    <div className="flex pt-3 px-8 mb-3 items-center justify-between">
      <TabFilters
        filterList={statusFilters}
        activeFilter={selectedStatusFilter}
        setActiveFilter={setSelectedStatusFilter}
      />
      <RoundedBtnWithIcon
        title="See payout requests"
        onBtnClick={navigateToPayoutRequests}
      />
    </div>
  );
};

export default DriversTableHeader;
