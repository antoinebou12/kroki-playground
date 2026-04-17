import { describe, expect, it } from "vitest";
import { MAX_DIAGRAM_SOURCE_LENGTH, validateGenerateDiagramInput } from "./validate";

describe("validateGenerateDiagramInput", () => {
  it("requires selectedDiagram", () => {
    const r = validateGenerateDiagramInput({
      diagramSource: "a",
      selectedDiagram: "",
      outputFormat: undefined,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.body.code).toBe("MISSING_DIAGRAM_TYPE");
    }
  });

  it("treats whitespace-only selectedDiagram as missing", () => {
    const r = validateGenerateDiagramInput({
      diagramSource: "a",
      selectedDiagram: "   ",
      outputFormat: undefined,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.body.code).toBe("MISSING_DIAGRAM_TYPE");
    }
  });

  it("rejects unknown diagram type", () => {
    const r = validateGenerateDiagramInput({
      diagramSource: "a",
      selectedDiagram: "not-a-real-type",
      outputFormat: undefined,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.body.code).toBe("INVALID_DIAGRAM_TYPE");
    }
  });

  it("rejects output format not allowed for type", () => {
    const r = validateGenerateDiagramInput({
      diagramSource: "a",
      selectedDiagram: "bpmn",
      outputFormat: "pdf",
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.body.code).toBe("INVALID_OUTPUT_FORMAT");
    }
  });

  it("accepts valid plantuml + svg", () => {
    const r = validateGenerateDiagramInput({
      diagramSource: "@startuml\n@enduml",
      selectedDiagram: "plantuml",
      outputFormat: "svg",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.outputFormat).toBe("svg");
    }
  });

  it("defaults outputFormat to the first supported format when omitted", () => {
    const r = validateGenerateDiagramInput({
      diagramSource: "flowchart LR\n  A-->B",
      selectedDiagram: "mermaid",
      outputFormat: undefined,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.outputFormat).toBe("svg");
    }
  });

  it("treats null outputFormat like omitted", () => {
    const r = validateGenerateDiagramInput({
      diagramSource: "x",
      selectedDiagram: "mermaid",
      outputFormat: null,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.outputFormat).toBe("svg");
    }
  });

  it("rejects diagramSource over max length", () => {
    const r = validateGenerateDiagramInput({
      diagramSource: "a".repeat(MAX_DIAGRAM_SOURCE_LENGTH + 1),
      selectedDiagram: "mermaid",
      outputFormat: "svg",
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.body.code).toBe("SOURCE_TOO_LARGE");
    }
  });

  it("treats empty string outputFormat as omitted (default)", () => {
    const r = validateGenerateDiagramInput({
      diagramSource: "x",
      selectedDiagram: "mermaid",
      outputFormat: "",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.outputFormat).toBe("svg");
    }
  });

  it("accepts vega-lite with default output", () => {
    const r = validateGenerateDiagramInput({
      diagramSource: "{}",
      selectedDiagram: "vega-lite",
      outputFormat: undefined,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.outputFormat).toBe("svg");
    }
  });
});
