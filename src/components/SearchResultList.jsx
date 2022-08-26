import React from "react";
import { useHistory } from "react-router";
import startCase from "lodash/startCase";

import SearchResultLoading from "./loader/SearchResult.loader";

const SearchResultItem = ({ title, recordType, recordInfo, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className="w-full rounded-md bg-247-gray-accent3 border-2 border-247-dark-text px-8 py-5 mb-6 cursor-pointer"
    >
      <span className="text-white bg-247-red-shade rounded-full px-3 py-1 text-sm">
        {startCase(recordType)}
      </span>
      <h3 className="text-white text-2xl font-medium my-3">{title}</h3>
      <div>
        {Object.entries(recordInfo).map(([key, value]) => (
          <span
            key={key}
            className="bg-247-main rounded-full text-white text-sm px-2 py-1 mr-2"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};

const SearchResultList = ({ results, loadingResults }) => {
  const history = useHistory();

  const navigateToRecordPage = (item) => {
    history.push(`/${item.type}/${item.id}`);
  };

  return (
    <div className="mt-9 px-5">
      {loadingResults ? (
        <SearchResultLoading />
      ) : (
        results.map((item) => (
          <SearchResultItem
            key={item.id}
            title={item.name || item.campaignName || item.advertiserName}
            recordType={item.type}
            recordInfo={item.recordInfo}
            handleClick={() => navigateToRecordPage(item)}
          />
        ))
      )}
    </div>
  );
};

export default SearchResultList;
