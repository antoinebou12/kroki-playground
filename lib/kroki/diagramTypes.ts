/**
 * Canonical Kroki URL path segments (see https://kroki.io).
 * Use `vega-lite` (not `vegalite`) to match Kroki routes.
 */
export const DIAGRAM_TYPES = [
  "blockdiag",
  "bpmn",
  "bytefield",
  "seqdiag",
  "actdiag",
  "nwdiag",
  "packetdiag",
  "rackdiag",
  "c4plantuml",
  "d2",
  "dbml",
  "ditaa",
  "erd",
  "excalidraw",
  "graphviz",
  "mermaid",
  "nomnoml",
  "pikchr",
  "plantuml",
  "structurizr",
  "svgbob",
  "symbolator",
  "tikz",
  "vega",
  "vega-lite",
  "wavedrom",
  "wireviz",
] as const;

export type DiagramType = (typeof DIAGRAM_TYPES)[number];

/** Output image/format suffix supported per diagram type (Kroki paths). */
export const LANGUAGE_OUTPUT_SUPPORT: Record<DiagramType, readonly string[]> = {
  blockdiag: ["png", "svg", "pdf"],
  bpmn: ["svg"],
  bytefield: ["svg"],
  seqdiag: ["png", "svg", "pdf"],
  actdiag: ["png", "svg", "pdf"],
  nwdiag: ["png", "svg", "pdf"],
  packetdiag: ["png", "svg", "pdf"],
  rackdiag: ["png", "svg", "pdf"],
  c4plantuml: ["png", "svg", "pdf", "txt", "base64"],
  d2: ["png", "svg"],
  dbml: ["svg"],
  ditaa: ["png", "svg"],
  erd: ["png", "svg", "pdf"],
  excalidraw: ["svg"],
  graphviz: ["png", "svg", "pdf", "jpeg"],
  mermaid: ["svg", "png"],
  nomnoml: ["svg"],
  pikchr: ["svg"],
  plantuml: ["png", "svg", "pdf", "txt", "base64"],
  structurizr: ["png", "svg", "pdf", "txt", "base64"],
  svgbob: ["svg"],
  symbolator: ["svg"],
  tikz: ["png", "svg", "jpeg", "pdf"],
  vega: ["svg", "png"],
  "vega-lite": ["svg", "png"],
  wavedrom: ["svg"],
  wireviz: ["png", "svg"],
};

export function isDiagramType(value: string): value is DiagramType {
  return (DIAGRAM_TYPES as readonly string[]).includes(value);
}
