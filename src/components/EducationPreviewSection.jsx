import { useResumeStore } from "@/stores/useResumeStore";
import { formatDate } from "date-fns";
import React from "react";

const EducationPreviewSection = () => {
  const { resumes, currentResumeId } = useResumeStore();
  const resumeData = resumes[currentResumeId] || {};

  const educations = resumeData?.education?.educations || [];
  const { colorHex } = resumeData?.appearance || {};

  const educationsNotEmpty = educations.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0
  );
  if (!educationsNotEmpty.length) return null;

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
          Education
        </p>
        {educationsNotEmpty.map((edu, idx) => (
          <div className="break-inside-avoid space-y-1" key={idx}>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span
                style={{
                  color: colorHex,
                }}
              >
                {" "}
                {edu?.degree}{" "}
              </span>
              {edu.startDate && (
                <span>
                  {edu.startDate &&
                    `${formatDate(edu.startDate, "MM/yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""}`}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{edu.school}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default EducationPreviewSection;
