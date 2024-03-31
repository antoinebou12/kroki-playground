import React, { useEffect } from 'react';

const DiagramGenerator = () => {
  useEffect(() => {
    document.addEventListener('DOMContentLoaded', function () {
      // Function to update the diagram
      function updateDiagram() {
        var diagramSelect = document.getElementById('select-diagram');
        var selectedDiagram = diagramSelect.options[diagramSelect.selectedIndex].value;
        var diagramSource = document.getElementById('diagram-source').value;
        var diagramResult = document.getElementById('diagram-result');
        var diagramErrorMessage = document.getElementById('diagram-error-message');
        
        // Clear previous error messages
        diagramErrorMessage.textContent = '';
        
        // Generate diagram using Kroki
        kroki.diagram(selectedDiagram, diagramSource, 'svg', function (svg) {
          diagramResult.innerHTML = svg;
          // Update diagram URL
          var diagramUrl = 'https://kroki.io/' + selectedDiagram + '/svg/' + encodeURIComponent(diagramSource);
          var diagramUrlElement = document.querySelector('#diagram-url code');
          diagramUrlElement.textContent = 'GET ' + diagramUrl;
          diagramUrlElement.parentNode.parentNode.href = diagramUrl;
        }, function (error) {
          diagramErrorMessage.textContent = error;
          diagramResult.innerHTML = '';
        });
      }

      // Update diagram on diagram source change
      document.getElementById('diagram-source').addEventListener('input', updateDiagram);
      
      // Update diagram on diagram type change
      document.getElementById('select-diagram').addEventListener('change', updateDiagram);
      
      // Initial diagram update
      updateDiagram();
    });
  }, []);

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
