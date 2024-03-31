import React, { useEffect, useState } from 'react';

const DiagramGenerator = () => {
  const [diagramUrl, setDiagramUrl] = useState('');

  useEffect(() => {
    const updateDiagram = () => {
      const diagramSelect = document.getElementById('select-diagram');
      const selectedDiagram = diagramSelect.options[diagramSelect.selectedIndex].value;
      const diagramSource = document.getElementById('diagram-source').value;
      const diagramResult = document.getElementById('diagram-result');
      const diagramErrorMessage = document.getElementById('diagram-error-message');

      // Clear previous error messages
      diagramErrorMessage.textContent = '';

      // Generate diagram using Kroki
      kroki.diagram(selectedDiagram, diagramSource, 'svg', (svg) => {
        diagramResult.innerHTML = svg;
        // Update diagram URL
        const diagramUrl = `https://kroki.io/${selectedDiagram}/svg/${encodeURIComponent(diagramSource)}`;
        setDiagramUrl(diagramUrl);
      }, (error) => {
        diagramErrorMessage.textContent = error;
        diagramResult.innerHTML = '';
      });
    };

    // Update diagram on diagram source change
    document.getElementById('diagram-source').addEventListener('input', updateDiagram);

    // Update diagram on diagram type change
    document.getElementById('select-diagram').addEventListener('change', updateDiagram);

    // Initial diagram update
    updateDiagram();

    // Cleanup event listeners
    return () => {
      document.getElementById('diagram-source').removeEventListener('input', updateDiagram);
      document.getElementById('select-diagram').removeEventListener('change', updateDiagram);
    };
  }, []);

  const copyDiagramUrlToClipboard = () => {
    const diagramUrlElement = document.querySelector('#diagram-url code');
    const diagramUrl = diagramUrlElement.textContent;
    navigator.clipboard.writeText(diagramUrl);
  };

  return (
    <div>
      <div className="field">
        <label className="label">Diagram</label>
        <div className="control">
          <div className="select">
            <select id="select-diagram" aria-label="Diagram">
              <option value="blockdiag">BlockDiag</option>
              {/* Add other diagram options here */}
            </select>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="columns try-columns">
          <div className="column">
            <div className="field">
              <div className="control">
                <textarea id="diagram-source" className="textarea code" placeholder="User -> Kroki: Hello" rows="25"></textarea>
              </div>
            </div>
          </div>
          <div className="column">
            <div id="diagram-result" className="diagram-plantuml"></div>
            <article id="diagram-error" className="message is-danger is-invisible">
              <div id="diagram-error-message" className="message-body"></div>
            </article>
          </div>
        </div>
        <div className="highlight" id="diagram-url">
          <pre><code className="language-http static"></code></pre>
          <button className="button is-small bd-copy" title="Copy to clipboard">Copy</button>
        </div>
      </div>
    </div>
  );
};

export default DiagramGenerator;
