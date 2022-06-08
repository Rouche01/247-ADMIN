import React from "react";
import classNames from "classnames/bind";

const TabFilters = ({
  defaultFilters,
  filterList,
  activeFilter,
  setActiveFilter,
}) => {
  return (
    <div className="bg-247-tab-bg rounded-lg p-3">
      <ul className="flex text-white gap-3 text-lg">
        {filterList.map(({ label, id }) => (
          <li key={id}>
            <button
              onClick={() => {
                id === defaultFilters.status
                  ? setActiveFilter(undefined)
                  : setActiveFilter(id);
              }}
              className={classNames(
                "py-1",
                "px-2",
                "rounded-md",
                {
                  "bg-247-tab-bg": id !== activeFilter,
                },
                { "bg-247-red-straight": id === activeFilter }
              )}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabFilters;
