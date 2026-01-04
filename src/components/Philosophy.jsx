import React from 'react';
import { useTranslation } from 'react-i18next';

const Philosophy = ({ text }) => {
  const { t } = useTranslation();
  
  return (
    <section className="container" style={{ paddingBottom: '8rem' }}>
      <div className="glass" style={{ 
        padding: '5rem 2rem', 
        borderRadius: '24px', 
        textAlign: 'center',
        background: 'radial-gradient(circle at top right, rgba(0, 245, 255, 0.05), transparent)'
      }}>
        <p className="mono accent-text" style={{ fontSize: '0.8rem', marginBottom: '2rem' }}>
          {t('philosophy.label')}
        </p>
        <blockquote style={{ 
          fontSize: '2.5rem', 
          lineHeight: 1.2, 
          maxWidth: '900px', 
          margin: '0 auto',
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}>
          "{text}"
        </blockquote>
      </div>
    </section>
  );
};

export default Philosophy;
