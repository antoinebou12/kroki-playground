import {
  LANGUAGE_OUTPUT_SUPPORT,
  type DiagramType,
  isDiagramType,
} from "./diagramTypes";

/** Max diagram source length (chars) — aligns with practical Kroki limits. */
export const MAX_DIAGRAM_SOURCE_LENGTH = 512_000;

export type GenerateDiagramValidation =
  | {
      ok: true;
      diagramSource: string;
      selectedDiagram: DiagramType;
      outputFormat: string;
    }
  | {
      ok: false;
      status: 400;
      body: {
        error: string;
        code: string;
        fields?: Record<string, string>;
      };
    };

export function validateGenerateDiagramInput(input: {
  diagramSource: unknown;
  selectedDiagram: unknown;
  outputFormat: unknown;
}): GenerateDiagramValidation {
  const diagramSource =
    typeof input.diagramSource === "string" ? input.diagramSource : "";
  const selectedDiagramRaw =
    typeof input.selectedDiagram === "string" ? input.selectedDiagram : "";
  const outputFormatRaw =
    input.outputFormat === undefined || input.outputFormat === null
      ? undefined
      : typeof input.outputFormat === "string"
        ? input.outputFormat
        : "";

  if (!selectedDiagramRaw.trim()) {
    return {
      ok: false,
      status: 400,
      body: {
        error: "selectedDiagram is required",
        code: "MISSING_DIAGRAM_TYPE",
        fields: { selectedDiagram: "required" },
      },
    };
  }

  if (!isDiagramType(selectedDiagramRaw)) {
    return {
      ok: false,
      status: 400,
      body: {
        error: "Unknown or unsupported diagram type",
        code: "INVALID_DIAGRAM_TYPE",
        fields: { selectedDiagram: "not in allowed list" },
      },
    };
  }

  const selectedDiagram = selectedDiagramRaw;

  if (diagramSource.length > MAX_DIAGRAM_SOURCE_LENGTH) {
    return {
      ok: false,
      status: 400,
      body: {
        error: `diagramSource exceeds maximum length of ${MAX_DIAGRAM_SOURCE_LENGTH}`,
        code: "SOURCE_TOO_LARGE",
        fields: { diagramSource: "too long" },
      },
    };
  }

  const allowed = LANGUAGE_OUTPUT_SUPPORT[selectedDiagram];

  if (outputFormatRaw !== undefined && outputFormatRaw !== "") {
    if (!allowed.includes(outputFormatRaw)) {
      return {
        ok: false,
        status: 400,
        body: {
          error: "outputFormat is not supported for this diagram type",
          code: "INVALID_OUTPUT_FORMAT",
          fields: {
            outputFormat: `allowed: ${allowed.join(", ")}`,
          },
        },
      };
    }
    return {
      ok: true,
      diagramSource,
      selectedDiagram,
      outputFormat: outputFormatRaw,
    };
  }

  return {
    ok: true,
    diagramSource,
    selectedDiagram,
    outputFormat: allowed[0] ?? "svg",
  };
}
