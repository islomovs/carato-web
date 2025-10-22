/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { useTranslations } from "next-intl";

type Props = {
  onRegistered: () => void;
  onBack?: () => void;
};

export default function AuthRegisterStep({ onRegistered, onBack }: Props) {
  const t = useTranslations("auth");
  const { control, handleSubmit } = useForm<{
    phone: string;
    name: string;
  }>({
    defaultValues: { phone: "+998 " },
  });

  const onSubmit = (data: { phone: string; name: string }) => {
    console.log("Registered data:", data);
    onRegistered();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-[24px] font-normal text-black mb-10">
        {t("titleRegister")}
      </h3>

      <Controller
        control={control}
        name="phone"
        rules={{
          required: t("errors.phoneRequired"),
          validate: (v) =>
            v.replace(/\D/g, "").length === 12 || t("errors.phoneInvalid"),
        }}
        render={({ field, fieldState }) => (
          <div className="mb-6">
            <label className="block text-[12px] font-normal text-[#697586] mb-2">
              <div className="flex gap-[2px]">
                <span>{t("phone")}</span>
                <span className="text-red-600">*</span>
              </div>
            </label>

            <IMaskInput
              {...field}
              mask="+998 00 000-00-00"
              onAccept={(value: any) => field.onChange(value)}
              className={`w-full rounded-[4px] border p-3 text-[14px] font-normal ${
                fieldState.error ? "border-red-600" : "border-black"
              }`}
            />

            {fieldState.error && (
              <p className="mt-2 text-[12px] font-normal text-red-600">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* --- NAME FIELD --- */}
      <Controller
        control={control}
        name="name"
        rules={{ required: "Введите имя" }}
        render={({ field, fieldState }) => (
          <div className="mb-10">
            <label className="block text-[12px] font-normal text-[#697586] mb-2">
              <div className="flex gap-[2px]">
                <span>ФИО</span>
                <span className="text-red-600">*</span>
              </div>
            </label>

            <input
              {...field}
              className={`w-full rounded-[4px] border p-3 text-[14px] font-normal ${
                fieldState.error ? "border-red-600" : "border-black"
              }`}
            />

            {fieldState.error && (
              <p className="mt-2 text-[12px] font-normal text-red-600">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* --- BUTTONS --- */}
      <div className="flex flex-col gap-3">
        <Button
          variant="default"
          type="submit"
          className="w-full bg-black text-white rounded-[4px] py-6 text-[14px] font-normal uppercase cursor-pointer"
        >
          Зарегистрироваться
        </Button>

        <Button
          variant="outline"
          type="button"
          className="w-full bg-white border border-black rounded-[4px] py-6 text-[14px] font-normal cursor-pointer uppercase"
          onClick={() => onBack?.()}
        >
          Назад ко входу
        </Button>
      </div>
    </form>
  );
}
