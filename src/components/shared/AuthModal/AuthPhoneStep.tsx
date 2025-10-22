/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type Props = {
  onNext: (phone: string) => void;
  onOpenRegister?: () => void;
};

export default function AuthPhoneStep({ onNext, onOpenRegister }: Props) {
  const t = useTranslations("auth");
  const { control, handleSubmit } = useForm<{ phone: string }>({
    defaultValues: { phone: "+998 " },
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (data: { phone: string }) => {
    const digits = data.phone.replace(/\D/g, "");
    if (digits.length !== 12) return; // +998 + 9 digits
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onNext(data.phone);
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <h3 className="text-[24px] font-normal text-black mb-10">
        {t("titleLogin")}
      </h3>

      <Controller
        control={control}
        name="phone"
        rules={{
          required: t("errors.phoneRequired"),
          validate: (v) => {
            const digits = v.replace(/\D/g, "");
            return digits.length === 12 || t("errors.phoneInvalid");
          },
        }}
        render={({ field, fieldState }) => (
          <div className="mb-10">
            <label className="block text-[12px] font-normal text-[#697586] mb-2">
              <div className="flex gap-[2px]">
                <span>{t("phone")}</span>
                <span className="text-red-600">*</span>
              </div>
            </label>

            <IMaskInput
              mask="+998 00 000-00-00"
              value={field.value}
              onAccept={(value: any) => field.onChange(value)}
              overwrite={true}
              className={`w-full rounded-[4px] border p-3 text-[14px] font-normal outline-none ${
                fieldState.error ? "border-red-600" : "border-black"
              }`}
              placeholder="+998 90 123-45-67"
            />

            {fieldState.error && (
              <p className="mt-2 text-[12px] font-normal text-red-600">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          className="w-full bg-black text-white rounded-[4px] py-6 text-[14px] font-normal uppercase cursor-pointer"
          disabled={submitting}
        >
          {submitting ? t("submitting") : t("continue")}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full bg-white border border-black rounded-[4px] py-6 text-[14px] font-normal uppercase cursor-pointer"
          onClick={() => onOpenRegister?.()}
        >
          Регистрация
        </Button>
      </div>
    </form>
  );
}
