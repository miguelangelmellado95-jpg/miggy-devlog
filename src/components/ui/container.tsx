import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "reader" | "default" | "wide";
  as?: React.ElementType;
};

const SIZE_MAP = {
  reader: "max-w-4xl",
  default: "max-w-5xl",
  wide: "max-w-6xl",
} as const;

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", as: As = "div", ...props }, ref) => (
    <As
      ref={ref}
      className={cn("mx-auto w-full px-4 md:px-8", SIZE_MAP[size], className)}
      {...props}
    />
  ),
);
Container.displayName = "Container";
