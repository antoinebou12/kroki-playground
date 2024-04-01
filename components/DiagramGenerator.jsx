import React, { useEffect, useState, useCallback } from 'react';
import pako from "pako";
import { TextEncoder } from "text-encoding";
import { encode as btoa } from "base-64";

const DiagramGenerator = () => {
  const [diagramUrl, setDiagramUrl] = useState('');
  const [diagramSvg, setDiagramSvg] = useState('');
  const [selectedDiagram, setSelectedDiagram] = useState('blockdiag');
  const [diagramSource, setDiagramSource] = useState('');
  const [error, setError] = useState('');


  const generateDiagram = useCallback(async () => {
    if (!diagramSource.trim()) return;

    function textEncode(str) {
      return new TextEncoder("utf-8").encode(str);
    }

    let encoded = btoa(pako.deflate(textEncode(diagramSource), { level: 9, to: "string" })).replace(/\+/g, "-").replace(/\//g, "_");
  
    const url = `https://kroki.io/${selectedDiagram}/svg/${encoded}`;

    console.log(url);

    try {
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
    generateDiagram();
  }, [generateDiagram]);

  useEffect(() => {
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

  // Handlers for user inputs and actions
  const handleDiagramTypeChange = (e) => setSelectedDiagram(e.target.value);
  const handleDiagramSourceChange = (e) => {
    const source = e.target.value;
    setDiagramSource(source);
    generateDiagram();
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

  return (
    <div>
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
