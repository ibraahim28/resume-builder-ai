import useDimensions from "@/hooks/useDimensions";
import { useRef } from "react";
import PersonalInfoPreviewSection from "./PersonalInfoPreviewSection";

const { cn } = require("@/lib/utils");

const ResumePreview = ({ resumeData, classname }) => {
  const containerRef = useRef(null);

  const { width } = useDimensions(containerRef);
  return (
    <div
      className={cn(
        "bg-white text-black h-fit w-full aspect-[210/297]",
        classname
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
      >
      
      <PersonalInfoPreviewSection resumeData={resumeData} />
    </div>
    </div>
  );
};

export default ResumePreview;
