"use client";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { LucideUpload } from "lucide-react";
import React, { useState } from "react";

const ImportResumeBtn = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleUpload(e) {
    setError(null);
    e.preventDefault();

    const file = e.target.files[0];

    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);
    try {
      const res = await axiosInstance.post("/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.data;
      console.log(data);
    } catch (err) {
      console.error("Upload failed:", err);
      setError({ error: "Upload failed" });
    } finally {
      setUploading(false);
    }
  }
  return (
    <>
      {error && (
        <p className="bg-red-200 px-4 py-2 font-semibold text-lg text-red-600">
          Error in uploading pdf
        </p>
      )}
      <Button
        size="lg"
        disabled={uploading}
        onClick={() => document.getElementById("import-resume").click()}
        className="bg-blue-100 flex px-3 py-2 rounded-md text-primary hover:bg-blue-200 text-xs sm:text-sm w-full sm:w-auto mb-2 sm:mb-0"
      >
        <LucideUpload size={16} className="h-4 w-4 mr-1" /> Import Resume
      </Button>
      <input
        type="file"
        id="import-resume"
        className="hidden"
        accept="application/pdf"
        onChange={(e) => handleUpload(e)}
      />
    </>
  );
};

export default ImportResumeBtn;
