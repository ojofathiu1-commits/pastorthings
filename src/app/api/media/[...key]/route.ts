import { NextResponse } from "next/server";
import { getObject } from "@/lib/storage";

export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;

  try {
    const object = await getObject(key.join("/"));
    const stream = object.Body?.transformToWebStream();
    if (!stream) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return new Response(stream, {
      headers: {
        "Content-Type": object.ContentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
