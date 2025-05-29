"use client";

import { useResumeStore } from "@/stores/useResumeStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ResumeItem from "./ResumeItem";
import AddNewResumeBtn from "./AddNewResumeBtn";

const ResumeLayout = ({ resumes }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [resumesState, setResumesState] = useState();
  const router = useRouter();

  const navigateToResume = (id) => {
    router.push(`/resumes/editor?resumeId=${id}`);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4 flex-wrap pt-2 pb-6">
        <AddNewResumeBtn />

        {resumes.map((resume, index) => (
          <ResumeItem
            key={index}
            resume={resume}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            toggleMenu={toggleMenu}
            navigateToResume={navigateToResume}
            setResumesState={setResumesState}
            resumesState={resumesState}
          />
        ))}
      </div>
    </div>
  );
};

export default ResumeLayout;
