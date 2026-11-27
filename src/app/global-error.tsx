"use client";

import { useEffect } from "react";
import { isChunkLoadError, reloadOnceForNewBuild } from "@/lib/chunkError";

// Last-resort boundary (errors in the root layout itself). Replaces <html>, so no providers here.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
    if (isChunkLoadError(error)) reloadOnceForNewBuild();
  }, [error]);

  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          fontFamily: "sans-serif",
          textAlign: "center",
          padding: 16,
          background: "#fff",
          color: "#000",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 400, margin: 0 }}>Что-то пошло не так</h1>
        <p style={{ fontSize: 16, fontWeight: 300, margin: 0 }}>Пожалуйста, обновите страницу.</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 16,
            height: 44,
            padding: "0 32px",
            borderRadius: 4,
            background: "#000",
            color: "#fff",
            border: 0,
            fontSize: 14,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Обновить
        </button>
      </body>
    </html>
  );
}
