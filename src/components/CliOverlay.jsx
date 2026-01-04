import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTranslation } from 'react-i18next';

const CliOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { projects } = useData();
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setHistory(prev => [...prev, `> ${cmd}`]);
      processCommand(cmd);
      setInput('');
    }
  };

  const processCommand = (cmd) => {
    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        logOutput("Available commands: login, goto [admin|home], ls, cat [id], lang [es|en], clear, exit");
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'exit':
        setIsOpen(false);
        break;
      case 'login':
        if (args.length > 0) {
           if(login(args[0])) {
               logOutput("Authentication successful. Access granted.");
               navigate('/admin');
               setIsOpen(false);
           } else {
               logOutput("Access denied. Invalid credentials.", "error");
           }
        } else {
            logOutput("Usage: login [password]"); 
        }
        break;
      case 'goto':
        if (args[0] === 'admin') navigate('/admin');
        else if (args[0] === 'home') navigate('/');
        else logOutput("Unknown destination");
        break;
      case 'ls':
        logOutput("Projects:");
        projects.forEach(p => logOutput(`  - ${p.id}: ${p.title} (${p.stack.join(', ')})`));
        break;
      case 'cat':
        const project = projects.find(p => p.id === args[0]);
        if (project) {
          logOutput(`Title: ${project.title}`);
          logOutput(`Stack: ${project.stack.join(', ')}`);
          logOutput(`Description: ${i18n.language === 'en' ? project.description_en : project.description_es}`);
        } else {
          logOutput(`Project '${args[0]}' not found.`);
        }
        break;
      case 'lang':
        if (args[0] === 'es' || args[0] === 'en') {
            i18n.changeLanguage(args[0]);
            logOutput(`Language switched to ${args[0].toUpperCase()}`);
        } else {
            logOutput("Usage: lang [es|en]"); 
        }
        break;
      default:
        logOutput(`Command not found: ${command}`);
    }
  };

  const logOutput = (text, type = 'info') => {
    setHistory(prev => [...prev, <div style={{ color: type === 'error' ? '#ff4444' : '#e0e0e0' }}>{text}</div>]);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(5px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }} onClick={() => setIsOpen(false)}>
      <div style={{
        width: '600px',
        maxHeight: '400px',
        backgroundColor: '#1a1a1a',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-mono)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ marginBottom: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          FRAN_MONTIRON_CLI v1.0.0 -- Type 'help' for commands
        </div>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {history.map((line, i) => (
            <div key={i} style={{ marginBottom: '0.25rem' }}>{line}</div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>➜</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleCommand}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              flex: 1,
              outline: 'none',
              fontFamily: 'var(--font-mono)'
            }}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default CliOverlay;
