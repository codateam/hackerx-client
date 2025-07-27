import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CustomCardProps {
  className?: string;
  title?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  bgColor?: string;
  noPadding?: boolean;
}

export function CustomCard({
  className,
  title,
  icon,
  actions,
  footer,
  children,
  bgColor,
  noPadding = false,
}: CustomCardProps) {
  const style = bgColor?.startsWith("#") ? { backgroundColor: bgColor } : {};

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl shadow-sm border overflow-hidden py-4 lg:py-6",
        !bgColor?.startsWith("#") ? bgColor : "",
        className
      )}
      style={style}
    >
      {(title || icon || actions) && (
        <div className="flex justify-between items-center px-4 lg:px-6 mb-4 lg:mb-4">
          <div className="flex items-center gap-2">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            {title && <h3 className="text-sm font-medium">{title}</h3>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}

      <div className={noPadding ? "text-sm lg:text-4xl" : "px-4 lg:p-6"}>
        {children}
      </div>

      {footer && <div className="border-t px-4 lg:p-6">{footer}</div>}
    </div>
  );
}
