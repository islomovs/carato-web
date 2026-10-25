import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import sharp from "sharp";

// Image resizer for MinIO uploads (see src/lib/imageLoader.ts).
// Replaces Next's built-in optimizer, which aborts origin downloads after a
// hard-coded 7s — too short for the 2–8 MB originals stored in MinIO.

export const runtime = "nodejs";

const ALLOWED_HOST = "minio.carato.uz";
const WIDTHS = [64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920];
const CACHE_DIR = path.join(os.tmpdir(), "carato-img-cache");
const FETCH_TIMEOUT_MS = 60_000;
const MAX_PARALLEL_FETCHES = 4;

// Same request in flight → share one download/resize
const inFlight = new Map<string, Promise<Buffer>>();

// Simple semaphore so a page full of images doesn't open dozens of origin downloads at once
let active = 0;
const queue: (() => void)[] = [];
async function withFetchSlot<T>(fn: () => Promise<T>): Promise<T> {
  if (active >= MAX_PARALLEL_FETCHES) {
    await new Promise<void>((resolve) => queue.push(resolve));
  }
  active++;
  try {
    return await fn();
  } finally {
    active--;
    queue.shift()?.();
  }
}

function snapWidth(w: number) {
  return WIDTHS.find((x) => x >= w) ?? WIDTHS[WIDTHS.length - 1];
}

async function render(src: string, width: number, quality: number) {
  const original = await withFetchSlot(async () => {
    const res = await fetch(src, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`Origin responded ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  });
  return sharp(original)
    .rotate() // respect EXIF orientation
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
}

function imageResponse(body: Buffer) {
  return new NextResponse(new Uint8Array(body), {
    headers: {
      "Content-Type": "image/webp",
      // MinIO file names are unique upload timestamps, so the content never changes
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const src = params.get("url") ?? "";
  const width = snapWidth(Number(params.get("w")) || 640);
  const quality = Math.min(Math.max(Number(params.get("q")) || 75, 30), 90);

  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }
  if (parsed.protocol !== "https:" || parsed.hostname !== ALLOWED_HOST) {
    return new NextResponse("Host not allowed", { status: 400 });
  }

  const key = createHash("sha1").update(`${parsed.href}|${width}|${quality}`).digest("hex");
  const file = path.join(CACHE_DIR, `${key}.webp`);

  try {
    return imageResponse(await fs.readFile(file));
  } catch {
    // not cached yet
  }

  try {
    let job = inFlight.get(key);
    if (!job) {
      job = render(parsed.href, width, quality);
      inFlight.set(key, job);
      job.finally(() => inFlight.delete(key)).catch(() => {});
    }
    const body = await job;

    // Write atomically so a concurrent reader never sees a half-written file
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, body);
    await fs.rename(tmp, file).catch(() => fs.unlink(tmp).catch(() => {}));

    return imageResponse(body);
  } catch (err) {
    console.error("Image resize failed, falling back to original:", parsed.href, err);
    // Better a slow image than a broken one
    return NextResponse.redirect(parsed.href, 302);
  }
}
