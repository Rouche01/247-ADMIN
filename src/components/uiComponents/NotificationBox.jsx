import React from "react";

const NotificationBox = ({
  subject,
  message,
  actionText,
  handleAction,
  time,
}) => {
  return (
    <div className="bg-247-dark-accent2 w-full grid grid-cols-3 rounded-md shadow-xl mb-3">
      <div className="col-span-2 py-3 px-5">
        {subject && (
          <h5 className="text-247-transparent text-base font-semibold mb-1">
            {subject}
          </h5>
        )}
        <p className="text-247-transparent text-sm">{message}</p>
        <p className="text-247-gray-accent5 text-sm mt-2">{`${time} ago`}</p>
      </div>
      <div className="flex flex-col">
        <button
          onClick={handleAction}
          className="bg-247-error-text w-full text-247-transparent py-3 rounded-tr-md flex-grow text-sm font-bold cursor-pointer"
        >
          {actionText}
        </button>
        <button className="bg-247-gray-accent2 w-full py-3 rounded-br-md flex-grow text-sm font-bold cursor-pointer">
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationBox;
