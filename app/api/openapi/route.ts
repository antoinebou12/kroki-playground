import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

/** Serves the same OpenAPI document as `public/openapi.yaml` for tools that expect an API route. */
export async function GET() {
  const filePath = join(process.cwd(), "public", "openapi.yaml");
  const yaml = await readFile(filePath, "utf8");
  return new NextResponse(yaml, {
    headers: {
      "Content-Type": "application/yaml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
