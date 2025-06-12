import React from "react";
import { Suspense } from "react";
import ResumeEditor from "./_components/ResumeEditor";

export const metadata = {
  title: "Design Your Resume",
};

const Page = () => {
  return (
    <div className="flex grow flex-col max-w-7xl mx-auto">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-gray-500 animate-fade-in">
            <svg
              className="w-6 h-6 animate-spin text-primary"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <p className="text-sm">Preparing your resume editor...</p>
          </div>
        }
      >
        <ResumeEditor />
      </Suspense>
    </div>
  );
};

export default Page;
