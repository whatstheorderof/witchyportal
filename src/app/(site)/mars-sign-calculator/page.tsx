import { CalcPage, calcMetadata } from "@/components/stars/CalcPage";

export const generateMetadata = () => calcMetadata("mars");

export default function Page() {
  return <CalcPage kind="mars" />;
}
