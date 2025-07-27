import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/Button/page";

interface SectionHeaderProps {
  title: string;
  size?: "default" | "sm";
}

export function SectionHeader({ title, size = "default" }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2
        className={
          size === "default" ? "text-lg font-semibold" : "text-base font-medium"
        }
      >
        {title}
      </h2>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
