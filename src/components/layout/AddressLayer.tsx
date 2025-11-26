"use client";

import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { TextField } from "../shared/TextField";
import FeedbackInput from "../shared/feedback/FeedbackInput";
import PageHeader from "../shared/PageHeader";
import useLockScroll from "@/hooks/useLockScroll";

type AddressLayerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (date: string, time: string, price: number) => void;
};

export default function AddressLayer({
  open,
  onClose,
  onSelect,
}: AddressLayerProps) {
  const handleConfirm = () => {};

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
            <div className="w-full md:w-[520px] md:mx-0 h-full bg-white flex flex-col">
              <PageHeader
                title="Адрес доставки"
                onBack={onClose}
                onClose={onClose}
                centeredTitle={true}
                absoluteClose={true}
                className="md:px-10 md:pt-10 md:pb-5"
              />

              {/* content */}
              <div className="flex-1 overflow-auto px-4 pt-8 pb-[120px] space-y-6 md:px-10 md:py-5">
                <TextField
                  label="Адрес доставки"
                  placeholder="Город, улица, дом"
                  isRequired
                />
                <TextField label="Подъезд" placeholder="Введите подъезд" />
                <TextField label="Этаж" placeholder="Введите этаж" />
                <FeedbackInput
                  label="Комментарий для курьера"
                  value=""
                  onChange={() => {}}
                  placeholder="Введите комментарий"
                  rows={4}
                  multiline
                />

                <TextField
                  label="Адрес доставки"
                  placeholder="Город, улица, дом"
                  isRequired
                />
                <TextField label="Подъезд" placeholder="Введите подъезд" />
                <TextField label="Этаж" placeholder="Введите этаж" />
                <FeedbackInput
                  label="Комментарий для курьера"
                  value=""
                  onChange={() => {}}
                  placeholder="Введите комментарий"
                  rows={4}
                  multiline
                />
              </div>

              {/* bottom fixed button */}
              <div className="fixed bottom-0 left-0 right-0 px-4 py-3 md:px-10 md:pr-[54px] md:py-5 bg-white border-t border-[#EEF2F6] md:static md:flex md:justify-end">
                <Button
                  onClick={handleConfirm}
                  className="cursor-pointer w-full py-[26px] md:px-4 bg-black text-white rounded-[10px] md:rounded-md font-medium md:font-normal hover:bg-white hover:text-black border border-black md:w-auto flex items-center justify-center uppercase"
                >
                  Подтвердить
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
