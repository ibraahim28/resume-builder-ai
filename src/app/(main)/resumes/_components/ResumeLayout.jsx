import { useResumeStore } from "@/stores/useResumeStore";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const ResumeLayout = ({ data }) => {
  const { addResume } = useResumeStore();
  const router = useRouter();
  const addNewResume = () => {
    addResume();
    router.push("/resumes/editor");
  };
  return (
    <div className="container mx-auto p-4">
      <div
        className="flex gap-4 overflow-x-auto no-scrollbar pt-2 pb-6"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Add New Resume */}
        <div
          onClick={() => addNewResume()}
          className="flex-shrink-0 w-40 md:w-48 lg:w-52 mr-4"
        >
          <div className="h-full bg-white rounded-lg shadow-md p-3 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-300">
            <Plus size={80} className="text-gray-400" />

            <h2 className="text-sm font-semibold text-gray-500">Add New</h2>
          </div>
        </div>

        {/* Resume Items */}
        {data.map((resume, idx) => (
          <div key={idx} className="flex-shrink-0 w-40 md:w-48 lg:w-52 mr-4">
            <div className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="w-full h-40 relative mb-3">
                <Image
                  src={resume.image}
                  alt={`${resume.title} thumbnail`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <h2 className="text-sm font-semibold truncate w-full">
                {resume.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1">{resume.lastUpdated}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeLayout;
