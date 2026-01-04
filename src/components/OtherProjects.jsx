import React from 'react';
import { ExternalLink, Github, Layers, Code2, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OtherProjects = ({ data }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';

  if (!data || data.length === 0) {
    return null;
  }

  const getIcon = (index) => {
    const icons = [Code2, Globe, Layers];
    const Icon = icons[index % icons.length];
    return <Icon size={24} />;
  };

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <p className="mono accent-text" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
          {"// OTHER_MODULES"}
        </p>
        <h3 style={{ fontSize: '2rem', fontWeight: 600 }}>
          {lang === 'es' ? 'Otros Proyectos' : 'Other Projects'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          {lang === 'es' ? 'Exploraciones y experimentos' : 'Explorations and experiments'}
        </p>
      </div>

      {/* Card Grid */}
      <div style={styles.grid}>
        {data.map((project, index) => (
          <div key={project.id} className="glass" style={styles.card}>
            {/* Card Header */}
            <div style={styles.cardHeader}>
              <div style={styles.iconWrapper}>
                {getIcon(index)}
              </div>
              <div style={styles.cardLinks}>
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
                    <Github size={18} />
                  </a>
                )}
                {project.link && project.link !== '#' && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div style={styles.cardContent}>
              <h4 style={styles.cardTitle}>{project.title}</h4>
              <p style={styles.cardDescription}>
                {project.description || (lang === 'es' ? project.description_es : project.description_en)}
              </p>
            </div>

            {/* Card Footer */}
            <div style={styles.cardFooter}>
              {(project.stack || []).slice(0, 4).map(tech => (
                <span key={tech} style={styles.techTag}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    padding: '2rem',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    transition: 'all 0.3s ease',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    background: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8b5cf6',
  },
  cardLinks: {
    display: 'flex',
    gap: '0.5rem',
  },
  iconLink: {
    padding: '0.5rem',
    color: 'var(--text-dim)',
    transition: 'color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: 'var(--text-primary)',
  },
  cardDescription: {
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
  },
  cardFooter: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: 'auto',
  },
  techTag: {
    fontSize: '0.7rem',
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
    background: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)',
  },
};

export default OtherProjects;
