import { CalcPage, calcMetadata } from "@/components/stars/CalcPage";

export const generateMetadata = () => calcMetadata("moon");

export default function Page() {
  return <CalcPage kind="moon" />;
}
