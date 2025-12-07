/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TotalsColumn } from "../shared/checkout/TotalsColumn";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { ContactInfoSection } from "../shared/checkout/ContactInfoSection";
import { DeliveryOptionsSection } from "../shared/checkout/DeliveryOptionsSection";
import AddressSection from "../shared/checkout/AddressSection";
import DateTimeSection from "../shared/checkout/DateTimeSection";
import PaymentTypesSection from "../shared/checkout/PaymentMethodsSection";
import PromocodeField from "../shared/checkout/PromocodeField";
import PageHeader from "../shared/PageHeader";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { useEffect, useState } from "react";

export type PaymentOption = "click" | "payme" | "cash";

type CheckoutLayerProps = {
  open: boolean;
  onClose?: () => void;
  fullPage?: boolean;
};

export default function CheckoutLayer({
  open,
  onClose,
  fullPage = false,
}: CheckoutLayerProps) {
  const t = useTranslations("checkout");
  const { createOrder } = useCreateOrder();

  const cartItems = useCartStore((state) => state.cartItems);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    if (open) {
      fetchCart();
    }
  }, [open, fetchCart]);

  const [deliveryPrice, setDeliveryPrice] = useState(0);

  const { totalQuantity, totalPrice, totalOldPrice } = useCartStore();

  // Savings
  const savings = totalOldPrice() - totalPrice();

  const totalSum = totalPrice() + deliveryPrice;

  const { register, control, handleSubmit, watch, setValue } = useForm<{
    phone: string;
    fullName: string;
    deliveryType: string;
    address: string;
    apartmentNumber: string;
    entrance: string;
    floor: string;
    comment: string;
    deliveryPreferredTime: string;
    paymentType: "click" | "payme" | "cash";
    totalSum: number;
    promocode: string;
  }>({
    defaultValues: {
      phone: "+998 ",
      fullName: "",
      deliveryType: "",
      address: "",
      apartmentNumber: "",
      entrance: "",
      floor: "",
      comment: "",
      deliveryPreferredTime: "",
      paymentType: "click",
      totalSum: 0,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // Формируем массив продуктов для отправки
      const productsPayload = cartItems.map((item) => {
        const variant = item.product.variants[0]; // или нужный вариант
        return {
          product: item.product.slug,
          size: variant.size.id,
          quantity: item.quantity,
        };
      });

      const payload = {
        ...data, // остальные поля формы
        products: productsPayload,
        totalSum: totalSum,
      };

      console.log("🔥 Checkout Payload:", payload);

      // Создаем заказ через хук
      const response = await createOrder(payload);

      // Если приходит checkoutUrl — редиректим
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        console.error("No checkoutUrl in response:", response);
      }
    } catch (err) {
      console.error("Failed to create order:", err);
    }
  };

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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 flex flex-col"
          >
            <div className="flex flex-row h-full md:mb-20">
              <div className="w-full mx-auto h-full bg-white flex flex-col md:px-4 md:pt-[52px]">
                <PageHeader
                  title={t("title")}
                  onBack={onBack}
                  onClose={onClose}
                  absoluteClose={true}
                  centeredTitle={true}
                  showDesktopButton={true}
                  className="md:relative md:justify-start md:gap-8 md:border-0 md:top-auto md:z-auto md:bg-transparent md:px-0 md:py-0"
                />
                <div className="flex-1 space-y-6 px-4 pt-8 md:px-4 pb-56 md:pb-20 overflow-auto">
                  {/* Контактная информация */}
                  <ContactInfoSection control={control} register={register} />

                  <hr className="border-t border-[#EEF2F6]" />

                  {/* Варианты доставки */}
                  <DeliveryOptionsSection watch={watch} setValue={setValue} />

                  {/* Адрес доставки */}
                  <AddressSection watch={watch} setValue={setValue} />

                  {/* Дата и время доставки */}
                  <DateTimeSection
                    setValue={setValue}
                    setDeliveryPrice={setDeliveryPrice}
                  />

                  <hr className="border-t border-[#EEF2F6]" />

                  {/* Способ оплаты */}
                  <PaymentTypesSection control={control} name="paymentType" />

                  {/* Промокод */}
                  <PromocodeField control={control} name="promocode" />
                </div>

                {/* footer summary (sticky inside sheet) */}
              </div>
              <TotalsColumn
                totalPrice={totalPrice()}
                savings={savings}
                count={totalQuantity()}
                control={control}
                isCheckoutPage
              />
            </div>
          </form>
        </div>
      </div>
    )
  );
}
