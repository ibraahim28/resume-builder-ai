import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useResumeStore } from "@/stores/useResumeStore";
import { Palette } from "lucide-react";
import React, { useState } from "react";
import { TwitterPicker } from "react-color";

const ColorPicker = () => {
  const { resumes, currentResumeId, setResumeData } = useResumeStore();

  const resumeData = resumes[currentResumeId] || {};
  const [showPopover, setShowPopover] = useState(false);
  const { colorHex } = resumeData?.appearance || "";

  function onChange(color) {
    setResumeData((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        colorHex: color.hex,
      },
    }));
  }

  return (
    <Popover
      className="bg-white text-black"
      open={showPopover}
      onOpenChange={setShowPopover}
    >
      <PopoverTrigger asChild>
        <Button
          className="cursor-pointer"
          variant="outline"
          size="icon"
          title="Change resume color"
          onClick={() => setShowPopover(true)}
        >
          <Palette className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-none bg-transparent shadow-none"
        align="end"
      >
        <TwitterPicker
          triangle="top-right"
          color={colorHex}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
