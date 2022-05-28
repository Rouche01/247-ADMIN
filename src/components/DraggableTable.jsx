import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const DraggableTable = ({ droppableId, children, headers, handleDragEnd }) => {
  return (
    <table className="font-customRoboto w-full text-white border-collapse">
      <thead>
        <tr className="border border-247-dark-text bg-247-red-straight">
          {headers.map((header, idx) => (
            <th
              key={`${header}_${idx}`}
              className="text-left px-6 py-4 text-lg"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <tbody {...provided.droppableProps} ref={provided.innerRef}>
              {children}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </DragDropContext>
    </table>
  );
};

export default DraggableTable;
