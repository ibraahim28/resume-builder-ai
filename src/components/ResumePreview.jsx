import useDimensions from "@/hooks/useDimensions";
import { useRef } from "react";
import PersonalInfoPreviewSection from "./PersonalInfoPreviewSection";
import SummaryPreviewSection from "./SummaryPreviewSection";
import ExperiencesPreviewSection from "./ExperiencesPreviewSection";
import EducationPreviewSection from "./EducationPreviewSection";
import SkillsPreviewSection from "./SkillsPreviewSection";
import { useResumeStore } from "@/stores/useResumeStore";

const { cn } = require("@/lib/utils");

const ResumePreview = ({ classname, resumeData, contentRef = null }) => {
  const containerRef = useRef(null);
  const { resumes, currentResumeId } = useResumeStore();

  const data = resumeData || resumes[currentResumeId] || {};

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
        ref={contentRef}
        id="resumePreviewContent"
      >
        <PersonalInfoPreviewSection
          personalInfo={data.personalInfo}
          appearance={data.appearance}
        />
        <SummaryPreviewSection
          summary={data.summary}
          appearance={data.appearance}
        />
        <ExperiencesPreviewSection
          workExperience={data.workExperience}
          project={data.project}
          appearance={data.appearance}
          hasWorkExperience={data.hasWorkExperience}
        />
        <EducationPreviewSection
          education={data.education}
          appearance={data.appearance}
        />
        <SkillsPreviewSection
          skills={data.skills}
          appearance={data.appearance}
        />
      </div>
    </div>
  );
};

export default ResumePreview;
