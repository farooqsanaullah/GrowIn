import { useRef, useState, useEffect } from "react";

export const useHorizontalScroll = (scrollAmount = 200) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); 
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    container?.addEventListener("scroll", updateScrollState);
    updateScrollState();
    return () => container?.removeEventListener("scroll", updateScrollState);
  }, []);

  return { scrollRef, scroll, canScrollLeft, canScrollRight };
};
