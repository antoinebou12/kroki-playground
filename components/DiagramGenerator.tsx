"use client";

import {
  startTransition,
  useEffect,
  useState,
} from "react";
import { DIAGRAM_TYPES } from "@/lib/kroki/diagramTypes";
import type { DiagramType } from "@/lib/kroki/diagramTypes";
import { DIAGRAM_TYPE_LABELS } from "@/lib/kroki/diagramLabels";
import {
  decodeDiagramPayloadFromUrlParam,
  encodeDiagramPayload,
} from "@/lib/kroki/encode";

function getKrokiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_KROKI_BASE_URL?.trim();
  const base = raw && raw.length > 0 ? raw : "https://kroki.io";
  return base.replace(/\/+$/, "");
}

function normalizeLegacyDiagramType(type: string): DiagramType | null {
  if (type === "vegalite") {
    return "vega-lite";
  }
  return null;
}

export default function DiagramGenerator() {
  const [diagramUrl, setDiagramUrl] = useState("");
  const [diagramSvg, setDiagramSvg] = useState("");
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramType>("plantuml");
  const [diagramSource, setDiagramSource] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sourceParam = queryParams.get("source");
    const typeParam = queryParams.get("type");

    startTransition(() => {
      if (typeParam) {
        const legacy = normalizeLegacyDiagramType(typeParam);
        const next =
          legacy ??
          (DIAGRAM_TYPES.includes(typeParam as DiagramType)
            ? (typeParam as DiagramType)
            : null);
        if (next) {
          setSelectedDiagram(next);
        }
      }

      if (sourceParam) {
        try {
          const decoded = decodeDiagramPayloadFromUrlParam(sourceParam);
          setDiagramSource(decoded);
        } catch {
          setError("Could not decode diagram source from URL");
        }
      }
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const storedType = localStorage.getItem("selectedDiagram");
        const storedSource = localStorage.getItem("diagramSource");
        startTransition(() => {
          if (storedType && DIAGRAM_TYPES.includes(storedType as DiagramType)) {
            setSelectedDiagram(storedType as DiagramType);
          }
          if (storedSource !== null) {
            setDiagramSource(storedSource);
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedDiagram", selectedDiagram);
    localStorage.setItem("diagramSource", diagramSource);
  }, [selectedDiagram, diagramSource]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const encoded = encodeDiagramPayload(diagramSource);
        const url = `${getKrokiBaseUrl()}/${selectedDiagram}/svg/${encoded}`;

        const response = await fetch(url);
        if (cancelled) {
          return;
        }
        if (response.ok) {
          const svgContent = await response.text();
          if (cancelled) {
            return;
          }
          startTransition(() => {
            setDiagramSvg(svgContent);
            setDiagramUrl(url);
            setError("");
          });
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.error(err);
        if (cancelled) {
          return;
        }
        startTransition(() => {
          setError("Failed to fetch the diagram");
          setDiagramSvg("");
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [diagramSource, selectedDiagram]);

  const updateUrl = (type: DiagramType, source: string) => {
    const encodedSource = encodeDiagramPayload(source);
    const newUrl = `${window.location.pathname}?type=${encodeURIComponent(type)}&source=${encodeURIComponent(encodedSource)}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const handleDiagramTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as DiagramType;
    setSelectedDiagram(newType);
    updateUrl(newType, diagramSource);
  };

  const handleDiagramSourceChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newSource = e.target.value;
    setDiagramSource(newSource);
    updateUrl(selectedDiagram, newSource);
  };

  const copyDiagramUrlToClipboard = () => {
    void navigator.clipboard.writeText(diagramUrl).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadDiagram = () => {
    const element = document.createElement("a");
    const file = new Blob([diagramSvg], { type: "image/svg+xml" });
    element.href = URL.createObjectURL(file);
    element.download = "diagram.svg";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="select-diagram"
            className="mb-1 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            Diagram type
          </label>
          <select
            id="select-diagram"
            aria-label="Select diagram type"
            value={selectedDiagram}
            onChange={handleDiagramTypeChange}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          >
            {DIAGRAM_TYPES.map((type) => (
              <option key={type} value={type}>
                {DIAGRAM_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="diagram-source"
            className="mb-1 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            Diagram source
          </label>
          <textarea
            id="diagram-source"
            placeholder="Enter diagram source here"
            value={diagramSource}
            onChange={handleDiagramSourceChange}
            rows={8}
            className="w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>

        <div
          id="diagram-result"
          className="max-w-none overflow-auto rounded-md border border-dashed border-zinc-200 bg-zinc-50/50 p-4 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-100 [&_svg]:max-h-[60vh] [&_svg]:w-auto"
          dangerouslySetInnerHTML={{ __html: diagramSvg }}
        />

        {diagramSvg ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadDiagram}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              Download SVG
            </button>
            <button
              type="button"
              onClick={copyDiagramUrlToClipboard}
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              {copied ? "Copied" : "Copy URL"}
            </button>
          </div>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
