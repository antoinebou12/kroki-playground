import pako from "pako";
import { TextEncoder } from "text-encoding";
import { encode as btoa } from "base-64";
import axios from 'axios';

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
  if (req.method === 'POST') {
    const { diagramSource, selectedDiagram, outputFormat } = req.body;

    const formats = LANGUAGE_OUTPUT_SUPPORT[selectedDiagram] || [];
    const format = formats.includes(outputFormat) ? outputFormat : formats[0]; // Default to first supported format

    try {
      const compressed = pako.deflate(textEncode(diagramSource), { level: 9, to: "Uint8Array" });
      const encoded = btoa(String.fromCharCode(...compressed))
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
      
      const url = `https://kroki.io/${selectedDiagram}/${format}/${base64Encoded}`;
      
      // Fetch the SVG from Kroki
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
      res.status(500).json({ error: 'Failed to fetch the diagram' });
    }
  } else {
    // Handle any requests that aren't POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
