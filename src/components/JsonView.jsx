import React from 'react';
import { X, Copy } from 'lucide-react';

const JsonView = ({ data, onExit }) => {
  const jsonString = JSON.stringify(data, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    alert('JSON copied to clipboard');
  };

  return (
    <div style={{ 
      backgroundColor: '#050505', 
      minHeight: '100vh', 
      color: '#d4d4d4', 
      fontFamily: 'var(--font-mono)',
      padding: '2rem',
      position: 'relative',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #333'
        }}>
          <div>
            <span style={{ color: '#569cd6' }}>GET</span> 
            <span style={{ color: '#ce9178' }}> /api/v1/profile/francisco-montiron</span> 
            <span style={{ color: '#b5cea8', marginLeft: '1rem' }}>200 OK</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={copyToClipboard}
              style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Copy size={16} /> COPY
            </button>
            <button 
              onClick={onExit}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <X size={16} /> EXIT_RAW_MODE
            </button>
          </div>
        </div>

        <pre style={{ 
          fontSize: '0.9rem', 
          lineHeight: '1.5', 
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>
          {jsonString.split('\n').map((line, i) => {
            // Very basic syntax highlighting simulation
            let color = '#d4d4d4';
            if (line.includes('":')) color = '#9cdcfe'; // Keys
            if (line.includes('"') && !line.includes('":')) color = '#ce9178'; // Values
            
            return (
              <div key={i} style={{ display: 'flex' }}>
                <span style={{ width: '3rem', color: '#444', userSelect: 'none' }}>{i + 1}</span>
                <span style={{ color }}>{line}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};

export default JsonView;
