import Image from "next/image";
import DeliveryDateTimeLayer from "../layout/DeliveryDateTimeLayer";
import { useState } from "react";

interface DateTimeSectionProps {
  selectedDate: string | null;
  selectedTime: string | null;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setDeliveryPrice: (price: number) => void;
}

export default function DateTimeSection({
  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
  setDeliveryPrice,
}: DateTimeSectionProps) {
  const [deliveryDateTimeOpen, setDeliveryDateTimeOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center gap-4 py-2 md:p-6 md:bg-[#F8FAFC] md:hover:bg-[#EAF1F7] cursor-pointer"
        onClick={() => setDeliveryDateTimeOpen(true)}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-[#EEF2F6] rounded">
          <Image
            src="/icons/calendar.svg"
            alt="calendar"
            width={20}
            height={20}
          />
        </div>

        <div className="flex-1 text-left">
          <div className="text-[14px] font-light text-[#697586]">
            Дата и время доставки
          </div>
          <div className="text-[16px] font-normal">
            {selectedDate && selectedTime
              ? `${selectedDate} в ${selectedTime}`
              : "Выберите дату и время доставки"}
          </div>
        </div>
        <div className="w-6 h-6 flex items-center justify-center">
          <Image
            src="/icons/chevron-right.svg"
            alt=">"
            width={20}
            height={20}
          />
        </div>
      </div>
      <DeliveryDateTimeLayer
        open={deliveryDateTimeOpen}
        onClose={() => setDeliveryDateTimeOpen(false)}
        onSelect={(date, time, price) => {
          setSelectedDate(date);
          setSelectedTime(time);
          setDeliveryPrice(price);
          setDeliveryDateTimeOpen(false);
          console.log("Delivery date time open isss:", deliveryDateTimeOpen);
        }}
      />
    </>
  );
}
