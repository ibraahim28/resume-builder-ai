import React from "react";
import { Button } from "./ui/button";
import { Loader2Icon, Wand2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

const LoadingButton = ({ loading, disabled, className, children, ...rest }) => {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex gap-2 items-center", className)}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2Icon className="size-5 animate-spin" /> {children}
        </>
      ) : (
        <>
          <Wand2Icon className="size-4" /> {children}
        </>
      )}
    </Button>
  );
};

export default LoadingButton;
