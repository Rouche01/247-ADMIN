import React, { forwardRef } from "react";
import classNames from "classnames";
import { FiMoreVertical } from "react-icons/fi";
import Checkbox from "./uiComponents/Checkbox";
import { formatNum } from "../utils/numFormatter";
import withClickOutside from "../hoc/withClickOutside";

const mapIndexToOption = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
};

const QuizItemRow = forwardRef(
  (
    {
      setCurrentItem,
      checkedItems,
      index,
      toggleItemCheck,
      quizItem,
      setConfirmDeleteItem,
      setOpen,
      open,
    },
    ref
  ) => {
    const correctOptionIdx = quizItem.options.findIndex(
      (option) => option.toLowerCase() === quizItem.answer.toLowerCase()
    );

    return (
      <tr
        className={classNames(
          "border",
          "border-247-dark-text",
          "hover:bg-gray-700",
          "text-lg",
          { "bg-gray-700": checkedItems.includes(index) },
          { "odd:bg-247-dark-accent3": !checkedItems.includes(index) }
        )}
      >
        <td className="px-3 py-5">
          <Checkbox
            checked={checkedItems.includes(index) ? true : false}
            iconColor="#CACACA"
            name={quizItem.id.toLowerCase()}
            handleChange={() => toggleItemCheck(index)}
          />
        </td>
        <td className="px-6 py-5 max-w-xs">{quizItem.question}</td>
        <td className="px-6 py-5">
          {formatNum(quizItem.timesAnswered, false, true)}
        </td>
        <td className="px-6 py-5">
          {formatNum(quizItem.timesAnsweredCorrectly, false, true)}
        </td>
        <td className="px-6 py-5">{mapIndexToOption[correctOptionIdx]}</td>
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
              <li
                className="w-full py-4 px-5 text-white text-sm font-semibold hover:bg-black hover:text-247-red-straight first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                onClick={(_ev) => {
                  setOpen(false);
                  setCurrentItem(quizItem);
                  setConfirmDeleteItem(true);
                }}
              >
                Delete question
              </li>
            </ul>
          </div>
        </td>
      </tr>
    );
  }
);

export default withClickOutside(QuizItemRow);
