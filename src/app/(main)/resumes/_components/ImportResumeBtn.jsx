"use client";
import { Button } from "@/components/ui/button";
import { LucideUpload } from "lucide-react";
import React from "react";

const ImportResumeBtn = () => {
  return (
    <>
      <Button
        size="lg"
        onClick={() => document.getElementById("import-resume").click()}
        className="bg-blue-100 flex px-3 py-2 rounded-md text-primary hover:bg-blue-200 text-xs sm:text-sm w-full sm:w-auto mb-2 sm:mb-0"
      >
        <LucideUpload size={16} className="h-4 w-4 mr-1" /> Import Resume
      </Button>
      <input type="file" id="import-resume" className="hidden" />
    </>
  );
};

export default ImportResumeBtn;
