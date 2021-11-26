import React from "react";

const TextArea = ({ name }) => {
  return (
    <>
      <textarea
        className="bg-transparent border-2 border-247-dark-text w-2/3 rounded-md px-6 py-4 text-white text-lg focus:outline-none focus:ring-1"
        placeholder="Write a message..."
        name={name}
        id={name}
        cols="30"
        rows="10"
      ></textarea>
    </>
  );
};

export default TextArea;
