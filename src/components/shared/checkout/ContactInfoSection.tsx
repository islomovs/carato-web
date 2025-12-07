/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Control } from "react-hook-form";
import { Input } from "../../ui/input";
import { withMask } from "use-mask-input";
import { TextField } from "../TextField";
import { useTranslations } from "next-intl";

interface ContactInfoSectionProps {
  control: Control<any>;
  register: any;
}

export function ContactInfoSection({
  control,
  register,
}: ContactInfoSectionProps) {
  const t = useTranslations("checkout");

  return (
    <div>
      <h3 className="text-[14px] font-normal md:text-base mb-4">
        {t("contactInfo")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div>
              <label className="block text-[12px] font-normal text-[#697586] mb-2">
                <div className="flex gap-[2px]">
                  <span>{t("phone")}</span>
                  <span className="text-red-600">*</span>
                </div>
              </label>

              <Input
                type="text"
                placeholder="+998 90 000-00-00"
                ref={withMask("+\\9\\9\\8 99 999-99-99", {
                  placeholder: "_",
                  showMaskOnHover: false,
                })}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={`w-full rounded-[4px] border p-3 text-[14px] font-normal outline-none ${
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
        <TextField
          label={t("fullName")}
          placeholder="Введите ваше полное имя"
          type="text"
          isRequired
          {...register("fullName")}
        />
      </div>
    </div>
  );
}
