import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const authHeader = req.headers.get("authorization") ?? "";

  const response = await fetch(
    "https://api.carato.uz/api/v1/files/admin/upload",
    {
      method: "POST",
      headers: { Authorization: authHeader },
      body: formData,
    },
  );

  const data = await response.json();
  return NextResponse.json(data);
}
