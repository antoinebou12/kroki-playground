import { describe, expect, it } from "vitest";
import { DIAGRAM_TYPES, isDiagramType } from "./diagramTypes";

describe("isDiagramType", () => {
  it("returns true for every canonical slug", () => {
    for (const t of DIAGRAM_TYPES) {
      expect(isDiagramType(t)).toBe(true);
    }
  });

  it("accepts vega-lite with a hyphen", () => {
    expect(isDiagramType("vega-lite")).toBe(true);
  });

  it("rejects common typos and aliases", () => {
    expect(isDiagramType("vegalite")).toBe(false);
    expect(isDiagramType("PlantUML")).toBe(false);
    expect(isDiagramType("")).toBe(false);
  });
});
