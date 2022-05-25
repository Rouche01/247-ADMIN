import React from "react";

const DataTable = ({ headers, children }) => {
  return (
    <table className="font-customRoboto w-full text-white border-collapse">
      <thead>
        <tr className="border border-247-dark-text bg-247-red-straight">
          {headers.map((header, idx) => (
            <th
              key={`${header}_${idx}`}
              className="text-left px-6 py-4 text-lg"
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
