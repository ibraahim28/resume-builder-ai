import { useEffect } from "react";

export default function useUnloadWarning(condition = true) {
  useEffect(() => {
    if (!condition) return;

    const handleBeforeUnload = (event) => {
      const message = "You have unsaved changes. Are you sure you want to leave?";
      event.preventDefault();          
      event.returnValue = message;    
      return message;                 
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [condition]);
}
