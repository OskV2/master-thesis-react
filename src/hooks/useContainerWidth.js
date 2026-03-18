import { useState, useEffect, useRef } from "react";

/**
 * useContainerWidth — measures the width of a container element.
 * Returns [ref, width] — attach ref to a wrapper div.
 */
export function useContainerWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    observer.observe(el);
    // Set initial width
    setWidth(el.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  return [ref, width];
}