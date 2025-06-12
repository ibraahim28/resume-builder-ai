import { BorderStyles } from "@/app/(main)/editor/_components/BorderStyleButton";
import { useResumeStore } from "@/stores/useResumeStore";
import React from "react";

const SummaryPreviewSection = ({ summary: summaryProp, appearance }) => {
  const { resumes, currentResumeId } = useResumeStore();
  
  const summaryData = summaryProp || (resumes[currentResumeId]?.summary || {});
  const appearanceData = appearance || (resumes[currentResumeId]?.appearance || {});

  const { summary } = summaryData;
  const { colorHex, borderStyle } = appearanceData;

  if (!summary) return null;
  const cleanSummary = summary
  ?.replace(/\s+/g, " ")      
  ?.trim();   

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
          borderRadius:
                  borderStyle === BorderStyles.SQUARE
                    ? "0px"
                    : borderStyle === BorderStyles.CIRCLE
                      ? "999px"
                      : "8px",
        }}
      />
      <div className="space-y-3 break-inside-avoid">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Professional Profile
        </p>
        <div className="whitespace-pre-line text-sm">{cleanSummary}</div>
      </div>
    </>
  );
};

export default SummaryPreviewSection;
