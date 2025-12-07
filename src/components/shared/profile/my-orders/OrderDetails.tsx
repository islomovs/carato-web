"use client";

import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../../PageHeader";
import useLockScroll from "@/hooks/useLockScroll";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useOrderById } from "@/hooks/useOrderById";
import OrderDetailsSkeleton from "./OrderDetailsSkeleton";
import OrderDetailsProducts from "./OrderDeatilsProducts";
import OrderDetailsInfo from "./OrderDetailsInfo";

type OrderDetailsProps = {
  orderId: number | null;
  open: boolean;
  onClose: () => void;
};

export default function OrderDetails({
  orderId,
  open,
  onClose,
}: OrderDetailsProps) {
  const t = useTranslations("profile");
  const tabs = [
    { id: "details", label: t("orderDetails") },
    { id: "products", label: t("productList") },
  ];

  useLockScroll(open);
  const [active, setActive] = useState("details");

  const { order, loading, error } = useOrderById(orderId);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#00000040] z-[55]"
            onClick={onClose}
          />

          {/* Side panel */}
          <motion.div
            key="order-details-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-0 right-0 top-0 bottom-0 
              md:fixed md:top-4 md:right-4 md:bottom-4 md:left-auto 
              md:rounded-[8px] flex z-[60] bg-white overflow-hidden md:justify-end"
          >
            <div className="w-full md:w-[520px] h-full bg-white flex flex-col">
              <PageHeader
                title={order ? `Заказ №${order.id}` : "Загрузка..."}
                onBack={onClose}
                onClose={onClose}
                centeredTitle
                absoluteClose
                className="md:px-10 md:pt-10 md:pb-5"
              />

              {/* Tabs */}
              <div className="flex justify-start gap-[40px] relative border-b border-b-[#EEF2F6] w-full md:px-10">
                {tabs.map((tab) => {
                  const isActive = tab.id === active;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActive(tab.id)}
                      className={cn(
                        "relative py-[24px] text-[14px] font-normal text-[#1D1D1F] transition-colors cursor-pointer",
                        isActive ? "font-medium" : "text-[#697586]"
                      )}
                    >
                      {tab.label}
                      {isActive && (
                        <motion.div
                          layoutId="underline"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                          className="absolute left-0 right-0 -bottom-[1px] h-[0.5px] bg-black"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="w-full flex justify-center overflow-y-auto">
                <div className="flex flex-col w-full md:gap-10 md:px-10 md:py-5 pb-20">
                  {loading && <OrderDetailsSkeleton />}
                  {error && <div className="text-red-600">{error}</div>}
                  {order && (
                    <AnimatePresence mode="wait">
                      {active === "details" && (
                        <OrderDetailsInfo order={order} />
                      )}

                      {active === "products" && (
                        <OrderDetailsProducts order={order} />
                      )}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
