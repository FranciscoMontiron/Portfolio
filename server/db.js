import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use data folder for persistent storage in production
const dataDir = process.env.NODE_ENV === 'production' 
  ? join(__dirname, 'data')
  : __dirname;

// Ensure data directory exists
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const db = new Database(join(dataDir, 'portfolio.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value_en TEXT,
    value_es TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description_en TEXT,
    description_es TEXT,
    impact_en TEXT,
    impact_es TEXT,
    stack TEXT DEFAULT '[]',
    link TEXT,
    images TEXT DEFAULT '[]',
    featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add featured column if it doesn't exist (migration for existing DBs)
try {
  db.exec(`ALTER TABLE projects ADD COLUMN featured INTEGER DEFAULT 0`);
  // Set ARKUM as featured by default
  db.exec(`UPDATE projects SET featured = 1 WHERE title LIKE '%ARKUM%'`);
  console.log('✓ Added featured column to projects');
} catch (e) {
  // Column already exists, ignore
}

// Check if settings are empty and seed initial data
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get();
if (settingsCount.count === 0) {
  const insertSetting = db.prepare('INSERT INTO settings (key, value_en, value_es) VALUES (?, ?, ?)');
  
  const initialSettings = [
    ['name', 'Francisco Montiron', 'Francisco Montiron'],
    ['role', 'Full-Stack Developer & Systems Engineer', 'Desarrollador Full-Stack & Ingeniero en Sistemas'],
    ['status', 'Building ARKUM / Systems Engineer @ UTN', 'Desarrollando ARKUM / Ingeniero en Sistemas @ UTN'],
    ['location', 'Buenos Aires, Argentina', 'Buenos Aires, Argentina'],
    ['bio_short', 
      'I build systems that work in the real world, not just in theory. Specialized in transforming complex problems into elegant digital solutions.',
      'Construyo sistemas que funcionan en el mundo real, no solo en teoría. Especializado en transformar problemas complejos en soluciones digitales elegantes.'
    ],
    ['bio_long',
      'With a foundation in systems engineering and years of hands-on experience, I approach every project with a focus on scalability, maintainability, and real-world impact. Currently leading development at ARKUM, managing electronic document flows for public administration.',
      'Con una base en ingeniería de sistemas y años de experiencia práctica, abordo cada proyecto con un enfoque en escalabilidad, mantenibilidad e impacto real. Actualmente liderando el desarrollo en ARKUM, gestionando flujos de documentos electrónicos para la administración pública.'
    ],
    ['philosophy',
      'I prioritize clarity over cleverness, maintainability over brilliant hacks, and solutions that scale without technical debt.',
      'Priorizo la claridad sobre la astucia, la mantenibilidad sobre los hacks brillantes, y soluciones que escalan sin deuda técnica.'
    ],
    ['specializations', 'Symfony,PHP,Angular,Python,API Platform,System Architecture', 'Symfony,PHP,Angular,Python,API Platform,Arquitectura de Sistemas']
  ];

  const insertMany = db.transaction((settings) => {
    for (const [key, value_en, value_es] of settings) {
      insertSetting.run(key, value_en, value_es);
    }
  });
  insertMany(initialSettings);
  console.log('✓ Seeded initial settings');
}

// Check if projects are empty and seed initial data
const projectsCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
if (projectsCount.count === 0) {
  const insertProject = db.prepare(`
    INSERT INTO projects (title, description_en, description_es, impact_en, impact_es, stack, link, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialProjects = [
    {
      title: 'ARKUM',
      description_en: 'Electronic Document Management System for public administration.',
      description_es: 'Sistema de Gestión Documental Electrónica para la administración pública.',
      impact_en: 'Processes thousands of institutional documents daily.',
      impact_es: 'Procesa miles de documentos institucionales diariamente.',
      stack: JSON.stringify(['Symfony', 'PHP', 'API Platform', 'PostgreSQL']),
      link: 'https://www.htc.gba.gov.ar',
      sort_order: 1
    },
    {
      title: 'Advanced Solutions',
      description_en: 'Custom digital products from REST APIs to automation prototypes.',
      description_es: 'Productos digitales personalizados desde APIs REST hasta prototipos de automatización.',
      impact_en: '',
      impact_es: '',
      stack: JSON.stringify(['Python', 'Angular', 'Next.js']),
      link: '#',
      sort_order: 2
    }
  ];

  const insertManyProjects = db.transaction((projects) => {
    for (const p of projects) {
      insertProject.run(p.title, p.description_en, p.description_es, p.impact_en, p.impact_es, p.stack, p.link, p.sort_order);
    }
  });
  insertManyProjects(initialProjects);
  console.log('✓ Seeded initial projects');
}

// Check if experiences are empty and seed initial data
db.exec(`
  CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    company TEXT,
    period TEXT,
    description_en TEXT,
    description_es TEXT,
    tech TEXT DEFAULT '[]',
    type TEXT DEFAULT 'main', -- 'main' or 'minor'
    context TEXT, -- For minor experiences
    layout_delay TEXT DEFAULT '0s'
  );
`);

const experiencesCount = db.prepare('SELECT COUNT(*) as count FROM experiences').get();
if (experiencesCount.count === 0) {
  const insertExperience = db.prepare(`
    INSERT INTO experiences (role, company, period, description_en, description_es, tech, type, context, layout_delay)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialExperiences = [
    {
      role: "Arkum Developer",
      company: "Arkum",
      period: "2024 - Present",
      description_en: "Full stack development of scalable solutions, database optimization and complex system architecture. Technical leadership in the implementation of critical new features.",
      description_es: "Desarrollo full stack de soluciones escalables, optimización de base de datos y arquitectura de sistemas complejos. Liderazgo técnico en la implementación de nuevas funcionalidades críticas.",
      tech: JSON.stringify(["React", "Node.js", "PostgreSQL", "AWS"]),
      type: "main",
      context: "",
      layout_delay: "0.2s"
    },
    {
      role: "Freelance Senior",
      company: "Independent",
      period: "2022 - 2024",
      description_en: "Remote team leadership and microservices architecture development for international clients.",
      description_es: "Liderazgo de equipos remotos y desarrollo de arquitecturas de microservicios para clientes internacionales.",
      tech: JSON.stringify(["Docker", "Kubernetes", "Go", "Redis"]),
      type: "main",
      context: "",
      layout_delay: "0.4s"
    },
    {
      role: "Freelance Projects",
      company: "",
      period: "",
      description_en: "Development of corporate websites and small custom management systems.",
      description_es: "Desarrollo de sitios web corporativos y pequeños sistemas de gestión personalizados.",
      tech: "[]",
      type: "minor",
      context: "Various Clients",
      layout_delay: "0s"
    },
    {
      role: "Hackathon Participant",
      company: "",
      period: "",
      description_en: "Team collaboration for the development of a video game prototype in 48 hours.",
      description_es: "Colaboración en equipo para el desarrollo de un prototipo de videojuego en 48 horas.",
      tech: "[]",
      type: "minor",
      context: "Global Game Jam",
      layout_delay: "0s"
    },
    {
      role: "Open Source",
      company: "",
      period: "",
      description_en: "Contributions to UI libraries and web development tools.",
      description_es: "Contribuciones a librerías de UI y herramientas de desarrollo web.",
      tech: "[]",
      type: "minor",
      context: "GitHub Community",
      layout_delay: "0s"
    }
  ];

  const insertManyExperiences = db.transaction((experiences) => {
    for (const e of experiences) {
      insertExperience.run(e.role, e.company, e.period, e.description_en, e.description_es, e.tech, e.type, e.context, e.layout_delay);
    }
  });
  insertManyExperiences(initialExperiences);
  console.log('✓ Seeded initial experiences');
}

// Create admin_users table for secure authentication
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default admin user if none exists (password will be hashed on first login attempt)
const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
if (adminCount.count === 0) {
  const defaultPassword = process.env.ADMIN_PASSWORD || 'changeme123';
  const hash = crypto.createHash('sha256').update(defaultPassword).digest('hex');
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash);
  console.log('✓ Created default admin user (username: admin, password: ' + defaultPassword + ')');
  console.log('⚠️  IMPORTANT: Change the admin password after first login!');
}

export default db;
