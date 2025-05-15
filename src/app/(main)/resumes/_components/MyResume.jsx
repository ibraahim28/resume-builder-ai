"use client";
import { Button } from "@/components/ui/button";
import { AlarmClock } from "lucide-react";
import React, { useEffect, useState } from "react";
import ResumeLayout from "./ResumeLayout";
import { useResumeStore } from "@/stores/useResumeStore";
import { getSortedResumeIds } from "@/lib/utils";

const MyResume = () => {
  const [selectedMode, setSelectedMode] = useState("draft");
  const { resumes } = useResumeStore();

  const [resumesArr, setResumesArr] = useState([]);

  useEffect(() => {
    setResumesArr(getSortedResumeIds(resumes));
  }, [resumes, setResumesArr]);

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-blue-950 text-xl font-semibold">My Resume</h2>
      </div>
      <div className="flex justify-between border-b-2 border-gray-200">
        <div className="py-2 flex gap-6 ">
          <button
            className={`text-lg text-gray-800 font-semibold cursor-pointer ${
              selectedMode === "draft" && "text-green-600"
            } `}
            onClick={() => setSelectedMode("draft")}
          >
            Draft
          </button>
          <button
            className={`text-lg text-gray-800 font-semibold cursor-pointer ${
              selectedMode === "completed" && "text-green-600"
            } `}
            onClick={() => setSelectedMode("completed")}
          >
            Completed
          </button>
        </div>
        <div>
          <Button className={"bg-blue-100 text-primary hover:bg-blue-200 "}>
            {" "}
            <AlarmClock /> Add Reminder
          </Button>
        </div>
      </div>
      {selectedMode === "draft" ? (
        <ResumeLayout resumeIdArr={resumesArr} />
      ) : (
        <ResumeLayout resumeIdArr={resumesArr} />
      )}
    </div>
  );
};

export default MyResume;
