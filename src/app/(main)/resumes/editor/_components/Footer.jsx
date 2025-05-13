import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { steps } from "./forms/steps";
import { FileUserIcon, PenLineIcon } from "lucide-react";

const Footer = ({ currentStep, setCurrentStep, showPreviewOnSmDevice, setShowPreviewOnSmDevice }) => {
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep
  )?.key;

  return (
    <footer className="w-full border-t px-3 py-5 shrink-0">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
          >
            Previous step
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
          >
            Next step
          </Button>
        </div>
        <Button
        variant="outline"
        size="icon"
        onClick={()=> setShowPreviewOnSmDevice(!showPreviewOnSmDevice)}
        className="md:hidden"
        title={showPreviewOnSmDevice ? "Show input Form" : "Show Resume preview"}
        >
          {showPreviewOnSmDevice ? <PenLineIcon /> : <FileUserIcon />}
        </Button>
        <div className="flex items-center gap-3">
          <Button asChild variant="secondary">
            <Link href="/resumes">Close Editor</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
