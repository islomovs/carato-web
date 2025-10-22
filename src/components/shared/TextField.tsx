import React from "react";
import { forwardRef } from "react";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const hasError = Boolean(error);
    return (
      <label className="w-full block">
        {label && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-[12px] font-[400] text-[#697586]">
              {label}
            </span>
            {hasError && (
              <span className="text-[12px] font-[400] text-red-600">*</span>
            )}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full rounded-[4px] border px-3 py-3 text-[14px] font-[400] outline-none transition-shadow ${
            hasError ? "border-red-600" : "border-black"
          } ${className}`}
          {...props}
        />
        {hasError && typeof error === "string" && (
          <p className="mt-2 text-[12px] font-[400] text-red-600">{error}</p>
        )}
      </label>
    );
  }
);

TextField.displayName = "TextField";
