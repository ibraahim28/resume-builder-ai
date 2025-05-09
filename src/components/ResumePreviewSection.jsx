import React from "react";
import ResumePreview from "./ResumePreview";
import ColorPicker from "@/app/(main)/resumes/editor/_components/ColorPicker";
import BorderStyleButton from "@/app/(main)/resumes/editor/_components/BorderStyleButton";
const ResumePreviewSection = () => {
  return (
    <div className="group hidden relative md:flex w-1/2 p-4 overflow-y-auto">
      <div className="absolute opacity-50 group-hover:opacity-100 transition-opacity duration-200 left-1 top-1 flex flex-col gap-3 flex-none lg:left-3 lg:top-3">
        <ColorPicker />
        <BorderStyleButton />
      </div>
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <ResumePreview
          classname={"max-w-2xl shadow-md"}
        />
      </div>
    </div>
  );
};

export default ResumePreviewSection;
