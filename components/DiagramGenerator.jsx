import React, { useEffect, useState, useCallback } from 'react';
import pako from 'pako';

// Debounce function to limit the rate at which a function is executed
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Function to encode text
function textEncode(str) {
  if (window.TextEncoder) {
    return new TextEncoder().encode(str);
  }
  var utf8 = unescape(encodeURIComponent(str));
  var result = new Uint8Array(utf8.length);
  for (var i = 0; i < utf8.length; i++) {
    result[i] = utf8.charCodeAt(i);
  }
  return result;
}

const DiagramGenerator = () => {
  const [diagramUrl, setDiagramUrl] = useState('');
  const [diagramSvg, setDiagramSvg] = useState('');
  const [selectedDiagram, setSelectedDiagram] = useState('blockdiag');
  const [diagramSource, setDiagramSource] = useState('');
  const [error, setError] = useState('');

  // Async function to generate the diagram
  const generateDiagram = async (diagramType, diagramSource) => {
    // Encode and compress the diagram source
    const encodedSource = textEncode(diagramSource);
    const compressedSource = pako.deflate(encodedSource, { to: 'string' });
    const base64Source = btoa(compressedSource)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''); // URL safe base64 and remove padding

    const urlPath = `${diagramType}/svg/${base64Source}`;
    const url = `https://kroki.io/${urlPath}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch SVG from Kroki');
      const svgContent = await response.text();
      setDiagramSvg(svgContent);
      setDiagramUrl(url);
      setError('');
    } catch (error) {
      console.error(error);
      setError(error.message);
      setDiagramSvg('');
    }
  };

  // Use useCallback to wrap the debounced convert function
  const updateDiagram = useCallback(debounce(async () => {
    if (!diagramSource.trim()) {
      setDiagramSvg('');
      setError('No diagram source provided.');
      return;
    }

    const encodedSource = btoa(unescape(encodeURIComponent(diagramSource)));
    const compressedSource = btoa(String.fromCharCode.apply(null, pako.deflate(encodedSource)));

    const urlPath = `${selectedDiagram}/svg/${compressedSource.replace(/\+/g, '-').replace(/\//g, '_')}`;
    const url = `https://kroki.io/${urlPath}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const svgContent = await response.text();
      setDiagramSvg(svgContent);
      setDiagramUrl(url);
      setError(''); // Clear any previous error
    } catch (error) {
      console.error(error.message);
      setError('Could not fetch the diagram');
      setDiagramSvg('');
    }
  }, 500), [selectedDiagram, diagramSource]);

  useEffect(() => {
    // Safe guard to check if running in the browser
    if (typeof window !== 'undefined') {
      // Now safe to use localStorage
      const storedSelectedDiagram = localStorage.getItem('selectedDiagram');
      if (storedSelectedDiagram) {
        setSelectedDiagram(storedSelectedDiagram);
      }

      const storedDiagramSource = localStorage.getItem('diagramSource');
      if (storedDiagramSource) {
        setDiagramSource(storedDiagramSource);
      }
    }
  }, []);

  useEffect(() => {
    if(diagramSource.trim() && selectedDiagram) {
      generateDiagram(selectedDiagram, diagramSource);
    }
  }, [diagramSource, selectedDiagram]);

useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedDiagram', selectedDiagram);
      localStorage.setItem('diagramSource', diagramSource);
    }
  }, [selectedDiagram, diagramSource]);

  const copyDiagramUrlToClipboard = () => {
    navigator.clipboard.writeText(diagramUrl).then(() => {
      alert('Diagram URL copied to clipboard!');
    }, (err) => {
      console.error('Could not copy diagram URL to clipboard:', err);
    });
  };

  const downloadDiagram = () => {
    const element = document.createElement("a");
    const file = new Blob([diagramSvg], {type: 'image/svg+xml'});
    element.href = URL.createObjectURL(file);
    element.download = "diagram.svg";
    document.body.appendChild(element); // Required for this to work in Firefox
    element.click();
  };

  return (
    <div>
      <div className="field">
        <label className="label">Diagram Type</label>
        <div className="control">
          <div className="select">
            <select id="select-diagram" aria-label="Select diagram type" value={selectedDiagram} onChange={e => setSelectedDiagram(e.target.value)}>
              <option value="blockdiag">BlockDiag</option>
              <option value="bpmn">BPMN</option>
              <option value="bytefield">Bytefield</option>
              <option value="seqdiag">SeqDiag</option>
              <option value="actdiag">ActDiag</option>
              <option value="nwdiag">NwDiag</option>
              <option value="packetdiag">PacketDiag</option>
              <option value="rackdiag">RackDiag</option>
              <option value="c4plantuml">C4 with PlantUML</option>
              <option value="d2">D2</option>
              <option value="dbml">DBML</option>
              <option value="ditaa">Ditaa</option>
              <option value="erd">Erd</option>
              <option value="excalidraw">Excalidraw</option>
              <option value="graphviz">GraphViz</option>
              <option value="mermaid">Mermaid</option>
              <option value="nomnoml">Nomnoml</option>
              <option value="pikchr">Pikchr</option>
              <option selected="" value="plantuml">PlantUML</option>
              <option value="structurizr">Structurizr</option>
              <option value="svgbob">Svgbob</option>
              <option value="symbolator">Symbolator</option>
              <option value="tikz">TikZ</option>
              <option value="vega">Vega</option>
              <option value="vegalite">Vega-Lite</option>
              <option value="wavedrom">WaveDrom</option>
              <option value="wireviz">WireViz</option>
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Diagram Source</label>
        <div className="control">
          <textarea id="diagram-source" className="textarea code" placeholder="Diagram source code" rows="10" value={diagramSource} onChange={e => setDiagramSource(e.target.value)}></textarea>
        </div>
      </div>

      <div id="diagram-result" className="content" dangerouslySetInnerHTML={{ __html: diagramSvg }}></div>
      {diagramSvg && (
        <div>
          <button className="button is-primary" onClick={downloadDiagram}>Download SVG</button>
          <div className="highlight" id="diagram-url">
            <pre><code className="language-http static">{diagramUrl}</code></pre>
            <button className="button is-small bd-copy" onClick={copyDiagramUrlToClipboard} title="Copy to clipboard">Copy</button>
          </div>
        </div>
      )}

      {error && (
        <article className="message is-danger">
          <div className="message-body">{error}</div>
        </article>
      )}
    </div>
  );
};

export default DiagramGenerator;
