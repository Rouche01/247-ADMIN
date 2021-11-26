import React from "react";

const InfoBox = ({ infoTitle, infoValue, isCurrency }) => {
  return (
    <div className="bg-247-secondary rounded-md border-2 border-247-dark-text px-6 py-4">
      <h4 className="text-247-gray-accent2 font-customRoboto font-medium text-xl">
        {infoTitle}
      </h4>
      <h2 className="mt-4 font-customRoboto text-247-gray-accent2 text-3xl font-bold">
        {isCurrency
          ? Number(infoValue).toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : Number(infoValue).toLocaleString("en-US")}
      </h2>
    </div>
  );
};

export default InfoBox;
