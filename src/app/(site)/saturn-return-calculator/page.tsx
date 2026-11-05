import { CalcPage, calcMetadata } from "@/components/stars/CalcPage";

export const generateMetadata = () => calcMetadata("saturn-return");

export default function Page() {
  return <CalcPage kind="saturn-return" />;
}
