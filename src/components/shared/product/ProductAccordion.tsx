"use client";

import { useTranslations } from "next-intl";
import AccordionPoint from "../catalog/AccordionPoint";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductAccordionProps {
  description: string;
  chracteristics: string;
  loading: boolean;
}

export default function ProductAccordion({
  description,
  chracteristics,
  loading,
}: ProductAccordionProps) {
  const t = useTranslations("product");

  const points = [
    { title: t("description"), content: description },
    {
      title: t("characteristics"),
      content: chracteristics,
    },
    { title: t("warranty"), content: "Warranty information goes here..." },
    {
      title: t("deliveryReturnService"),
      content: "Delivery and return policies plus after-sales service info...",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col w-full gap-0">
        {[1, 2, 3, 4].map((point) => (
          <Skeleton key={point} className="h-10 w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-0">
      {points.map((point) => (
        <AccordionPoint
          key={point.title}
          title={point.title}
          content={point.content}
        />
      ))}
    </div>
  );
}
