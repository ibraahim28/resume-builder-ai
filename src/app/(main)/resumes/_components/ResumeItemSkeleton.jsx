import React from 'react';

const ResumeItemSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 flex flex-col items-center text-center h-full animate-pulse">
        <div className="w-full aspect-[4/5] relative mb-2 sm:mb-3 bg-gray-200 rounded-md"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3 mt-1"></div>
      </div>
    </div>
  );
};

export default ResumeItemSkeleton;