import classNames from "classnames";
import React from "react";

const DataTable = ({ headers, children, loadingData }) => {
  return (
    <table className="font-customRoboto w-full text-white border-collapse relative">
      <thead>
        <tr className="border border-247-dark-text bg-247-red-straight">
          {headers.map((header, idx) => (
            <th
              key={`${header}_${idx}`}
              className={classNames(
                "text-left",
                "py-4",
                "text-lg",
                {
                  "px-2": idx === 0,
                },
                {
                  "px-6": idx !== 0,
                }
              )}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={classNames({ "h-48": loadingData })}>{children}</tbody>
    </table>
  );
};

export default DataTable;
