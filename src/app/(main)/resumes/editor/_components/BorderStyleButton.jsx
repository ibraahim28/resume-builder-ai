import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/useResumeStore";
import { Circle, Square, Squircle } from "lucide-react";
import React from "react";

export const BorderStyles = {
  SQUARE: "square",
  CIRCLE: "circle",
  SQUIRCLE: "squircle",
};

const borderStylesArray = Object.values(BorderStyles);

const BorderStyleButton = () => {
  const { setResumeData } = useResumeStore();
  const { borderStyle } = useResumeStore()?.resumeData?.appearance;

  const onChange = (borderStyle) => {
    setResumeData((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        borderStyle: borderStyle,
      },
    }));
  };

  const handleClick = () => {
    const currentBorderIndex = borderStyle
      ? borderStylesArray.indexOf(borderStyle)
      : 0;

    const nextBorderIndex = (currentBorderIndex + 1) % borderStylesArray.length;
    onChange(borderStylesArray[nextBorderIndex]);
  };

  const Icon =
    borderStyle === "square"
      ? Square
      : borderStyle === "circle"
        ? Circle
        : Squircle;
  return (
    <Button
      className="cursor-pointer"
      variant="outline"
      size="icon"
      onClick={handleClick}
      title="Change border radius"
    >
      <Icon className="size-5" />
    </Button>
  );
};
export default BorderStyleButton;
