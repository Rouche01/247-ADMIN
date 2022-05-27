import React, { useState } from "react";
import { FiMoreVertical, FiUploadCloud } from "react-icons/fi";
import Dashboard from "../components/Dashboard";
import DataTable from "../components/DataTable";
import Checkbox from "../components/uiComponents/Checkbox";
import Pagination from "../components/uiComponents/Pagination";
import startCase from "lodash/startCase";
import { usePagination } from "../hooks/pagination";
import { contentLibrary } from "../utils/dummyData";
import { formatNum } from "../utils/numFormatter";
import classNames from "classnames";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import UploadContentModal from "../components/uiComponents/UploadContentModal";

const tableHeaders = [
  "",
  "Title",
  "Duration",
  "Category",
  "Date",
  "Plays",
  "Status",
  "",
];

const ContentLibrary = () => {
  const [checkedContentItem, setCheckedContentItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const { currentList, indexOfFirstItem, indexOfLastItem, pages } =
    usePagination(currentPage, shownRows, contentLibrary);

  const toggleAdvertiserCheck = (idx) => {
    if (checkedContentItem.includes(idx)) {
      const index = checkedContentItem.indexOf(idx);
      const newCheckedAdvertisers = [...checkedContentItem];
      newCheckedAdvertisers.splice(index, 1);
      setCheckedContentItem(newCheckedAdvertisers);
    } else {
      setCheckedContentItem([...checkedContentItem, idx]);
    }
  };

  const handleUploadNewContent = (...args) => {
    console.log(args, "uploading new content...");
    setUploadModalOpen(false);
  };

  return (
    <Dashboard>
      <div className="mt-20 rounded-md bg-247-secondary border-2 border-247-dark-text mb-10">
        <div className="flex py-4 px-8 justify-end">
          <RoundedBtnWithIcon
            title="Upload Content"
            icon={<FiUploadCloud className="mr-3" size={22} />}
            onBtnClick={() => setUploadModalOpen(true)}
          />
        </div>
        <DataTable headers={tableHeaders}>
          {currentList.map((contentItem, idx) => (
            <tr
              className={
                checkedContentItem.includes(idx)
                  ? "text-lg bg-gray-700 border border-247-dark-text hover:bg-gray-700"
                  : "text-lg border border-247-dark-text odd:bg-247-dark-accent3 hover:bg-gray-700"
              }
              key={`advertisers_${idx}`}
            >
              <td className="px-3 py-5">
                <Checkbox
                  checked={checkedContentItem.includes(idx) ? true : false}
                  iconColor="#CACACA"
                  name={contentItem.title.toLowerCase()}
                  handleChange={() => toggleAdvertiserCheck(idx)}
                />
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center">
                  <img
                    src={contentItem.previewImg}
                    className="h-14 w-24 object-cover rounded"
                    alt="content thumbnail"
                  />
                  <div className="ml-4">
                    <p>{contentItem.title}</p>
                    <p className="text-sm text-247-timestamp-color font-semibold">
                      {contentItem.type}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">{contentItem.duration}</td>
              <td className="px-6 py-5">{contentItem.category}</td>
              <td className="px-6 py-5">{contentItem.date}</td>
              <td className="px-6 py-5">
                {formatNum(contentItem.plays, false, true)}
              </td>
              <td
                className={classNames("px-6", "py-5", {
                  "text-247-red-straight": contentItem.status === "live",
                  "text-247-not-live": contentItem.status === "not-live",
                })}
              >
                {startCase(contentItem.status.split("-").join(" "))}
              </td>
              <td>
                <button className="flex items-center justify-center">
                  <FiMoreVertical color="#fff" size={24} />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
      <div className="flex items-center justify-end mb-20">
        <Pagination
          activePage={currentPage}
          dataLength={contentLibrary.length}
          firstItem={indexOfFirstItem + 1}
          lastItem={indexOfLastItem}
          pages={pages}
          setActivePage={setCurrentPage}
          setVisibleRows={setShownRows}
          visibleRows={shownRows}
        />
      </div>
      <UploadContentModal
        isOpen={uploadModalOpen}
        setIsOpen={setUploadModalOpen}
        handleUpload={handleUploadNewContent}
      />
    </Dashboard>
  );
};

export default ContentLibrary;
