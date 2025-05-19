"use client";

import { cn, getLastUpdatedTime } from "@/lib/utils";
import { useResumeStore } from "@/stores/useResumeStore";
import { EllipsisVertical, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ResumeLayout = ({ resumes }) => {
  const { addResume } = useResumeStore();
  const [openMenuId, setOpenMenuId] = useState(null);
  const router = useRouter();

  const addNewResume = () => {
    addResume();
    router.push("/resumes/editor");
  };

  const placeholderImage = "/resume.jpeg";

  const navigateToResume = (id) => {
    router.push(`/resumes/editor?resumeId=${id}`);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };


  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4 flex-wrap pt-2 pb-6">
        <div
          onClick={addNewResume}
          className="flex-shrink-0 w-40 md:w-48 lg:w-52 mr-4"
        >
          <div className="h-full bg-white rounded-lg shadow-md p-3 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-300">
            <Plus size={80} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-500">Add New</h2>
          </div>
        </div>

        {resumes.map((resume, idx) => (
          <div
            key={resume._id}
            className="flex-shrink-0 w-40 md:w-48 lg:w-52 mr-4 relative group"
          >
            <div
              className={cn(
                "absolute top-3 right-2 z-10 text-gray-500 hover:text-black opacity-0 group-hover:opacity-100 transition-all duration-300",
                openMenuId === resume._id ? "opacity-100" : ""
              )}
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu(resume._id);
              }}
            >
              {openMenuId === resume._id ? <X /> : <EllipsisVertical />}
            </div>

            {openMenuId === resume._id && (
              <div className="absolute top-10 right-2 bg-white shadow-lg rounded-md text-sm z-20 w-28 py-2">
                <button
                  onClick={() => {
                    setOpenMenuId(null);
                    // TODO: Implement print logic
                  }}
                  className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                >
                  Print
                </button>
                <button
                  onClick={() => {
                    setOpenMenuId(null);
                    // TODO: Hook this to DB deletion
                    console.log("Delete resume", resume._id);
                  }}
                  className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-500"
                >
                  Delete
                </button>
              </div>
            )}

            <div
              className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer h-full"
              onClick={() => navigateToResume(resume.resumeId)}
            >
              <div className="w-full h-40 relative mb-3">
                <Image
                  src={placeholderImage}
                  alt={`${resume?.data?.generalInfo?.title} thumbnail`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <h2 className="text-sm font-semibold truncate w-full">
                {resume?.data?.generalInfo?.title || "untitled"}
              </h2>
              <p className="text-xs truncate">
                {resume?.data?.generalInfo?.description || ""}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {getLastUpdatedTime(resume.updatedAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeLayout;
