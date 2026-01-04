import express from 'express';
import db from '../db.js';

const router = express.Router();

// Helper to parse project row
const parseProject = (row) => ({
  id: row.id,
  title: row.title,
  description_en: row.description_en,
  description_es: row.description_es,
  impact_en: row.impact_en,
  impact_es: row.impact_es,
  stack: JSON.parse(row.stack || '[]'),
  link: row.link,
  images: JSON.parse(row.images || '[]'),
  featured: Boolean(row.featured),
  sort_order: row.sort_order
});

// GET all projects
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM projects ORDER BY featured DESC, sort_order ASC, id ASC').all();
    const projects = rows.map(parseProject);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET single project
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    
    if (!row) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(parseProject(row));
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST create project
router.post('/', (req, res) => {
  try {
    const { title, description_en, description_es, impact_en, impact_es, stack, link, images, featured } = req.body;
    
    // Get max sort_order
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM projects').get();
    const sortOrder = (maxOrder.max || 0) + 1;
    
    const result = db.prepare(`
      INSERT INTO projects (title, description_en, description_es, impact_en, impact_es, stack, link, images, featured, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title || '',
      description_en || '',
      description_es || '',
      impact_en || '',
      impact_es || '',
      JSON.stringify(stack || []),
      link || '',
      JSON.stringify(images || []),
      featured ? 1 : 0,
      sortOrder
    );
    
    const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(parseProject(newProject));
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT update project
router.put('/:id', (req, res) => {
  try {
    const { title, description_en, description_es, impact_en, impact_es, stack, link, images, featured, sort_order } = req.body;
    
    const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    db.prepare(`
      UPDATE projects SET
        title = ?,
        description_en = ?,
        description_es = ?,
        impact_en = ?,
        impact_es = ?,
        stack = ?,
        link = ?,
        images = ?,
        featured = ?,
        sort_order = ?
      WHERE id = ?
    `).run(
      title ?? existing.title,
      description_en ?? existing.description_en,
      description_es ?? existing.description_es,
      impact_en ?? existing.impact_en,
      impact_es ?? existing.impact_es,
      stack ? JSON.stringify(stack) : existing.stack,
      link ?? existing.link,
      images ? JSON.stringify(images) : existing.images,
      featured !== undefined ? (featured ? 1 : 0) : existing.featured,
      sort_order ?? existing.sort_order,
      req.params.id
    );
    
    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    res.json(parseProject(updated));
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project
router.delete('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
