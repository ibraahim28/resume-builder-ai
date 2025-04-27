"use client";
import { steps } from "./forms/steps";
import StepBreadcrumbs from "./StepBreadcrumbs";
import { useSearchParams } from "next/navigation";
import Footer from "./Footer";
import { useState } from "react";

const ResumeEditor = () => {
  const searchParams = useSearchParams();

  const [resumeData, setResumeData] = useState({});

  const currentStep = searchParams.get("step") || steps[0]?.key;

  const setCurrentStep = (key) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  };

  const CurrentFormComponent = steps.find(
    (step) => step.key === currentStep
  )?.component;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <header className="border-b px-3 py-5 text-center shrink-0 space-y-1.5">
        <h2 className="text-3xl font-bold text-blue-950">Design your resume</h2>
        <p className="text-xs text-muted-foreground">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 space-y-6">
            <StepBreadcrumbs
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />

            {CurrentFormComponent && (
              <CurrentFormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>
        </div>

        <div className="grow md:border-r" />
        <div className="hidden md:flex w-1/2 p-4 overflow-y-auto">
        <pre> {JSON.stringify(resumeData, null, 2)} </pre>
        </div>
      </main>

      <Footer currentStep={currentStep} setCurrentStep={setCurrentStep} />
    </div>
  );
};

export default ResumeEditor;
