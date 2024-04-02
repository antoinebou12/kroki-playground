import React, { useEffect, useState, useCallback } from 'react';
import pako from "pako";
import { TextEncoder } from "text-encoding";
import { encode as btoa } from "base-64";

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

const DiagramGenerator = () => {
  const [diagramUrl, setDiagramUrl] = useState('');
  const [diagramSvg, setDiagramSvg] = useState('');
  const [selectedDiagram, setSelectedDiagram] = useState('blockdiag');
  const [diagramSource, setDiagramSource] = useState('');
  const [error, setError] = useState('');


  const generateDiagram = useCallback(async () => {
    try {
      const compressed = pako.deflate(textEncode(diagramSource), { level: 9, to: "Uint8Array" });
      const encoded = btoa(String.fromCharCode(...compressed))
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

      const url = `https://kroki.io/${selectedDiagram}/svg/${encoded}`;
      console.log(url);

      const response = await fetch(url);
      if (response.ok) {
        const svgContent = await response.text();
        setDiagramSvg(svgContent);
        setDiagramUrl(url);
        setError('');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch the diagram');
      setDiagramSvg('');
    }
  }, [diagramSource, selectedDiagram]);


  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sourceParam = queryParams.get('source');
    const typeParam = queryParams.get('type');
  
    if (typeParam) {
      setSelectedDiagram(typeParam);
    }
  
    if (sourceParam) {
      const diagramSource = decompressFromEncodedURIComponent(sourceParam);
      setDiagramSource(diagramSource);
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const storedSelectedDiagram = localStorage.getItem('selectedDiagram');
        const storedDiagramSource = localStorage.getItem('diagramSource');
        if (storedSelectedDiagram) setSelectedDiagram(storedSelectedDiagram);
        if (storedDiagramSource) setDiagramSource(storedDiagramSource);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedDiagram', selectedDiagram);
    localStorage.setItem('diagramSource', diagramSource);
  }, [selectedDiagram, diagramSource]);

  useEffect(() => {
    generateDiagram();
  }, [generateDiagram, diagramSource, selectedDiagram]);

  const updateUrl = (type, source) => {
    const compressedSource = pako.deflate(textEncode(source), { level: 9, to: "Uint8Array" });
    const encodedSource = btoa(String.fromCharCode(...compressedSource))
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    
    const newUrl = `${window.location.pathname}?type=${type}&source=${encodedSource}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };
  
  const handleDiagramTypeChange = (e) => {
    const newType = e.target.value;
    setSelectedDiagram(newType);
    updateUrl(newType, diagramSource);
  };
  
  const handleDiagramSourceChange = (e) => {
    const newSource = e.target.value;
    setDiagramSource(newSource);
    updateUrl(selectedDiagram, newSource);
  };

  const copyDiagramUrlToClipboard = () => navigator.clipboard.writeText(diagramUrl).then(() => alert('Diagram URL copied to clipboard!'));
  const downloadDiagram = () => {
    const element = document.createElement("a");
    const file = new Blob([diagramSvg], {type: 'image/svg+xml'});
    element.href = URL.createObjectURL(file);
    element.download = "diagram.svg";
    document.body.appendChild(element);
    element.click();
  };

  const styles = {
    container: {
      marginTop: '20px',
      padding: '20px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Added subtle shadow
      maxWidth: '600px', // Limit width for better focus
      margin: '20px auto', // Center container
    },
    field: {
      marginBottom: '15px',
    },
    label: {
      display: 'block', // Ensure label takes its own line
      marginBottom: '5px',
      fontWeight: '600',
      color: '#333',
    },
    select: {
      width: '100%',
      padding: '10px',
      margin: '5px 0 15px', // Increase bottom margin
      borderRadius: '4px',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    textarea: {
      width: '100%',
      minHeight: '100px', // Start with a reasonable default height
      padding: '12px 20px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: 'white',
      resize: 'vertical', // Allow vertical resizing
      fontFamily: 'sans-serif', // Use a more modern font
      fontSize: '14px', // Set font size
    },
    button: {
      cursor: 'pointer',
      padding: '10px 20px',
      margin: '5px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#007bff',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: '#0056b3',
      },
    },
  };

  return (
    <div style={styles.container}>
      {/* Diagram Type Selection */}
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

      {/* Diagram Source Input */}
      <div className="field">
        <label className="label">Diagram Source</label>
        <div className="control">
          <textarea id="diagram-source" className="textarea" placeholder="Enter diagram source here" value={diagramSource} onChange={handleDiagramSourceChange}></textarea>
        </div>
      </div>

      {/* Display Diagram */}
      <div id="diagram-result" dangerouslySetInnerHTML={{ __html: diagramSvg }}></div>
      
      {/* Actions */}
      {diagramSvg && (
        <div>
          <button onClick={downloadDiagram}>Download SVG</button>
          <button onClick={copyDiagramUrlToClipboard}>Copy URL</button>
        </div>
      )}

      {/* Error Message */}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default DiagramGenerator;
