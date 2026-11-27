"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { isChunkLoadError, reloadOnceForNewBuild } from "@/lib/chunkError";

const TEXT: Record<string, { title: string; body: string; reload: string }> = {
  ru: {
    title: "Что-то пошло не так",
    body: "Пожалуйста, обновите страницу.",
    reload: "Обновить",
  },
  uz: {
    title: "Nimadir xato ketdi",
    body: "Iltimos, sahifani yangilang.",
    reload: "Yangilash",
  },
};

export default function Error({ error }: { error: Error & { digest?: string } }) {
  const locale = useLocale();
  const t = TEXT[locale] ?? TEXT.ru;
  // Stale build after a deploy → reload straight away instead of showing an error
  const [reloading, setReloading] = useState(() => isChunkLoadError(error));

  useEffect(() => {
    console.error(error);
    if (isChunkLoadError(error) && !reloadOnceForNewBuild()) setReloading(false);
  }, [error]);

  if (reloading) return <div className="min-h-[60vh]" />;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-[24px] font-normal">{t.title}</h1>
      <p className="text-[16px] font-light text-[#4B5565]">{t.body}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 h-[44px] px-8 rounded-[4px] bg-black text-white text-[14px] uppercase cursor-pointer"
      >
        {t.reload}
      </button>
    </div>
  );
}
