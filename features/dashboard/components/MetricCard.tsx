import { CustomCard } from "@/components/ui/card";
import Image from "next/image";

interface MetricCardProps {
  title: string;
  value: string;
  bgColor: string;
}

export function MetricCard({ title, value, bgColor }: MetricCardProps) {
  return (
    <div className="w-full h-[100px] lg:h-[185px]">
      <CustomCard
        className="text-black border-none h-full"
        title={title}
        bgColor={bgColor}
        actions={
          <Image src="/icons/Group 27.svg" width={27} height={5} alt="dots" />
        }
        noPadding
      >
        <div className="px-4 lg:px-6 flex flex-col gap-4 md:gap-10 md:mt-6">
          <p className="md:text-[2rem] font-bold">{value}</p>
          <div className="w-[120px] h-1 border border-black" />
        </div>
      </CustomCard>
    </div>
  );
}
