import React from "react";
import PlaceholderLoading from "react-placeholder-loading";

const CampaignDetailLoading = ({ ...props }) => {
  return (
    <div className="py-10 h-full">
      <div>
        <PlaceholderLoading
          width="100%"
          height="30vh"
          shape="rect"
          colorEnd="#1A1C1F"
          colorStart="#1D2023"
        />
      </div>
      <div className="grid grid-cols-3 space-x-4 mt-6">
        <div>
          <PlaceholderLoading
            width="100%"
            height="20vh"
            shape="rect"
            colorEnd="#1A1C1F"
            colorStart="#1D2023"
          />
        </div>
        <div>
          <PlaceholderLoading
            width="100%"
            height="20vh"
            shape="rect"
            colorEnd="#1A1C1F"
            colorStart="#1D2023"
          />
        </div>
        <div>
          <PlaceholderLoading
            width="100%"
            height="20vh"
            shape="rect"
            colorEnd="#1A1C1F"
            colorStart="#1D2023"
          />
        </div>
      </div>
      <div className="mt-6">
        <PlaceholderLoading
          width="100%"
          height="10vh"
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

export default CampaignDetailLoading;
