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
    "home.hero.eyebrow": "Enterprise Software Engineering",
    "home.hero.title": "Build, modernize, and scale enterprise software — with AI where it counts.",
    "home.hero.tagline":
      "I help engineering teams build robust enterprise platforms, modernize legacy systems, and integrate AI capabilities where they deliver real value — without disrupting what already works.",
    "home.hero.tone":
      "Production-grade systems. Clean architecture. Practical AI integration that fits how your team already works.",
    "home.hero.title.lead": "Build, modernize, and scale ",
    "home.hero.title.highlight": "enterprise software",
    "home.hero.title.tail": " — with AI where it counts.",
    "home.hero.badge.1": "Platform Live",
    "home.hero.badge.2": "API Integrated",
    "home.hero.badge.3": "99.9% Uptime",
    "home.hero.cta.audit": "Book a Systems Assessment",
    "home.hero.cta.work": "View Case Studies",

    // ── Problem / Where Teams Get Stuck ──
    "home.problem.heading": "Where Engineering Teams Hit Walls",
    "home.problem.body":
      "Growing teams face operational friction that slows delivery and compounds technical debt. Here's where the pain shows up:",
    "home.problem.card1.title": "Legacy Systems Stalling Growth",
    "home.problem.card1.body":
      "Your platform was built for a smaller scale. Now the architecture can't keep up — undocumented code, fragile integrations, and features that take longer to ship than to spec.",
    "home.problem.card2.title": "AI Experiments Not Reaching Production",
    "home.problem.card2.body":
      "Your team has explored AI tools and prototypes, but nothing is integrated into your actual engineering workflows. The gap between demo and production remains wide.",
    "home.problem.card3.title": "Fragmented Development Operations",
    "home.problem.card3.body":
      "CI/CD is slow, observability is scattered, documentation is perpetually out of date, and each engineer has a different setup. The team spends more time on tooling than shipping.",
    "home.problem.card4.title": "Scaling Without Structure",
    "home.problem.card4.body":
      "The team has grown, but the processes haven't. Onboarding takes months, knowledge is siloed, and there's no shared engineering practice that scales across the org.",
    "home.problem.card5.title": "Unclear Path for AI Integration",
    "home.problem.card5.body":
      "You know AI should be part of your stack, but security, cost, and reliability questions are unresolved. You need a practical plan — not another proof of concept.",

    // ── Who This Is For ──
    "home.whofor.heading": "Who This Is For",
    "home.whofor.body":
      "I work with teams that build and operate real software — enterprise platforms, SaaS products, internal tools, and production systems that need to run reliably at scale.",
    "home.whofor.card1.title": "Enterprise Engineering Teams",
    "home.whofor.card1.body":
      "You maintain platforms that power real operations — property management, logistics, finance. You need systems that scale, integrate cleanly, and deliver measurable business outcomes.",
    "home.whofor.card2.title": "CTOs & Engineering Leaders",
    "home.whofor.card2.body":
      "You're responsible for platform reliability, team velocity, and technology decisions. You need a practical partner who understands both architecture and execution.",
    "home.whofor.card3.title": "Teams Modernizing Existing Systems",
    "home.whofor.card3.body":
      "You're not starting from zero. You have Laravel apps, TypeScript services, internal tools, CI/CD pipelines — and you need to evolve them incrementally while keeping production stable.",

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

    // ── Engagements (Ways to Work Together) ──
    "home.engagements.heading": "Ways to Work Together",
    "home.engagements.subtitle":
      "Three engagement models depending on where you are — from initial assessment to full platform build.",
    "home.engagements.audit.title": "Systems Assessment",
    "home.engagements.audit.duration": "1–2 weeks",
    "home.engagements.audit.body":
      "Assessment of your current platform architecture, technical debt, integration opportunities, and a prioritized roadmap. You'll know what to build next, what to refactor, and where AI fits.",
    "home.engagements.prototype.title": "Platform Build & Integration",
    "home.engagements.prototype.duration": "2–4 weeks",
    "home.engagements.prototype.body":
      "A working feature or integration delivered into your actual platform — new service, API layer, AI capability, or modernization milestone — shipped with your real tools and constraints.",
    "home.engagements.production.title": "Full Engagement",
    "home.engagements.production.duration": "4–8+ weeks",
    "home.engagements.production.body":
      "End-to-end design, build, and deployment of enterprise features or platforms. Includes architecture, AI integration, monitoring, documentation, and team handoff for long-term success.",

    // ── About Teaser ──
    "home.about.heading": "About Mauricio",
    "home.about.teaser":
      "I'm Mauricio Suárez, a full-stack software engineer based in Malta with years of experience building and operating production systems — enterprise platforms, SaaS products, payment integrations, infrastructure, and developer tooling.\n\nI focus on enterprise software engineering with practical AI integration — building platforms that work reliably, modernizing what exists, and introducing AI capabilities where they deliver real, measurable value.",
    "home.about.stacks":
      "Laravel · TypeScript · Node.js · Cloudflare · AWS · CI/CD · Observability",
    "home.about.cta": "More about me →",
    "home.about.portrait.alt":
      "Mauricio Suarez — full-stack software engineer specializing in enterprise platforms",

    // ── Engagements CTA ──
    "home.engagements.cta": "Get started →",

    // ── Contact CTA ──
    "home.contact.heading": "Ready to build software that scales?",
    "home.contact.teaser":
      "Start with a focused conversation about your platform, your team, and where engineering improvements can deliver the most impact. No generic pitch — just a practical discussion about your systems and goals.",
    "home.contact.cta.primary": "Book a Systems Assessment",
    "home.contact.cta.secondary": "Or just say hello →",

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
      "Full-stack software engineer based in Malta. I build and operate production enterprise systems — SaaS platforms, property management tools, payment integrations, infrastructure, and developer tooling — with practical AI integration where it delivers measurable value.",
    "about.description":
      "I specialize in enterprise software engineering with practical AI integration. My experience spans building and operating real production systems: SaaS products, property management platforms, payment processing, third-party integrations, cloud infrastructure, and developer tooling. I don't sell buzzwords — I build systems that work and integrate AI where it solves concrete engineering problems. Stacks I work with: Laravel, TypeScript, Node.js, Cloudflare, AWS, CI/CD, observability tooling.",
    "about.background.title": "Background",
    "about.background.body":
      "Years of experience building production software across SaaS, property tech, payments, integrations, infrastructure, and developer tooling. Based in Malta, working with teams across time zones.",

    // ── Contact Page ──
    "contact.title": "Contact",
    "contact.description":
      "Want to discuss a project or explore how to improve your engineering platform? Reach out — straightforward conversation, no filler.",
    "contact.email": "Email",
    "contact.github": "GitHub",
    "contact.linkedin": "LinkedIn",

    // ── Meta Descriptions ──
    "meta.description.home":
      "Enterprise software engineering with practical AI integration. I help teams build robust platforms, modernize legacy systems, and integrate AI where it delivers real value.",
    "meta.description.services":
      "Enterprise software services: Platform Development, AI Integration, System Architecture, and Developer Productivity. Build, modernize, and scale with confidence.",
    "meta.description.work":
      "Case studies from real engineering engagements — enterprise platforms, system modernization, and AI integration for production environments.",
    "meta.description.writing":
      "Ideas, guides, and lessons from building enterprise software and integrating AI in production. AI Engineering, Developer Experience, and System Architecture.",
    "meta.description.about":
      "Full-stack software engineer based in Malta. Building enterprise systems at the intersection of software architecture, AI integration, and developer productivity.",
    "meta.description.contact":
      "Get in touch to discuss a project or explore how to improve your engineering platform. Email, GitHub, and LinkedIn.",

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
    "home.hero.eyebrow": "Ingeniería de Software Empresarial",
    "home.hero.title": "Construye, moderniza y escala software empresarial — con IA donde cuenta.",
    "home.hero.tagline":
      "Ayudo a equipos de ingeniería a construir plataformas empresariales robustas, modernizar sistemas legacy e integrar capacidades de IA donde generan valor real — sin interrumpir lo que ya funciona.",
    "home.hero.tone":
      "Sistemas en grado de producción. Arquitectura limpia. Integración práctica de IA que se adapta a la forma en que tu equipo ya trabaja.",
    "home.hero.title.lead": "Construye, moderniza y escala ",
    "home.hero.title.highlight": "software empresarial",
    "home.hero.title.tail": " — con IA donde cuenta.",
    "home.hero.badge.1": "Plataforma Activa",
    "home.hero.badge.2": "API Integrada",
    "home.hero.badge.3": "99.9% Disponibilidad",
    "home.hero.cta.audit": "Agendar una Evaluación de Sistemas",
    "home.hero.cta.work": "Ver Casos de Estudio",

    // ── Problema / Dónde los equipos se estancan ──
    "home.problem.heading": "Dónde los Equipos de Ingeniería se Estancan",
    "home.problem.body":
      "Los equipos en crecimiento enfrentan fricción operacional que ralentiza la entrega y acumula deuda técnica. Aquí es donde aparece el dolor:",
    "home.problem.card1.title": "Sistemas Legacy que Frenan el Crecimiento",
    "home.problem.card1.body":
      "Tu plataforma fue construida para una escala menor. Ahora la arquitectura no aguanta — código sin documentar, integraciones frágiles, y features que tardan más en implementarse que en especificarse.",
    "home.problem.card2.title": "Experimentos de IA que No Llegan a Producción",
    "home.problem.card2.body":
      "Tu equipo ha explorado herramientas y prototipos de IA, pero nada está integrado en los flujos de ingeniería reales. La brecha entre demo y producción sigue siendo amplia.",
    "home.problem.card3.title": "Operaciones de Desarrollo Fragmentadas",
    "home.problem.card3.body":
      "CI/CD lento, observabilidad dispersa, documentación perpetuamente desactualizada, y cada ingeniero con un setup diferente. El equipo dedica más tiempo a tooling que a entregar.",
    "home.problem.card4.title": "Crecimiento sin Estructura",
    "home.problem.card4.body":
      "El equipo ha crecido, pero los procesos no. La incorporación de nuevos ingenieros toma meses, el conocimiento está aislado, y no hay prácticas de ingeniería compartidas que escalen en la organización.",
    "home.problem.card5.title": "Camino poco Claro para Integrar IA",
    "home.problem.card5.body":
      "Sabes que la IA debería ser parte de tu stack, pero las preguntas de seguridad, costos y confiabilidad están sin resolver. Necesitas un plan práctico — no otra prueba de concepto.",

    // ── Para Quién Es ──
    "home.whofor.heading": "Para Quién Es",
    "home.whofor.body":
      "Trabajo con equipos que construyen y operan software real — plataformas empresariales, productos SaaS, herramientas internas y sistemas en producción que necesitan funcionar de forma confiable a escala.",
    "home.whofor.card1.title": "Equipos de Ingeniería Empresarial",
    "home.whofor.card1.body":
      "Mantienen plataformas que impulsan operaciones reales — gestión de propiedades, logística, finanzas. Necesitan sistemas que escalen, se integren limpiamente, y entreguen resultados de negocio medibles.",
    "home.whofor.card2.title": "CTOs y Líderes de Ingeniería",
    "home.whofor.card2.body":
      "Son responsables de la confiabilidad de la plataforma, la velocidad del equipo y las decisiones tecnológicas. Necesitan un socio práctico que entienda tanto la arquitectura como la ejecución.",
    "home.whofor.card3.title": "Equipos Modernizando Sistemas Existentes",
    "home.whofor.card3.body":
      "No están empezando de cero. Tienen apps Laravel, servicios TypeScript, herramientas internas, pipelines CI/CD — y necesitan evolucionarlos de forma incremental manteniendo la producción estable.",

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

    // ── Modalidades de Trabajo ──
    "home.engagements.heading": "Modalidades de Trabajo",
    "home.engagements.subtitle":
      "Tres modelos de engagement según dónde estás — desde evaluación inicial hasta construcción completa de plataforma.",
    "home.engagements.audit.title": "Evaluación de Sistemas",
    "home.engagements.audit.duration": "1–2 semanas",
    "home.engagements.audit.body":
      "Evaluación de la arquitectura actual de tu plataforma, deuda técnica, oportunidades de integración, y un roadmap priorizado. Sabrás qué construir, qué refactorizar y dónde encaja la IA.",
    "home.engagements.prototype.title": "Construcción e Integración de Plataforma",
    "home.engagements.prototype.duration": "2–4 semanas",
    "home.engagements.prototype.body":
      "Una feature o integración funcional entregada en tu plataforma real — nuevo servicio, capa de API, capacidad de IA, o hito de modernización — con tus herramientas y restricciones reales.",
    "home.engagements.production.title": "Engagement Completo",
    "home.engagements.production.duration": "4–8+ semanas",
    "home.engagements.production.body":
      "Diseño, construcción y despliegue completo de features o plataformas empresariales. Incluye arquitectura, integración de IA, monitoreo, documentación y handoff al equipo para éxito a largo plazo.",

    // ── Sobre Mí (Teaser) ──
    "home.about.heading": "Sobre Mauricio",
    "home.about.teaser":
      "Soy Mauricio Suárez, ingeniero de software full-stack radicado en Malta con años de experiencia construyendo y operando sistemas en producción — plataformas empresariales, productos SaaS, integraciones de pagos, infraestructura y developer tooling.\n\nMe enfoco en ingeniería de software empresarial con integración práctica de IA — construyendo plataformas que funcionan de forma confiable, modernizando lo existente, e introduciendo capacidades de IA donde generan valor real y medible.",
    "home.about.stacks":
      "Laravel · TypeScript · Node.js · Cloudflare · AWS · CI/CD · Observabilidad",
    "home.about.cta": "Más sobre mí →",
    "home.about.portrait.alt":
      "Mauricio Suarez — ingeniero de software full-stack especializado en plataformas empresariales",

    // ── CTA Modalidades ──
    "home.engagements.cta": "Comenzar →",

    // ── Contacto CTA ──
    "home.contact.heading": "¿Listo para construir software que escale?",
    "home.contact.teaser":
      "Empieza con una conversación enfocada sobre tu plataforma, tu equipo y dónde las mejoras de ingeniería pueden generar el mayor impacto. Sin presentación genérica — solo una discusión práctica sobre tus sistemas y objetivos.",
    "home.contact.cta.primary": "Agendar una Evaluación de Sistemas",
    "home.contact.cta.secondary": "O simplemente saluda →",

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
      "Ingeniero de software full-stack radicado en Malta. Construyo y opero sistemas empresariales en producción — plataformas SaaS, herramientas de gestión de propiedades, integraciones de pagos, infraestructura y developer tooling — con integración práctica de IA donde genera valor medible.",
    "about.description":
      "Me especializo en ingeniería de software empresarial con integración práctica de IA. Mi experiencia abarca construcción y operación de sistemas reales en producción: productos SaaS, plataformas de gestión de propiedades, procesamiento de pagos, integraciones con terceros, infraestructura cloud y developer tooling. No vendo buzzwords — construyo sistemas que funcionan e integro IA donde resuelve problemas concretos de ingeniería. Stacks con los que trabajo: Laravel, TypeScript, Node.js, Cloudflare, AWS, CI/CD, herramientas de observabilidad.",
    "about.background.title": "Trayectoria",
    "about.background.body":
      "Años de experiencia construyendo software en producción en SaaS, property tech, pagos, integraciones, infraestructura y developer tooling. Radicado en Malta, trabajando con equipos en diferentes zonas horarias.",

    // ── Página de Contacto ──
    "contact.title": "Contacto",
    "contact.description":
      "¿Quieres discutir un proyecto o explorar cómo mejorar tu plataforma de ingeniería? Escríbeme — conversación directa, sin relleno.",
    "contact.email": "Correo",
    "contact.github": "GitHub",
    "contact.linkedin": "LinkedIn",

    // ── Meta Descripciones ──
    "meta.description.home":
      "Ingeniería de software empresarial con integración práctica de IA. Ayudo a equipos a construir plataformas robustas, modernizar sistemas legacy e integrar IA donde genera valor real.",
    "meta.description.services":
      "Servicios de software empresarial: Desarrollo de Plataformas, Integración de IA, Arquitectura de Sistemas y Productividad de Desarrollo. Construye, moderniza y escala con confianza.",
    "meta.description.work":
      "Casos de estudio de engagements de ingeniería reales — plataformas empresariales, modernización de sistemas e integración de IA para entornos de producción.",
    "meta.description.writing":
      "Ideas, guías y lecciones de construir software empresarial e integrar IA en producción. Ingeniería de IA, Experiencia del Desarrollador y Arquitectura de Sistemas.",
    "meta.description.about":
      "Ingeniero de software full-stack radicado en Malta. Construyendo sistemas empresariales en la intersección de arquitectura de software, integración de IA y productividad de desarrollo.",
    "meta.description.contact":
      "Contáctame para discutir un proyecto o explorar cómo mejorar tu plataforma de ingeniería. Correo, GitHub y LinkedIn.",

    // ── Footer ──
    "footer.rights": "Todos los derechos reservados.",
  },
} as const;

export type UIKey = keyof (typeof ui)["en"];
