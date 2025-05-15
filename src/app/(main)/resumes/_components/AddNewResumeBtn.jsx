"use client";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/useResumeStore";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const AddNewResumeBtn = () => {
  const { addResume } = useResumeStore();
  const router = useRouter();

  const addNewResume = () => {
    addResume();
    router.push("resumes/editor");
  };

  return (
    <Button onClick={addNewResume} className="flex items-center gap-2" size={"lg"}>
      <Plus size={20} /> New Resume
    </Button>
  );
};

export default AddNewResumeBtn;
