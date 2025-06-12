import { useEffect, useState } from "react";

export function useSkeletonCount(cardMinWidth = 250, gap = 16) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    function updateCount() {
      const container = document.getElementById("skeleton-grid");
      if (container) {
        const width = container.offsetWidth;
        const totalCardWidth = cardMinWidth + gap;
        const columns = Math.floor(width / totalCardWidth);
        setCount(Math.max(columns, 1));
      }
    }

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, [cardMinWidth, gap]);

  return count;
}
