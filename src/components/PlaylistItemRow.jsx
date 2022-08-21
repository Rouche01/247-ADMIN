import React, { forwardRef, useMemo } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { MdDragHandle } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";
import classNames from "classnames";
import kebabCase from "lodash/kebabCase";
import withClickOutside from "../hoc/withClickOutside";
import { convertSecToMMSS } from "../utils/numFormatter";
import { transformPlaylistCreateDate } from "../utils/date";

const PlaylistItemRow = forwardRef(
  (
    {
      playlistItem,
      onDownwardMove,
      onUpwardMove,
      setConfirmRemoveItem,
      open,
      setOpen,
      draggableId,
      index,
      setCurrentItem,
      key,
    },
    ref
  ) => {
    const handleMoveUp = (item, index) => {
      setOpen(false);
      onUpwardMove(item, index);
    };

    const handleMoveDown = (item, index) => {
      setOpen(false);
      onDownwardMove(item, index);
    };

    const handleConfirmRemoveItem = (item) => {
      setCurrentItem(item);
      setOpen(false);
      setConfirmRemoveItem(true);
    };

    const playlistActions = [
      playlistItem.contentType !== "campaign" && {
        name: "Remove content",
        action: handleConfirmRemoveItem,
      },
      { name: "Move up", action: handleMoveUp },
      { name: "Move down", action: handleMoveDown },
    ].filter((val) => val);

    const thumbnail = useMemo(() => {
      if (playlistItem.contentType === "campaign") {
        return playlistItem.mediaType === "video"
          ? playlistItem?.resourceRef?.videoThumbnail
          : playlistItem?.resourceRef?.campaignMedia;
      } else {
        return playlistItem?.resourceRef?.previewUri;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlistItem.contentType]);

    return (
      <Draggable draggableId={draggableId} index={index} key={key}>
        {(provided) => (
          <tr
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="text-lg border border-247-dark-text odd:bg-247-dark-accent3 hover:bg-gray-700"
          >
            <td {...provided.dragHandleProps} className="px-3 py-5">
              <MdDragHandle color="#fff" size={30} />
            </td>
            <td className="px-6 py-5">
              <div className="flex items-center">
                <img
                  src={thumbnail}
                  className="h-14 w-24 object-cover rounded"
                  alt="content thumbnail"
                />
                <div className="ml-4">
                  <p>{playlistItem.title}</p>
                  <p className="text-sm text-247-timestamp-color font-semibold">
                    {playlistItem.contentType}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-6 py-5">
              {convertSecToMMSS(playlistItem.durationInSeconds)}
            </td>
            <td className="px-6 py-5">
              {transformPlaylistCreateDate(playlistItem.createdAt)}
            </td>
            <td className="px-6 py-5">
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
                  {playlistActions.map((action) => (
                    <li
                      className="w-full py-4 px-5 text-white text-sm font-semibold hover:bg-black hover:text-247-red-straight first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                      key={kebabCase(action.name)}
                      onClick={(_ev) => action.action(playlistItem, index)}
                    >
                      {action.name}
                    </li>
                  ))}
                </ul>
              </div>
            </td>
          </tr>
        )}
      </Draggable>
    );
  }
);

export default withClickOutside(PlaylistItemRow);
