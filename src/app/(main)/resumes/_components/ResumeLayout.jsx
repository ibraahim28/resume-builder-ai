import { cn, getLastUpdatedTime } from "@/lib/utils";
import { useResumeStore } from "@/stores/useResumeStore";
import { EllipsisVertical, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ResumeLayout = ({ resumeIdArr }) => {
  const { addResume, resumes, setCurrentResumeId, deleteResume } =
    useResumeStore();
  const [openMenuId, setOpenMenuId] = useState(null);
  const router = useRouter();

  const addNewResume = () => {
    addResume();
    router.push("/resumes/editor");
  };

  const placeholderImage = "/resume.jpeg";

  const navigateToResume = (id) => {
    setCurrentResumeId(id);
    router.push(`/resumes/editor`);
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

        {resumeIdArr
          ?.filter((id) => resumes[id])
          ?.map((resumeId, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-40 md:w-48 lg:w-52 mr-4 relative group"
            >
              <div
                className={cn(
                  "absolute top-3 right-2 z-10 text-gray-500 hover:text-black opacity-0 group-hover:opacity-100 transition-all duration-300",
                  openMenuId === resumeId ? "opacity-100" : ""
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu(resumeId);
                }}
              >
                {openMenuId === resumeId ? <X /> : <EllipsisVertical />}
              </div>

              {openMenuId === resumeId && (
                <div className="absolute top-10 right-2 bg-white shadow-lg rounded-md text-sm z-20 w-28 py-2">
                  <button
                    onClick={() => {
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => {
                      deleteResume(resumeId);
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}

              <div
                className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer h-full"
                onClick={() => navigateToResume(resumeId)}
              >
                <div className="w-full h-40 relative mb-3">
                  <Image
                    src={placeholderImage}
                    alt={`${resumes[resumeId].title} thumbnail`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <h2 className="text-sm font-semibold truncate w-full">
                  {resumes[resumeId]?.generalInfo?.title || "untitled"}
                </h2>
                <p className="text-xs truncate">
                  {resumes[resumeId]?.generalInfo?.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getLastUpdatedTime(resumes[resumeId].updatedAt)}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ResumeLayout;
