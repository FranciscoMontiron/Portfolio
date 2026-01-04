import React, { useState } from 'react';
import { Terminal, Code2, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Header = ({ onToggleApi }) => {
  const { t, i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 0',
      marginBottom: '4rem',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '4px', 
            background: 'var(--accent-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000'
          }}>
            <Code2 size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1rem', margin: 0 }}>FRAN_MONTIRON</h1>
            <p className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', margin: 0 }}>{t('header.role')}</p>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#projects" className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textDecoration: 'none' }}>{t('header.nav.projects')}</a>
          
          <button
            onClick={toggleLanguage}
            className="glass"
            style={{
               background: 'transparent',
               border: '1px solid var(--border-color)',
               color: 'var(--text-dim)',
               padding: '0.4rem',
               borderRadius: '4px',
               cursor: 'pointer',
               display: 'flex',
               alignItems: 'center',
               gap: '0.5rem',
               fontFamily: 'var(--font-mono)',
               fontSize: '0.8rem'
            }}
          >
            <Globe size={14} /> {i18n.language.toUpperCase()}
          </button>

          <button 
            onClick={onToggleApi}
            className="glass"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              color: 'var(--accent-color)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem'
            }}
          >
            <Terminal size={14} />
            RAW_API_MODE
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
