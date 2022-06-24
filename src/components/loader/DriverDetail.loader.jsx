import React from "react";
import PlaceholderLoading from "react-placeholder-loading";

const DriverDetailLoading = ({ ...props }) => {
  return (
    <div className="py-10 h-full">
      <div className="mt-6">
        <PlaceholderLoading
          width="100%"
          height="35vh"
          shape="rect"
          colorEnd="#1A1C1F"
          colorStart="#1D2023"
        />
      </div>
      <div className="mt-6">
        <PlaceholderLoading
          width="100%"
          height="20vh"
          shape="rect"
          colorEnd="#1A1C1F"
          colorStart="#1D2023"
        />
      </div>
      <div className="mt-6">
        <PlaceholderLoading
          width="100%"
          height="15vh"
          shape="rect"
          colorEnd="#1A1C1F"
          colorStart="#1D2023"
        />
      </div>
    </div>
  );
};

export default DriverDetailLoading;
