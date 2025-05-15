"use client";

import { steps } from "./forms/steps";
import StepBreadcrumbs from "./StepBreadcrumbs";
import { useSearchParams, useRouter } from "next/navigation";
import Footer from "./Footer";
import ResumePreviewSection from "@/components/ResumePreviewSection";
import { useResumeStore } from "@/stores/useResumeStore";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ResumeEditor = () => {
  const { currentResumeId, setCurrentResumeId, addResume } = useResumeStore();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const currentStep = searchParams.get("step") || steps[0]?.key;

  const [showPreviewOnSmDevice, setShowPreviewOnSmDevice] = useState(false);

  useEffect(() => {
    const resumeId = searchParams.get("resumeId");
    if (resumeId) {
      setCurrentResumeId(resumeId);
    } else if (!resumeId && currentResumeId) {
      params.set("resumeId", currentResumeId);
      router.replace(`?${params.toString()}`);
    } else {
      addResume();
      params.set("resumeId", currentResumeId);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, currentResumeId]);

  const setCurrentStep = (key) => {
    params.set("step", key);
    if (!currentResumeId) return;
    params.set("resumeId", currentResumeId);

    router.replace(`?${params.toString()}`);
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
        <div
          className={cn(
            "w-full md:w-1/2 flex flex-col",
            showPreviewOnSmDevice ? "hidden md:flex " : "flex md:w-1/2"
          )}
        >
          <div className="flex-1 overflow-y-auto p-3 space-y-6">
            <StepBreadcrumbs
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
            {CurrentFormComponent && <CurrentFormComponent />}
          </div>
        </div>

        <div className="grow md:border-r" />
        <ResumePreviewSection showPreviewOnSmDevice={showPreviewOnSmDevice} />
      </main>

      <Footer
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        showPreviewOnSmDevice={showPreviewOnSmDevice}
        setShowPreviewOnSmDevice={setShowPreviewOnSmDevice}
        setCurrentResumeId={setCurrentResumeId}
      />
    </div>
  );
};

export default ResumeEditor;
