import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="container" style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <div className="glass" style={{
        padding: '3rem',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        border: error ? '1px solid #ff4444' : '1px solid var(--border-color)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          marginBottom: '2rem',
          color: 'var(--accent-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Lock size={48} />
        </div>

        <h2 className="mono" style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          {t('admin.login_title')}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('admin.password_placeholder')}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              padding: '1rem',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              width: '100%',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              background: 'var(--accent-color)',
              color: '#000',
              border: 'none',
              padding: '1rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              marginTop: '1rem'
            }}
          >
            {t('admin.login_btn')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
