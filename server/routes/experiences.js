import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all experiences
router.get('/', (req, res) => {
  try {
    const experiences = db.prepare('SELECT * FROM experiences ORDER BY id ASC').all();
    const parsedExperiences = experiences.map(e => ({
      ...e,
      tech: JSON.parse(e.tech || '[]')
    }));
    res.json(parsedExperiences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new experience
router.post('/', (req, res) => {
  try {
    const { role, company, period, description_en, description_es, tech, type, context, layout_delay } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO experiences (role, company, period, description_en, description_es, tech, type, context, layout_delay)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(
      role, 
      company || '', 
      period || '', 
      description_en || '', 
      description_es || '', 
      JSON.stringify(tech || []), 
      type || 'main', 
      context || '',
      layout_delay || '0s'
    );
    
    res.json({ id: info.lastInsertRowid, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update experience
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { role, company, period, description_en, description_es, tech, type, context, layout_delay } = req.body;
    
    const stmt = db.prepare(`
      UPDATE experiences 
      SET role = ?, company = ?, period = ?, description_en = ?, description_es = ?, tech = ?, type = ?, context = ?, layout_delay = ?
      WHERE id = ?
    `);
    
    stmt.run(
      role, 
      company || '', 
      period || '', 
      description_en || '', 
      description_es || '', 
      JSON.stringify(tech || []), 
      type, 
      context || '',
      layout_delay || '0s',
      id
    );
    
    res.json({ id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE experience
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM experiences WHERE id = ?').run(id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
