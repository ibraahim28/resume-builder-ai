import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import { steps } from "./forms/steps";
import toast from "react-hot-toast";
import { useResumeStore } from "@/stores/useResumeStore";

const Footer = ({ currentStep, setCurrentStep }) => {
  const { saveResumeData, isSaving, setIsSaving } = useResumeStore();
  const [localIsSaving, setLocalIsSaving] = useState(false);

  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep
  )?.key;

  // const handleSave = async () => {
  //   // const form = getForm(currentStep);

  //   if (!form) {
  //     toast.error("Cannot save at this time");
  //     return;
  //   }

  //   setLocalIsSaving(true);

  //   try {
  //     const success = await saveResumeData(currentStep, form);

  //     if (success) {
  //       toast.success("Resume saved successfully!");

  //       if (form.setContext) {
  //         form.setContext("saveStatus", "saved");
  //       }
  //     } else {
  //       toast.error("Failed to save resume. Please check form fields.");

  //       if (form.setContext) {
  //         form.setContext("saveStatus", "error");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error saving form:", error);
  //     toast.error("An error occurred while saving");
  //   } finally {
  //     setLocalIsSaving(false);
  //   }
  // };

  const isButtonDisabled = isSaving || localIsSaving;

  return (
    <footer className="w-full border-t px-3 py-5 shrink-0">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
            disabled={!previousStep || isButtonDisabled}
          >
            Previous step
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep || isButtonDisabled}
          >
            Next step
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="secondary" disabled={isButtonDisabled}>
            <Link href="/resumes">Close Editor</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
