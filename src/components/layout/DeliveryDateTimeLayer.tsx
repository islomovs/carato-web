"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../shared/PageHeader";
import useLockScroll from "@/hooks/useLockScroll";

type DeliveryDateTimeLayerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (date: string, time: string, price: number) => void;
  deliveryOptions?: { label: string; price: number }[];
  timeOptions?: string[];
};

export default function DeliveryDateTimeLayer({
  open,
  onClose,
  onSelect,
  deliveryOptions = [
    { label: "Завтра, 08.10", price: 0 },
    { label: "Послезавтра, 09.10", price: 0 },
    { label: "Суббота, 10.10", price: 100_000 },
    { label: "Воскресенье, 11.10", price: 100_000 },
  ],
  timeOptions = [
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "12:00",
    "17:00",
  ],
}: DeliveryDateTimeLayerProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    const option = deliveryOptions.find((d) => d.label === selectedDate);
    const price = option?.price || 0;
    onSelect(selectedDate, selectedTime, price);
  };

  useLockScroll(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#00000040] z-[55] mb-0"
            onClick={onClose}
          />

          <motion.div
            key="delivery-datetime-layer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-0 right-0 top-0 bottom-0 
            md:fixed md:top-4 md:right-4 md:bottom-4 md:left-auto 
            md:rounded-[8px] flex z-[60] bg-white overflow-hidden md:justify-end mb-0"
          >
            <div className="md:max-w-[520px] mx-auto md:mx-0 h-full bg-white flex flex-col">
              <PageHeader
                title="Дата и время доставки"
                onBack={onClose}
                onClose={onClose}
                centeredTitle={true}
                absoluteClose={true}
                className="md:px-10 md:pt-10 md:pb-5 md:border-b md:border-[#EEF2F6]"
              />

              {/* content */}
              <div className="flex-1 overflow-auto px-4 pt-8 pb-[120px] space-y-6 md:px-10 md:py-5">
                {/* Дата доставки */}
                <div>
                  <h3 className="text-[14px] font-normal mb-6">
                    Дата доставки
                  </h3>
                  <div className="grid grid-cols-2 gap-3 md:gap-5">
                    {deliveryOptions.map((opt) => {
                      const selected = selectedDate === opt.label;
                      return (
                        <Button
                          variant="default"
                          key={opt.label}
                          onClick={() => setSelectedDate(opt.label)}
                          className={`flex-1 px-4 py-[21px] rounded-md border border-black cursor-pointer hover:bg-black hover:text-white min-w-48 ${
                            selected
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          } flex items-center justify-center gap-2`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              selected
                                ? "block bg-white"
                                : "hidden bg-transparent border border-[#D1D5DB]"
                            }`}
                          >
                            <Image
                              src="/icons/check.svg"
                              alt="check"
                              width={12}
                              height={12}
                            />
                          </div>
                          <span
                            className={`${selected ? "font-medium" : "font-normal"} text-[14px]`}
                          >
                            {opt.label}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Время доставки */}
                <div>
                  <h3 className="text-[14px] font-normal mb-6">
                    Время доставки
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                    {timeOptions.map((time) => {
                      const selected = selectedTime === time;
                      return (
                        <Button
                          variant="default"
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`flex-1 px-4 py-[21px] rounded-md border border-black cursor-pointer hover:bg-black hover:text-white ${
                            selected
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          } flex items-center justify-center gap-2`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              selected
                                ? "block bg-white"
                                : "hidden bg-transparent border border-[#D1D5DB]"
                            }`}
                          >
                            <Image
                              src="/icons/check.svg"
                              alt="check"
                              width={12}
                              height={12}
                            />
                          </div>
                          <span
                            className={`${selected ? "font-medium" : "font-normal"} text-[14px]`}
                          >
                            {time}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* bottom fixed button */}
              <div className="fixed bottom-0 left-0 right-0 px-4 py-3 md:px-10 md:pr-[54px] md:py-5 bg-white border-t border-[#EEF2F6] md:static md:flex md:justify-end">
                <Button
                  onClick={handleConfirm}
                  disabled={!selectedDate || !selectedTime}
                  className="cursor-pointer w-full py-[26px] md:px-4 bg-black text-white rounded-[10px] md:rounded-md font-medium md:font-normal hover:bg-white hover:text-black border border-black md:w-auto flex items-center justify-center min-w-[235px] uppercase"
                >
                  {selectedDate && selectedTime
                    ? `${
                        deliveryOptions.find((d) => d.label === selectedDate)
                          ?.price === 0
                          ? "БЕСПЛАТНАЯ ДОСТАВКА"
                          : `${deliveryOptions.find((d) => d.label === selectedDate)?.price?.toLocaleString()} UZS ЗА ДОСТАВКУ`
                      }`
                    : "Выберите дату и время доставки"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
