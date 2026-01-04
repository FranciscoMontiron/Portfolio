import express from 'express';
import db from '../db.js';

const router = express.Router();

// Create contact_messages table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    reason TEXT,
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// POST submit contact message
router.post('/', (req, res) => {
  try {
    const { name, email, message, reason } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }

    const result = db.prepare(`
      INSERT INTO contact_messages (name, email, message, reason)
      VALUES (?, ?, ?, ?)
    `).run(name, email, message, reason || null);

    // Here you could add email notification logic
    // For example: sendEmail({ to: process.env.CONTACT_EMAIL, ... })
    
    console.log(`📧 New contact message from ${name} <${email}>`);

    res.status(201).json({ 
      success: true, 
      message: 'Message received successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// GET all messages (admin only - add auth middleware in production)
router.get('/', (req, res) => {
  try {
    const messages = db.prepare(`
      SELECT * FROM contact_messages 
      ORDER BY created_at DESC
    `).all();
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PUT mark message as read
router.put('/:id/read', (req, res) => {
  try {
    db.prepare('UPDATE contact_messages SET read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE message
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
