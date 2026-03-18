import { quickSortSteps } from "@/lib/algorithms/quickSort";
import SortingAlgorithmView from "@/components/algorithms/SortingAlgorithmView";

export default function QuickSortView() {
  return <SortingAlgorithmView generateSteps={quickSortSteps} />;
}