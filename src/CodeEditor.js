import React, {useState, useEffect, useRef} from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';

import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/eclipse.css';

export const CodeEditor = () => {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [theme, setTheme] = useState('material');
  const iframeRef = useRef(null);

  useEffect(() => {
    loadCode();
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current?.contentDocument;
    if (iframe) {
      iframe.open();
      iframe.write(`
        <html lang="en">
          <head>
            <style>${css}</style>
            <title>Document</title>
          </head>
          <body>${html}</body>
          <script>${js}</script>
        </html>
      `);
      iframe.close();
    }
  }, [html, css, js]);

  const handleHtmlChange = (_, __, value) => setHtml(value);
  const handleCssChange = (_, __, value) => setCss(value);
  const handleJsChange = (_, __, value) => setJs(value);
  const handleThemeChange = (event) => setTheme(event.target.value);
  const saveCode = () => {
    const code = JSON.stringify({html, css, js});
    localStorage.setItem('code', code);
    alert('Your code has been saved!');
  };
  const loadCode = () => {
    const code = JSON.parse(localStorage.getItem('code'));
    if (code) {
      const {html: savedHtml, css: savedCss, js: savedJs} = code;
      setHtml(savedHtml);
      setCss(savedCss);
      setJs(savedJs);
    }
  };
  const clearCode = () => {
    setHtml('');
    setCss('');
    setJs('');
  };
  return (
    <div>
      <div>
        <label htmlFor="theme-select">Select Theme:</label>
        <select id="theme-select" value={theme} onChange={handleThemeChange}>
          <option value="material">Material</option>
          <option value="monokai">Monokai</option>
          <option value="dracula">Dracula</option>
          <option value="eclipse">Eclipse</option>
        </select>
      </div>
      <div className="html-editor">
                HTML Editor
        <CodeMirror
          value={html}
          onBeforeChange={handleHtmlChange}
          options={{
            mode: 'htmlmixed',
            theme,
            lineNumbers: true,
            tabSize: 4,
            dragDrop: false,
            matchBrackets: true,
            autoCloseBrackets: true,
            bracketMatching: true,
            styleActiveLine: true,
            lint: true,
          }}
        />
      </div>
      <div className="css-editor">
                CSS Editor
        <CodeMirror
          value={css}
          onBeforeChange={handleCssChange}
          options={{
            mode: 'css',
            theme,
            lineNumbers: true,
            tabSize: 4,
            matchBrackets: true,
            autoCloseBrackets: true,
            bracketMatching: true,
            styleActiveLine: true,
            lint: true,

          }}
        />
      </div>
      <div className="js-editor">
                JavaScript Editor
        <CodeMirror
          value={js}
          onBeforeChange={handleJsChange}
          options={{
            mode: 'javascript',
            theme,
            lineNumbers: true,
            tabSize: 4,
            matchBrackets: true,
            autoCloseBrackets: true,
            bracketMatching: true,
            styleActiveLine: true,
            lint: true,

          }}
        />
      </div>
      <div>
        <button onClick={saveCode}>Save Code</button>
        <button onClick={loadCode}>Load Code</button>
        <button onClick={clearCode}>Clear Code</button>
      </div>
      <iframe
        title="Output"
        ref={iframeRef}
        style={{width: '100%', height: '400px'}}
      />
    </div>
  );
};


export default CodeEditor;
