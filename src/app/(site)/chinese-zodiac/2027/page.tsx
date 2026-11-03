import { ChineseYearPage, chineseYearMetadata } from "@/components/chinese/ChineseYearPage";

export const metadata = chineseYearMetadata(2027);

export default function Page() {
  return <ChineseYearPage year={2027} />;
}
