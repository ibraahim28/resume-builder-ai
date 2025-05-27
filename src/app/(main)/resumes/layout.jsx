import React from "react";

const layout = ({ children }) => {
  return (
    <div className="h-screen overflow-y-hidden">
      {children}
    </div>
  );
};

export default layout;
