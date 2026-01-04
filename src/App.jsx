import React, { useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';

// Components
import TerminalHero from './components/TerminalHero';
import Header from './components/Header';
import About from './components/About';
import FeaturedProjects from './components/FeaturedProjects';
import OtherProjects from './components/OtherProjects';
import Philosophy from './components/Philosophy';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Footer from './components/Footer';
import JsonView from './components/JsonView';
import Login from './components/admin/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import CliOverlay from './components/CliOverlay';
import ParallaxBackground from './components/ParallaxBackground';

// Animation wrapper for sections with robust 3D reveal
const MotionSection = ({ children, className, delay = 0 }) => (
  <motion.section
    className={className}
    initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 5 }}
    whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true, margin: "-10%" }} // Trigger a bit earlier
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    style={{ transformStyle: 'preserve-3d' }}
  >
    {children}
  </motion.section>
);

// Wrapper to provide data access to main layout
const PortfolioLayout = () => {
    const [isApiMode, setIsApiMode] = useState(false);
    const [bootComplete, setBootComplete] = useState(false);
    const { projects, settings, getSetting, loading } = useData();
    const { t, i18n } = useTranslation();
    
    const lang = i18n.language?.startsWith('es') ? 'es' : 'en';

    // Split projects into featured and other
    const featuredProjects = projects.filter(p => p.featured).map(p => ({
        ...p,
        description: lang === 'es' ? p.description_es : p.description_en,
        impact: lang === 'es' ? p.impact_es : p.impact_en
    }));
    
    const otherProjects = projects.filter(p => !p.featured).map(p => ({
        ...p,
        description: lang === 'es' ? p.description_es : p.description_en,
        impact: lang === 'es' ? p.impact_es : p.impact_en
    }));

    // Reconstruct data object using dynamic settings from API
    const portfolioData = {
        identity: {
            name: getSetting('name', lang) || 'Francisco Montiron',
            role: getSetting('role', lang) || t('about.role_prefix') + " " + t('about.role_suffix'),
            status: getSetting('status', lang) || 'Building ARKUM / Systems Engineer @ UTN',
            location: getSetting('location', lang) || 'Buenos Aires, Argentina'
        },
        specialization: (getSetting('specializations', lang) || 'Symfony,PHP,Angular,Python,API Platform,System Architecture').split(',').map(s => s.trim()),
        bio: {
            short: getSetting('bio_short', lang) || 'I build systems that work in the real world, not just in theory.',
            long: getSetting('bio_long', lang) || ''
        },
        projects: projects.map(p => ({
            ...p,
            description: lang === 'es' ? p.description_es : p.description_en,
            impact: lang === 'es' ? p.impact_es : p.impact_en
        })),
        philosophy: getSetting('philosophy', lang) || 'I prioritize clarity over cleverness, maintainability over brilliant hacks, and solutions that scale without technical debt.',
        primaryTech: (getSetting('primary_tech', 'en') || 'Laravel,Symfony,Angular').split(',').map(s => s.trim()),
        specialties: [1, 2, 3, 4].map(n => ({
            label: getSetting(`specialty_${n}_label`, lang) || (lang === 'es' ? ['Backend', 'Dockerización', 'Despliegue', 'Seguridad'][n-1] : ['Backend', 'Dockerization', 'Deployment', 'Security'][n-1]),
            desc: getSetting(`specialty_${n}_desc`, lang) || (lang === 'es' ? ['Arquitecturas robustas', 'Contenedores', 'CI/CD', 'Auditorías'][n-1] : ['Robust architectures', 'Containers', 'CI/CD', 'Auditing'][n-1])
        }))
    };

    if (loading) {
        return (
            <div className="app-container" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh',
                color: 'var(--accent-color)'
            }}>
                <div className="mono">LOADING_SYSTEM...</div>
            </div>
        );
    }

    if (isApiMode) {
        return <JsonView data={portfolioData} onExit={() => setIsApiMode(false)} />;
    }

    return (
        <div className="app-container" style={{ perspective: '1000px' }}>
            <ParallaxBackground />
            <CliOverlay />
            {!bootComplete && (
                <TerminalHero onComplete={() => setBootComplete(true)} />
            )}

            {bootComplete && (
                <div className="scroll-container" style={{ animation: 'fadeIn 1s forwards' }}>
                    <Header onToggleApi={() => setIsApiMode(!isApiMode)} />
                    
                    {/* About Section */}
                    <MotionSection className="snap-section section-gradient-1">
                        <About data={portfolioData} />
                    </MotionSection>

                    {/* Experience Section */}
                    <MotionSection className="snap-section section-gradient-2">
                        <Experience />
                    </MotionSection>

                    {/* Featured Projects Section */}
                    <section className="snap-section-auto">
                        <FeaturedProjects data={featuredProjects} />
                    </section>

                    {/* Other Projects Section */}
                    {otherProjects.length > 0 && (
                        <MotionSection className="snap-section section-gradient-2">
                            <OtherProjects data={otherProjects} />
                        </MotionSection>
                    )}

                    {/* Contact Section */}
                    <MotionSection className="snap-section section-gradient-1">
                        <Contact />
                    </MotionSection>

                    {/* Philosophy Section */}
                    <MotionSection className="snap-section">
                        <Philosophy text={portfolioData.philosophy} />
                    </MotionSection>

                    {/* Footer */}
                    <div className="snap-section-auto">
                        <Footer />
                    </div>
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <Routes>
                    <Route path="/" element={<PortfolioLayout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </DataProvider>
        </AuthProvider>
    );
}

export default App;
