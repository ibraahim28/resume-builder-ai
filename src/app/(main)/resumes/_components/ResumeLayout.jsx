"use client";


import { useResumeStore } from "@/stores/useResumeStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ResumeItem from "./ResumeItem";
import AddNewResumeBtn from "./AddNewResumeBtn";


const ResumeLayout = ({ resumes }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const [resumesState, setResumesState] = useState(resumes);

  useEffect(() => {
    setResumesState(resumes);
  }, [resumes]);

  const router = useRouter();

  const addNewResume = () => {
    addResume();
    router.push("/resumes/editor");
  };


  const navigateToResume = (id) => {
    router.push(`/resumes/editor?resumeId=${id}`);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 pt-2 pb-6">
        <div onClick={addNewResume} className="w-full h-full">
          <div className="h-full bg-white rounded-lg shadow-md p-3 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Plus size={30} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-700">Add New</h2>
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
