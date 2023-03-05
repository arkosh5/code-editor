import React from 'react';
import CodeEditor from './CodeEditor';
import './App.css';
import esprima from 'esprima';
import {CSSLint} from 'csslint';
import {HTMLHint} from 'htmlhint';

const App = () => {
  const handleLint = (content, options, editor) => {
    const {mode, ...opts} = options || {};
    const errors = [];

    switch (mode) {
      case 'javascript':
        try {
          esprima.parse(content);
        } catch (e) {
          errors.push({
            from: editor?.posFromIndex?.(e.index),
            to: editor?.posFromIndex?.(e.index + 1),
            message: e.description,
            severity: e.description.includes('syntax error') ?
                'error' : 'warning',
          });
        }
        break;
      case 'css':
        try {
          CSSLint.verify(content, {'adjoining-classes': false, ...opts});
        } catch (e) {
          errors.push({
            from: editor?.posFromIndex?.(e.error.position?.start),
            to: editor?.posFromIndex?.(e.error.position?.end),
            message: e.error.message,
            severity: e.description.includes('syntax error') ?
                'error' : 'warning',
          });
        }
        break;
      case 'html':
        try {
          HTMLHint.verify(content, opts);
        } catch (e) {
          errors.push({
            from: editor?.posFromIndex?.(e.linePos),
            to: editor?.posFromIndex?.(e.linePos),
            message: e.message,
            severity: e.description.includes('syntax error') ?
                'error' : 'warning',
          });
        }
        break;
      default:
        break;
    }

    return errors;
  };

  return (
    <div>
      <CodeEditor handleLint={handleLint} />
    </div>
  );
};

export default App;
