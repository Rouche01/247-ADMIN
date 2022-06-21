import React, { forwardRef } from "react";
import classNames from "classnames";
import startCase from "lodash/startCase";
import kebabCase from "lodash/kebabCase";
import compact from "lodash/compact";
import format from "date-fns/format";
import { FiMoreVertical } from "react-icons/fi";
import Checkbox from "./uiComponents/Checkbox";
import { formatNum } from "../utils/numFormatter";
import withClickOutside from "../hoc/withClickOutside";

const ContentItemRow = forwardRef(
  (
    {
      setConfirmItemDelete,
      setCurrentItem,
      removeItemFromPlaylist,
      addItemToPlaylist,
      contentItem,
      index,
      checkedItems,
      toggleItemCheck,
      hideAction,
      smallText,
      open,
      setOpen,
    },
    ref
  ) => {
    const handleConfirmDelete = (item) => {
      setOpen(false);
      setCurrentItem(item);
      setConfirmItemDelete(true);
    };

    const onRemoveItemFromPlaylist = (item) => {
      setOpen(false);
      removeItemFromPlaylist(item);
    };

    const onAddItemToPlaylist = (item) => {
      setOpen(false);
      addItemToPlaylist(item);
    };

    const contentActions = [
      {
        name: "Delete content",
        action: handleConfirmDelete,
      },
      contentItem.status === "not-live" && {
        name: "Add to live playlist",
        action: onAddItemToPlaylist,
      },
      contentItem.status === "live" && {
        name: "Remove from live playlist",
        action: onRemoveItemFromPlaylist,
      },
    ];

    return (
      <tr
        className={classNames(
          "border",
          "border-247-dark-text",
          "hover:bg-gray-700",
          { "bg-gray-700": checkedItems.includes(index) },
          { "odd:bg-247-dark-accent3": !checkedItems.includes(index) },
          { "text-lg": !smallText },
          { "text-sm": smallText }
        )}
      >
        <td className="px-3 py-5">
          <Checkbox
            checked={checkedItems.includes(index) ? true : false}
            iconColor="#CACACA"
            name={contentItem.title.toLowerCase()}
            handleChange={() => toggleItemCheck(index)}
          />
        </td>
        <td className="px-6 py-5">
          <div className="flex items-center">
            <img
              src={contentItem.previewUri}
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
        <td className="px-6 py-5">
          {format(new Date(contentItem.createdAt), "dd LLL, yyyy")}
        </td>
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
        {!hideAction && (
          <td>
            <div className="relative" ref={ref}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-center"
              >
                <FiMoreVertical color="#fff" size={24} />
              </button>
              <ul
                style={{ transform: "translateX(-90%)" }}
                className={classNames(
                  "absolute",
                  "top-7",
                  "bg-247-dark-accent3",
                  "p-0",
                  "left-1/2",
                  "transition-all",
                  "translate-y-3",
                  "origin-top-right",
                  "w-52",
                  "z-50",
                  "shadow-xl",
                  "rounded-lg",
                  { "opacity-0": !open },
                  { "opacity-100": open },
                  { visible: open },
                  { hidden: !open }
                )}
              >
                {compact(contentActions).map((action) => (
                  <li
                    className="w-full py-4 px-5 text-white text-sm font-semibold hover:bg-black hover:text-247-red-straight first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                    key={kebabCase(action.name)}
                    onClick={(_ev) => action.action(contentItem)}
                  >
                    {action.name}
                  </li>
                ))}
              </ul>
            </div>
          </td>
        )}
      </tr>
    );
  }
);

export default withClickOutside(ContentItemRow);
