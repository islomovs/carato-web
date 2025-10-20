/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: "default" | "bold";
  underlineColor?: string;
}

export function NavButton({
  children,
  active,
  variant = "default",
  underlineColor,
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
        "after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:transition-all after:duration-300",
        isBold
          ? "font-bold text-[#000000] after:h-[1px]"
          : "text-[#000000] after:h-[0.5px]",
        active
          ? isBold
            ? "after:w-full text-[#000000]"
            : "after:w-full text-[#4B5565]"
          : "after:w-0 hover:after:w-full",
        className
      )}
      style={{
        ["--underline-color" as any]: underlineColor || "#4B5565",
      }}
    >
      <style jsx>{`
        button::after {
          background-color: var(--underline-color);
        }
      `}</style>
      {children}
    </button>
  );
}
