import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all settings
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM settings').all();
    
    // Transform array to object for easier consumption
    const settings = {};
    for (const row of rows) {
      settings[row.key] = {
        en: row.value_en,
        es: row.value_es
      };
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT update settings (accepts object with key: {en, es} pairs)
router.put('/', (req, res) => {
  try {
    const updates = req.body;
    
    const updateStmt = db.prepare(`
      INSERT INTO settings (key, value_en, value_es) 
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET 
        value_en = excluded.value_en,
        value_es = excluded.value_es
    `);

    const updateMany = db.transaction((entries) => {
      for (const [key, values] of Object.entries(entries)) {
        updateStmt.run(key, values.en || '', values.es || '');
      }
    });
    
    updateMany(updates);
    
    // Return updated settings
    const rows = db.prepare('SELECT * FROM settings').all();
    const settings = {};
    for (const row of rows) {
      settings[row.key] = {
        en: row.value_en,
        es: row.value_es
      };
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
