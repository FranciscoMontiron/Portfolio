import React, { useState, useEffect, useRef, useCallback } from 'react';

const TerminalHero = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [showCursor, setShowCursor] = useState(true);
  const timeoutsRef = useRef([]);

  // Use a stable reference for logs
  const botLog = React.useMemo(() => [
    { text: "SYSTEM: BOOT SEQUENCE INITIALIZED", delay: 200 },
    { text: "CORE: LOAD_KERNEL [OK]", delay: 150 },
    { text: "ENV: SYMFONY_ECOSYSTEM [PHP 8.3]", delay: 150 },
    { text: "ENV: REACT_FRONTEND [VITE_ESM]", delay: 150 },
    { text: "LOAD: PROJECT_DATA [ARKUM_ENGINE]", delay: 200 },
    { text: "AUTH: MONTIRON_FRANCISCO [VALIDATED]", delay: 300 },
    { text: "STATUS: AGENT_READY", delay: 150 },
    { text: "BOOTING_UI_MODULES...", delay: 400 },
  ], []);

  const startBoot = useCallback(() => {
    let current = 0;
    
    const next = () => {
      if (current < botLog.length) {
        const entry = botLog[current];
        setLines(prev => [...prev, entry.text]);
        const t = setTimeout(next, entry.delay);
        timeoutsRef.current.push(t);
        current++;
      } else {
        const done = setTimeout(() => {
          if (onComplete) onComplete();
        }, 600);
        timeoutsRef.current.push(done);
      }
    };

    const initial = setTimeout(next, 500);
    timeoutsRef.current.push(initial);
  }, [botLog, onComplete]);

  useEffect(() => {
    startBoot();
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeoutsRef.current.forEach(clearTimeout);
      clearInterval(cursorInterval);
    };
  }, [startBoot]);

  return (
    <div className="hero-section" style={{ 
      backgroundColor: '#050505', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="container" style={{ maxWidth: '800px', width: '100%' }}>
        <div style={{ 
          padding: '2rem', 
          minHeight: '420px', 
          borderRadius: '12px',
          background: 'rgba(20, 20, 20, 0.4)',
          border: '1px solid rgba(0, 245, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.2), transparent)',
            animation: 'scanline 3s linear infinite',
            pointerEvents: 'none'
          }} />
          
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            {lines.map((text, i) => (
              <div key={i} style={{ marginBottom: '0.6rem', color: text.includes('OK') || text.includes('VALIDATED') ? '#4ade80' : '#e5e7eb' }}>
                <span style={{ marginRight: '1rem', opacity: 0.3 }}>{`[` + i.toString().padStart(2, '0') + `]`}</span>
                {text}
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ marginRight: '1rem', opacity: 0.3 }}>{`[` + lines.length.toString().padStart(2, '0') + `]`}</span>
              <span style={{ color: 'var(--accent-color)', opacity: showCursor ? 1 : 0, fontWeight: 'bold' }}>_</span>
            </div>
          </div>

          <button 
            onClick={onComplete}
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)',
              padding: '0.4rem 0.8rem',
              fontSize: '0.65rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              borderRadius: '4px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--accent-color)'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.4)'}
          >
            {">> SKIP_BOOT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminalHero;
