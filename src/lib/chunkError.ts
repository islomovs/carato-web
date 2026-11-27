// After a deploy, a tab still running the previous build asks for JS/CSS chunks that no longer exist.
// That surfaces as "Application error". Reloading once picks up the new build.

const KEY = "carato-chunk-reload-at";

export function isChunkLoadError(error: unknown): boolean {
  const e = error as { name?: string; message?: string } | null;
  const text = `${e?.name ?? ""} ${e?.message ?? ""}`;
  return /ChunkLoadError|Loading (CSS )?chunk [\w-]+ failed|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
    text,
  );
}

/** Hard-reloads the page, at most once per 30s so a genuinely broken deploy can't loop. Returns whether it reloaded. */
export function reloadOnceForNewBuild(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < 30_000) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    // storage blocked — still reload once (no loop guard available)
  }
  window.location.reload();
  return true;
}
