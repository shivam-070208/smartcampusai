import React from "react";
import { cn } from "@/lib/utils";

type SubHeadingProps = {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
  [key: string]: any;
};

const sizeMap: Record<NonNullable<SubHeadingProps["size"]>, string> = {
  sm: "text-base font-medium",
  md: "text-lg font-semibold",
  lg: "text-xl font-bold",
};

const alignMap: Record<NonNullable<SubHeadingProps["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const SubHeading: React.FC<SubHeadingProps> = ({
  children,
  as: Component = "h3",
  className,
  size = "md",
  align = "left",
  ...rest
}) => {
  return (
    <Component
      className={cn(
        sizeMap[size],
        alignMap[align],
        "text-muted-foreground",
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};

export { SubHeading };
