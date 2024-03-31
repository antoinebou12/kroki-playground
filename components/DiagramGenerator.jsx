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
    <div className="content">
      <div className="columns try-columns">
        <div className="column">
          <div className="field">
            <div className="control">
              <textarea id="diagram-source" className="textarea code" placeholder="" rows="25"/>
            </div>
          </div>
        </div>
        <div className="column">
          <div id="diagram-result" className="diagram-blockdiag">{/* Your SVG diagram will be rendered here */}</div>
          <article id="diagram-error" className="message is-danger is-invisible">
            <div id="diagram-error-message" className="message-body"></div>
          </article>
        </div>
      </div>
      <div className="highlight" id="diagram-url">
        <pre><code className="language-http static"><span className="token verb-get">GET</span> <span className="token host">https://kroki.io</span>/<span className="token path">blockdiag/svg/eNpdzDEKQjEQhOHeU4zpPYFoYesRxGJ9bwghMSsbUYJ4d10UCZbDfPynolOek0Q8FsDeNCestoisNLmy-Qg7R3Blcm5hPcr0ITdaB6X15fv-_YdJixo2CNHI2lmK3sPRA__RwV5SzV80ZAegJjXSyfMFptc71w==</span></code></pre>
        <button className="button is-small bd-copy" data-clipboard-text="https://kroki.io/blockdiag/svg/eNpdzDEKQjEQhOHeU4zpPYFoYesRxGJ9bwghMSsbUYJ4d10UCZbDfPynolOek0Q8FsDeNCestoisNLmy-Qg7R3Blcm5hPcr0ITdaB6X15fv-_YdJixo2CNHI2lmK3sPRA__RwV5SzV80ZAegJjXSyfMFptc71w==" title="Copy to clipboard">
          <svg fill="currentColor" viewBox="0 0 896 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M128 768h256v64H128v-64z m320-384H128v64h320v-64z m128 192V448L384 640l192 192V704h320V576H576z m-288-64H128v64h160v-64zM128 704h160v-64H128v64z m576 64h64v128c-1 18-7 33-19 45s-27 18-45 19H64c-35 0-64-29-64-64V192c0-35 29-64 64-64h192C256 57 313 0 384 0s128 57 128 128h192c35 0 64 29 64 64v320h-64V320H64v576h640V768zM128 256h512c0-35-29-64-64-64h-64c-35 0-64-29-64-64s-29-64-64-64-64 29-64 64-29 64-64 64h-64c-35 0-64 29-64 64z"></path>
          </svg>
          Copy
        </button>
      </div>
    </div>
  );
};

export default DiagramGenerator;
