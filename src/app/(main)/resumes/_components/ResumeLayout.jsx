"use client";

import { useResumeStore } from "@/stores/useResumeStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ResumeItem from "./ResumeItem";
import { Plus } from "lucide-react";

const ResumeLayout = ({ resumes }) => {
  const { addResume } = useResumeStore();
  const [openMenuId, setOpenMenuId] = useState(null);

  const [resumesState, setResumesState] = useState(resumes);

  useEffect(() => {
    setResumesState(resumes);
  }, [resumes]);

  const router = useRouter();

  const addNewResume = () => {
    addResume();
    router.push("/editor");
  };

  const navigateToResume = (id) => {
    router.push(`/editor?resumeId=${id}`);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-4 pb-8">
        <div className="w-full relative group">
          <div
            className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer"
            style={{ minHeight: "340px" }}
            onClick={addNewResume}
          >
            <div className="w-full aspect-[3/4] relative mb-2 sm:mb-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:border-blue-400 transition-colors">
              <Plus
                size={32}
                className="text-gray-400 group-hover:text-blue-500 transition-colors"
              />
            </div>
            <h2 className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              Add New Resume
            </h2>
          </div>
        </div>

        {resumesState.map((resume) => {
          return (
            <ResumeItem
              key={resume._id}
              resume={resume}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              toggleMenu={toggleMenu}
              navigateToResume={navigateToResume}
              resumesState={resumesState}
              setResumesState={setResumesState}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ResumeLayout;
