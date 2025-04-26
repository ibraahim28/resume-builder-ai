"use client";
import { Button } from "@/components/ui/button";
import { AlarmClock } from "lucide-react";
import React, { useState } from "react";
import ResumeLayout from "./ResumeLayout";



const MyResume = () => {
  const [selectedMode, setSelectedMode] = useState("draft");

  const completedResume = [
    {
    title : "Untitled Resume",
    image : "/resume.jpeg",
    lastUpdated : "10 days ago",
  },
    {
    title : "Untitled Resume",
    image : "/resume.jpeg",
    lastUpdated : "3 days ago",
  },
    {
    title : "Web Dev Resume",
    image : "/resume.jpeg",
    lastUpdated : "3 hours ago",
  },
    {
    title : "Professional Resume",
    image : "/resume.jpeg",
    lastUpdated : "4 days ago",
  },
]
  const draftResume = [
    {
    title : "Untitled Resume",
    image : "/resume.jpeg",
    lastUpdated : "2 days ago",
  },
    {
    title : "Untitled Resume",
    image : "/resume.jpeg",
    lastUpdated : "3 days ago",
  },
    {
    title : "Web Dev Resume",
    image : "/resume.jpeg",
    lastUpdated : "3 hours ago",
  },
    {
    title : "Untitled Resume",
    image : "/resume.jpeg",
    lastUpdated : "4 days ago",
  },
]

  return (
    <div >
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
      {
        selectedMode === 'draft' ? (<ResumeLayout data={draftResume} />) : (<ResumeLayout data={completedResume} />)
      }
    </div>
  );
};

export default MyResume;
