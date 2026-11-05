import { CalcPage, calcMetadata } from "@/components/stars/CalcPage";

export const generateMetadata = () => calcMetadata("rising");

export default function Page() {
  return <CalcPage kind="rising" />;
}
