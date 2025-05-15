import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import MyResume from "./_components/MyResume";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import AddNewResumeBtn from "./_components/AddNewResumeBtn";

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
        <div>
         <AddNewResumeBtn />
        </div>
      </div>
      <MyResume />
    </div>
  );
};

export default Page;
