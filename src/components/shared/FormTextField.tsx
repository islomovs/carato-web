"use client";
import React from "react";
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import clsx from "clsx";

type Props = {
  label?: string;
  name: string;
  error?: string | undefined;
  placeholder?: string;
  mask?: string; // optional mask string for react-input-mask
} & React.ComponentPropsWithoutRef<typeof Input>;

const FormTextField = forwardRef<HTMLInputElement, Props>(
  ({ label, name, error, placeholder, mask, ...rest }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {label && (
            <label className="block text-[12px] font-normal text-[#697586] mb-2">
              <span className="flex justify-between">
                <span>{label}</span>
                {error ? <span className="text-red-600 ml-2">*</span> : null}
              </span>
            </label>
          )}
        </div>

        {/* If mask provided, use Input as wrapper with inputMode */}
        {mask ? (
          // react-input-mask will be used in parent (we won't re-import here to keep component dumb)
          <input
            ref={ref}
            name={name}
            placeholder={placeholder}
            className={clsx(
              "w-full rounded-[4px] border p-3 text-[14px] font-normal",
              error ? "border-red-600" : "border-black"
            )}
            {...rest}
          />
        ) : (
          <Input
            ref={ref}
            name={name}
            placeholder={placeholder}
            className={clsx(
              "w-full rounded-[4px] border p-3 text-[14px] font-normal",
              error ? "border-red-600" : "border-black"
            )}
            {...rest}
          />
        )}

        {error ? (
          <p className="mt-2 text-[12px] font-normal text-red-600">{error}</p>
        ) : null}
      </div>
    );
  }
);

FormTextField.displayName = "FormTextField";
export default FormTextField;
