"use client";

import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import ResumeLayout from "./ResumeLayout";
import { getSortedResumes } from "@/lib/utils";
import ResumeItemSkeleton from "./ResumeItemSkeleton";
import toast from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";

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
    fetchResumes();
  }, [fetchResumes, retryCount]);

  const sorted = getSortedResumes(resumes);

  if (error) {
    return (
      <div className="container mx-auto px-4 text-center py-12">
        <p className="text-red-500 mb-4 text-sm sm:text-base">
          Failed to load resumes.
        </p>
        <LoadingButton
          onClick={() => setRetryCount((prev) => prev + 1)}
          className="bg-red-100 text-red-600 hover:bg-red-200"
        >
          Retry Loading
        </LoadingButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array(5)
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
