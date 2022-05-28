import React, { forwardRef } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { MdDragHandle } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";
import classNames from "classnames";
import kebabCase from "lodash/kebabCase";
import withClickOutside from "../hoc/withClickOutside";

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
    },
    ref
  ) => {
    const handleMoveUp = (item) => {
      setOpen(false);
      onUpwardMove(item);
    };

    const handleMoveDown = (item) => {
      setOpen(false);
      onDownwardMove(item);
    };

    const handleConfirmRemoveItem = () => {
      setOpen(false);
      setConfirmRemoveItem(true);
    };

    const playlistActions = [
      { name: "Remove content", action: handleConfirmRemoveItem },
      { name: "Move up", action: handleMoveUp },
      { name: "Move down", action: handleMoveDown },
    ];

    return (
      <Draggable draggableId={draggableId} index={index}>
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
                  src={playlistItem.previewImg}
                  className="h-14 w-24 object-cover rounded"
                  alt="content thumbnail"
                />
                <div className="ml-4">
                  <p>{playlistItem.title}</p>
                  <p className="text-sm text-247-timestamp-color font-semibold">
                    {playlistItem.type}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-6 py-5">{playlistItem.duration}</td>
            <td className="px-6 py-5">{playlistItem.date}</td>
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
                      onClick={(_ev) => action.action(playlistItem)}
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
