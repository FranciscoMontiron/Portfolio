import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Send, 
  Briefcase, 
  MessageSquare, 
  Coffee, 
  Github, 
  Linkedin, 
  Mail, 
  ArrowRight,
  Check,
  Loader2
} from 'lucide-react';

const Contact = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  
  const [selectedReason, setSelectedReason] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '';

  const quickActions = [
    { id: 'project', icon: Briefcase, label: lang === 'es' ? 'Tengo un proyecto' : 'I have a project', color: '#00f5ff' },
    { id: 'question', icon: MessageSquare, label: lang === 'es' ? 'Consulta técnica' : 'Technical question', color: '#8b5cf6' },
    { id: 'coffee', icon: Coffee, label: lang === 'es' ? 'Solo saludar' : 'Just say hi', color: '#f59e0b' }
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/franciscomontiron', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/francisco-montiron-3212b7129/', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:franciscomontiron@gmail.com', label: 'Email' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, reason: selectedReason })
      });

      if (!response.ok) throw new Error('Failed');
      
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setFormData({ name: '', email: '', message: '' });
        setSelectedReason(null);
      }, 3000);
    } catch (error) {
      alert(lang === 'es' ? 'Error al enviar' : 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="container" style={{ padding: '4rem 2rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p className="mono accent-text" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
          {lang === 'es' ? '// CONECTEMOS' : '// LET\'S CONNECT'}
        </p>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
          {lang === 'es' ? '¿Tienes algo en mente?' : 'Got something in mind?'}
        </h2>
        <p style={{ color: 'var(--text-dim)' }}>
          {lang === 'es' ? 'Siempre abierto a nuevos proyectos' : 'Always open to new projects'}
        </p>
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 400px) minmax(300px, 450px)',
        gap: '2rem',
        maxWidth: '900px',
        margin: '0 auto',
        justifyContent: 'center'
      }}>
        
        {/* Left Column */}
        <div>
          {/* Quick Actions */}
          <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            {lang === 'es' ? '// ACCIÓN RÁPIDA' : '// QUICK ACTION'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => setSelectedReason(action.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  borderRadius: '10px',
                  border: `1px solid ${selectedReason === action.id ? action.color : 'rgba(255,255,255,0.1)'}`,
                  background: selectedReason === action.id ? `${action.color}10` : 'transparent',
                  cursor: 'pointer',
                  color: selectedReason === action.id ? action.color : 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-sans)',
                  textAlign: 'left',
                }}
              >
                <action.icon size={18} />
                <span>{action.label}</span>
                {selectedReason === action.id && <Check size={14} style={{ marginLeft: 'auto' }} />}
              </button>
            ))}
          </div>

          {/* Social Links */}
          <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            {lang === 'es' ? '// REDES SOCIALES' : '// SOCIAL'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                }}
              >
                <social.icon size={16} />
                <span>{social.label}</span>
              </a>
            ))}
          </div>


        </div>

        {/* Right Column - Form */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <MessageSquare size={18} style={{ color: 'var(--accent-color)' }} />
            <span style={{ fontWeight: 600 }}>{lang === 'es' ? 'Enviar mensaje' : 'Send message'}</span>
          </div>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(0, 200, 83, 0.15)',
                border: '2px solid #00c853',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00c853',
                margin: '0 auto 1rem',
              }}>
                <Check size={24} />
              </div>
              <p style={{ fontWeight: 600 }}>{lang === 'es' ? '¡Mensaje enviado!' : 'Message sent!'}</p>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                {lang === 'es' ? 'Te responderé pronto' : 'I\'ll get back to you soon'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.35rem' }}>
                    {lang === 'es' ? 'Nombre' : 'Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={lang === 'es' ? 'Tu nombre' : 'Your name'}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,0,0,0.3)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.35rem' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@ejemplo.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,0,0,0.3)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.35rem' }}>
                  {lang === 'es' ? 'Mensaje' : 'Message'}
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder={lang === 'es' ? 'Cuéntame sobre tu proyecto...' : 'Tell me about your project...'}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              </div>

              <button 
                type="submit" 
                disabled={sending}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--accent-color) 0%, #00c8d4 100%)',
                  color: '#000',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.7 : 1,
                }}
              >
                {sending ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    {lang === 'es' ? 'Enviando...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    {lang === 'es' ? 'Enviar mensaje' : 'Send message'}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .container > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
