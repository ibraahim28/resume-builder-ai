import React from "react";
import { cn } from "@/lib/utils";

const ResumeItemSkeleton = () => {
  return (
    <div className="w-full relative group">
      <div
        className={cn(
          "bg-white rounded-lg shadow-md p-2 sm:p-3 flex flex-col items-center text-center animate-pulse h-[320px]"
        )}
      >
        {/* Preview skeleton */}
        <div className="w-full aspect-[4/5] relative mb-2 sm:mb-3 bg-gray-200 rounded-md" />

        {/* Title */}
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-1" />

        {/* Description */}
        <div className="h-3 w-5/6 bg-gray-200 rounded mb-1" />

        {/* Timestamp */}
        <div className="h-3 w-1/2 bg-gray-200 rounded mt-2" />
      </div>
    </div>
  );
};

export default ResumeItemSkeleton;
