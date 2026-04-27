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
    "home.hero.eyebrow": "AI Engineering for Software Teams",
    "home.hero.title": "Turn AI experiments into production-ready engineering workflows.",
    "home.hero.tagline":
      "I help SaaS and software teams modernize existing systems and integrate AI agents into real engineering workflows — code review, ticket grooming, documentation, CI/CD, legacy system analysis, and more.",
    "home.hero.tone":
      "No hype. No random AI experiments. Just production-ready systems that fit how your team already works.",
    "home.hero.cta.audit": "Book an AI Systems Audit",
    "home.hero.cta.work": "View Case Studies",

    // ── Problem / Where Teams Get Stuck ──
    "home.problem.heading": "Where Teams Get Stuck with AI",
    "home.problem.body":
      "Most engineering teams don't need another AI demo. They need AI that fits into how they already build, ship, and maintain software. Here's where the friction shows up:",
    "home.problem.card1.title": "Prototypes Not Connected to Workflows",
    "home.problem.card1.body":
      "Your team has built AI demos or proof-of-concepts, but they're not integrated into your actual engineering tools and processes.",
    "home.problem.card2.title": "Unsafe Tool & Data Access for Agents",
    "home.problem.card2.body":
      "You want AI agents to take real actions — but you can't risk giving them unchecked access to production systems, customer data, or CI/CD pipelines.",
    "home.problem.card3.title": "Legacy Systems Hard to Understand",
    "home.problem.card3.body":
      "Older codebases, undocumented APIs, and tribal knowledge make it difficult to know where AI can help and where it's risky.",
    "home.problem.card4.title": "Individual AI Usage, No Team Process",
    "home.problem.card4.body":
      "Engineers are using AI tools individually, but there's no shared practice, no quality standards, and no way to scale what works.",
    "home.problem.card5.title": "Unclear Production Risks",
    "home.problem.card5.body":
      "Security, cost, quality, and ownership questions are unresolved. You're not sure what responsible AI deployment looks like for your stack.",

    // ── Who This Is For ──
    "home.whofor.heading": "Who This Is For",
    "home.whofor.body":
      "I work with teams that build and maintain real software — SaaS platforms, internal tools, production systems that need to work reliably.",
    "home.whofor.card1.title": "SaaS Engineering Teams",
    "home.whofor.card1.body":
      "You ship features, fix bugs, manage technical debt, and need AI to accelerate — not complicate — your day-to-day.",
    "home.whofor.card2.title": "Software Team Leads & CTOs",
    "home.whofor.card2.body":
      "You're evaluating where AI fits in your engineering org, but need a practical partner — not another framework or buzzword presentation.",
    "home.whofor.card3.title": "Teams with Existing Systems",
    "home.whofor.card3.body":
      "You're not starting from zero. You have Laravel apps, TypeScript services, internal tools, CI/CD pipelines — and you want AI layered in safely.",

    // ── Services Preview (How I Help) ──
    "home.services.heading": "How I Help",
    "home.services.subtitle":
      "Every engagement is designed to produce a practical outcome — a working agent, a clear roadmap, or a shipped integration your team can build on.",
    "home.services.audit.title": "AI Systems Audit",
    "home.services.audit.teaser":
      "A practical assessment of your current stack, AI opportunities, technical risks, and a roadmap with clear architecture priorities for the next 90 days.",
    "home.services.agents.title": "AI Agent Implementation",
    "home.services.agents.teaser":
      "Production-ready agents for PR review, ticket grooming, documentation generation, QA and log analysis, and developer productivity — built for your domain.",
    "home.services.legacy.title": "Legacy Modernization",
    "home.services.legacy.teaser":
      "Improve existing systems without risky rewrites. Bring AI into your Laravel, TypeScript, SaaS, or internal tools stack incrementally and safely.",
    "home.services.devex.title": "Developer Productivity",
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

    // ── Engagements (Ways to Work Together) ──
    "home.engagements.heading": "Ways to Work Together",
    "home.engagements.subtitle":
      "Three engagement models depending on where you are — from initial assessment to full production deployment.",
    "home.engagements.audit.title": "AI Systems Audit",
    "home.engagements.audit.duration": "1–2 weeks",
    "home.engagements.audit.body":
      "Assessment of your current AI readiness, technical risks, workflow opportunities, and a prioritized architecture roadmap. You'll know where to start, what to avoid, and what to build first.",
    "home.engagements.prototype.title": "Agent Prototype",
    "home.engagements.prototype.duration": "2–4 weeks",
    "home.engagements.prototype.body":
      "A working prototype of an AI agent integrated into your actual engineering workflow. Not a demo — something your team can test with real tools, real code, and real workflow constraints.",
    "home.engagements.production.title": "Production Implementation",
    "home.engagements.production.duration": "4–8+ weeks",
    "home.engagements.production.body":
      "Full design, build, and deployment of production-ready AI systems. Includes guardrails, monitoring, documentation, and team training for long-term success.",

    // ── About Teaser ──
    "home.about.heading": "About Mauricio",
    "home.about.teaser":
      "I'm Mauricio Suárez, a full-stack software engineer based in Malta with years of experience building and maintaining production systems — SaaS platforms, payment integrations, infrastructure, internal tools, and developer workflows.\n\nI work at the intersection of software architecture, AI agents, and developer productivity, helping teams introduce AI in ways that are safe, useful, and maintainable.",
    "home.about.stacks":
      "Laravel · TypeScript · Node.js · Cloudflare · AWS · CI/CD · Observability",
    "home.about.cta": "More about me →",
    "home.about.portrait.alt":
      "Mauricio Suarez — full-stack software engineer and AI consultant",

    // ── Engagements CTA ──
    "home.engagements.cta": "Get started →",

    // ── Contact CTA ──
    "home.contact.heading": "Ready to turn AI into a real engineering advantage?",
    "home.contact.teaser":
      "Start with a focused conversation about your stack, your goals, and where AI can deliver real value. No generic pitch deck — just a practical conversation about your systems, workflows, and opportunities.",
    "home.contact.cta.primary": "Book an AI Systems Audit",
    "home.contact.cta.secondary": "Or just say hello →",

    // ── Services Page ──
    "services.title": "Services",
    "services.subtitle":
      "Focused engagements that move AI from experiment to production — practical implementation and consulting.",

    "services.audit.title": "AI Systems Audit",
    "services.audit.description":
      "A practical assessment of your current engineering stack and AI readiness. You'll get quick wins you can ship this sprint, a clear architecture review, and a prioritized roadmap for the next 90 days.",
    "services.audit.bullet1": "Architecture review and gap analysis for your existing stack",
    "services.audit.bullet2": "Quick wins identified and documented for immediate implementation",
    "services.audit.bullet3": "AI readiness assessment: data access, security, tooling",
    "services.audit.bullet4": "Cost and latency profiling for proposed AI integrations",
    "services.audit.bullet5": "Prioritized roadmap with architecture recommendations",
    "services.audit.outcome":
      "Deliverable: Practical assessment + quick wins + prioritized 90-day architecture roadmap.",

    "services.agents.title": "AI Agent Implementation",
    "services.agents.description":
      "End-to-end design, implementation, and consulting for production-ready AI agents tailored to your engineering workflows. Built for real tasks — PR review, ticket grooming, documentation, QA and log analysis — with guardrails and monitoring your system needs to run reliably.",
    "services.agents.bullet1": "Agent architecture designed for your specific engineering workflows",
    "services.agents.bullet2": "Prompt engineering, tool integration, and evaluation pipelines",
    "services.agents.bullet3": "Guardrails, safety checks, and scope boundaries",
    "services.agents.bullet4": "Observability, cost tracking, and performance monitoring",
    "services.agents.bullet5": "CI/CD integration and deployment automation",
    "services.agents.outcome":
      "Deliverable: Production-ready agent system with monitoring dashboard and documentation.",

    "services.legacy.title": "Legacy Modernization",
    "services.legacy.description":
      "Bring AI capabilities into your existing systems — Laravel apps, TypeScript services, SaaS platforms, internal tools — without risky rewrites. Incremental integration that preserves what works while adding intelligence where it counts.",
    "services.legacy.bullet1": "Current system assessment and integration mapping",
    "services.legacy.bullet2": "API design for AI service boundaries in existing architectures",
    "services.legacy.bullet3": "Safe integration patterns with feature flags and gradual rollout",
    "services.legacy.bullet4": "Data pipeline preparation and quality verification",
    "services.legacy.bullet5": "Performance monitoring and rollback procedures",
    "services.legacy.outcome":
      "Deliverable: Integrated AI capability in your existing stack, deployed with zero downtime.",

    "services.devex.title": "Developer Productivity",
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
      "Start with an AI Systems Audit. It's the fastest way to understand where you stand and what to prioritize.",
    "services.cta.button": "Book an AI Systems Audit",

    // ── Work / Projects ──
    "work.title": "Work",
    "work.subtitle":
      "Case studies from real engineering engagements with AI and software systems.",
    "work.backToList": "← Back to all work",
    "work.readMore": "View case study →",
    "work.repo": "Repository",
    "work.live": "Live Demo",
    "work.anonymized": "Anonymized Case Study",

    // ── Writing ──
    "writing.title": "Writing",
    "writing.subtitle":
      "Ideas, guides, and lessons from building AI systems in production.",
    "writing.pillars.ai-eng": "AI Engineering",
    "writing.pillars.devex": "Developer Experience",
    "writing.pillars.arch": "System Architecture",
    "writing.empty": "Articles coming soon. Subscribe to be notified.",
    "writing.subscribe": "Stay updated →",

    // ── About Page ──
    "about.title": "About Me",
    "about.intro":
      "Full-stack software engineer based in Malta. I build production systems for a living — SaaS platforms, payment integrations, infrastructure, and developer tooling — and now focus on practical implementation and consulting to help engineering teams integrate AI where it actually works.",
    "about.description":
      "I work at the intersection of software architecture, AI agents, and developer productivity — through practical implementation and consulting. My experience spans building and maintaining real production systems: SaaS products, payment processing, third-party integrations, cloud infrastructure, and developer tooling. I don't sell AI hype — I help teams use AI to solve concrete engineering problems. Stacks I work with: Laravel, TypeScript, Node.js, Cloudflare, AWS, CI/CD, observability tooling.",
    "about.background.title": "Background",
    "about.background.body":
      "Years of experience building production software across SaaS, payments, integrations, infrastructure, and developer tooling. Based in Malta, working with teams across time zones.",

    // ── Contact Page ──
    "contact.title": "Contact",
    "contact.description":
      "Want to discuss a project or explore how AI can help your engineering team? Reach out — straightforward conversation, no filler.",
    "contact.email": "Email",
    "contact.github": "GitHub",
    "contact.linkedin": "LinkedIn",

    // ── Meta Descriptions ──
    "meta.description.home":
      "Practical AI engineering for software teams — implementation and consulting. I help SaaS teams modernize existing systems and integrate AI agents into real engineering workflows.",
    "meta.description.services":
      "Focused AI engineering services: AI Systems Audit, Agent Implementation, Legacy Modernization, and Developer Productivity. Move from experiment to production.",
    "meta.description.work":
      "Case studies from real AI engineering engagements. See how production-ready AI systems are built for software teams.",
    "meta.description.writing":
      "Ideas, guides, and lessons from building AI systems in production. AI Engineering, Developer Experience, and System Architecture.",
    "meta.description.about":
      "Full-stack software engineer based in Malta. Building production systems at the intersection of software architecture, AI agents, and developer productivity.",
    "meta.description.contact":
      "Get in touch to discuss a project or explore how AI can help your engineering team. Email, GitHub, and LinkedIn.",

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
    "home.hero.eyebrow": "Ingeniería de IA para Equipos de Software",
    "home.hero.title": "Convierte experimentos de IA en flujos de ingeniería listos para producción.",
    "home.hero.tagline":
      "Ayudo a equipos SaaS y de software a modernizar sistemas existentes e integrar agentes de IA en flujos de ingeniería reales — revisión de código, grooming de tickets, documentación, CI/CD, análisis de sistemas legacy, y más.",
    "home.hero.tone":
      "Sin exageraciones. Sin experimentos aleatorios de IA. Sistemas listos para producción que se adaptan a la forma en que tu equipo ya trabaja.",
    "home.hero.cta.audit": "Agendar una Auditoría de Sistemas de IA",
    "home.hero.cta.work": "Ver Casos de Estudio",

    // ── Problema / Dónde los equipos se estancan ──
    "home.problem.heading": "Dónde los Equipos se Estancan con IA",
    "home.problem.body":
      "La mayoría de equipos de ingeniería no necesitan otro demo de IA. Necesitan IA que se integre en cómo ya construyen, entregan y mantienen software. Aquí es donde aparece la fricción:",
    "home.problem.card1.title": "Prototipos No Conectados a los Flujos de Trabajo",
    "home.problem.card1.body":
      "Tu equipo ha construido demos o pruebas de concepto con IA, pero no están integrados en tus herramientas y procesos de ingeniería reales.",
    "home.problem.card2.title": "Acceso Inseguro a Herramientas y Datos para Agentes",
    "home.problem.card2.body":
      "Quieres que los agentes de IA ejecuten acciones reales — pero no puedes arriesgarte a darles acceso sin control a sistemas en producción, datos de clientes, o pipelines de CI/CD.",
    "home.problem.card3.title": "Sistemas Legacy Difíciles de Entender",
    "home.problem.card3.body":
      "Codebases antiguos, APIs sin documentar y conocimiento tribal hacen difícil saber dónde la IA puede ayudar y dónde es riesgosa.",
    "home.problem.card4.title": "Uso Individual de IA, Sin Proceso de Equipo",
    "home.problem.card4.body":
      "Los ingenieros usan herramientas de IA individualmente, pero no hay prácticas compartidas, estándares de calidad, ni forma de escalar lo que funciona.",
    "home.problem.card5.title": "Riesgos de Producción Poco Claros",
    "home.problem.card5.body":
      "Las preguntas sobre seguridad, costos, calidad y responsabilidad están sin resolver. No tienes claro cómo se ve un despliegue responsable de IA para tu stack.",

    // ── Para Quién Es ──
    "home.whofor.heading": "Para Quién Es",
    "home.whofor.body":
      "Trabajo con equipos que construyen y mantienen software real — plataformas SaaS, herramientas internas, sistemas en producción que necesitan funcionar.",
    "home.whofor.card1.title": "Equipos de Ingeniería SaaS",
    "home.whofor.card1.body":
      "Entregan features, corrigen bugs, gestionan deuda técnica y necesitan que la IA acelere — no complique — su día a día.",
    "home.whofor.card2.title": "Líderes Técnicos y CTOs",
    "home.whofor.card2.body":
      "Están evaluando dónde encaja la IA en su organización de ingeniería, pero necesitan un socio práctico — no otro framework o presentación de buzzwords.",
    "home.whofor.card3.title": "Equipos con Sistemas Existentes",
    "home.whofor.card3.body":
      "No están empezando de cero. Tienen apps Laravel, servicios TypeScript, herramientas internas, pipelines CI/CD — y quieren integrar IA de forma segura.",

    // ── Servicios (Preview) ──
    "home.services.heading": "Cómo Ayudo",
    "home.services.subtitle":
      "Cada engagement está diseñado para producir un resultado práctico — un agente funcional, un roadmap claro, o una integración que tu equipo pueda construir sobre ella.",
    "home.services.audit.title": "Auditoría de Sistemas de IA",
    "home.services.audit.teaser":
      "Una evaluación práctica de tu stack actual, oportunidades de IA, riesgos técnicos, y un roadmap con prioridades de arquitectura claras para los próximos 90 días.",
    "home.services.agents.title": "Implementación de Agentes de IA",
    "home.services.agents.teaser":
      "Agentes listos para producción para revisión de PRs, grooming de tickets, generación de documentación, análisis de QA y logs, y productividad de desarrollo — construidos para tu dominio.",
    "home.services.legacy.title": "Modernización de Sistemas Legacy",
    "home.services.legacy.teaser":
      "Mejora sistemas existentes sin reescrituras riesgosas. Integra IA en tu stack de Laravel, TypeScript, SaaS o herramientas internas de forma incremental y segura.",
    "home.services.devex.title": "Productividad de Desarrollo",
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

    // ── Modalidades de Trabajo ──
    "home.engagements.heading": "Modalidades de Trabajo",
    "home.engagements.subtitle":
      "Tres modelos de engagement según dónde estás — desde evaluación inicial hasta despliegue completo en producción.",
    "home.engagements.audit.title": "Auditoría de Sistemas de IA",
    "home.engagements.audit.duration": "1–2 semanas",
    "home.engagements.audit.body":
      "Evaluación de tu preparación actual para IA, riesgos técnicos, oportunidades de flujo de trabajo, y un roadmap de arquitectura priorizado. Sabrás por dónde empezar, qué evitar, y qué construir primero.",
    "home.engagements.prototype.title": "Prototipo de Agente",
    "home.engagements.prototype.duration": "2–4 semanas",
    "home.engagements.prototype.body":
      "Un prototipo funcional de un agente de IA integrado en tu flujo de ingeniería real. No un demo — algo que tu equipo puede probar con herramientas reales, código real, y restricciones de flujo de trabajo reales.",
    "home.engagements.production.title": "Implementación en Producción",
    "home.engagements.production.duration": "4–8+ semanas",
    "home.engagements.production.body":
      "Diseño, construcción y despliegue completo de sistemas de IA listos para producción. Incluye guardrails, monitoreo, documentación y entrenamiento del equipo para éxito a largo plazo.",

    // ── Sobre Mí (Teaser) ──
    "home.about.heading": "Sobre Mauricio",
    "home.about.teaser":
      "Soy Mauricio Suárez, ingeniero de software full-stack radicado en Malta con años de experiencia construyendo y manteniendo sistemas en producción — plataformas SaaS, integraciones de pagos, infraestructura, herramientas internas y flujos de trabajo para desarrolladores.\n\nTrabajo en la intersección de arquitectura de software, agentes de IA y productividad de desarrollo, ayudando a equipos a introducir IA de formas que sean seguras, útiles y sostenibles.",
    "home.about.stacks":
      "Laravel · TypeScript · Node.js · Cloudflare · AWS · CI/CD · Observabilidad",
    "home.about.cta": "Más sobre mí →",
    "home.about.portrait.alt":
      "Mauricio Suarez — ingeniero de software full-stack y consultor de IA",

    // ── CTA Modalidades ──
    "home.engagements.cta": "Comenzar →",

    // ── Contacto CTA ──
    "home.contact.heading": "¿Listo para convertir la IA en una verdadera ventaja de ingeniería?",
    "home.contact.teaser":
      "Empieza con una conversación enfocada sobre tu stack, tus objetivos y dónde la IA puede generar valor real. Sin presentación genérica — solo una conversación práctica sobre tus sistemas, flujos de trabajo y oportunidades.",
    "home.contact.cta.primary": "Agendar una Auditoría de Sistemas de IA",
    "home.contact.cta.secondary": "O simplemente saluda →",

    // ── Página de Servicios ──
    "services.title": "Servicios",
    "services.subtitle":
      "Engagements enfocados que mueven la IA de experimento a producción — implementación práctica y consultoría.",

    "services.audit.title": "Auditoría de Sistemas de IA",
    "services.audit.description":
      "Una evaluación práctica de tu stack de ingeniería actual y preparación para IA. Recibirás quick wins que puedes entregar este sprint, una revisión de arquitectura clara, y un roadmap priorizado para los próximos 90 días.",
    "services.audit.bullet1": "Revisión de arquitectura y análisis de brechas para tu stack existente",
    "services.audit.bullet2": "Quick wins identificados y documentados para implementación inmediata",
    "services.audit.bullet3": "Evaluación de preparación para IA: acceso a datos, seguridad, herramientas",
    "services.audit.bullet4": "Perfilado de costos y latencia para integraciones de IA propuestas",
    "services.audit.bullet5": "Roadmap priorizado con recomendaciones de arquitectura",
    "services.audit.outcome":
      "Entregable: Evaluación práctica + quick wins + roadmap de arquitectura priorizado a 90 días.",

    "services.agents.title": "Implementación de Agentes de IA",
    "services.agents.description":
      "Diseño, implementación y consultoría completa de agentes de IA listos para producción, adaptados a tus flujos de ingeniería. Construidos para tareas reales — revisión de PRs, grooming de tickets, documentación, análisis de QA y logs — con los guardrails y monitoreo que tu sistema necesita.",
    "services.agents.bullet1": "Arquitectura de agente diseñada para tus flujos de ingeniería específicos",
    "services.agents.bullet2": "Ingeniería de prompts, integración de herramientas y pipelines de evaluación",
    "services.agents.bullet3": "Guardrails, verificaciones de seguridad y límites de alcance",
    "services.agents.bullet4": "Observabilidad, seguimiento de costos y monitoreo de rendimiento",
    "services.agents.bullet5": "Integración CI/CD y automatización de despliegue",
    "services.agents.outcome":
      "Entregable: Sistema de agente en producción con dashboard de monitoreo y documentación.",

    "services.legacy.title": "Modernización de Sistemas Legacy",
    "services.legacy.description":
      "Incorpora capacidades de IA en tus sistemas existentes — apps Laravel, servicios TypeScript, plataformas SaaS, herramientas internas — sin reescrituras riesgosas. Integración incremental que preserva lo que funciona mientras añade inteligencia donde cuenta.",
    "services.legacy.bullet1": "Evaluación del sistema actual y mapeo de integración",
    "services.legacy.bullet2": "Diseño de APIs para límites de servicios de IA en arquitecturas existentes",
    "services.legacy.bullet3": "Patrones de integración segura con feature flags y rollout gradual",
    "services.legacy.bullet4": "Preparación de pipelines de datos y verificación de calidad",
    "services.legacy.bullet5": "Monitoreo de rendimiento y procedimientos de rollback",
    "services.legacy.outcome":
      "Entregable: Capacidad de IA integrada en tu stack existente, desplegada sin downtime.",

    "services.devex.title": "Productividad de Desarrollo",
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
      "Empieza con una Auditoría de Sistemas de IA. Es la forma más rápida de entender dónde estás y qué priorizar.",
    "services.cta.button": "Agendar una Auditoría de Sistemas de IA",

    // ── Trabajo / Proyectos ──
    "work.title": "Proyectos",
    "work.subtitle":
      "Casos de estudio de engagements de ingeniería reales con sistemas de IA y software.",
    "work.backToList": "← Volver a todos los proyectos",
    "work.readMore": "Ver caso de estudio →",
    "work.repo": "Repositorio",
    "work.live": "Demo en vivo",
    "work.anonymized": "Caso de Estudio Anonimizado",

    // ── Artículos ──
    "writing.title": "Artículos",
    "writing.subtitle":
      "Ideas, guías y lecciones de construir sistemas de IA en producción.",
    "writing.pillars.ai-eng": "Ingeniería de IA",
    "writing.pillars.devex": "Experiencia del Desarrollador",
    "writing.pillars.arch": "Arquitectura de Sistemas",
    "writing.empty": "Artículos próximamente. Suscríbete para ser notificado.",
    "writing.subscribe": "Mantente informado →",

    // ── Página Sobre Mí ──
    "about.title": "Sobre mí",
    "about.intro":
      "Ingeniero de software full-stack radicado en Malta. Construyo sistemas en producción — plataformas SaaS, integraciones de pagos, infraestructura y developer tooling — y ahora me enfoco en implementación práctica y consultoría para ayudar a equipos de ingeniería a integrar IA donde realmente funciona.",
    "about.description":
      "Trabajo en la intersección de arquitectura de software, agentes de IA y productividad de desarrollo — a través de implementación práctica y consultoría. Mi experiencia abarca construcción y mantenimiento de sistemas reales en producción: productos SaaS, procesamiento de pagos, integraciones con terceros, infraestructura cloud y developer tooling. No vendo hype de IA — ayudo a equipos a usar IA para resolver problemas concretos de ingeniería. Stacks con los que trabajo: Laravel, TypeScript, Node.js, Cloudflare, AWS, CI/CD, herramientas de observabilidad.",
    "about.background.title": "Trayectoria",
    "about.background.body":
      "Años de experiencia construyendo software en producción en SaaS, pagos, integraciones, infraestructura y developer tooling. Radicado en Malta, trabajando con equipos en diferentes zonas horarias.",

    // ── Página de Contacto ──
    "contact.title": "Contacto",
    "contact.description":
      "¿Quieres discutir un proyecto o explorar cómo la IA puede ayudar a tu equipo de ingeniería? Escríbeme — conversación directa, sin relleno.",
    "contact.email": "Correo",
    "contact.github": "GitHub",
    "contact.linkedin": "LinkedIn",

    // ── Meta Descripciones ──
    "meta.description.home":
      "Ingeniería de IA práctica para equipos de software — implementación y consultoría. Ayudo a equipos SaaS a modernizar sistemas existentes e integrar agentes de IA en flujos de ingeniería reales.",
    "meta.description.services":
      "Servicios de ingeniería de IA enfocados: Auditoría de Sistemas de IA, Implementación de Agentes, Modernización Legacy y Productividad de Desarrollo.",
    "meta.description.work":
      "Casos de estudio de engagements reales de ingeniería de IA. Mira cómo se construyen sistemas de IA listos para producción para equipos de software.",
    "meta.description.writing":
      "Ideas, guías y lecciones de construir sistemas de IA en producción. Ingeniería de IA, Experiencia del Desarrollador y Arquitectura de Sistemas.",
    "meta.description.about":
      "Ingeniero de software full-stack radicado en Malta. Construyendo sistemas en producción en la intersección de arquitectura de software, agentes de IA y productividad de desarrollo.",
    "meta.description.contact":
      "Contáctame para discutir un proyecto o explorar cómo la IA puede ayudar a tu equipo de ingeniería. Correo, GitHub y LinkedIn.",

    // ── Footer ──
    "footer.rights": "Todos los derechos reservados.",
  },
} as const;

export type UIKey = keyof (typeof ui)["en"];
