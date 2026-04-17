import { describe, expect, it } from "vitest";
import { DIAGRAM_TYPES } from "./diagramTypes";
import { DIAGRAM_TYPE_LABELS } from "./diagramLabels";

describe("DIAGRAM_TYPE_LABELS", () => {
  it("has a non-empty label for every diagram type", () => {
    for (const t of DIAGRAM_TYPES) {
      const label = DIAGRAM_TYPE_LABELS[t];
      expect(label, `missing label for ${t}`).toBeDefined();
      expect(label.trim().length).toBeGreaterThan(0);
    }
  });

  it("does not define keys outside DIAGRAM_TYPES", () => {
    const labelKeys = Object.keys(DIAGRAM_TYPE_LABELS);
    expect(labelKeys.sort()).toEqual([...DIAGRAM_TYPES].sort());
  });
});
