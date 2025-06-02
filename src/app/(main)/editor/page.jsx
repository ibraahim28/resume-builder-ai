import React from "react";
import { Suspense } from "react";
import ResumeEditor from "./_components/ResumeEditor";

export const metadata = {
  title: "Design Your Resume",
};

const Page = () => {
  return (
    <div className="flex grow flex-col max-w-7xl mx-auto">
      <Suspense fallback={<div>...Loading</div>}>
        <ResumeEditor />
      </Suspense>
    </div>
  );
};

export default Page;
