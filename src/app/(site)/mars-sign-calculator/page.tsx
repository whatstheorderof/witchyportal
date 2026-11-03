import { CalcPage, calcMetadata } from "@/components/stars/CalcPage";

export const metadata = calcMetadata("mars");

export default function Page() {
  return <CalcPage kind="mars" />;
}
