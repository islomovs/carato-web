"use client";

import AccordionPoint from "./AccordionPoint";

export default function ProductAccordion() {
  const points = [
    { title: "Description", content: "This is the description text..." },
    {
      title: "Characteristics",
      content: "Here are the product characteristics...",
    },
    { title: "Warranty", content: "Warranty information goes here..." },
    {
      title: "Delivery, Return, Service",
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
