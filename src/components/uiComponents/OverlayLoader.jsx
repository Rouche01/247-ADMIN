import React from "react";
import Spinner from "./Spinner";

const OverlayLoader = () => {
  return (
    <div className="absolute top-0 left-0 right-0 min-h-screen z-50 bg-247-overlay-2 flex items-center justify-center">
      <Spinner size="v-large" />
    </div>
  );
};

export default OverlayLoader;
