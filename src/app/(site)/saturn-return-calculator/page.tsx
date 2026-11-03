import { CalcPage, calcMetadata } from "@/components/stars/CalcPage";

export const metadata = calcMetadata("saturn-return");

export default function Page() {
  return <CalcPage kind="saturn-return" />;
}
