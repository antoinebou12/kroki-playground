import pako from "pako";
import { TextEncoder } from "text-encoding";
import { encode as btoa } from "base-64";
import axios from 'axios';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { diagramSource, selectedDiagram } = req.body;

    try {
      const compressed = pako.deflate(textEncode(diagramSource), { level: 9, to: "Uint8Array" });
      const encoded = btoa(String.fromCharCode(...compressed))
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
      
      const url = `https://kroki.io/${selectedDiagram}/svg/${base64Encoded}`;
      
      // Fetch the SVG from Kroki
      const response = await axios.get(url);
      
      // Respond with the SVG content
      res.status(200).json({ diagramSvg: response.data, diagramUrl: url });
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
