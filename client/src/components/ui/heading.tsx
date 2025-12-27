import React from "react";
import { cn } from "@/lib/utils";

type HeadingProps = {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  color?: string;
  align?: "left" | "center" | "right";
  [key: string]: any;
};

const sizeMap: Record<NonNullable<HeadingProps["size"]>, string> = {
  sm: "text-lg font-semibold",
  md: "text-xl font-semibold",
  lg: "text-2xl font-bold",
  xl: "text-3xl font-bold",
  "2xl": "text-4xl font-extrabold",
};

const alignMap: Record<NonNullable<HeadingProps["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const Heading: React.FC<HeadingProps> = ({
  children,
  as: Component = "h2",
  className,
  size = "lg",
  color,
  align = "left",
  ...rest
}) => {
  return (
    <Component
      className={cn(
        sizeMap[size],
        alignMap[align],
        "text-foreground",
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};

export { Heading };
