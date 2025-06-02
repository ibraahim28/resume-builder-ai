import LoadingButton from "@/components/LoadingButton";
import React, { useState } from "react";
import { generateSummary } from "../../../_actions/generateSummaryAction";
import toast from "react-hot-toast";

const GenerateSummaryBtn = ({
  resumes,
  currentResumeId,
  onSummaryGenerated,
}) => {
  const [loading, setLoading] = useState(false);

  const generateSummaryWithAi = async () => {
    const resume = resumes[currentResumeId];

    if (!resume) {
      toast.error("Couldn't fetch resume. Please try again.");
      return;
    }

    if (!resume.personalInfo.jobTitle || resume.personalInfo.jobTitle === "") {
      toast.error("Please provide Job title to generate a Summary");
      return;
    }


    try {
      setLoading(true);

      const generatedSummary = await generateSummary({
        personalInfo: resume.personalInfo,
        workExperiences: resume.workExperience?.workExperiences || [],
        projects: resume.project?.projects || [],
        educations: resume.education?.educations || [],
        skills: resume.skills?.skills || [],
        hasWorkExperience: resume.hasWorkExperience ?? true,
      });

      if (!generatedSummary || typeof generatedSummary !== "string") {
        toast.error("Failed to generate summary. Please try again.");
        return;
      }
      onSummaryGenerated(generatedSummary);

      toast.success("AI summary generated!");
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Something went wrong while generating summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingButton
      variant="default"
      title="Generate a summary just for your resume"
      type="button"
      onClick={generateSummaryWithAi}
      loading={loading}
    >
      {loading ? "Generating" : "Generate"}
    </LoadingButton>
  );
};

export default GenerateSummaryBtn;
