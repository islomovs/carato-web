"use client";

import { useTranslations } from "next-intl";
import AccordionPoint from "../catalog/AccordionPoint";

interface ProductAccordionProps {
  description: string;
  chracteristics: string;
}

export default function ProductAccordion({
  description,
  chracteristics,
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
