import { useResumeStore } from "@/stores/useResumeStore";
import React from "react";

const SummaryPreviewSection = ({ summary: summaryProp, appearance }) => {
  const { resumes, currentResumeId } = useResumeStore();
  
  // If props are not provided, fall back to the Zustand store
  const summaryData = summaryProp || (resumes[currentResumeId]?.summary || {});
  const appearanceData = appearance || (resumes[currentResumeId]?.appearance || {});

  const { summary } = summaryData;
  const { colorHex } = appearanceData;

  if (!summary) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
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
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </>
  );
};

export default SummaryPreviewSection;
