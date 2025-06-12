import { BorderStyles } from "@/app/(main)/editor/_components/BorderStyleButton";
import { useResumeStore } from "@/stores/useResumeStore";
import { formatDate } from "date-fns";
import React from "react";

const EducationPreviewSection = ({ education: educationProp, appearance }) => {
  const { resumes, currentResumeId } = useResumeStore();

  // If props are not provided, fall back to the Zustand store
  const educationData =
    educationProp || resumes[currentResumeId]?.education || {};
  const appearanceData =
    appearance || resumes[currentResumeId]?.appearance || {};

  const educations = educationData?.educations || [];
  const { colorHex, borderStyle } = appearanceData;

  const educationsNotEmpty = educations.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0
  );
  if (!educationsNotEmpty.length) return null;

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
                {edu?.degree}
                {edu?.major ? ` in ${edu.major}` : ""}
              </span>
              {edu.startDate && (
                <span>
                  {safeFormatDate(edu.startDate)} -{" "}
                  {edu.endDate ? safeFormatDate(edu.endDate) : "Present"}
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
