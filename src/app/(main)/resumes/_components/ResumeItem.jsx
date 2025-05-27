import React, { useRef, useState } from "react";
import ResumePreview from "@/components/ResumePreview";
import axiosInstance from "@/lib/axios";
import { cn, getLastUpdatedTime } from "@/lib/utils";
import toast from "react-hot-toast";
import { X, EllipsisVertical } from "lucide-react";
import { useReactToPrint } from "react-to-print";

const ResumeItem = ({
  resume,
  openMenuId,
  setOpenMenuId,
  toggleMenu,
  navigateToResume,
  setResumesState,
  resumesState,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const contentRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle : resume?.data?.generalInfo?.title || `resume-${resume?.resumeId}`,
  })
  return (
    <>
      <div className="w-full relative group">
        <div
          className={cn(
            "absolute top-2 right-2 z-10 text-gray-500 hover:text-black opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300",
            openMenuId === resume._id ? "opacity-100" : ""
          )}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu(resume._id);
          }}
        >
          {openMenuId === resume._id ? (
            <X size={18} />
          ) : (
            <EllipsisVertical size={18} />
          )}
        </div>

        {openMenuId === resume._id && (
          <div className="absolute top-8 right-2 bg-white border border-gray-300 shadow-lg rounded-md text-sm z-20 w-28 py-2">
            <button
              onClick={() => {
                setOpenMenuId(null);
                reactToPrintFn()
              }}
              className="w-full px-4 py-2 hover:bg-gray-100 text-left border-b"
            >
              Print
            </button>
            <button
              onClick={() => {
                setOpenMenuId(null);
                // TODO: Implement export logic
              }}
              className="w-full px-4 py-2 hover:bg-gray-100 text-left border-b"
            >
              Export
            </button>
            <button
              onClick={async () => {
                try {
                  setIsDeleting(true);
                  const response = await axiosInstance.delete(
                    "/resumes/delete",
                    {
                      data: { resumeId: resume.resumeId },
                    },
                    { headers: {} }
                  );

                  if (response.data && response.data.success) {
                    setOpenMenuId(null);
                    toast.success("Resume deleted successfully");
                    setResumesState(
                      resumesState.filter((r) => r.resumeId !== resume.resumeId)
                    );
                  } else {
                    toast.error(
                      "Failed to delete resume, please try again later"
                    );
                  }
                } catch (error) {
                  console.error("Error deleting resume:", error);
                  toast.error(
                    "Failed to delete resume, please try again later"
                  );
                } finally {
                  setIsDeleting(false);
                }
              }}
              className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-500"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}

        <div
          className="bg-white rounded-lg shadow-md p-2 sm:p-3 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer h-full"
          onClick={() => navigateToResume(resume.resumeId)}
        >
          <div className="w-full aspect-[4/5] relative mb-2 sm:mb-3">
            {/* <Image
                src={placeholderImage}
                alt={`${resume?.data?.generalInfo?.title} thumbnail`}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 25vw, 20vw"
                style={{ objectFit: "cover" }}
                className="rounded-md"
              /> */}
            <ResumePreview resumeData={resume.data} contentRef={contentRef} />
          </div>
          <h2 className="text-sm font-semibold truncate w-full">
            {resume?.data?.generalInfo?.title || "untitled"}
          </h2>
          <p className="text-xs truncate w-full">
            {resume?.data?.generalInfo?.description || ""}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {getLastUpdatedTime(resume.updatedAt)}
          </p>
        </div>
      </div>
    </>
  );
};

export default ResumeItem;
