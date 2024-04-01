import pako from "pako";
import { TextEncoder } from "text-encoding";
import { encode as btoa } from "base-64";
import axios from 'axios';

function textEncode(str) {
  return new TextEncoder("utf-8").encode(str);
}

function decompressFromEncodedURIComponent(encoded) {
  const binaryString = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
  const charCodes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    charCodes[i] = binaryString.charCodeAt(i);
  }
  const decompressed = pako.inflate(charCodes, { to: 'string' });
  return decompressed; // Corrected from return decompress;
}

const LANGUAGE_OUTPUT_SUPPORT = {
  "blockdiag": ["png", "svg", "pdf"],
  "bpmn": ["svg"],
  "bytefield": ["svg"],
  "seqdiag": ["png", "svg", "pdf"],
  "actdiag": ["png", "svg", "pdf"],
  "nwdiag": ["png", "svg", "pdf"],
  "packetdiag": ["png", "svg", "pdf"],
  "rackdiag": ["png", "svg", "pdf"],
  "c4plantuml": ["png", "svg", "pdf", "txt", "base64"],
  "d2": ["png", "svg"],
  "dbml": ["svg"],
  "ditaa": ["png", "svg"],
  "erd": ["png", "svg", "pdf"],
  "excalidraw": ["svg"],
  "graphviz": ["png", "svg", "pdf", "jpeg"],
  "nomnoml": ["svg"],
  "pikchr": ["svg"],
  "structurizr": ["png", "svg", "pdf", "txt", "base64"],
  "svgbob": ["svg"],
  "symbolator": ["svg"],
  "tikz": ["png", "svg", "jpeg", "pdf"],
  "umlet": ["png", "svg", "jpeg"],
  "vega": ["svg", "png"],
  "vega-lite": ["svg", "png"],
  "wavedrom": ["svg"],
  "wireviz": ["png", "svg"],
};

export default async function handler(req, res) {
  let diagramSource, selectedDiagram, outputFormat;

  if (req.method === 'POST') {
    ({ diagramSource, selectedDiagram, outputFormat = "svg" } = req.body);
  } else if (req.method === 'GET') {
    const queryParams = new URLSearchParams(req.query);
    diagramSource = queryParams.get('diagramSource');
    selectedDiagram = queryParams.get('selectedDiagram');
    outputFormat = queryParams.get('outputFormat') || "svg";
  } else {
    // Handle any requests that aren't GET or POST
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const formats = LANGUAGE_OUTPUT_SUPPORT[selectedDiagram] || [];
  const format = formats.includes(outputFormat) ? outputFormat : formats[0]; // Default to first supported format

  try {
    const compressed = pako.deflate(textEncode(diagramSource), { level: 9, to: "Uint8Array" });
    const encoded = btoa(String.fromCharCode(...compressed))
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const url = `https://kroki.io/${selectedDiagram}/${format}/${encoded}`;

    // Fetch the diagram from Kroki
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    // Convert binary data to base64
    const diagramData = Buffer.from(response.data).toString('base64');
    const mimeType = `image/${format === 'jpeg' ? 'jpeg' : format === 'svg' ? 'svg+xml' : format}`;

    res.status(200).json({
      diagramUrl: url,
      diagramData: diagramData,
      mimeType: mimeType
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to fetch the diagram',
      details: error.message,
      attemptedUrl: url,
      attemptedDiagramSource: diagramSource,
      attemptedSelectedDiagram: selectedDiagram,
      outputFormat: format,
    });
  }
}
