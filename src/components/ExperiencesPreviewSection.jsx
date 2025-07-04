import { useResumeStore } from "@/stores/useResumeStore";
import React from "react";
import { formatDate } from "date-fns";
import { BorderStyles } from "@/app/(main)/editor/_components/BorderStyleButton";
import { Badge } from "./ui/badge";

const ExperiencesPreviewSection = ({
  workExperience,
  project,
  appearance,
  hasWorkExperience: hasWorkExperienceProp,
}) => {
  const { resumes, currentResumeId, getHasWorkExperience } = useResumeStore();

  // If props are not provided, fall back to the Zustand store
  const workExperienceData =
    workExperience || resumes[currentResumeId]?.workExperience || {};
  const projectData = project || resumes[currentResumeId]?.project || {};
  const appearanceData =
    appearance || resumes[currentResumeId]?.appearance || {};
  const hasWorkExperience =
    hasWorkExperienceProp !== undefined
      ? hasWorkExperienceProp
      : getHasWorkExperience();

  const workExperiences = workExperienceData?.workExperiences || [];
  const projects = projectData?.projects || [];
  const { colorHex, borderStyle } = appearanceData;

  const getNonEmptyExperiences = (list = []) =>
    list.filter((exp) => exp && Object.values(exp).some(Boolean));

  const experiences = hasWorkExperience
    ? getNonEmptyExperiences(workExperiences)
    : getNonEmptyExperiences(projects);

  if (!experiences.length) return null;

  const safeFormatDate = (dateStr, formatStr = "MM/yyyy") => {
    const date = new Date(dateStr);
    return isNaN(date) ? "Invalid Date" : formatDate(date, formatStr);
  };

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderRadius:
            borderStyle === BorderStyles.SQUARE
              ? "0px"
              : borderStyle === BorderStyles.CIRCLE
                ? "999px"
                : "8px",
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          {hasWorkExperience ? "Work Experiences" : "Projects"}
        </p>
        {experiences.map((exp, idx) => (
          <div key={idx} className="break-inside-avoid space-y-1">
            <div className="flex  items-center justify-between text-sm font-semibold">
              {hasWorkExperience ? (
                <p
                  style={{
                    color: colorHex,
                  }}
                >
                  {" "}
                  {exp.position}{" "}
                </p>
              ) : (
                <div className="flex flex-col items-start">
                  <p className={exp.projectLink ? "text-blue-500" : ""}>
                    {" "}
                    {exp.projectLink ? (
                      <a href={exp.projectLink}>{exp.title}</a>
                    ) : (
                      exp.title
                    )}{" "}
                  </p>

                  {exp.techStack && exp.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 my-3">
                      {exp.techStack.map((tech, index) => (
                        <Badge
                          key={index}
                          className="text-xs font-semibold text-white px-2 py-1"
                          style={{
                            backgroundColor: colorHex,
                            borderRadius:
                              borderStyle === BorderStyles.SQUARE
                                ? "0px"
                                : borderStyle === BorderStyles.CIRCLE
                                  ? "999px"
                                  : "8px",
                          }}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {exp.startDate && (
                <span>
                  {safeFormatDate(exp.startDate)} -{" "}
                  {exp.endDate ? safeFormatDate(exp.endDate) : "Present"}
                </span>
              )}
            </div>
            {exp.company && (
              <p className="text-xs font-normal text-gray-500">{exp.company}</p>
            )}
            {exp.description && (
              <p className="text-sm/relaxed whitespace-pre-line text-gray-600 ">
                {exp.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ExperiencesPreviewSection;
