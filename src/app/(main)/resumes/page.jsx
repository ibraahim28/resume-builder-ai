import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import MyResume from "./_components/MyResume";
import Link from "next/link";

export const metadata = {
  title: "Your Resumes",
};

const Page = () => {
  return (
    <div className="bg-muted min-h-[calc(100vh-64px)] p-6 flex flex-col gap-10">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-blue-950 font-bold text-2xl">Resume Builder</h1>
          <p className="text-gray-500 text-base ">
            Create your own custom resume and land your dream job
          </p>
        </div>
        <div>
          <Button asChild size={"lg"}>
            <Link href='/resumes/editor'>
              <Plus /> New Resume
            </Link>
          </Button>
        </div>
      </div>
      <MyResume />
    </div>
  );
};

export default Page;
