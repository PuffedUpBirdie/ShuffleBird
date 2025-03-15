import { useCallback, useEffect, useRef, useState } from "react";

export const ImagePathContainer = ({ filename }: { filename: string }) => {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleCursorMove = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(false), 6000);
    setIsVisible(true);
  }, [setIsVisible]);

  useEffect(() => {
    document.addEventListener("mousemove", handleCursorMove);
    return () => {
      document.removeEventListener("mousemove", handleCursorMove);
    };
  }, []);

  return (
    <div
      id="filename-container"
      style={!isVisible ? { opacity: 0 } : undefined}
    >
      {filename}
    </div>
  );
};
