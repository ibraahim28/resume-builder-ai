import React from 'react';

const ResumeItemSkeleton = () => {
  return (
    <div className="w-full relative">
      <div className="absolute top-2 right-2 z-10 text-gray-300">
        <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
      </div>

      <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 flex flex-col items-center text-center h-full">
        <div className="w-full aspect-[4/5] relative mb-2 sm:mb-3">
          <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
        </div>

        <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded mb-1" />

        <div className="w-5/6 h-3 bg-gray-200 animate-pulse rounded mb-1" />

        <div className="w-1/2 h-3 bg-gray-200 animate-pulse rounded mt-1" />
      </div>
    </div>
  );
};

export default ResumeItemSkeleton;
