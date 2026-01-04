import express from 'express';
import { Resend } from 'resend';
import db from '../db.js';

const router = express.Router();

// Initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'franciscomontiron@gmail.com';

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

// Send email notification
async function sendEmailNotification(name, email, message, reason) {
  if (!resend) {
    console.log('⚠️ Resend not configured, skipping email notification');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
      subject: `🚀 Nuevo mensaje de contacto: ${reason || 'Sin categoría'}`,
      html: `
        <div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 30px; border-radius: 12px;">
          <h1 style="color: #00ffd5; margin-bottom: 20px;">📬 Nuevo mensaje de contacto</h1>
          
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #00ffd5;">De:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong style="color: #00ffd5;">Email:</strong> <a href="mailto:${email}" style="color: #00ffd5;">${email}</a></p>
            <p style="margin: 0;"><strong style="color: #00ffd5;">Razón:</strong> ${reason || 'No especificada'}</p>
          </div>
          
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px;">
            <p style="color: #00ffd5; margin: 0 0 10px 0;"><strong>Mensaje:</strong></p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Responde directamente a este email para contactar a ${name}.
          </p>
        </div>
      `,
      replyTo: email
    });
    console.log(`✅ Email notification sent to ${CONTACT_EMAIL}`);
  } catch (error) {
    console.error('❌ Failed to send email notification:', error);
  }
}

// POST submit contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, message, reason } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }

    const result = db.prepare(`
      INSERT INTO contact_messages (name, email, message, reason)
      VALUES (?, ?, ?, ?)
    `).run(name, email, message, reason || null);

    // Send email notification (async, don't wait for it)
    sendEmailNotification(name, email, message, reason);
    
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
