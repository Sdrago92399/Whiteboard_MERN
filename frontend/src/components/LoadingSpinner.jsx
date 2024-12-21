import React from "react";

const LoadingSpinner = ({ size = 16, color = "blue" }) => (
  <div className="flex h-screen items-center justify-center">
    <div
      className={`w-${size} h-${size} border-4 border-${color} animate-spin rounded-full border-4 border-dashed`}
    ></div>
  </div>
);

export default LoadingSpinner;
