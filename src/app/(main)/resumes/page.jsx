import React from "react";
import MyResume from "./_components/MyResume";
import AddNewResumeBtn from "./_components/AddNewResumeBtn";

export const metadata = {
  title: "Your Resumes",
};

const Page = () => {
  return (
    <div className="bg-muted h-full p-3 sm:p-4 md:p-6 flex flex-col gap-6 md:gap-12 overflow-y-auto ">
      <div className="border-b-2 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-blue-950 font-bold text-xl sm:text-2xl">
            Resume Builder
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Craft your professional resume and land your dream job.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="w-full sm:w-auto">
            <AddNewResumeBtn />
          </div>
        </div>
      </div>
      <MyResume />
    </div>
  );
};

export default Page;
