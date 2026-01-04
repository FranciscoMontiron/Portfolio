import React, { useRef } from 'react';
import { ExternalLink, Database, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import ImageCarousel from './ImageCarousel';

const ProjectCard = ({ project, index, lang, t }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax subtle movement and 3D rotation
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <section 
      ref={ref}
      style={{
        ...styles.projectCard,
        background: index % 2 === 0 
          ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.02) 0%, rgba(0, 0, 0, 0.3) 100%)'
          : 'linear-gradient(135deg, rgba(139, 92, 246, 0.02) 0%, rgba(0, 0, 0, 0.3) 100%)',
        perspective: '1000px', // key for 3d effect
        rotateX,
        scale
      }}
    >
      {/* Image Carousel - Parallax Effect */}
      {project.images && project.images.length > 0 && (
        <motion.div 
          style={{ 
            ...styles.carouselWrapper, 
            y: y, // Parallax movement
          }}
        >
          <ImageCarousel 
            images={project.images} 
            autoPlay={true}
            interval={6000}
          />
        </motion.div>
      )}

      {/* Project Info */}
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div 
          style={styles.projectContent}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div style={styles.projectHeader}>
            <div style={styles.iconWrapper}>
              {project.title?.toLowerCase().includes('arkum') ? (
                <Database size={28} />
              ) : (
                <Layers size={28} />
              )}
            </div>
            
            <div style={styles.titleSection}>
              <h4 style={styles.projectTitle}>{project.title}</h4>
              <div style={styles.techStack}>
                {(project.stack || []).map(tech => (
                  <span key={tech} style={styles.techBadge}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.link && project.link !== '#' && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={styles.linkButton}
              >
                <ExternalLink size={18} />
                <span>{t('projects.view_project')}</span>
              </a>
            )}
          </div>

          <p style={styles.description}>
            {project.description || (lang === 'es' ? project.description_es : project.description_en)}
          </p>

          {(project.impact || project.impact_en || project.impact_es) && (
            <div style={styles.impactBox}>
              <div style={styles.impactIcon}>⚡</div>
              <p style={styles.impactText}>
                {project.impact || (lang === 'es' ? project.impact_es : project.impact_en)}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

const FeaturedProjects = ({ data }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div id="projects" style={{ paddingBottom: '2rem', overflow: 'hidden' }}>
      <div className="container" style={{ marginBottom: '3rem' }}>
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6 }}
           viewport={{ once: true }}
        >
          <p className="mono accent-text" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
            {t('projects.section_label')}
          </p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            {t('projects.title')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            {lang === 'es' ? 'Proyectos destacados con impacto real' : 'Featured projects with real-world impact'}
          </p>
        </motion.div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {data.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            lang={lang} 
            t={t} 
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  projectCard: {
    width: '100%',
    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
    paddingTop: '6rem',
    paddingBottom: '6rem',
    position: 'relative',
    overflow: 'hidden', // Contain parallax elements
  },
  carouselWrapper: {
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto 6rem auto', // Increased margin to prevent parallax overlap
    padding: '0 2rem',
    // Removed z-index to allow parallax to flow naturally, or set low if needed
  },
  projectContent: {
    maxWidth: '900px',
    background: 'rgba(10, 10, 10, 0.6)', // Slight background to ensure text readability over parallax
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  projectHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  iconWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(0, 245, 255, 0.05) 100%)',
    border: '1px solid rgba(0, 245, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--accent-color)',
    flexShrink: 0,
  },
  titleSection: {
    flex: 1,
    minWidth: '200px',
  },
  projectTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.75rem',
    background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  techStack: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  techBadge: {
    fontSize: '0.75rem',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)',
  },
  linkButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.8rem 1.2rem',
    borderRadius: '12px',
    background: 'rgba(0, 245, 255, 0.1)',
    border: '1px solid rgba(0, 245, 255, 0.3)',
    color: 'var(--accent-color)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-mono)',
    transition: 'all 0.3s ease',
    flexShrink: 0,
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: 1.7,
    color: 'var(--text-secondary)',
    marginBottom: '1.5rem',
  },
  impactBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem 1.5rem',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.05) 0%, rgba(0, 245, 255, 0.02) 100%)',
    borderLeft: '3px solid var(--accent-color)',
    boxShadow: '0 4px 20px rgba(0, 245, 255, 0.1)',
  },
  impactIcon: {
    fontSize: '1.5rem',
  },
  impactText: {
    margin: 0,
    fontSize: '0.95rem',
    color: 'var(--accent-color)',
    fontFamily: 'var(--font-mono)',
  },
};

export default FeaturedProjects;
