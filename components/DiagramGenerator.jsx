import React, { useEffect, useState, useCallback } from 'react';
import kroki from './services/krokiService';

const DiagramGenerator = () => {
  const [diagramUrl, setDiagramUrl] = useState('');
  const [selectedDiagram, setSelectedDiagram] = useState('blockdiag');
  const [diagramSource, setDiagramSource] = useState('');

  const updateDiagram = useCallback(async () => {
    const diagramResult = document.getElementById('diagram-result');
    const diagramErrorMessage = document.getElementById('diagram-error-message');

    diagramErrorMessage.textContent = '';

    try {
      const svg = await kroki.generateDiagram(selectedDiagram, diagramSource, 'svg');
      diagramResult.innerHTML = svg;
      const encodedDiagramSource = encodeURIComponent(diagramSource);
      const diagramUrl = `https://kroki.io/${selectedDiagram}/svg/${encodedDiagramSource}`;
      setDiagramUrl(diagramUrl);
    } catch (error) {
      diagramErrorMessage.textContent = error.message;
      diagramResult.innerHTML = '';
    }
  }, [selectedDiagram, diagramSource]);

  useEffect(() => {
    updateDiagram();
  }, [updateDiagram]);

  const copyDiagramUrlToClipboard = () => {
    navigator.clipboard.writeText(diagramUrl).then(() => {
    }, (err) => {
      console.error('Could not copy diagram URL to clipboard:', err);
    });
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

      <div id="diagram-result" className="content"></div>
      <article id="diagram-error" className="message is-danger" style={{ display: diagramUrl ? 'none' : 'block' }}>
        <div id="diagram-error-message" className="message-body"></div>
      </article>

      <div className="highlight" id="diagram-url">
        <pre><code className="language-http static">{diagramUrl}</code></pre>
        <button className="button is-small bd-copy" onClick={copyDiagramUrlToClipboard} title="Copy to clipboard">Copy</button>
      </div>
    </div>
  );
};

export default DiagramGenerator;
