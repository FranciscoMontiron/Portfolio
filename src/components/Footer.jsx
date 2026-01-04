import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="container" style={{ 
      padding: '4rem 0', 
      borderTop: '1px solid var(--border-color)',
      marginTop: '8rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem'
    }}>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-dim)', transition: 'var(--transition-fast)' }}>
          <Github size={20} />
        </a>
        <a href="https://www.linkedin.com/in/francisco-montiron-3212b7129/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-dim)', transition: 'var(--transition-fast)' }}>
          <Linkedin size={20} />
        </a>
        <a href="mailto:francisco@example.com" style={{ color: 'var(--text-dim)', transition: 'var(--transition-fast)' }}>
          <Mail size={20} />
        </a>
        <a href="/login" style={{ color: 'var(--text-dim)', transition: 'var(--transition-fast)', opacity: 0.3 }}>
            <div style={{ width: '20px', height: '20px', border: '1px solid currentColor', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px' }}>A</span>
            </div>
        </a>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div className="mono" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          letterSpacing: '-2px'
        }}>
          FM<span style={{ color: 'var(--accent-color)' }}>.</span>
        </div>
        <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
          PRODUCT_OF_FRANCISCO_MONTIRON // © {new Date().getFullYear()}
        </p>

      </div>
    </footer>
  );
};

export default Footer;
