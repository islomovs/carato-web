"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/shared/TextField";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { withMask } from "use-mask-input";
import { Input } from "@/components/ui/input";
import { submitPartnershipApplication } from "@/services/partnership";
import { toast } from "sonner";

type PartnerFormValues = {
  company: string;
  fullName: string;
  country: string;
  businessType: string;
  phone: string;
  email: string;
};

const COUNTRIES = ["Узбекистан"];

const BUSINESS_TYPES_RU = ["ООО", "ИП"];
const BUSINESS_TYPES_UZ = ["MChJ", "YaTT"];

// Grid cell data — replace src/title/description with real content
const GRID_CELLS = {
  topLeft: {
    src: "/images/banner-placeholder.jpg",
    title: "Эксклюзивные коллекции",
    description: "Доступ к лимитированным изделиям и премиальным линейкам",
    width: 445,
    height: 660,
  },
  topRight: {
    src: "/images/category-placeholder.png",
    title: "Маркетинговая поддержка",
    description: "Профессиональные материалы и совместные кампании",
    width: 445,
    height: 320,
  },
  bottomLeft: {
    src: "/images/jewellery-rings.jpg",
    title: "Гибкие условия",
    description: "Индивидуальные программы сотрудничества под ваш бизнес",
    width: 445,
    height: 320,
  },
  bottomRight: {
    src: "/images/news-crafted-eternity.jpg",
    title: "Персональный менеджер",
    description: "Выделенная поддержка на всех этапах партнёрства",
    width: 445,
    height: 660,
  },
  fullWidth: {
    src: "/images/news-golden-harmony.jpg",
    title: "Обучение и развитие",
    description:
      "Регулярные тренинги, доступ к экспертам и образовательным материалам бренда",
  },
};

function GridCell({
  src,
  title,
  description,
  className = "",
}: {
  src: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Text */}
      <div className="absolute top-10 left-10 right-10">
        <p
          className="text-white mb-2"
          style={{
            fontWeight: 500,
            fontSize: 28,
            lineHeight: "40px",
          }}
        >
          {title}
        </p>
        <p
          className="text-white/85"
          style={{
            fontWeight: 400,
            fontSize: 20,
            lineHeight: "28px",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export default function PartnersPage() {
  const t = useTranslations("partners");
  const locale = useLocale();
  const BUSINESS_TYPES = locale === "uz" ? BUSINESS_TYPES_UZ : BUSINESS_TYPES_RU;
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryError, setCountryError] = useState("");

  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [businessTypeOpen, setBusinessTypeOpen] = useState(false);
  const [businessTypeError, setBusinessTypeError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<PartnerFormValues>({
    defaultValues: {
      company: "",
      fullName: "",
      country: "",
      businessType: "",
      phone: "",
      email: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: PartnerFormValues) => {
    let hasScopeError = false;

    if (!selectedBusinessType) {
      setBusinessTypeError(t("errors.businessTypeRequired"));
      hasScopeError = true;
    } else {
      setBusinessTypeError("");
    }

    if (!selectedCountry) {
      setCountryError(t("errors.countryRequired"));
      hasScopeError = true;
    } else {
      setCountryError("");
    }

    if (hasScopeError) return;

    try {
      setSubmitting(true);
      await submitPartnershipApplication({
        company: data.company,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        country: selectedCountry,
        businessType: selectedBusinessType,
      });

      toast.success(t("submitSuccess"));

      reset();
      setSelectedCountry("");
      setSelectedBusinessType("");
    } catch {
      toast.error(t("submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* ─── Hero Banner ─── */}
      <div
        className="relative w-full h-[462px] md:h-[522px]"
        style={{
          backgroundImage: "url('/images/news-opening.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />

        {/* Vertically centered content (accounts for ~66px header) */}
        <div className="absolute inset-0 flex items-center">
          <div className="px-4 md:px-16 text-center w-full">
            <h1 className="font-normal text-[24px] md:text-[52px] leading-[34px] md:leading-[72px] text-white">
              {t("heroTitle")}
            </h1>
            <p className="font-normal text-[18px] md:text-[24px] leading-[26px] md:leading-[34px] text-white mt-[8px] md:mt-[16px]">
              {t("heroSubtitle")}
            </p>
            <div className="mt-6 md:mt-10">
              <Button
                onClick={() => {
                  document
                    .getElementById("partner-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-black text-white border border-black hover:bg-white hover:text-black cursor-pointer font-normal uppercase rounded-md z-20 w-full md:w-[280px] h-[52px] text-sm"
              >
                {t("learnMoreBanner")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content — 910px centered ─── */}
      <div className="mx-auto" style={{ maxWidth: 910 }}>
        {/* Why Carato */}
        <div className="px-4" style={{ marginTop: 80 }}>
          <p className="font-medium text-[20px] md:text-[22px] leading-[28px] md:leading-[30px]">
            {t("whyTitle")}
          </p>
          <p className="font-light text-[16px] md:text-[18px] leading-[22px] md:leading-[26px] mt-2">
            {t("whyDescription")}
          </p>
        </div>

        {/* ─── Grid ─── */}
        <div className="mt-12 md:mt-20">
          <div className="flex flex-col md:flex-row w-full md:gap-5">
            {/* Left column */}
            <div className="flex flex-col w-full md:gap-5">
              {/* Top Left */}
              <GridCell
                src={GRID_CELLS.topLeft.src}
                title={GRID_CELLS.topLeft.title}
                description={GRID_CELLS.topLeft.description}
                className="h-[320px] md:h-[660px] w-full"
              />
              {/* Bottom Left */}
              <GridCell
                src={GRID_CELLS.bottomLeft.src}
                title={GRID_CELLS.bottomLeft.title}
                description={GRID_CELLS.bottomLeft.description}
                className="h-[320px] w-full"
              />
            </div>

            {/* Right column */}
            <div className="flex flex-col w-full md:gap-5">
              {/* Top Right */}
              <GridCell
                src={GRID_CELLS.topRight.src}
                title={GRID_CELLS.topRight.title}
                description={GRID_CELLS.topRight.description}
                className="h-[320px] w-full"
              />
              {/* Bottom Right */}
              <GridCell
                src={GRID_CELLS.bottomRight.src}
                title={GRID_CELLS.bottomRight.title}
                description={GRID_CELLS.bottomRight.description}
                className="h-[320px] md:h-[660px] w-full"
              />
            </div>
          </div>

          {/* Full-width bottom cell */}
          <div className="md:mt-5">
            <GridCell
              src={GRID_CELLS.fullWidth.src}
              title={GRID_CELLS.fullWidth.title}
              description={GRID_CELLS.fullWidth.description}
              className="h-[320px] w-full"
            />
          </div>
        </div>

        {/* ─── Application Form ─── */}
        <div id="partner-form" className="my-12 mb-20 px-4 md:px-0 md:my-30">
          {/* Form centered at 446px */}
          <div className="mx-auto" style={{ maxWidth: 446 }}>
            <p
              style={{
                fontWeight: 500,
                fontSize: 22,
                lineHeight: "30px",
                marginBottom: 24,
              }}
            >
              {t("formTitle")}
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col"
              style={{ gap: 24 }}
            >
              <TextField
                label={t("company")}
                placeholder={t("companyPlaceholder")}
                isRequired
                error={errors.company?.message}
                {...register("company", {
                  required: t("errors.companyRequired"),
                })}
              />

              {/* Business type dropdown */}
              <div className="relative">
                <label className="block mb-2 text-[12px] font-normal text-[#697586]">
                  <div className="flex gap-[2px]">
                    <span>{t("businessType")}</span>
                    <span className="text-red-600">*</span>
                  </div>
                </label>
                <div
                  className="relative cursor-pointer"
                  onClick={() => setBusinessTypeOpen((p) => !p)}
                >
                  <div
                    className={`w-full rounded-[4px] border px-3 flex items-center justify-between ${
                      businessTypeError ? "border-red-600" : "border-black"
                    }`}
                    style={{ height: 44, fontSize: 14, fontWeight: 400 }}
                  >
                    <span
                      style={{
                        color: selectedBusinessType ? "#000" : "#9AA4B2",
                      }}
                    >
                      {selectedBusinessType || t("businessTypePlaceholder")}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className={`transition-transform ${businessTypeOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M4 6l4 4 4-4"
                        stroke="#697586"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {businessTypeOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E3E8EE] rounded-md shadow-lg z-10 overflow-hidden">
                      {BUSINESS_TYPES.map((bt) => (
                        <div
                          key={bt}
                          className="px-3 py-2 hover:bg-[#F8F9FB] cursor-pointer"
                          style={{ fontSize: 14 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBusinessType(bt);
                            setBusinessTypeError("");
                            setBusinessTypeOpen(false);
                          }}
                        >
                          {bt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {businessTypeError && (
                  <p className="mt-2 text-[12px] font-normal text-red-600">
                    {businessTypeError}
                  </p>
                )}
              </div>

              <TextField
                label={t("fullName")}
                placeholder={t("fullNamePlaceholder")}
                isRequired
                error={errors.fullName?.message}
                {...register("fullName", {
                  required: t("errors.fullNameRequired"),
                })}
              />

              {/* Country dropdown */}
              <div className="relative">
                <label className="block mb-2 text-[12px] font-normal text-[#697586]">
                  <div className="flex gap-[2px]">
                    <span>{t("country")}</span>
                    <span className="text-red-600">*</span>
                  </div>
                </label>
                <div
                  className="relative cursor-pointer"
                  onClick={() => setCountryOpen((p) => !p)}
                >
                  <div
                    className={`w-full rounded-[4px] border px-3 flex items-center justify-between ${
                      countryError ? "border-red-600" : "border-black"
                    }`}
                    style={{ height: 44, fontSize: 14, fontWeight: 400 }}
                  >
                    <span
                      style={{ color: selectedCountry ? "#000" : "#9AA4B2" }}
                    >
                      {selectedCountry || t("countryPlaceholder")}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className={`transition-transform ${countryOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M4 6l4 4 4-4"
                        stroke="#697586"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {countryOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E3E8EE] rounded-md shadow-lg z-10 overflow-hidden">
                      {COUNTRIES.map((c) => (
                        <div
                          key={c}
                          className="px-3 py-2 hover:bg-[#F8F9FB] cursor-pointer"
                          style={{ fontSize: 14 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCountry(c);
                            setCountryError("");
                            setCountryOpen(false);
                          }}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {countryError && (
                  <p className="mt-2 text-[12px] font-normal text-red-600">
                    {countryError}
                  </p>
                )}
              </div>

              {/* Phone + Email in one row */}
              <div className="flex gap-6">
                <div className="flex-1">
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
                    render={({ field, fieldState }) => {
                      const maskRef = withMask("+\\9\\9\\8 99 999-99-99", {
                        placeholder: "_",
                        showMaskOnHover: false,
                      });

                      return (
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
                            ref={(el) => {
                              maskRef(el); // apply mask
                              field.ref(el); // connect to react-hook-form
                            }}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            className={fieldState.error ? "border-red-600" : ""}
                          />

                          {fieldState.error && (
                            <p className="mt-2 text-[12px] font-normal text-red-600">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      );
                    }}
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label={t("email")}
                    placeholder={t("emailPlaceholder")}
                    type="email"
                    isRequired
                    error={errors.email?.message}
                    {...register("email", {
                      required: t("errors.emailRequired"),
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t("errors.emailInvalid"),
                      },
                    })}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="mt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white border border-black hover:bg-white hover:text-black cursor-pointer font-normal uppercase rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ height: 52, fontSize: 14 }}
                >
                  {submitting ? t("submitting") : t("submit")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
