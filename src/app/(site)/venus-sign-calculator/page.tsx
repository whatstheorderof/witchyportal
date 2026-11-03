import { CalcPage, calcMetadata } from "@/components/stars/CalcPage";

export const metadata = calcMetadata("venus");

export default function Page() {
  return <CalcPage kind="venus" />;
}
