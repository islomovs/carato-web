/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useTranslations } from "use-intl";
import { TextField } from "../TextField";
import { Controller, useForm } from "react-hook-form";
import { useMemo, useRef, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../../ui/button";
import { withMask } from "use-mask-input";
import { cn } from "@/lib/utils";
import { Input } from "../../ui/input";
import AuthModal from "@/components/shared/auth-modal/index";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserInfo } from "@/hooks/useUserInfo";
import { UserInfo } from "@/services/user";
import SkeletonPersonalInfoBlock from "./SkeletonPersonalInfoBlock";

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export default function PersonalInfoBlock() {
  const t = useTranslations("profile");
  const [authOpen, setAuthOpen] = useState(false);

  const { userInfo, loading, error } = useUserInfo();
  const form = useForm<UserInfo>({ defaultValues: {} });
  const { control, register, watch, handleSubmit, reset } = form;
  const DEFAULT_PHONE = "+998 ";

  useEffect(() => {
    if (userInfo) {
      reset({
        fullName: userInfo.fullName || "",
        phone: userInfo.phone || DEFAULT_PHONE,
        address: userInfo.address || "",
        apartmentNumber: userInfo.apartmentNumber || "",
        entrance: userInfo.entrance || "",
        floor: userInfo.floor || "",
      });
    }
  }, [userInfo, reset]);

  const watchedPhone = watch("phone");
  const originalNormalizedRef = useRef<string>("");
  useEffect(() => {
    if (userInfo?.phone) {
      originalNormalizedRef.current = normalizePhone(userInfo.phone);
    }
  }, [userInfo]);
  const normalizedPhone = useMemo(
    () => normalizePhone(watchedPhone || ""),
    [watchedPhone]
  );
  const phoneChanged = normalizedPhone !== originalNormalizedRef.current;

  const sendBtnClasses = cn(
    "uppercase text-sm font-medium px-4 py-[11px] h-full rounded-[4px] border transition-all inline-flex items-center justify-center border border-black cursor-pointer",
    // default: white background, black text
    "bg-black text-white",
    // hover: black background, white text
    "hover:bg-white hover:text-black",
    // active/click (pressed): white bg with border 1 black
    "active:bg-white active:border active:border-black"
  );

  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const { startSendCode, logout } = useAuth();
  const router = useRouter();

  const handleSendCode = async () => {
    setSendError(null);

    // basic validation: phone must have 12 digits (as you used)
    if (normalizedPhone.length !== 12) {
      setSendError(t("errors.phoneInvalid") || "Неверный номер телефона");
      return;
    }

    setSending(true);
    try {
      // call API
      await startSendCode(watchedPhone);
      setAuthOpen(true);
    } catch (err: any) {
      // handle API error - show message
      console.error("sendCode error", err);
      const msg =
        (err?.message && String(err.message)) ||
        "Не удалось отправить код. Попробуйте ещё раз.";
      setSendError(msg);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <SkeletonPersonalInfoBlock />;
  if (error)
    return (
      <div className="text-red-600">
        {t("loadError")}
        <button onClick={() => location.reload()} className="underline ml-2">
          {t("retry")}
        </button>
      </div>
    );

  return (
    <>
      <motion.form
        key="personal"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className="w-full flex flex-col gap-10 items-start max-w-[910px]"
        onSubmit={handleSubmit((data) => {
          console.log("Form submitted with data:", data);
        })}
      >
        {/* CONTACT INFO */}
        <div className="flex flex-col gap-6 w-full">
          <h2 className="font-normal text-base">{t("contactInformation")}</h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label={t("fullName")}
              type="text"
              placeholder={t("fullNamePlaceholder")}
              {...register("fullName", {
                required: t("errors.fullNameRequired"),
              })}
            />
            <Controller
              control={control}
              name="phone"
              rules={{
                required: t("errors.phoneRequired"),
                validate: (v: string) => {
                  const digits = normalizePhone(v);
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

                  {/* input + button row */}
                  <div className="flex items-start gap-[12px]">
                    <Input
                      type="text"
                      placeholder="+998 90 000-00-00"
                      ref={withMask("+\\9\\9\\8 99 999-99-99", {
                        placeholder: "_",
                        showMaskOnHover: false,
                      })}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className={`flex-1 rounded-[4px] border p-3 text-[14px] font-normal outline-none ${
                        fieldState.error ? "border-red-600" : "border-black"
                      }`}
                    />

                    {/* show send code button only when phone changed from original */}
                    {phoneChanged && (
                      <Button
                        onClick={handleSendCode}
                        disabled={sending}
                        className={cn(
                          sendBtnClasses,
                          sending && "opacity-60 cursor-not-allowed"
                        )}
                      >
                        {sending ? t("sending") : t("sendCode")}
                      </Button>
                    )}
                  </div>

                  {/* errors */}
                  {fieldState.error && (
                    <p className="mt-2 text-[12px] font-normal text-red-600">
                      {fieldState.error.message as string}
                    </p>
                  )}

                  {/* send error (API) */}
                  {sendError && (
                    <p className="mt-2 text-[12px] font-normal text-red-600">
                      {sendError}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* ADDRESS INFO */}
        <div className="flex flex-col gap-6 w-full">
          <h2 className="font-normal text-base">{t("addressInformation")}</h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label={t("address")}
              {...register("address", {
                required: t("errors.addressRequired"),
              })}
              type="text"
              placeholder={t("addressPlaceholder")}
              isRequired
            />
            <TextField
              label={t("apartmentNumber")}
              {...register("apartmentNumber")}
              placeholder={t("apartmentNumberPlaceholder")}
            />
            <TextField
              label={t("entrance")}
              {...register("entrance")}
              placeholder={t("entrancePlaceholder")}
            />
            <TextField
              label={t("floor")}
              {...register("floor")}
              placeholder={t("floorPlaceholder")}
            />
          </div>
        </div>
        <Button
          onClick={() => {
            logout();
            toast.success(t("loggedOutSuccessfully"));
            router.push("/");
          }}
          className="text-black rounded-md px-7 py-6 bg-[#EEF2F6] hover:bg-[#E3E8EF] hover:text-black font-medium self-center cursor-pointer transition-all duration-300 uppercase"
        >
          {t("exit")}
        </Button>
      </motion.form>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode="otp"
        initialPhone={watchedPhone}
      />
    </>
  );
}
