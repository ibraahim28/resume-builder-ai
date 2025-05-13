import { useResumeStore } from "@/stores/useResumeStore";
import React from "react";

const SummaryPreviewSection = () => {
  const { resumes, currentResumeId } = useResumeStore();
  const resumeData = resumes[currentResumeId] || {};

  const { summary } = resumeData?.summary || {};
  const { colorHex } = resumeData?.appearance || {};

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
