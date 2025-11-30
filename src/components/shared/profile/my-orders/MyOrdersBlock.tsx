import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "use-intl";
import OrderDetails from "./OrderDetails";
import { useMyOrders } from "@/hooks/useMyOrders";
import SkeletonMyOrdersBlock from "./SkeletonMyOrdersBlock";
import EmptyOrdersBlock from "./EmptyOrdersBlock";
import OrderCard from "./OrderCard";

export default function MyOrdersBlock() {
  const t = useTranslations("profile");

  const { orders, loading, error, reload } = useMyOrders();

  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  if (loading) return <SkeletonMyOrdersBlock />;

  if (error)
    return (
      <div className="text-red-600">
        {error}
        <button onClick={reload} className="underline ml-2">
          {t("retry")}
        </button>
      </div>
    );

  if (orders?.length === 0) return <EmptyOrdersBlock />;

  const handleOpenDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOrderDetailsOpen(true);
  };

  return (
    <>
      <motion.div
        key="orders"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-[910px]"
      >
        {orders?.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onOpenDetails={() => handleOpenDetails(order.id)}
          />
        ))}
      </motion.div>

      <OrderDetails
        orderId={selectedOrderId}
        open={orderDetailsOpen}
        onClose={() => setOrderDetailsOpen(false)}
      />
    </>
  );
}
