import useDimensions from "@/hooks/useDimensions";
import { useRef } from "react";
import PersonalInfoPreviewSection from "./PersonalInfoPreviewSection";
import SummaryPreviewSection from "./SummaryPreviewSection";
import ExperiencesPreviewSection from "./ExperiencesPreviewSection";
import EducationPreviewSection from "./EducationPreviewSection";
import SkillsPreviewSection from "./SkillsPreviewSection";

const { cn } = require("@/lib/utils");

const ResumePreview = ({ classname }) => {
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
        <PersonalInfoPreviewSection />
        <SummaryPreviewSection />
        <ExperiencesPreviewSection />
        <EducationPreviewSection />
        <SkillsPreviewSection />
      </div>
    </div>
  );
};

export default ResumePreview;
