import React from 'react';
import { Briefcase, Calendar, ChevronRight, Terminal } from 'lucide-react';
import ThreeDCard from './ThreeDCard';
import { useData } from '../context/DataContext';
import { useTranslation } from 'react-i18next';

const ExperienceCard = ({ role, company, period, description, tech, delay }) => (
  <ThreeDCard className="experience-card" style={{ animationDelay: delay }}>
    <h3 className="experience-role">
      {role}
      <ChevronRight size={20} strokeWidth={2} className="accent-text" />
    </h3>
    
    <div className="experience-company">
      <Briefcase size={16} />
      <span>{company}</span>
    </div>
    
    <div className="experience-period">
      <Calendar size={14} />
      {period}
    </div>

    <p className="experience-desc">
      {description}
    </p>

    <div>
      {tech.map((item, index) => (
        <span key={index} className="tech-chip">
          {item}
        </span>
      ))}
    </div>
  </ThreeDCard>
);

const MinorExperienceItem = ({ role, context, description }) => (
  <div className="minor-exp-item">
    <h4 className="mono" style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
      {role}
    </h4>
    <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
      {context}
    </p>
    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
      {description}
    </p>
  </div>
);

export default function Experience() {
  const { experiences } = useData();
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';

  const mainExperiences = experiences
    .filter(e => e.type === 'main')
    .map(e => ({
      ...e,
      description: lang === 'es' ? e.description_es : e.description_en,
      delay: e.layout_delay || "0.2s"
    }));

  const minorExperiences = experiences
    .filter(e => e.type === 'minor')
    .map(e => ({
      ...e,
      description: lang === 'es' ? e.description_es : e.description_en
    }));

  return (
    <div className="container">
      <div className="section-title-wrapper">
        <div className="terminal-icon-box">
          <Terminal size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{lang === 'es' ? 'Experiencia' : 'Experience'}</h2>
          <p className="section-label">trayectoria_profesional.log</p>
        </div>
      </div>

      <div className="exp-grid">
        {/* Main Experience Column */}
        <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
          <div className="subsection-title">
            <span className="subsection-line"></span>
            {lang === 'es' ? 'Roles Principales' : 'Main Roles'}
          </div>
          <div>
            {mainExperiences.map((exp, index) => (
              <ExperienceCard key={index} {...exp} />
            ))}
          </div>
        </div>

        {/* Minor Experience Column */}
        <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
            <div className="subsection-title">
              <span className="subsection-line"></span>
              {lang === 'es' ? 'Otras Actividades' : 'Other Activities'}
            </div>
            <div>
              {minorExperiences.map((exp, index) => (
                <MinorExperienceItem key={index} {...exp} />
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
