import React from "react";
import classNames from "classnames";

const ResourceMeta = ({ label, value, last, valueColor }) => {
  return (
    <div className={classNames("text-white", { "mb-7": !last })}>
      <h5 className="text-base font-light mb-2">{label}</h5>
      <h3
        className="text-xl font-medium"
        style={valueColor && { color: valueColor }}
      >
        {value}
      </h3>
    </div>
  );
};

export default ResourceMeta;
