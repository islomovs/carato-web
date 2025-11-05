"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  title: string;
  content: string;
};

export default function AccordionPoint({ title, content }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#EEF2F6]">
      <Button
        variant="ghost"
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full py-[26px] !px-0 uppercase font-[400] text-[14px] cursor-pointer"
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </Button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mt-3 mb-4 text-[#4B5565] font-[300] text-[14px]"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
