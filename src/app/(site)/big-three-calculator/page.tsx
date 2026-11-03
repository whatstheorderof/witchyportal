import { CalcPage, calcMetadata } from "@/components/stars/CalcPage";

export const metadata = calcMetadata("big-three");

export default function Page() {
  return <CalcPage kind="big-three" />;
}
