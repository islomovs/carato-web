import React from "react";
import { forwardRef } from "react";
import { Input } from "../ui/input";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  isMultiple?: boolean;
  isRequired?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      placeholder,
      type,
      value,
      onChange,
      onBlur,
      isMultiple = false,
      isRequired = false,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);
    return (
      <div className="w-full block">
        {label && (
          <label className="block text-xs font-normal text-[#697586] mb-2">
            <div className="flex gap-[2px]">
              <span>{label}</span>
              {isRequired && <span className="text-red-600">*</span>}
            </div>
          </label>
        )}
        <Input
          ref={ref}
          type={type}
          multiple={isMultiple}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full rounded-[4px] border p-3 text-[14px] font-normal outline-none ${
            hasError && !value?.trim() ? "border-red-600" : "border-black"
          }`}
          {...props}
        />
        {hasError && typeof error === "string" && (
          <p className="mt-2 text-[12px] font-[400] text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
