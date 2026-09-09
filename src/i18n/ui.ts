export const languages = {
  en: "English",
  es: "Español",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "en";

export const ui = {
  en: {
    // ── Navigation ──
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.work": "Work",
    "nav.writing": "Writing",
    "nav.about": "About",
    "nav.contact": "Contact",

    // ── Hero ──
    "home.hero.eyebrow": "Applied AI Engineer · Senior Software Engineer",
    "home.hero.title": "I build AI agents and software for real business workflows.",
    "home.hero.tagline":
      "My work spans AI code review, incident triage, property operations and service platforms. I combine TypeScript, PHP/Laravel and Cloudflare to connect AI capabilities with the systems people use every day.",
    "home.hero.tone":
      "Open to senior engineering opportunities and selected consulting engagements.",
    "home.hero.title.lead": "I build ",
    "home.hero.title.highlight": "AI agents and software",
    "home.hero.title.tail": " for real business workflows.",
    "home.hero.badge.1": "AI Code Review",
    "home.hero.badge.2": "WhatsApp Concierge",
    "home.hero.badge.3": "Property Ops Platform",
    "home.hero.cta.primary": "Explore my work",
    "home.hero.cta.secondary": "Get in touch",

    // ── How I Work ──
    "home.how.heading": "How I Work",
    "home.how.body":
      "From problem definition to production operation — with verification at every step.",
    "home.how.card1.title": "Context first",
    "home.how.card1.body":
      "Understand the business process, users and constraints before writing code — what exists today, what breaks, what the operation actually needs.",
    "home.how.card2.title": "Deliberate decisions",
    "home.how.card2.body":
      "Choose boring, reversible solutions. Document the trade-offs on architecture, integrations and AI boundaries so the reasoning survives the code.",
    "home.how.card3.title": "Ship in slices",
    "home.how.card3.body":
      "Deliver working vertical slices into the real system — booking flows, review pipelines, maintenance workflows — not isolated prototypes.",
    "home.how.card4.title": "Verify relentlessly",
    "home.how.card4.body":
      "Tests, structured-output validation for AI, retries with fallbacks, and approval gates where mistakes matter. Evidence over claims.",
    "home.how.card5.title": "Operate and learn",
    "home.how.card5.body":
      "Monitor in production, triage what fails, feed lessons back into the product. Software isn't done at deploy.",

    // ── Services Preview (How I Help) ──
    "home.services.heading": "How I Help",
    "home.services.subtitle":
      "Every engagement is designed to produce a practical outcome — a shipped platform feature, a clear modernization roadmap, or a production integration your team can build on.",
    "home.services.audit.title": "Enterprise App Development & Modernization",
    "home.services.audit.teaser":
      "Build new enterprise platforms or modernize existing ones — Laravel, TypeScript, Node.js — with clean architecture, API design, and incremental migration strategies that keep production stable.",
    "home.services.agents.title": "AI Integration & Agent Systems",
    "home.services.agents.teaser":
      "Integrate AI capabilities where they deliver measurable value — code review automation, document processing, workflow intelligence — with guardrails, monitoring, and production reliability.",
    "home.services.legacy.title": "Platform Architecture & System Design",
    "home.services.legacy.teaser":
      "Design scalable architectures for growing platforms — service boundaries, data pipelines, observability infrastructure, and integration patterns that support long-term evolution.",
    "home.services.devex.title": "Developer Productivity & Operations",
    "home.services.devex.teaser":
      "CI/CD optimization, observability setup, documentation automation, and workflow improvements that help your team ship faster with confidence.",
    "home.services.cta": "View all services →",

    // ── Featured Work ──
    "home.featured.heading": "Featured Work",
    "home.featured.subtitle":
      "Case studies from real engineering engagements. Some work is anonymized due to client confidentiality.",
    "home.featured.viewAll": "View all case studies →",
    "home.featured.confidentiality":
      "Some work is anonymized due to client confidentiality.",

    // ── Featured Work ──
    "home.about.heading": "About Mauricio",
    "home.about.teaser":
      "I'm Mauricio Suárez, a software engineer based in Malta. I build and operate production systems — service platforms, property operations tools, AI code review and error triage — with PHP/Laravel, TypeScript and Cloudflare.\n\nMy focus is applied AI: agents and workflows that fit into real business processes, with validation, fallbacks and human review where mistakes matter.",
    "home.about.stacks":
      "Laravel · TypeScript · Node.js · Cloudflare · AWS · CI/CD · Observability",
    "home.about.cta": "More about me →",
    "home.about.portrait.alt":
      "Mauricio Suarez — full-stack software engineer specializing in enterprise platforms",

    // ── Contact CTA ──
    "home.contact.heading": "Hiring an engineer who ships?",
    "home.contact.teaser":
      "I'm open to senior software and applied AI engineering roles, plus selected consulting engagements. The best starting point is the work — then a direct conversation.",
    "home.contact.cta.primary": "Get in touch",
    "home.contact.cta.secondary": "View case studies →",

    // ── Services Page ──
    "services.title": "Services",
    "services.subtitle":
      "Focused engagements for building, modernizing, and scaling enterprise software — with practical AI integration where it counts.",

    "services.audit.title": "Enterprise App Development & Modernization",
    "services.audit.description":
      "Build new enterprise platforms or modernize existing ones with clean architecture, clear service boundaries, and incremental migration strategies. Whether you're scaling a SaaS product, evolving a legacy system, or building a new internal platform — I deliver production-ready systems that your team can maintain and grow.",
    "services.audit.bullet1": "Architecture design and system assessment for your existing stack",
    "services.audit.bullet2": "Incremental modernization roadmaps with clear milestones",
    "services.audit.bullet3": "API design, service boundaries, and integration patterns",
    "services.audit.bullet4": "Feature flag-driven rollouts with zero-downtime deployment",
    "services.audit.bullet5": "Prioritized roadmap with architecture recommendations",
    "services.audit.outcome":
      "Deliverable: Production-ready platform feature or modernization milestone with documentation.",

    "services.agents.title": "AI Integration & Agent Systems",
    "services.agents.description":
      "Integrate AI capabilities into your existing enterprise workflows — code review automation, document processing, ticket grooming, log analysis — with the guardrails, monitoring, and reliability your production environment demands.",
    "services.agents.bullet1": "AI integration architecture designed for your specific workflows",
    "services.agents.bullet2": "Prompt engineering, tool integration, and evaluation pipelines",
    "services.agents.bullet3": "Guardrails, safety checks, and scope boundaries",
    "services.agents.bullet4": "Observability, cost tracking, and performance monitoring",
    "services.agents.bullet5": "CI/CD integration and deployment automation",
    "services.agents.outcome":
      "Deliverable: Production-ready AI integration with monitoring dashboard and documentation.",

    "services.legacy.title": "Platform Architecture & System Design",
    "services.legacy.description":
      "Design scalable architectures for growing enterprise platforms — service boundaries, data pipelines, observability infrastructure, and integration patterns that support long-term evolution without risky rewrites.",
    "services.legacy.bullet1": "Current system assessment and integration mapping",
    "services.legacy.bullet2": "API design for service boundaries in existing architectures",
    "services.legacy.bullet3": "Safe integration patterns with feature flags and gradual rollout",
    "services.legacy.bullet4": "Data pipeline preparation and quality verification",
    "services.legacy.bullet5": "Performance monitoring and rollback procedures",
    "services.legacy.outcome":
      "Deliverable: Scalable architecture design with implementation roadmap.",

    "services.devex.title": "Developer Productivity & Operations",
    "services.devex.description":
      "Improve your team's velocity with CI/CD optimization, observability setup, documentation automation, and engineering workflows that reduce toil and increase output quality.",
    "services.devex.bullet1": "CI/CD pipeline optimization and automation",
    "services.devex.bullet2": "Observability setup: logging, monitoring, alerting",
    "services.devex.bullet3": "Documentation automation and knowledge base tooling",
    "services.devex.bullet4": "AI-assisted development workflow design",
    "services.devex.bullet5": "Team training and knowledge transfer",
    "services.devex.outcome":
      "Deliverable: Documented workflow improvements with measurable productivity metrics.",

    "services.cta.heading": "Not sure where to start?",
    "services.cta.body":
      "Start with a Systems Assessment. It's the fastest way to understand your current state and what to prioritize.",
    "services.cta.button": "Book a Systems Assessment",

    // ── Work / Projects ──
    "work.title": "Work",
    "work.subtitle":
      "Case studies from real engineering engagements — enterprise platforms, system modernization, and AI integration.",
    "work.backToList": "← Back to all work",
    "work.readMore": "View case study →",
    "work.repo": "Repository",
    "work.live": "Live Demo",
    "work.anonymized": "Anonymized Case Study",

    // ── Writing ──
    "writing.title": "Writing",
    "writing.subtitle":
      "Ideas, guides, and lessons from building enterprise software and integrating AI in production.",
    "writing.pillars.ai-eng": "AI Engineering",
    "writing.pillars.devex": "Developer Experience",
    "writing.pillars.arch": "System Architecture",
    "writing.empty": "Articles coming soon. Subscribe to be notified.",
    "writing.subscribe": "Stay updated →",

    // ── About Page ──
    "about.title": "About Me",
    "about.intro":
      "Software engineer based in Malta. I build and operate production systems — service platforms, property operations tools, AI code review and error triage — integrating applied AI where it survives contact with real workflows.",
    "about.description":
      "I specialize in applied AI and product engineering on a senior software base. My experience covers building and operating real production systems: booking and service platforms, property management, payments, third-party integrations, cloud infrastructure and developer tooling. I don't sell buzzwords — I build systems that work and integrate AI where it solves concrete problems, with validation, fallbacks and human review where mistakes matter. Stacks I work with: Laravel, TypeScript, Node.js, Cloudflare, AWS, CI/CD, observability tooling.",
    "about.background.title": "Background",
    "about.background.body":
      "Years of experience building production software across SaaS, property tech, payments, integrations, infrastructure, and developer tooling. Based in Malta, working with teams across time zones.",

    // ── Contact Page ──
    "contact.title": "Contact",
    "contact.description":
      "Get in touch about senior engineering opportunities or selected consulting engagements. Straightforward conversation, no filler.",
    "contact.email": "Email",
    "contact.github": "GitHub",
    "contact.linkedin": "LinkedIn",

    // ── Meta Descriptions ──
    "meta.description.home":
      "Applied AI Engineer and Senior Software Engineer. AI code review, incident triage, property operations and service platforms — built with TypeScript, PHP/Laravel and Cloudflare.",
    "meta.description.services":
      "Enterprise software services: Platform Development, AI Integration, System Architecture, and Developer Productivity. Build, modernize, and scale with confidence.",
    "meta.description.work":
      "Case studies from real engineering engagements — enterprise platforms, system modernization, and AI integration for production environments.",
    "meta.description.writing":
      "Ideas, guides, and lessons from building enterprise software and integrating AI in production. AI Engineering, Developer Experience, and System Architecture.",
    "meta.description.about":
      "Software engineer based in Malta. Building production systems at the intersection of product engineering, applied AI and operations.",
    "meta.description.contact":
      "Get in touch about senior engineering opportunities or selected consulting. Email, GitHub, and LinkedIn.",

    // ── Footer ──
    "footer.rights": "All rights reserved.",
  },
  es: {
    // ── Navegación ──
    "nav.home": "Inicio",
    "nav.services": "Servicios",
    "nav.work": "Proyectos",
    "nav.writing": "Artículos",
    "nav.about": "Sobre mí",
    "nav.contact": "Contacto",

    // ── Hero ──
    "home.hero.eyebrow": "Applied AI Engineer · Ingeniero de Software Senior",
    "home.hero.title": "Construyo agentes de IA y software para flujos de negocio reales.",
    "home.hero.tagline":
      "Mi trabajo abarca revisión de código con IA, triage de incidentes, operaciones inmobiliarias y plataformas de servicios. Combino TypeScript, PHP/Laravel y Cloudflare para conectar capacidades de IA con los sistemas que la gente usa cada día.",
    "home.hero.tone":
      "Abierto a oportunidades senior de ingeniería y a consultoría selectiva.",
    "home.hero.title.lead": "Construyo ",
    "home.hero.title.highlight": "agentes de IA y software",
    "home.hero.title.tail": " para flujos de negocio reales.",
    "home.hero.badge.1": "Revisión de Código con IA",
    "home.hero.badge.2": "Concierge por WhatsApp",
    "home.hero.badge.3": "Plataforma de Operaciones",
    "home.hero.cta.primary": "Ver mi trabajo",
    "home.hero.cta.secondary": "Contáctame",

    // ── Cómo trabajo ──
    "home.how.heading": "Cómo trabajo",
    "home.how.body":
      "De la definición del problema a la operación en producción — con verificación en cada paso.",
    "home.how.card1.title": "Primero el contexto",
    "home.how.card1.body":
      "Entender el proceso de negocio, los usuarios y las restricciones antes de escribir código — qué existe hoy, qué falla y qué necesita realmente la operación.",
    "home.how.card2.title": "Decisiones deliberadas",
    "home.how.card2.body":
      "Elegir soluciones aburridas y reversibles. Documentar los trade-offs de arquitectura, integraciones y límites de IA para que el razonamiento sobreviva al código.",
    "home.how.card3.title": "Entregar en slices",
    "home.how.card3.body":
      "Entregar slices verticales funcionales en el sistema real — flujos de reservas, pipelines de revisión, flujos de mantenimiento — no prototipos aislados.",
    "home.how.card4.title": "Verificar sin descanso",
    "home.how.card4.body":
      "Tests, validación de salida estructurada para IA, reintentos con fallbacks y puertas de aprobación donde los errores importan. Evidencia sobre afirmaciones.",
    "home.how.card5.title": "Operar y aprender",
    "home.how.card5.body":
      "Monitorear en producción, hacer triage de lo que falla y devolver las lecciones al producto. El software no termina en el deploy.",

    // ── Servicios (Preview) ──
    "home.services.heading": "Cómo Ayudo",
    "home.services.subtitle":
      "Cada engagement está diseñado para producir un resultado práctico — una feature de plataforma entregada, un roadmap de modernización claro, o una integración en producción sobre la que tu equipo pueda construir.",
    "home.services.audit.title": "Desarrollo y Modernización de Apps Empresariales",
    "home.services.audit.teaser":
      "Construye nuevas plataformas empresariales o moderniza las existentes — Laravel, TypeScript, Node.js — con arquitectura limpia, diseño de APIs y estrategias de migración incremental que mantienen la producción estable.",
    "home.services.agents.title": "Integración de IA y Sistemas de Agentes",
    "home.services.agents.teaser":
      "Integra capacidades de IA donde generan valor medible — automatización de revisión de código, procesamiento de documentos, inteligencia de flujos — con guardrails, monitoreo y confiabilidad de producción.",
    "home.services.legacy.title": "Arquitectura de Plataformas y Diseño de Sistemas",
    "home.services.legacy.teaser":
      "Diseña arquitecturas escalables para plataformas empresariales en crecimiento — límites de servicios, pipelines de datos, infraestructura de observabilidad y patrones de integración que soporten evolución a largo plazo.",
    "home.services.devex.title": "Productividad de Desarrollo y Operaciones",
    "home.services.devex.teaser":
      "Optimización de CI/CD, setup de observabilidad, automatización de documentación y mejoras de flujos que ayudan a tu equipo a entregar más rápido con confianza.",
    "home.services.cta": "Ver todos los servicios →",

    // ── Trabajo Destacado ──
    "home.featured.heading": "Trabajo Destacado",
    "home.featured.subtitle":
      "Casos de estudio de engagements de ingeniería reales. Algunos trabajos están anonimizados por confidencialidad del cliente.",
    "home.featured.viewAll": "Ver todos los casos de estudio →",
    "home.featured.confidentiality":
      "Algunos trabajos están anonimizados por confidencialidad del cliente.",

    // ── Sobre Mí (Teaser) ──
    "home.about.heading": "Sobre Mauricio",
    "home.about.teaser":
      "Soy Mauricio Suárez, ingeniero de software radicado en Malta. Construyo y opero sistemas en producción — plataformas de servicios, herramientas de operaciones inmobiliarias, revisión de código con IA y triage de errores — con PHP/Laravel, TypeScript y Cloudflare.\n\nMi foco es la IA aplicada: agentes y flujos que encajan en procesos de negocio reales, con validación, fallbacks y revisión humana donde los errores importan.",
    "home.about.stacks":
      "Laravel · TypeScript · Node.js · Cloudflare · AWS · CI/CD · Observabilidad",
    "home.about.cta": "Más sobre mí →",
    "home.about.portrait.alt":
      "Mauricio Suarez — ingeniero de software full-stack especializado en plataformas empresariales",

    // ── Contacto CTA ──
    "home.contact.heading": "¿Buscas un ingeniero que entrega?",
    "home.contact.teaser":
      "Estoy abierto a posiciones senior de software e IA aplicada, además de consultoría selectiva. El mejor punto de partida es el trabajo — y luego una conversación directa.",
    "home.contact.cta.primary": "Contáctame",
    "home.contact.cta.secondary": "Ver casos de estudio →",

    // ── Página de Servicios ──
    "services.title": "Servicios",
    "services.subtitle":
      "Engagements enfocados en construir, modernizar y escalar software empresarial — con integración práctica de IA donde cuenta.",

    "services.audit.title": "Desarrollo y Modernización de Apps Empresariales",
    "services.audit.description":
      "Construye nuevas plataformas empresariales o moderniza las existentes con arquitectura limpia, límites de servicios claros y estrategias de migración incremental. Ya sea escalando un producto SaaS, evolucionando un sistema legacy o construyendo una nueva plataforma interna — entrego sistemas listos para producción que tu equipo puede mantener y hacer crecer.",
    "services.audit.bullet1": "Diseño de arquitectura y evaluación de sistemas para tu stack existente",
    "services.audit.bullet2": "Roadmaps de modernización incremental con hitos claros",
    "services.audit.bullet3": "Diseño de APIs, límites de servicios y patrones de integración",
    "services.audit.bullet4": "Rollouts con feature flags y despliegue sin downtime",
    "services.audit.bullet5": "Roadmap priorizado con recomendaciones de arquitectura",
    "services.audit.outcome":
      "Entregable: Feature de plataforma en producción o hito de modernización con documentación.",

    "services.agents.title": "Integración de IA y Sistemas de Agentes",
    "services.agents.description":
      "Integra capacidades de IA en tus flujos empresariales existentes — automatización de revisión de código, procesamiento de documentos, grooming de tickets, análisis de logs — con los guardrails, monitoreo y confiabilidad que tu entorno de producción demanda.",
    "services.agents.bullet1": "Arquitectura de integración de IA diseñada para tus flujos específicos",
    "services.agents.bullet2": "Ingeniería de prompts, integración de herramientas y pipelines de evaluación",
    "services.agents.bullet3": "Guardrails, verificaciones de seguridad y límites de alcance",
    "services.agents.bullet4": "Observabilidad, seguimiento de costos y monitoreo de rendimiento",
    "services.agents.bullet5": "Integración CI/CD y automatización de despliegue",
    "services.agents.outcome":
      "Entregable: Integración de IA en producción con dashboard de monitoreo y documentación.",

    "services.legacy.title": "Arquitectura de Plataformas y Diseño de Sistemas",
    "services.legacy.description":
      "Diseña arquitecturas escalables para plataformas empresariales en crecimiento — límites de servicios, pipelines de datos, infraestructura de observabilidad y patrones de integración que soporten evolución a largo plazo sin reescrituras riesgosas.",
    "services.legacy.bullet1": "Evaluación del sistema actual y mapeo de integración",
    "services.legacy.bullet2": "Diseño de APIs para límites de servicios en arquitecturas existentes",
    "services.legacy.bullet3": "Patrones de integración segura con feature flags y rollout gradual",
    "services.legacy.bullet4": "Preparación de pipelines de datos y verificación de calidad",
    "services.legacy.bullet5": "Monitoreo de rendimiento y procedimientos de rollback",
    "services.legacy.outcome":
      "Entregable: Diseño de arquitectura escalable con roadmap de implementación.",

    "services.devex.title": "Productividad de Desarrollo y Operaciones",
    "services.devex.description":
      "Mejora la velocidad de tu equipo con optimización de CI/CD, setup de observabilidad, automatización de documentación y flujos de ingeniería que reducen trabajo manual y aumentan la calidad de lo que entregan.",
    "services.devex.bullet1": "Optimización y automatización de pipelines CI/CD",
    "services.devex.bullet2": "Setup de observabilidad: logging, monitoreo, alertas",
    "services.devex.bullet3": "Automatización de documentación y tooling para base de conocimiento",
    "services.devex.bullet4": "Diseño de flujos de desarrollo asistidos por IA",
    "services.devex.bullet5": "Entrenamiento del equipo y transferencia de conocimiento",
    "services.devex.outcome":
      "Entregable: Mejoras de flujos documentadas con métricas de productividad medibles.",

    "services.cta.heading": "¿No sabes por dónde empezar?",
    "services.cta.body":
      "Empieza con una Evaluación de Sistemas. Es la forma más rápida de entender tu estado actual y qué priorizar.",
    "services.cta.button": "Agendar una Evaluación de Sistemas",

    // ── Trabajo / Proyectos ──
    "work.title": "Proyectos",
    "work.subtitle":
      "Casos de estudio de engagements de ingeniería reales — plataformas empresariales, modernización de sistemas e integración de IA.",
    "work.backToList": "← Volver a todos los proyectos",
    "work.readMore": "Ver caso de estudio →",
    "work.repo": "Repositorio",
    "work.live": "Demo en vivo",
    "work.anonymized": "Caso de Estudio Anonimizado",

    // ── Artículos ──
    "writing.title": "Artículos",
    "writing.subtitle":
      "Ideas, guías y lecciones de construir software empresarial e integrar IA en producción.",
    "writing.pillars.ai-eng": "Ingeniería de IA",
    "writing.pillars.devex": "Experiencia del Desarrollador",
    "writing.pillars.arch": "Arquitectura de Sistemas",
    "writing.empty": "Artículos próximamente. Suscríbete para ser notificado.",
    "writing.subscribe": "Mantente informado →",

    // ── Página Sobre Mí ──
    "about.title": "Sobre mí",
    "about.intro":
      "Ingeniero de software radicado en Malta. Construyo y opero sistemas en producción — plataformas de servicios, herramientas de operaciones inmobiliarias, revisión de código con IA y triage de errores — integrando IA aplicada donde sobrevive el contacto con flujos reales.",
    "about.description":
      "Me especializo en IA aplicada e ingeniería de producto sobre una base senior de software. Mi experiencia cubre construcción y operación de sistemas reales en producción: plataformas de reservas y servicios, gestión de propiedades, pagos, integraciones con terceros, infraestructura cloud y developer tooling. No vendo buzzwords — construyo sistemas que funcionan e integro IA donde resuelve problemas concretos, con validación, fallbacks y revisión humana donde los errores importan. Stacks: Laravel, TypeScript, Node.js, Cloudflare, AWS, CI/CD, herramientas de observabilidad.",
    "about.background.title": "Trayectoria",
    "about.background.body":
      "Años de experiencia construyendo software en producción en SaaS, property tech, pagos, integraciones, infraestructura y developer tooling. Radicado en Malta, trabajando con equipos en diferentes zonas horarias.",

    // ── Página de Contacto ──
    "contact.title": "Contacto",
    "contact.description":
      "Escríbeme sobre oportunidades senior de ingeniería o consultoría selectiva. Conversación directa, sin relleno.",
    "contact.email": "Correo",
    "contact.github": "GitHub",
    "contact.linkedin": "LinkedIn",

    // ── Meta Descripciones ──
    "meta.description.home":
      "Applied AI Engineer e Ingeniero de Software Senior. Revisión de código con IA, triage de incidentes, operaciones inmobiliarias y plataformas de servicios — con TypeScript, PHP/Laravel y Cloudflare.",
    "meta.description.services":
      "Servicios de software empresarial: Desarrollo de Plataformas, Integración de IA, Arquitectura de Sistemas y Productividad de Desarrollo. Construye, moderniza y escala con confianza.",
    "meta.description.work":
      "Casos de estudio de engagements de ingeniería reales — plataformas empresariales, modernización de sistemas e integración de IA para entornos de producción.",
    "meta.description.writing":
      "Ideas, guías y lecciones de construir software empresarial e integrar IA en producción. Ingeniería de IA, Experiencia del Desarrollador y Arquitectura de Sistemas.",
    "meta.description.about":
      "Ingeniero de software radicado en Malta. Construyendo sistemas en producción en la intersección de ingeniería de producto, IA aplicada y operaciones.",
    "meta.description.contact":
      "Escríbeme sobre oportunidades senior de ingeniería o consultoría selectiva. Correo, GitHub y LinkedIn.",

    // ── Footer ──
    "footer.rights": "Todos los derechos reservados.",
  },
} as const;

export type UIKey = keyof (typeof ui)["en"];
