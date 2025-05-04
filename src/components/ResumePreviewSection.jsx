import React from "react";
import ResumePreview from "./ResumePreview";
const ResumePreviewSection = () => {
  return (
    <div className="hidden md:flex w-1/2 p-4 overflow-y-auto">
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <ResumePreview
          classname={"max-w-2xl shadow-md"}
        />
      </div>
    </div>
  );
};

export default ResumePreviewSection;
