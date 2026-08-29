import { useEffect, useRef, useState } from "react";

function useSmartScroll(dependencies = []) {
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const checkScrollPosition = () => {
    const container = containerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setIsAtBottom(distanceFromBottom < 80);
  };

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    container.addEventListener("scroll", checkScrollPosition);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !isAtBottom) return;

    container.scrollTop = container.scrollHeight;
  }, [...dependencies, isAtBottom]);

  const scrollToLatest = () => {
    const container = containerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });

    setIsAtBottom(true);
  };

  return {
    containerRef,
    isAtBottom,
    scrollToLatest,
  };
}

export default useSmartScroll;