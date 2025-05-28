import React from "react";
import MyResume from "./_components/MyResume";
import AddNewResumeBtn from "./_components/AddNewResumeBtn";
import ImportResumeBtn from "./_components/ImportResumeBtn";

export const metadata = {
  title: "Your Resumes",
};

const Page = () => {
  return (
    <div className="bg-muted min-h-[calc(100vh-64px)] p-6 flex flex-col gap-12">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-blue-950 font-bold text-2xl">Resume Builder</h1>
          <p className="text-gray-500 text-base ">
            Create your own custom resume and land your dream job
          </p>
        </div>
        <div className="flex gap-4">
          <div>
            <ImportResumeBtn />
          </div>
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
