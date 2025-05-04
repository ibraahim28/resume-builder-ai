import { useResumeStore } from "@/stores/useResumeStore";
import React from "react";

const ExperiencesPreviewSection = () => {
  const { resumeData, hasWorkExperience } = useResumeStore();

  const { workExperiences = [] } = resumeData.workExperience || {};
  const { projects = [] } = resumeData.projects || {};

  const getNonEmptyExperiences = (list = []) =>
    list.filter((exp) => exp && Object.values(exp).some(Boolean));

  const experiences = hasWorkExperience
    ? getNonEmptyExperiences(workExperiences)
    : getNonEmptyExperiences(projects);

  if (!experiences.length) return null;
  
  return (
    <>
      <hr className="border-2" />
      <div className="space-y-3">
        <p className="text-lg font-semibold">
          {hasWorkExperience ? "Work Experiences" : "Projects"}
        </p>
        {experiences.map((exp, idx) => (
          <div key={idx} className="break-inside-avoid space-y-1">
            <div className="flex items-center justify-between text-sm font-semibold">
              <p>{exp.position }</p>
              <p className="text-xs font-normal text-gray-500">
                {exp.company }
              </p>
            </div>
            {exp.description && (
              <p className="text-sm text-muted-foreground">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ExperiencesPreviewSection;
