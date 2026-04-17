import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

const ORIGINAL_ENV = process.env;

function mockFetchOk(body: Uint8Array = new Uint8Array([1, 2, 3])) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(body, { status: 200 })),
  );
}

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.KROKI_BASE_URL;
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/generate-diagram", () => {
  it("returns 400 when validation fails", async () => {
    mockFetchOk();
    const res = await POST(
      new Request("http://localhost/api/generate-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagramSource: "x",
          selectedDiagram: "",
        }),
      }),
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.code).toBe("MISSING_DIAGRAM_TYPE");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns diagram payload when Kroki succeeds", async () => {
    mockFetchOk();
    const res = await POST(
      new Request("http://localhost/api/generate-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagramSource: "graph LR\n  A-->B",
          selectedDiagram: "mermaid",
          outputFormat: "svg",
        }),
      }),
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      diagramUrl: string;
      diagramData: string;
      mimeType: string;
    };
    expect(json.mimeType).toBe("image/svg+xml");
    expect(json.diagramUrl).toMatch(
      /^https:\/\/kroki\.io\/mermaid\/svg\/[A-Za-z0-9_-]+$/,
    );
    expect(json.diagramData).toBe(Buffer.from([1, 2, 3]).toString("base64"));
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("returns 502 when Kroki responds with an error status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );
    const res = await POST(
      new Request("http://localhost/api/generate-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagramSource: "x",
          selectedDiagram: "mermaid",
          outputFormat: "svg",
        }),
      }),
    );
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.code).toBe("KROKI_UPSTREAM_ERROR");
    expect(json.upstreamStatus).toBe(500);
  });

  it("strips trailing slashes from KROKI_BASE_URL", async () => {
    process.env.KROKI_BASE_URL = "https://example.test///";
    mockFetchOk();
    const res = await POST(
      new Request("http://localhost/api/generate-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagramSource: "x",
          selectedDiagram: "mermaid",
          outputFormat: "svg",
        }),
      }),
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as { diagramUrl: string };
    expect(json.diagramUrl.startsWith("https://example.test/mermaid/svg/")).toBe(
      true,
    );
  });
});

describe("GET /api/generate-diagram", () => {
  it("returns 400 when query params fail validation", async () => {
    mockFetchOk();
    const url = new URL("http://localhost/api/generate-diagram");
    url.searchParams.set("diagramSource", "a");
    url.searchParams.set("selectedDiagram", "nope");
    const res = await GET(new Request(url.toString()));
    expect(res.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("proxies Kroki using query string source", async () => {
    mockFetchOk();
    const url = new URL("http://localhost/api/generate-diagram");
    url.searchParams.set("diagramSource", "graph TD\n  A-->B");
    url.searchParams.set("selectedDiagram", "mermaid");
    const res = await GET(new Request(url.toString()));
    expect(res.status).toBe(200);
    const json = (await res.json()) as { mimeType: string };
    expect(json.mimeType).toBe("image/svg+xml");
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
