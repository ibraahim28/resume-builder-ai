"use client";

import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import ResumeLayout from "./ResumeLayout";
import { getSortedResumes } from "@/lib/utils";
import ResumeItemSkeleton from "./ResumeItemSkeleton";
import LoadingButton from "@/components/LoadingButton";
import { useSkeletonCount } from "@/hooks/useSkeletonCount";

const MyResume = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get("/resumes/fetch-all");
      setResumes(res.data.resumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes, retryCount]);

  const sorted = getSortedResumes(resumes);
  const skeletonCount = useSkeletonCount(250, 16); // 250px min card width, 16px gap

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 shadow-sm max-w-md w-full space-y-4">
          <p className="text-lg font-semibold">Something went wrong</p>
          <p className="text-sm text-red-500">
            We couldn’t load your resumes. If this issue persists, please reload
            the page or contact support.
          </p>
          <LoadingButton
            onClick={() => setRetryCount((prev) => prev + 1)}
            className="bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            Retry Loading
          </LoadingButton>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {loading ? (
        <div
          id="skeleton-grid"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {Array(skeletonCount)
            .fill(0)
            .map((_, index) => (
              <ResumeItemSkeleton key={index} />
            ))}
        </div>
      ) : (
        <ResumeLayout resumes={sorted} />
      )}
    </div>
  );
};

export default MyResume;
