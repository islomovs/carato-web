"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: "default" | "bold";
}

export function NavButton({
  children,
  active,
  variant = "default",
  className,
  ...props
}: NavButtonProps) {
  const isBold = variant === "bold";

  return (
    <button
      {...props}
      className={cn(
        "relative py-[2px] text-sm transition-colors duration-300 cursor-pointer",
        "hover:text-[#4B5565]",
        // underline base
        "after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:transition-all after:duration-300",
        // underline thickness + color depending on variant
        isBold
          ? "font-bold text-[#000000] after:h-[1px] after:bg-[#000000]"
          : "text-[#000000] after:h-[0.5px] after:bg-[#4B5565]",
        // active & hover underline
        // active logic
        active
          ? isBold
            ? "after:w-full text-[#000000]"
            : "after:w-full text-[#4B5565]"
          : "after:w-0 hover:after:w-full",
        className
      )}
    >
      {children}
    </button>
  );
}
