"use client";

import Image from "next/image";

interface EmptySearchProps {
  query: string;
}

export function EmptySearch({ query }: EmptySearchProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full min-h-[240px] md:min-h-[320px]">
      <Image
        src="/icons/search.svg"
        alt="Nothing found"
        width={64}
        height={64}
        className="opacity-40"
      />

      <p className="mt-4 text-lg font-medium">Ничего не найдено</p>

      <p className="mt-2 text-sm text-[#6B7280]">
        По запросу <span className="font-medium text-black">“{query}”</span>{" "}
        ничего не найдено.
        <br />
        Попробуйте изменить запрос.
      </p>
    </div>
  );
}
