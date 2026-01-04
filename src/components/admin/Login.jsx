import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(username, password);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
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

        {error && (
          <div style={{ 
            color: '#ff4444', 
            marginBottom: '1rem', 
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username..."
            disabled={loading}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              padding: '1rem',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              width: '100%',
              outline: 'none',
              opacity: loading ? 0.5 : 1
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('admin.password_placeholder')}
            disabled={loading}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              padding: '1rem',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              width: '100%',
              outline: 'none',
              opacity: loading ? 0.5 : 1
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#666' : 'var(--accent-color)',
              color: '#000',
              border: 'none',
              padding: '1rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-mono)',
              marginTop: '1rem'
            }}
          >
            {loading ? 'Loading...' : t('admin.login_btn')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
