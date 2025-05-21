import LoadingButton from "@/components/LoadingButton";
import React, { useState } from "react";
import { generateSummary } from "../actions";
import toast from "react-hot-toast";

const GenerateSummaryBtn = ({
  resumes,
  currentResumeId,
  onSummaryGenerated,
}) => {
  const [loading, setLoading] = useState(false);

  const generateSummaryWithAi = async () => {
    try {
      setLoading(true);
      const generatedSummary = await generateSummary({
        personalInfo: resumes[currentResumeId].personalInfo,
        workExperiences:
          resumes[currentResumeId].workExperience?.workExperiences || [],
        projects: resumes[currentResumeId].project?.projects || [],
        educations: resumes[currentResumeId].education?.educations || [],
        skills: resumes[currentResumeId].skills?.skills || [],
        hasWorkExperience: resumes[currentResumeId].hasWorkExperience ?? true,
      });

      if (!generatedSummary || typeof generatedSummary !== "string") {
        toast.error("Failed to generate summary. Please try again.");
        return;
      }

      //   form.setValue("summary", generatedSummary, {
      //     shouldDirty: true,
      //     shouldTouch: true,
      //     shouldValidate: true,
      //   });

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
      variant="outline"
      type="button"
      onClick={generateSummaryWithAi}
      loading={loading}
      children={loading ? "Generating" : "Generate"}
    />
  );
};

export default GenerateSummaryBtn;
