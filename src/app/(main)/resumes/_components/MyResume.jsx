"use client";

import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import ResumeLayout from "./ResumeLayout";
import { getSortedResumes } from "@/lib/utils";
import ResumeItemSkeleton from "./ResumeItemSkeleton";

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
      toast.error("Failed to load resumes. Please try again");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchResumes();

    return () => controller.abort();
  }, [fetchResumes, retryCount]);

  // Add error state UI
  if (error) {
    return (
      <div className="container mx-auto px-2 sm:px-4 text-center py-8">
        <p className="text-red-500 mb-4">Failed to load resumes</p>
        <LoadingButton 
          onClick={() => setRetryCount(prev => prev + 1)}
          className="bg-red-100 text-red-600 hover:bg-red-200"
        >
          Retry Loading
        </LoadingButton>
      </div>
    );
  }

  const sorted = getSortedResumes(resumes);

  return (
    <div>
      {loading ? (
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 pt-2 pb-6">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <ResumeItemSkeleton key={index} />
              ))}
          </div>
        </div>
      ) : (
        <ResumeLayout resumes={sorted} />
      )}
    </div>
  );
};

export default MyResume;
