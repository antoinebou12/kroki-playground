import { describe, expect, it } from "vitest";
import {
  decodeDiagramPayloadFromUrlParam,
  encodeDiagramPayload,
} from "./encode";

describe("encodeDiagramPayload", () => {
  it("round-trips through URL-safe base64 + inflate/deflate", () => {
    const src = "hello kroki";
    const encoded = encodeDiagramPayload(src);
    const back = decodeDiagramPayloadFromUrlParam(encoded);
    expect(back).toBe(src);
  });

  it("round-trips empty string", () => {
    const encoded = encodeDiagramPayload("");
    expect(decodeDiagramPayloadFromUrlParam(encoded)).toBe("");
  });

  it("round-trips unicode including surrogate pairs", () => {
    const src = "你好 🎨 é";
    const encoded = encodeDiagramPayload(src);
    expect(decodeDiagramPayloadFromUrlParam(encoded)).toBe(src);
  });

  it("round-trips a multi-line diagram source", () => {
    const src = "graph TD\n  A-->B\n  B-->C";
    const encoded = encodeDiagramPayload(src);
    expect(decodeDiagramPayloadFromUrlParam(encoded)).toBe(src);
  });

  it("produces base64url output without padding", () => {
    const encoded = encodeDiagramPayload("x");
    expect(encoded).not.toMatch(/[=+]/);
    expect(encoded).not.toContain("/");
  });
});
