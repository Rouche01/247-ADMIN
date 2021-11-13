import React from "react";

const DataTable = ({ headers, children }) => {
  return (
    <table className="font-customRoboto w-full text-247-gray-accent2 border border-247-dark-text border-collapse">
      <thead>
        <tr className="border border-247-dark-text">
          {headers.map((header, idx) => (
            <th
              key={`${header}_${idx}`}
              className="border border-247-dark-text text-left px-6 py-4 text-lg"
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
