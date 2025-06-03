"use client";

import { useState } from "react";
import { LucideUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { useResumeStore } from "@/stores/useResumeStore";
import ParsingPdfDialog from "./ParsingPdfDialog";
import { useRouter } from "next/navigation";

const ImportResumeBtn = () => {
  const { isUploadingResume, setIsUploadingResume, addResume } =
    useResumeStore();
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);

    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setIsUploadingResume(true);
    try {
      const res = await axiosInstance.post("/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;
      if (data.success && data.resume) {
        console.log("Resume uploaded and parsed successfully.");
        console.log("Parsed resume data:", data.resume);

        const newResumeId = addResume(data.resume);

        router.push(`/editor?resumeId=${newResumeId}`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploadingResume(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        size="lg"
        disabled={isUploadingResume}
        onClick={() => document.getElementById("import-resume")?.click()}
        className="w-full sm:w-auto flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-primary text-xs sm:text-sm"
      >
        <LucideUpload size={16} />
        {isUploadingResume ? "Uploading..." : "Import Resume"}
      </Button>
      {error && (
        <p className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-md text-sm">
          {error}
        </p>
      )}

      <input
        type="file"
        id="import-resume"
        accept="application/pdf"
        className="hidden"
        onChange={handleUpload}
      />

      <ParsingPdfDialog />
    </div>
  );
};

export default ImportResumeBtn;
