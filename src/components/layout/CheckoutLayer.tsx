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
import { useState } from "react";
import { toast } from "sonner";

export type PaymentOption = "ATMOS" | "CASH";

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
  const router = useRouter();

  const cartItems = useCartStore((state) => state.cartItems);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const { totalQuantity, totalPrice, totalOldPrice } = useCartStore();
  const savings = totalOldPrice() - totalPrice();
  const totalSum = totalPrice() + deliveryPrice;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{
    phone: string;
    fullName: string;
    deliveryType: string;
    address: string;
    apartmentNumber: string;
    entrance: string;
    floor: string;
    comment: string;
    deliveryPreferredTime: string;
    paymentType: "ATMOS" | "CASH";
    totalSum: number;
    promocode: string;
  }>({
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: false,
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
      paymentType: "ATMOS",
      totalSum: 0,
    },
  });

  const onSubmit = async (data: any) => {
    if (!data.deliveryType) {
      toast.error(t("errors.deliveryRequired"));
      return;
    }
    if (!data.address) {
      toast.error(t("errors.addressRequired"));
      return;
    }
    if (!data.deliveryPreferredTime) {
      toast.error(t("errors.dateTimeRequired"));
      return;
    }
    if (!data.paymentType) {
      toast.error(t("errors.paymentRequired"));
      return;
    }

    try {
      const productsPayload = cartItems.map((item) => {
        const variant = item.product.variants[0];
        return {
          product: item.product.slug,
          size: variant.size.id,
          quantity: item.quantity,
        };
      });

      const payload = {
        ...data,
        products: productsPayload,
        totalSum,
      };

      console.log("Checkout Payload:", payload);

      const response = await createOrder(payload);
      const checkoutUrl = response?.checkoutUrl;

      if (data.paymentType === "ATMOS" && checkoutUrl) {
        // checkoutUrl is returned directly by the order creation endpoint
        window.location.href = checkoutUrl;
      } else {
        // CASH or no checkout URL — go to profile orders tab
        router.push("/profile?tab=orders");
      }
    } catch (err) {
      console.error("Failed to create order:", err);
      toast.error("Could not place order. Please try again.");
    }
  };

  const containerClass = "w-full mx-auto h-full bg-white flex flex-col";

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
                  <ContactInfoSection
                    control={control}
                    register={register}
                    errors={errors}
                  />

                  <hr className="border-t border-[#EEF2F6]" />

                  <DeliveryOptionsSection watch={watch} setValue={setValue} />

                  <AddressSection watch={watch} setValue={setValue} />

                  <DateTimeSection
                    setValue={setValue}
                    setDeliveryPrice={setDeliveryPrice}
                  />

                  <hr className="border-t border-[#EEF2F6]" />

                  <PaymentTypesSection control={control} name="paymentType" />

                  <PromocodeField control={control} name="promocode" />
                </div>
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
