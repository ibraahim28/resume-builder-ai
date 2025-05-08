import { useResumeStore } from "@/stores/useResumeStore";
import React from "react";
import { Badge } from "./ui/badge";

const SkillsPreviewSection = () => {
  const { skills } = useResumeStore()?.resumeData?.skills;
  const { colorHex } = useResumeStore()?.resumeData?.appearance;
  if (!skills.length) return null;
  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="break-inside-avoid space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Skills
        </p>
        <div className="flex break-inside-avoid gap-2 flex-wrap">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              className="text-sm rounded-md text-white"
              style={{
                backgroundColor: colorHex,
              }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};

export default SkillsPreviewSection;
