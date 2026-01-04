import express from 'express';
import crypto from 'crypto';
import db from '../db.js';

const router = express.Router();

// Simple token storage (in production, use Redis or JWT)
const sessions = new Map();

// Generate secure token
const generateToken = () => crypto.randomBytes(32).toString('hex');

// Hash password
const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const passwordHash = hashPassword(password);
    
    if (user.password_hash !== passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate session token
    const token = generateToken();
    sessions.set(token, { userId: user.id, username: user.username, createdAt: Date.now() });
    
    // Clean old sessions (older than 24 hours)
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    for (const [key, value] of sessions) {
      if (value.createdAt < dayAgo) {
        sessions.delete(key);
      }
    }
    
    res.json({ success: true, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/verify
router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token || !sessions.has(token)) {
      return res.json({ valid: false });
    }
    
    const session = sessions.get(token);
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    if (session.createdAt < dayAgo) {
      sessions.delete(token);
      return res.json({ valid: false });
    }
    
    res.json({ valid: true, username: session.username });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  try {
    const { token } = req.body;
    
    if (token) {
      sessions.delete(token);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', (req, res) => {
  try {
    const { token, currentPassword, newPassword } = req.body;
    
    if (!token || !sessions.has(token)) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const session = sessions.get(token);
    const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(session.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const currentHash = hashPassword(currentPassword);
    if (user.password_hash !== currentHash) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }
    
    const newHash = hashPassword(newPassword);
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(newHash, user.id);
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
