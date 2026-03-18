import { useEffect, useRef } from "react";
import { useVisualizationStore } from "@/stores/visualizationStore";

/**
 * Hook that drives the visualization playback.
 * When isPlaying is true, calls stepForward() at intervals
 * determined by the current speed setting.
 *
 * Base interval: 500ms (at 1x speed)
 */
const BASE_INTERVAL_MS = 500;

export function usePlaybackTick() {
  const intervalRef = useRef(null);
  const { isPlaying, speed, stepForward } = useVisualizationStore();

  useEffect(() => {
    if (isPlaying) {
      const ms = BASE_INTERVAL_MS / speed;
      intervalRef.current = setInterval(stepForward, ms);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, speed, stepForward]);
}
