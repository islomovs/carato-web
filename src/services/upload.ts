import { getTokenPair } from "@/lib/axios/instance";

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file, file.name);

  const { token } = getTokenPair();

  const response = await fetch("/api/upload", {
    // → app/api/upload/route.ts
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

  const data = await response.json();
  return data.file;
}
