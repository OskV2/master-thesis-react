import { mergeSortSteps } from "@/lib/algorithms/mergeSort";
import SortingAlgorithmView from "@/components/algorithms/SortingAlgorithmView";

export default function MergeSortView() {
  return <SortingAlgorithmView generateSteps={mergeSortSteps} />;
}