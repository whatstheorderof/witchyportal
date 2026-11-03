import { ChineseYearPage, chineseYearMetadata } from "@/components/chinese/ChineseYearPage";

export const metadata = chineseYearMetadata(2028);

export default function Page() {
  return <ChineseYearPage year={2028} />;
}
