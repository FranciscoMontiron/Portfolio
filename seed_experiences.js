import db from './server/db.js';

const experiences = [
  {
    role: "Desarrollador web",
    company: "Honorable Tribunal de Cuentas (PBA)",
    period: "Mar 2025 - Presente",
    description_es: "Desarrollé módulos internos utilizando PHP y Symfony, modernizando la gestión de procesos. Diseñé y optimicé bases de datos MySQL usando Doctrine. Implementé interfaces responsivas con HTML5, CSS3 y JavaScript. Colaboré en equipos ágiles con Git y Jira.",
    description_en: "Developed internal modules using PHP and Symfony, modernizing process management. Designed and optimized MySQL databases using Doctrine. Implemented responsive interfaces with HTML5, CSS3, and JavaScript. Collaborated in agile teams using Git and Jira.",
    tech: JSON.stringify(["PHP", "Symfony", "MySQL", "Doctrine", "JavaScript", "Git", "Jira"]),
    type: "main",
    context: "",
    layout_delay: "0.2s"
  },
  {
    role: "Full Stack Developer",
    company: "JRC SoftCoding Solutions",
    period: "Nov 2024 - Feb 2025",
    description_es: "Desarrollé y mantuve APIs RESTful garantizando escalabilidad. Construí front-ends robustos con Angular e Ionic. Realicé pruebas unitarias y de integración. Colaboré en entornos ágiles siguiendo metodologías Scrum.",
    description_en: "Developed and maintained RESTful APIs ensuring scalability. Built robust front-ends with Angular and Ionic. Performed unit and integration testing. Collaborated in agile environments following Scrum methodologies.",
    tech: JSON.stringify(["Angular", "Ionic", "REST API", "Scrum", "TypeScript"]),
    type: "main",
    context: "",
    layout_delay: "0.4s"
  },
  {
    role: "Pasante en Desarrollo Frontend",
    company: "JRC SoftCoding Solutions",
    period: "Jun 2024 - Oct 2024",
    description_es: "Participé en el desarrollo de aplicaciones web y móviles. Colaboré utilizando Angular, PHP y Ionic. Optimicé el rendimiento y la accesibilidad de interfaces. Aprendí nuevas tecnologías y mejores prácticas.",
    description_en: "Participated in web and mobile app development. Collaborated using Angular, PHP, and Ionic. Optimized interface performance and accessibility. Learned new technologies and best practices.",
    tech: JSON.stringify(["Angular", "PHP", "Ionic", "HTML5", "CSS3"]),
    type: "main",
    context: "",
    layout_delay: "0.6s"
  }
];

const insert = db.prepare(`
  INSERT INTO experiences (role, company, period, description_en, description_es, tech, type, context, layout_delay)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((exps) => {
  for (const e of exps) {
    insert.run(e.role, e.company, e.period, e.description_en, e.description_es, e.tech, e.type, e.context, e.layout_delay);
  }
});

try {
  insertMany(experiences);
  console.log('Successfully added experiences.');
} catch (err) {
  console.error('Error adding experiences:', err);
}
