import { CalcPage, calcMetadata } from "@/components/stars/CalcPage";

export const generateMetadata = () => calcMetadata("venus");

export default function Page() {
  return <CalcPage kind="venus" />;
}
