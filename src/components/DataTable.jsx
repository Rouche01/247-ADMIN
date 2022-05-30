import classNames from "classnames";
import React from "react";

const DataTable = ({ headers, children, roundedHeader }) => {
  return (
    <table className="font-customRoboto w-full text-white border-collapse">
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
                  "px-3": idx === 0,
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
      <tbody>{children}</tbody>
    </table>
  );
};

export default DataTable;
