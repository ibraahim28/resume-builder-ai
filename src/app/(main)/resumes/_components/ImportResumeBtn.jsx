"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const ImportResumeBtn = () => {
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = (event) => {
      const file = event.target.files?.[0];
      if (file) {
        // Handle file upload logic here
        console.log("Selected PDF:", file.name);
      }
    };
    input.click();
  };

  return (
    <Button
      onClick={handleImport}
      className="flex items-center gap-2 bg-blue-100 text-gray-700 hover:bg-gray-200"
      variant="outline"
      size="lg"
    >
      <Upload size={18} /> Import PDF
    </Button>
  );
};

export default ImportResumeBtn;
