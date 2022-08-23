import React from "react";
import classNames from "classnames";

const ResourceMeta = ({
  label,
  value,
  last,
  valueColor,
  isButton,
  btnAction,
}) => {
  return (
    <div className={classNames("text-white", { "mb-7": !last })}>
      <h5 className="text-base font-light mb-2">{label}</h5>
      {isButton ? (
        <button
          className="text-xl font-semibold cursor-pointer underline text-247-red"
          onClick={btnAction}
        >
          {value}
        </button>
      ) : (
        <h3
          className="text-xl font-medium"
          style={valueColor && { color: valueColor }}
        >
          {value}
        </h3>
      )}
    </div>
  );
};

export default ResourceMeta;
