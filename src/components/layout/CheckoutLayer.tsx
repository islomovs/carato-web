/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { TotalsColumn } from "../shared/TotalsColumn";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { ContactInfoSection } from "../shared/ContactInfoSection";
import { DeliveryOptionsSection } from "../shared/DeliveryOptionsSection";
import AddressSection from "../shared/AddressSection";
import DateTimeSection from "../shared/DateTimeSection";
import PaymentMethodsSection from "../shared/PaymentMethodsSection";
import PromocodeField from "../shared/PromocodeField";
import PageHeader from "../shared/PageHeader";
import { useRouter } from "next/navigation";

type DeliveryOption = "courier" | "yandex";
export type PaymentOption = "click" | "payme" | "cash";

type CheckoutLayerProps = {
  open: boolean;
  onClose?: () => void;
  totalPrice: number;
  onSubmit?: (payload: any) => void;
  fullPage?: boolean;
};

export default function CheckoutLayer({
  open,
  onClose,
  totalPrice,
  onSubmit,
  fullPage = false,
}: CheckoutLayerProps) {
  const t = useTranslations("auth");
  const [fullname, setFullname] = useState("");
  const [fullnameTouched, setFullnameTouched] = useState(false);
  const [delivery, setDelivery] = useState<DeliveryOption | null>("courier");
  const [address, setAddress] = useState("");
  const [promo, setPromo] = useState("");
  const [payment, setPayment] = useState<PaymentOption | null>("click");

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);

  const { control, handleSubmit } = useForm<{ phone: string }>({
    defaultValues: { phone: "+998 " },
  });

  const totalFinalPrice = totalPrice + deliveryPrice;
  const containerClass = "w-full mx-auto h-full bg-white flex flex-col";

  const router = useRouter();

  function onBack() {
    router.back();
  }

  if (!open && !fullPage) return null;

  return (
    open && (
      <div
        className={fullPage ? "" : "fixed inset-0 z-50"}
        aria-modal={!fullPage}
        role={fullPage ? "region" : "dialog"}
      >
        {!fullPage && (
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
        )}

        {/* sheet */}
        <div
          className={
            fullPage
              ? containerClass
              : "absolute left-0 right-0 bottom-0 top-0 overflow-auto"
          }
        >
          <div className="flex flex-row h-full md:mb-20">
            <div className="w-full mx-auto h-full bg-white flex flex-col md:px-4 md:pt-[52px]">
              <PageHeader
                title="Оформление"
                onBack={onBack}
                onClose={onClose}
                absoluteClose={true}
                centeredTitle={true}
                showDesktopButton={true}
                className="md:relative md:justify-start md:gap-8 md:border-0 md:top-auto md:z-auto md:bg-transparent md:px-0 md:py-0"
              />

              <div className="flex-1 space-y-6 px-4 pt-8 md:px-4 pb-56 md:pb-20 overflow-auto">
                {/* Контактная информация */}
                <ContactInfoSection
                  control={control}
                  fullname={fullname}
                  fullnameTouched={fullnameTouched}
                  setFullname={setFullname}
                  setFullnameTouched={setFullnameTouched}
                  t={t}
                />

                <hr className="border-t border-[#EEF2F6]" />

                {/* Варианты доставки */}
                <DeliveryOptionsSection
                  delivery={delivery}
                  setDelivery={setDelivery}
                />

                {/* Адрес доставки */}
                <AddressSection />

                {/* Дата и время доставки */}
                <DateTimeSection
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  setSelectedDate={setSelectedDate}
                  setSelectedTime={setSelectedTime}
                  setDeliveryPrice={setDeliveryPrice}
                />

                <hr className="border-t border-[#EEF2F6]" />

                {/* Способ оплаты */}
                <PaymentMethodsSection
                  payment={payment}
                  setPayment={setPayment}
                />

                {/* Промокод */}
                <PromocodeField promo={promo} setPromo={setPromo} />
              </div>

              {/* footer summary (sticky inside sheet) */}
            </div>
            <TotalsColumn
              totalPrice={totalFinalPrice}
              savings={12000}
              count={10}
              promo={promo}
              setPromo={setPromo}
              payment={payment}
              setPayment={setPayment}
              isCheckoutPage
            />
          </div>
        </div>
      </div>
    )
  );
}
