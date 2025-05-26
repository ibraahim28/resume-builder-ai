import React from "react";
import MyResume from "./_components/MyResume";
import AddNewResumeBtn from "./_components/AddNewResumeBtn";

export const metadata = {
  title: "Your Resumes",
};

const Page = () => {
  return (
    <div className="bg-muted min-h-[calc(100vh-64px)] p-3 sm:p-4 md:p-6 flex flex-col gap-6 md:gap-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-blue-950 font-bold text-xl sm:text-2xl">Resume Builder</h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Create your own custom resume and land your dream job
          </p>
        </div>
        <div className="w-full sm:w-auto">
         <AddNewResumeBtn />
        </div>
      </div>
      <MyResume />
    </div>
  );
};

export default Page;
