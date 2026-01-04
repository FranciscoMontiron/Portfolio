import React from 'react';
import { useTranslation } from 'react-i18next';
import { Server, Shield, Container, Rocket } from 'lucide-react';

const About = ({ data }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  
  // Handle name splitting for styling
  const nameParts = (data.identity?.name || 'Francisco Montiron').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Core specialties with icons
  const coreSpecialties = [
    { icon: Server, ...data.specialties?.[0] },
    { icon: Container, ...data.specialties?.[1] },
    { icon: Rocket, ...data.specialties?.[2] },
    { icon: Shield, ...data.specialties?.[3] }
  ];

  // Primary technologies (highlighted)
  const primaryTech = data.primaryTech || ['Laravel', 'Symfony', 'Angular'];
  
  return (
    <section className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
      {/* Hero Section */}
      <div style={{ marginBottom: '4rem' }}>
        <p className="mono accent-text" style={{ fontSize: '0.9rem', marginBottom: '1.5rem', letterSpacing: '2px' }}>
          {lang === 'es' ? '// DESARROLLADOR DE SOFTWARE' : '// SOFTWARE DEVELOPER'}
        </p>
        
        {/* Name with gradient */}
        <h1 style={styles.heroName}>
          {firstName}
          <span style={styles.heroNameDim}> {lastName}</span>
        </h1>
        
        {/* Tagline - impactful statement */}
        <h2 style={styles.tagline}>
          {lang === 'es' 
            ? 'Creo soluciones de software de calidad que transforman ideas en sistemas robustos'
            : 'I build quality software solutions that transform ideas into robust systems'
          }
        </h2>

        {/* Bio */}
        <p style={styles.bio}>
          {data.bio?.short}
        </p>
      </div>

      {/* Core Specialties Grid */}
      <div style={{ marginBottom: '4rem' }}>
        <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
          {lang === 'es' ? '// ESPECIALIDADES CORE' : '// CORE SPECIALTIES'}
        </p>
        
        <div style={styles.specialtiesGrid}>
          {coreSpecialties.map((specialty, index) => (
            <div key={specialty.label} style={styles.specialtyCard}>
              <div style={styles.specialtyIcon}>
                <specialty.icon size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h3 style={styles.specialtyLabel}>{specialty.label}</h3>
                <p style={styles.specialtyDesc}>{specialty.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Technologies */}
      <div style={{ marginBottom: '3rem' }}>
        <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
          {lang === 'es' ? '// TECNOLOGÍAS PRINCIPALES' : '// PRIMARY TECHNOLOGIES'}
        </p>
        
        <div style={styles.techHighlight}>
          {primaryTech.map((tech, index) => (
            <div key={tech} style={styles.primaryTechBadge}>
              <span style={styles.techNumber}>0{index + 1}</span>
              <span style={styles.techName}>{tech}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Extended Bio */}
      {data.bio?.long && (
        <div style={styles.extendedBio}>
          <div style={styles.bioAccent} />
          <p style={{ margin: 0, lineHeight: 1.8 }}>{data.bio.long}</p>
        </div>
      )}

      {/* Secondary Skills */}
      <div style={{ marginTop: '3rem' }}>
        <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
          {lang === 'es' ? '// TAMBIÉN TRABAJO CON' : '// ALSO WORK WITH'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {(data.specialization || [])
            .map(tech => (
              <span key={tech} style={styles.secondaryTech}>
                {tech}
              </span>
            ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  heroName: {
    fontSize: 'clamp(3rem, 8vw, 5rem)',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: '1.5rem',
    background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 150%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroNameDim: {
    background: 'linear-gradient(135deg, var(--text-secondary) 0%, var(--text-dim) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  tagline: {
    fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
    fontWeight: 500,
    lineHeight: 1.4,
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
    maxWidth: '700px',
    fontFamily: 'var(--font-sans)',
  },
  bio: {
    fontSize: '1.1rem',
    color: 'var(--text-dim)',
    lineHeight: 1.7,
    maxWidth: '600px',
  },
  specialtiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
  },
  specialtyCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.5rem',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.03) 0%, rgba(0, 0, 0, 0.2) 100%)',
    border: '1px solid rgba(0, 245, 255, 0.1)',
    transition: 'all 0.3s ease',
  },
  specialtyIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.15) 0%, rgba(0, 245, 255, 0.05) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--accent-color)',
    flexShrink: 0,
  },
  specialtyLabel: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.3rem',
    color: 'var(--text-primary)',
  },
  specialtyDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-dim)',
    margin: 0,
  },
  techHighlight: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  primaryTechBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(0, 245, 255, 0.02) 100%)',
    border: '1px solid rgba(0, 245, 255, 0.3)',
    boxShadow: '0 4px 20px rgba(0, 245, 255, 0.1)',
  },
  techNumber: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-color)',
    opacity: 0.7,
  },
  techName: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--accent-color)',
    fontFamily: 'var(--font-mono)',
  },
  extendedBio: {
    position: 'relative',
    padding: '2rem',
    paddingLeft: '2.5rem',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.02)',
    color: 'var(--text-secondary)',
    fontSize: '1rem',
  },
  bioAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    borderRadius: '4px',
    background: 'linear-gradient(180deg, var(--accent-color) 0%, rgba(0, 245, 255, 0.2) 100%)',
  },
  secondaryTech: {
    fontSize: '0.75rem',
    padding: '0.35rem 0.75rem',
    borderRadius: '6px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)',
  },
};

export default About;
