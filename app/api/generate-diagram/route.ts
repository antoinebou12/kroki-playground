import { NextResponse } from "next/server";
import { encodeDiagramPayload } from "@/lib/kroki/encode";
import { validateGenerateDiagramInput } from "@/lib/kroki/validate";

const DEFAULT_KROKI_BASE = "https://kroki.io";

function getKrokiBaseUrl(): string {
  const raw = process.env.KROKI_BASE_URL?.trim();
  const base = raw && raw.length > 0 ? raw : DEFAULT_KROKI_BASE;
  return base.replace(/\/+$/, "");
}

function mimeTypeForFormat(format: string): string {
  switch (format) {
    case "svg":
      return "image/svg+xml";
    case "png":
      return "image/png";
    case "jpeg":
      return "image/jpeg";
    case "pdf":
      return "application/pdf";
    case "txt":
      return "text/plain; charset=utf-8";
    case "base64":
      return "text/plain; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

function parseBody(input: unknown): Record<string, unknown> {
  if (input && typeof input === "object" && !Array.isArray(input)) {
    return input as Record<string, unknown>;
  }
  return {};
}

export async function POST(req: Request) {
  let krokiUrl: string | undefined;
  try {
    const json = await req.json().catch(() => null);
    const body = parseBody(json);
    const validated = validateGenerateDiagramInput({
      diagramSource: body.diagramSource,
      selectedDiagram: body.selectedDiagram,
      outputFormat: body.outputFormat,
    });
    if (!validated.ok) {
      return NextResponse.json(validated.body, { status: validated.status });
    }

    const encoded = encodeDiagramPayload(validated.diagramSource);
    krokiUrl = `${getKrokiBaseUrl()}/${validated.selectedDiagram}/${validated.outputFormat}/${encoded}`;

    const response = await fetch(krokiUrl);
    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Kroki returned an error",
          code: "KROKI_UPSTREAM_ERROR",
          upstreamStatus: response.status,
          attemptedUrl: krokiUrl,
        },
        { status: 502 },
      );
    }

    const buf = Buffer.from(await response.arrayBuffer());
    const diagramData = buf.toString("base64");
    const mimeType = mimeTypeForFormat(validated.outputFormat);

    return NextResponse.json({
      diagramUrl: krokiUrl,
      diagramData,
      mimeType,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to fetch the diagram",
        code: "INTERNAL_ERROR",
        details: message,
        ...(krokiUrl ? { attemptedUrl: krokiUrl } : {}),
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  let krokiUrl: string | undefined;
  try {
    const { searchParams } = new URL(req.url);
    const validated = validateGenerateDiagramInput({
      diagramSource: searchParams.get("diagramSource"),
      selectedDiagram: searchParams.get("selectedDiagram"),
      outputFormat: searchParams.get("outputFormat"),
    });
    if (!validated.ok) {
      return NextResponse.json(validated.body, { status: validated.status });
    }

    const encoded = encodeDiagramPayload(validated.diagramSource);
    krokiUrl = `${getKrokiBaseUrl()}/${validated.selectedDiagram}/${validated.outputFormat}/${encoded}`;

    const response = await fetch(krokiUrl);
    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Kroki returned an error",
          code: "KROKI_UPSTREAM_ERROR",
          upstreamStatus: response.status,
          attemptedUrl: krokiUrl,
        },
        { status: 502 },
      );
    }

    const buf = Buffer.from(await response.arrayBuffer());
    const diagramData = buf.toString("base64");
    const mimeType = mimeTypeForFormat(validated.outputFormat);

    return NextResponse.json({
      diagramUrl: krokiUrl,
      diagramData,
      mimeType,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to fetch the diagram",
        code: "INTERNAL_ERROR",
        details: message,
        ...(krokiUrl ? { attemptedUrl: krokiUrl } : {}),
      },
      { status: 500 },
    );
  }
}
