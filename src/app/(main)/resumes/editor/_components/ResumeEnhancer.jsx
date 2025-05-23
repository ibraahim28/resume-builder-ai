import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useResumeStore } from "@/stores/useResumeStore";
import { Gauge, Lightbulb, ShieldCheck, ShieldAlert } from "lucide-react";
import React, { useState, useEffect } from "react";
import { analyzeResume } from "../_actions/AiActions";

const ResumeEnhancer = () => {
  const { resumes, currentResumeId } = useResumeStore();
  const [showPopover, setShowPopover] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resumeData = resumes[currentResumeId] || {};

  useEffect(() => {
    if (showPopover && !scoreData) {
      loadScore();
    }
  }, [showPopover]);

  const loadScore = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await analyzeResume(resumeData);
      setScoreData(result);
    } catch (err) {
      console.log(err);
      setError(err.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Resume analysis"
          className="cursor-pointer"
        >
          <Gauge className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" className="w-96 my-4 max-h-[calc(100vh-100px)] overflow-y-auto p-6 pb-10 space-y-4">
        {loading ? (
          <div className="text-center py-4">Analyzing resume...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : scoreData ? (
          <>
            <div className="text-center">
              <div className="relative inline-block">
                <svg className="w-24 h-24">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45"
                    className="fill-none stroke-gray-200"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45"
                    className="fill-none stroke-blue-600"
                    strokeWidth="8"
                    strokeDasharray={`${(scoreData.score / 100) * 283} 283`}
                    transform="rotate(-90 48 48)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{scoreData.score}</span>
                </div>
              </div>
              <h3 className="mt-2 text-lg font-semibold">Resume Score</h3>
              <p className="text-sm text-gray-500">
                {scoreData.score > 75
                  ? "Strong candidate"
                  : scoreData.score > 50
                    ? "Needs improvements"
                    : "Major revisions needed"}
              </p>
            </div>

            {/* Breakdown Section */}
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="size-4 text-green-600" />
                  <span className="font-medium">Hirability</span>
                  <span className="ml-auto">
                    {scoreData.breakdown.hirability}/10
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="size-4 text-blue-600" />
                  <span className="font-medium">Professionalism</span>
                  <span className="ml-auto">
                    {scoreData.breakdown.professionalism}/10
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Lightbulb className="size-4 text-yellow-600" />
                <div>
                  <h4 className="font-medium mb-1">Improvement Tips</h4>
                  <ul className="space-y-2">
                    {scoreData.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        •<span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};

export default ResumeEnhancer;
