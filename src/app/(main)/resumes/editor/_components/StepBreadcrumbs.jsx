import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { steps } from "./forms/steps";

const StepBreadcrumbs = ({ currentStep, setCurrentStep }) => {
  return (
    <div className="flex justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <BreadcrumbItem>
                {step.key === currentStep ? (
                  <BreadcrumbPage>{step.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <button onClick={() => setCurrentStep(step.key)}>
                      {step.title}
                    </button>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator className='last:hidden' />
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default StepBreadcrumbs;
