"use client";
import React, { useRef, useEffect } from "react";
import clsx from "clsx";

type Props = {
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
  length?: number;
  inputSize?: number;
};

export default function OTPInput({
  value,
  onChange,
  error = false,
  length = 6,
  inputSize = 60,
}: Props) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!value) return;
    const digitsOnly = value.replace(/\D/g, "").slice(0, length);
    if (digitsOnly !== value) onChange(digitsOnly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length]);

  const digits = (value || "").padEnd(length, "").split("").slice(0, length);

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const handleChange = (index: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    const arr = digits.slice();
    arr[index] = ch;
    const newVal = arr.join("");
    onChange(newVal.replace(/\s/g, ""));
    if (ch && index < length - 1) focusInput(index + 1);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number
  ) => {
    const key = e.key;

    if (key === "Backspace") {
      if ((e.target as HTMLInputElement).value) {
        (e.target as HTMLInputElement).value = "";
        handleChange(i, "");
      } else if (i > 0) {
        focusInput(i - 1);
        const arr = digits.slice();
        arr[i - 1] = "";
        onChange(arr.join(""));
      }
    } else if (key === "ArrowLeft" && i > 0) {
      focusInput(i - 1);
    } else if (key === "ArrowRight" && i < length - 1) {
      focusInput(i + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("Text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    const arr = Array.from({ length }, (_, idx) => pasted[idx] ?? "");
    onChange(arr.join(""));
    const nextIndex = Math.min(pasted.length, length - 1);
    focusInput(nextIndex);
  };

  return (
    <div className="flex justify-center w-full h-full">
      <div
        className="flex gap-4 select-none"
        style={{ WebkitUserSelect: "none" }}
      >
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            className={clsx(
              "flex items-center justify-center text-center placeholder:text-[#697586]",
              "outline-none border transition-all duration-150",
              error ? "border-red-600" : "border-black",
              "bg-white text-[20px] font-normal rounded-[4px]"
            )}
            style={{
              width: `${inputSize}px`,
              height: `${inputSize}px`,
              fontSize: 18,
            }}
            placeholder="-"
          />
        ))}
      </div>
    </div>
  );
}
