"use client";

import { motion } from "framer-motion";
import CheckoutLayer from "@/components/layout/CheckoutLayer";

export default function CheckoutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <CheckoutLayer open={true} fullPage totalPrice={123456} />
    </motion.div>
  );
}
