"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import ResumeLayout from "./ResumeLayout";
import { getSortedResumes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideUpload } from "lucide-react";

const MyResume = () => {
  const [selectedMode, setSelectedMode] = useState("draft");
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await axiosInstance.get("/resumes/fetch-all");
        setResumes(res.data.resumes);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    fetchResumes();
  }, []);

  const filtered = resumes.filter((resume) =>
    selectedMode === "draft" ? !resume.completed : resume.completed
  );
  const sorted = getSortedResumes(filtered);
  return (
    <div>
      <div className="mb-2">
        <h2 className="text-blue-950 text-xl font-semibold">My Resume</h2>
      </div>
      <div className="flex flex-col sm:flex-row justify-between border-b-2 border-gray-200 gap-3 sm:gap-0">
        <div className="py-2 flex gap-4 sm:gap-6">
          <button
            className={`text-base sm:text-lg text-gray-800 font-semibold cursor-pointer ${
              selectedMode === "draft" && "text-green-600"
            }`}
            onClick={() => setSelectedMode("draft")}
          >
            Draft
          </button>
          <button
            className={`text-base sm:text-lg text-gray-800 font-semibold cursor-pointer ${
              selectedMode === "completed" && "text-green-600"
            }`}
            onClick={() => setSelectedMode("completed")}
          >
            Completed
          </button>
        </div>
        <div>
          <label
            htmlFor="import-resume"
            className="bg-blue-100 flex px-3 py-2 rounded-md text-primary hover:bg-blue-200 text-xs sm:text-sm w-full sm:w-auto mb-2 sm:mb-0"
          >
            <LucideUpload size={16} className="h-4 w-4 mr-1" /> Import Resume
          </label>
          <input type="file" name="import-resume" className="hidden" />
        </div>
      </div>

      <ResumeLayout resumes={sorted} />
    </div>
  );
};

export default MyResume;
