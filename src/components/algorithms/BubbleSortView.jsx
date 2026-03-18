import { bubbleSortSteps } from "@/lib/algorithms/bubbleSort";
import SortingAlgorithmView from "@/components/algorithms/SortingAlgorithmView";

export default function BubbleSortView() {
  return <SortingAlgorithmView generateSteps={bubbleSortSteps} />;
}