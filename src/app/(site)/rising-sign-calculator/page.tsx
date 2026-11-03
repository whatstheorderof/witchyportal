import { CalcPage, calcMetadata } from "@/components/stars/CalcPage";

export const metadata = calcMetadata("rising");

export default function Page() {
  return <CalcPage kind="rising" />;
}
