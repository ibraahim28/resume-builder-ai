import { useResumeStore } from "@/stores/useResumeStore";
import React from "react";
import { formatDate } from "date-fns";
import { BorderStyles } from "@/app/(main)/resumes/editor/_components/BorderStyleButton";
import { Badge } from "./ui/badge";

const ExperiencesPreviewSection = () => {
  const { resumes, currentResumeId, hasWorkExperience } = useResumeStore();
  const resumeData = resumes[currentResumeId] || {};

  const workExperiences = resumeData?.workExperience?.workExperiences || [];
  const projects = resumeData?.project?.projects || [];
  const { colorHex, borderStyle } = resumeData?.appearance || {};

  const getNonEmptyExperiences = (list = []) =>
    list.filter((exp) => exp && Object.values(exp).some(Boolean));

  const experiences = hasWorkExperience
    ? getNonEmptyExperiences(workExperiences)
    : getNonEmptyExperiences(projects);

  if (!experiences.length) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
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
                  {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                  {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                </span>
              )}
            </div>
            {exp.company && (
              <p className="text-xs font-normal text-gray-500">{exp.company}</p>
            )}
            {exp.description && (
              <p className="text-sm whitespace-pre-line text-muted-foreground">
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
