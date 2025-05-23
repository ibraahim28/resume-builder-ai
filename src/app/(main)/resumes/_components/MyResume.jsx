"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import ResumeLayout from "./ResumeLayout";
import { getSortedResumes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlarmClock } from "lucide-react";

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
      <div className="flex justify-between border-b-2 border-gray-200">
        <div className="py-2 flex gap-6">
          <button
            className={`text-lg text-gray-800 font-semibold cursor-pointer ${
              selectedMode === "draft" && "text-green-600"
            }`}
            onClick={() => setSelectedMode("draft")}
          >
            Draft
          </button>
          <button
            className={`text-lg text-gray-800 font-semibold cursor-pointer ${
              selectedMode === "completed" && "text-green-600"
            }`}
            onClick={() => setSelectedMode("completed")}
          >
            Completed
          </button>
        </div>
        <Button className="bg-blue-100 text-primary hover:bg-blue-200">
          <AlarmClock /> Add Reminder
        </Button>
      </div>

      <ResumeLayout resumes={sorted} />
    </div>
  );
};

export default MyResume;
