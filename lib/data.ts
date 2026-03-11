export interface Project {
  id: string
  title: string
  description: string
  /** Minto Pyramid lead — the answer/outcome shown immediately after hero */
  lead?: string
  thumbnail: string
  tags: string[]
  heroImage: string
  role: string
  team: string
  timeline: string
  tools: string[]
  /** Custom section headings (defaults: "The Problem", "Research & Discovery", "Design", "Outcome") */
  sectionHeadings?: {
    problem?: string
    research?: string
    artifacts?: string
    design?: string
    outcome?: string
  }
  problem: string
  research: string
  design: string
  outcome: string
  designDecision: {
    title: string
    insight: string
    decision: string
  }
  designDecisions?: {
    title: string
    insight: string
    decision: string
    afterHeader?: string
  }[]
  artifacts: {
    type: string
    image: string
    caption: string
  }[]
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  title: string
  company: string
}

export interface ProcessStep {
  id: string
  title: string
  description: string
  tools: string[]
  diamond: 1 | 2
  mode: "diverge" | "converge"
}

export const projects: Project[] = [
  {
    id: "wsb-sentiment",
    title: "WSB Sentiment",
    description: "I designed a platform that runs stocks through nine analytical layers — and made it feel simple. The core challenge: how do you present nine dimensions of live financial data without drowning the user?",
    lead: "A real-time sentiment analysis platform that pulls from six data sources and runs each stock through a nine-layer validation pipeline. The engineering wasn't the hard part. The real challenge was a design problem: presenting all that density for three very different types of traders, each getting exactly what they need from the same screen. The answer was progressive disclosure mapped to behavioral personas — and it's live, serving traders through a tiered SaaS model.",
    thumbnail: "/images/projects/wsb-thumb.jpg",
    tags: ["UI/UX", "HCI Research", "Front-End Dev"],
    heroImage: "/images/projects/wsb-hero.jpg",
    role: "Sole Designer & Developer",
    team: "Solo (research, design, engineering, product)",
    timeline: "Ongoing (live SaaS product)",
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Radix UI", "Supabase", "Stripe", "Recharts", "OKLCh Color System", "Vercel", "React Email", "Web Push API"],
    sectionHeadings: {
      problem: "The gap retail traders couldn't close",
      research: "Three types of traders, three different relationships with data",
      artifacts: "Process Artifacts",
      design: "Six design decisions that shaped the product",
      outcome: "What worked, what I'd change"
    },
    problem: "In January 2021, retail investors on r/wallstreetbets moved the market. GameStop went from $20 to $483 in days. That moment exposed an information gap: institutions had Bloomberg terminals and quant models. Retail traders had a Reddit thread and gut instinct.\n\nWSB Sentiment closes that gap — a real-time platform that turns the chaos of Reddit, StockTwits, and financial news into layered BUY/SELL/HOLD signals. Under the hood, the engine pulls from six data sources and runs each stock through nine analytical layers: Reddit Sentiment, Options Flow, Bag Holder Detection, Retail Psychology, Volume Correlation, Cross-Subreddit Divergence, News Correlation, Institutional Activity, and Squeeze Analysis.\n\nBut the engineering is only half the story. The design challenge: how do you present nine dimensions of financial analysis for 20+ stocks, all updating live, without drowning the user?",
    research: "I chose observational research over surveys because I needed to see how traders actually behave — not how they describe their behavior. Watching four Reddit trading communities surfaced three distinct personas:\n\nTHE SCANNER\n\nChecks in once or twice a day. Wants an instant read on market mood in under two seconds. Mental model: a weather report. 'Is the market bullish or bearish today?' Maps to the Free tier.\n\nTHE PORTFOLIO TRACKER\n\nHolds active positions and wants sentiment layered over their real holdings. Cares about P/L context and getting a heads-up before a position turns. Mental model: a health dashboard for their money. Maps to the Starter tier.\n\nTHE SIGNAL HUNTER\n\nTreats the platform like a professional tool. Wants all nine layers, keyboard shortcuts, data export, and API access. Mental model: a command center. Maps to the Pro tier.\n\nTHE DESIGN CONSTRAINT\n\nThese personas define the core challenge: every screen has to be legible to the Scanner at a glance, useful to the Tracker daily, and powerful enough for the Signal Hunter to build a workflow around. The interface can't pick one audience — it has to layer itself to serve all three at once.\n\nThree universal needs emerged from synthesis: speed of comprehension (answerable in under two seconds), trust through transparency (users want to see why a stock is flagged BUY), and agency without overhead (power users want control; casual users want to glance and go).",
    design: "PROGRESSIVE DISCLOSURE: THREE DEPTHS OF DATA\n\nThe IA maps one tier to each persona. Depth 1 (Dashboard Glance): a grid of stock cards showing ticker, sentiment score, BUY/SELL/HOLD badge, and price change — a Scanner absorbs the market mood without scrolling. Depth 2 (Stock Card): each card reveals bullish/bearish splits, sentiment alignment, and all nine analysis layer indicators without clicking. Depth 3 (Detail View): dual-axis charts, the full nine-layer suite, correlated news, and CSV export for building conviction.\n\nMAKING BUY AND SELL VISUALLY EQUAL\n\nThe entire design system is built on OKLCh, a perceptually uniform color model. Traditional HSL makes green visually brighter than red at the same lightness — creating unconscious bullish bias in financial interfaces. OKLCh eliminates this. Every signal badge is also reinforced with a directional icon so color is never the only information channel. Dark mode inverts the lightness channel while preserving chroma and hue.\n\nTHE STOCK CARD: 300 PIXELS OF MICRO-DASHBOARD\n\nThe densest component in the system uses a four-level typographic hierarchy. Symbol anchors the grid scan. Signal badge and price deliver the headline. Sentiment score adds context. Analysis layers reward the deep reader. A Scanner reads levels 1-2 in two seconds. A Signal Hunter reads through level 4 without leaving the dashboard.\n\nTHE PAYWALL THAT SELLS BY SHOWING\n\nLocked features are never hidden. Free users see all nine layers — locked ones show a Gaussian-blurred value and the tier required to unlock. Three contextual variants (Badge, Card, Inline blur) adapt the lock to context. The blurred value tells the user's brain the data is real and computed. Loss aversion does the rest. Every locked element is one click from upgrade.\n\nSTILLNESS AS FEEDBACK\n\nAuto-refresh runs every 30 seconds with conditional HTTP requests. If nothing changed, the server returns 304 Not Modified and the UI stays perfectly still — no re-render, no flicker. Stillness is itself feedback. When data does update, staggered card entrance animations (30ms per card) communicate freshness without jarring layout shifts. Scroll position and sort order are always preserved.\n\nGUARDRAILS IN THE INTERFACE, NOT THE TERMS OF SERVICE\n\nAI-generated price predictions are the most sensitive feature. Instead of burying disclaimers, I built trust calibration into the UI: predictions below 60% confidence render muted with a 'Low Confidence' badge. Trailing accuracy anchors expectations. Disclaimers are part of the card layout. Rate limits prevent compulsive checking.",
    outcome: "WSB Sentiment is live, serving traders through a tiered subscription model (Free, Starter, Pro). The nine-layer system reveals itself progressively — first as a badge, then as a detail row, then as a full metrics page — meeting each user at their level of curiosity.\n\nWhat Worked:\n\nProgressive disclosure turned the paywall into a feature tour — free users see blurred data on stocks they're already watching, making the upgrade value undeniable at the moment of need.\n\nOptimistic UI made it feel like a native instrument, not a web tool. Removing perceived latency translates directly to trust when money is on the line.\n\nOKLCh ensures BUY and SELL carry genuinely equal visual weight — an invisible fairness guarantee that traditional HSL-based financial interfaces silently break.\n\nThe conditional refresh strategy turned 'nothing happening' into reassuring feedback instead of ambiguous silence.\n\nWhat I'd Do Differently:\n\nThe transparent paywall took three iterations. The first two were more about showing off the tech than serving the user. Having even one collaborator to push back earlier would have shortened that loop.\n\nI relied heavily on community observation and my own instincts as a trader, which worked for broad strokes but left interaction details under-validated. If starting over, I'd invest in structured usability testing earlier.\n\nThe notification permission flow went through a five-state design mostly on first principles. It works well, but I'd feel better with formal testing data behind it.\n\nThe Core Insight:\n\nComplexity isn't the enemy of usability. Poor disclosure is. Every design decision serves one principle: reduce the distance between raw data and confident action.",
    designDecision: {
      title: "Progressive Disclosure as the Primary Interaction Pattern",
      insight: "Nine analytical layers from six data sources. Showing everything at once for 20+ stocks would serve no one. But hiding layers removes the transparency that builds trust.",
      decision: "A three-depth hierarchy mapped to personas: 2-second dashboard for Scanners, expandable cards for Trackers, full drill-down for Signal Hunters. Locked layers show blurred values and tier badges instead of disappearing — the system's depth stays discoverable and the upgrade path is obvious."
    },
    designDecisions: [
      {
        title: "Progressive Disclosure as the Primary Interaction Pattern",
        afterHeader: "PROGRESSIVE DISCLOSURE",
        insight: "Nine analytical layers from six data sources. Showing everything at once for 20+ stocks would serve no one. But hiding layers removes the transparency that builds trust.",
        decision: "A three-depth hierarchy mapped to personas: 2-second dashboard for Scanners, expandable cards for Trackers, full drill-down for Signal Hunters. Locked layers show blurred values and tier badges instead of disappearing — the system's depth stays discoverable and the upgrade path is obvious."
      },
      {
        title: "OKLCh for Perceptual Fairness",
        afterHeader: "MAKING BUY AND SELL",
        insight: "Traditional HSL makes green visually brighter than red at equal lightness — creating unconscious bullish bias. The BUY badge literally catches the eye more than SELL at identical contrast values.",
        decision: "Built the entire design system on OKLCh with all tokens as CSS custom properties. BUY and SELL now carry genuinely equal visual weight. Dark mode inverts lightness while preserving chroma and hue — the signal hierarchy stays identical at 2 PM and 11 PM."
      },
      {
        title: "Transparent Paywall Over Hidden Features",
        afterHeader: "THE PAYWALL THAT SELLS",
        insight: "Most SaaS products hide locked features. But in a platform built on transparency, hiding data contradicts the core value. Users need to see the full depth to trust the signals.",
        decision: "Locked features are never hidden. A free user sees all nine layers with locked ones showing a Gaussian-blurred value. The brain registers the data is real and computed. Loss aversion makes the absence tangible. Three lock variants (Badge, Card, Inline) adapt to context. Every locked element is one click from upgrade."
      },
      {
        title: "Stillness as Feedback in Real-Time Systems",
        afterHeader: "STILLNESS AS FEEDBACK",
        insight: "Aggressive auto-refresh creates problems that rival stale data: content jumping, lost scroll position, spatial memory disruption. The refresh itself can be more disruptive than the staleness it's solving.",
        decision: "Auto-refresh with conditional HTTP requests using If-Modified-Since headers. Nothing changed? 304 Not Modified — the UI stays perfectly still. Scroll position and sort order are preserved. Staggered card entrance animations (30ms per card) communicate freshness without jarring layout shifts."
      },
      {
        title: "Trust Guardrails on AI Predictions",
        afterHeader: "GUARDRAILS IN THE INTERFACE",
        insight: "AI price forecasts are the most sensitive feature. Users might treat predictions as financial advice with real monetary consequences. The design has to prevent overreliance without undermining usefulness.",
        decision: "Trust calibration built directly into the UI: predictions below 60% confidence render muted with a 'Low Confidence' badge. Trailing accuracy anchors expectations. Disclaimers are part of the card layout, not buried in modals. Rate limits frame prediction as a deliberate action, not a reflex."
      }
    ],
    artifacts: [
      { type: "Persona Research", image: "/images/projects/wsb-personas.jpg", caption: "Three behavioral personas (Scanner, Portfolio Tracker, Signal Hunter) drawn from watching how people actually use Reddit trading communities, each with different needs around information density" },
      { type: "Information Architecture", image: "/images/projects/wsb-ia.jpg", caption: "Three-tier progressive disclosure model mapping nine analysis layers across dashboard glance, card detail, and full deep-dive views" },
      { type: "Color System", image: "/images/projects/wsb-color.jpg", caption: "OKLCh perceptually uniform color tokens ensuring BUY and SELL signals carry equal visual weight, eliminating unconscious bias in financial interfaces" },
      { type: "Stock Card Anatomy", image: "/images/projects/wsb-card.jpg", caption: "Four-level typographic hierarchy packed into 300 pixels, from a 2-second Scanner glance to the full nine-layer Signal Hunter breakdown" },
      { type: "Refresh UX Flow", image: "/images/projects/wsb-refresh.jpg", caption: "Conditional HTTP refresh strategy: 304 stillness as feedback, staggered entrance animations, and scroll position preservation" },
      { type: "Transparent Paywall", image: "/images/projects/wsb-paywall.jpg", caption: "Three locked-feature variants (Badge, Card, Inline blur) that show data exists without revealing it, using loss aversion for upgrade conversion" },
      { type: "Notification State Machine", image: "/images/projects/wsb-notifications.jpg", caption: "Five-state permission flow built on incremental commitment: never prompts on first load, only appears in user-initiated context" },
      { type: "Responsive Breakpoints", image: "/images/projects/wsb-responsive.jpg", caption: "Single 768px breakpoint with container queries, search promoted to primary navigation on mobile, 56x56px touch targets" },
      { type: "AI Trust Interface", image: "/images/projects/wsb-predictions.jpg", caption: "Confidence visualization, trailing accuracy metrics, and inline disclaimers: guardrails built into the interface, not the terms of service" }
    ]
  },
  {
    id: "fintech-dashboard",
    title: "FinFlow Dashboard",
    description: "Redesigning the analytics experience for a B2B fintech platform serving 2,000+ financial analysts",
    thumbnail: "/images/projects/fintech-thumb.jpg",
    tags: ["UI/UX", "Design System", "Front-End Dev"],
    heroImage: "/images/projects/fintech-hero.jpg",
    role: "Lead Designer & Developer",
    team: "3 designers, 4 engineers",
    timeline: "4 months",
    tools: ["Figma", "React", "D3.js", "Tailwind CSS", "Storybook", "Hotjar"],
    problem: "FinFlow's analytics platform had grown organically over three years, bolting on features without revisiting the core experience. Financial analysts were spending 40% of their working day navigating between disconnected tools just to compile a single client report. Support tickets around 'finding data' had increased 120% year-over-year, and the company was losing enterprise deals to competitors with more streamlined workflows. The existing dashboard surfaced 200+ metrics on a single screen with no clear hierarchy, no role-based views, and no actionable next steps — it was data-rich but insight-poor. Leadership set a clear goal: cut report generation time in half within one quarter, or risk losing the platform's largest client.",
    research: "I started by mapping assumptions against reality. I conducted 12 semi-structured interviews across three user segments — junior analysts, senior portfolio managers, and compliance officers — to understand how each role actually used the platform versus how we assumed they did. The gap was significant: we had designed for power users, but 70% of daily sessions were quick status checks lasting under 90 seconds.\n\nI created journey maps for each segment, revealing that analysts touched an average of 5 screens and 3 external tools to complete their most common task. Competitive analysis of Bloomberg Terminal, Tableau, and newer fintech tools like Mosaic showed an industry-wide shift toward progressive disclosure — surfacing only what matters, when it matters.\n\nThe breakthrough insight came from a contextual inquiry session. I watched a senior analyst tape handwritten sticky notes to her monitor with the four numbers she checked every morning. She had built her own 'dashboard' because ours failed her. That moment reframed the entire project: we weren't building a dashboard, we were building a decision-support tool.",
    design: "Armed with research, I established three design principles: 'Glanceable first, deep on demand,' 'Role-aware, not role-restricted,' and 'Every screen should answer: what do I do next?'\n\nI started with low-fidelity sketches exploring card-based layouts, then moved to Figma for mid-fidelity wireframes. I ran a design sprint with the engineering team to pressure-test feasibility early — this surfaced a critical constraint around real-time data refresh rates that shaped our card architecture.\n\nThe final design introduced three key innovations: (1) A modular card system that adapts to user roles, with analysts seeing trend summaries while compliance officers see risk flags. (2) 'Smart Summaries' — AI-generated plain-language insights that surface anomalies like 'Portfolio X is down 12% vs. sector avg, driven by Q3 earnings miss.' (3) A complete IA restructure from tool-centric ('Charts,' 'Tables,' 'Reports') to task-centric ('Morning Review,' 'Client Prep,' 'Compliance Check'), reducing clicks to key actions by 60%.\n\nI built the front-end component library in React with Storybook documentation, ensuring design-to-dev parity. Every component was tested against WCAG AA standards and validated with the three user segments before handoff.",
    outcome: "The results exceeded our targets across every metric. Average report generation time dropped from 2 hours to 25 minutes — a 79% reduction. Net Promoter Score climbed from 32 to 67 within the first quarter post-launch. Daily active usage increased 34% as users consolidated their workflows into the platform.\n\nThe enterprise client we were at risk of losing not only renewed their contract but expanded to two additional business units. The card-based design system I built became the foundation for 4 other products in FinFlow's suite, saving an estimated 6 months of design and development time across teams.\n\nMore importantly, three months after launch, I revisited the analyst who had used sticky notes. Her monitor was clean. 'I just open the dashboard now,' she said. That's when I knew we'd solved the right problem.",
    designDecision: {
      title: "Progressive Disclosure Over Information Overload",
      insight: "User research revealed that analysts only need granular data 20% of the time — 80% of sessions are quick status checks lasting under 90 seconds. Yet the existing dashboard treated every session as a deep-dive, front-loading 200+ metrics regardless of context.",
      decision: "I implemented a three-tier information hierarchy: glanceable KPIs on the home view → expandable summary cards with trend context → full drill-down with filtering and export. This reduced initial cognitive load by an estimated 70% (measured via task-completion time) while preserving every power-user capability behind intentional interactions. The key tradeoff was hiding advanced filters behind a second click — we validated this with 8 usability tests, confirming that power users adapted within one session."
    },
    artifacts: [
      { type: "Journey Map", image: "/images/projects/fintech-journey.jpg", caption: "End-to-end analyst journey revealing 5 tool-switches per report — the core pain point that shaped our task-centric IA" },
      { type: "Wireframes", image: "/images/projects/fintech-wireframes.jpg", caption: "Mid-fidelity exploration of the three-tier card system, tested with 3 user segments before visual design" },
      { type: "Usability Testing", image: "/images/projects/fintech-testing.jpg", caption: "Remote moderated testing — this session caught a critical issue with card collapse behavior on smaller viewports" }
    ]
  },
  {
    id: "healthcare-app",
    title: "MedConnect Patient Portal",
    description: "Building trust through transparent healthcare data access for 50,000+ patients",
    thumbnail: "/images/projects/healthcare-thumb.jpg",
    tags: ["UI/UX", "HCI Research", "Prototyping"],
    heroImage: "/images/projects/healthcare-hero.jpg",
    role: "UX Researcher & Designer",
    team: "2 designers, 1 PM, 5 engineers",
    timeline: "6 months",
    tools: ["Figma", "Maze", "Notion", "Next.js", "Dovetail", "Loom"],
    problem: "MedConnect's patient portal was built to meet regulatory requirements, not patient needs. It checked the compliance box but failed the people it was supposed to serve. Patients reported feeling disconnected from their own health data — lab results arrived as cryptic alphanumeric codes, appointment scheduling required calling a phone number listed in 8pt font, and medication lists used clinical names patients couldn't pronounce, let alone understand.\n\nThe numbers told the story: a 23% abandonment rate during onboarding, only 18% monthly active usage among registered patients, and a medication adherence rate 15% below the network average. The hospital system was also facing a new CMS rule requiring improved digital access, with penalties for non-compliance starting in 6 months. The mandate was clear: transform the portal from a compliance artifact into something patients actually want to use.",
    research: "I designed a mixed-methods research plan to understand the full patient experience, not just the portal interaction. First, I recruited 15 patients across age groups (28–74), tech comfort levels, and chronic condition types for a 4-week diary study. Participants logged every interaction with their health data — digital and analog — using voice memos and photo journals.\n\nThe diary study surfaced a pattern I hadn't expected: patients weren't avoiding the portal because of technical difficulty. They were avoiding it because it made them anxious. Seeing clinical terminology they didn't understand triggered fear responses. One participant wrote, 'I saw a flag next to my result and spent the whole weekend thinking I was dying. It was just slightly outside the range.'\n\nI complemented this with 3 expert interviews with physicians and nurses to understand the clinical perspective, analyzed 200+ support tickets to map recurring confusion points, and ran a full accessibility audit that revealed 14 WCAG AA failures — including insufficient color contrast on critical lab result indicators.\n\nSynthesis produced four core themes: (1) Medical terminology creates a trust barrier, (2) Information without context causes anxiety, (3) Patients want guidance, not just data, and (4) The portal ignores the patient's support network entirely.",
    design: "I translated research themes into four design principles: 'Clarity over completeness,' 'Context before content,' 'Guide, don't just display,' and 'Include the care circle.'\n\nThe centerpiece of the redesign was the 'Health Timeline' — a chronological, visual narrative of the patient's health journey that replaced the disconnected tabs-based navigation. Instead of forcing patients to mentally connect labs, appointments, and medications across separate sections, the timeline shows everything in context: 'Your cholesterol was checked on March 3rd, your doctor adjusted your medication on March 10th, and your next check is April 15th.'\n\nFor every clinical data point, I designed a dual-layer display: the clinical value for medical accuracy, paired with a plain-language summary written at a 6th-grade reading level. I collaborated with the clinical team over 3 workshops to develop a glossary of 400+ terms. 'Hyperlipidemia' became 'High cholesterol — a condition where there's too much fat in your blood.'\n\nThe onboarding flow was completely rebuilt. The original required 22 fields across 4 pages. I reduced it to 6 essential fields on a single page with optional progressive profiling — the rest could be completed later, in context, when patients actually needed those features. I prototyped 3 onboarding variations in Figma and tested them with 12 participants using Maze, iterating twice before the final design.",
    outcome: "The redesigned portal launched to a pilot group of 5,000 patients before rolling out network-wide. Onboarding completion jumped from 77% to 94% — but the more meaningful metric was what happened after onboarding. Monthly active usage grew from 18% to 52% within 6 months, and patients were spending 3x longer per session — not because the portal was harder to use, but because they were actually engaging with their health data for the first time.\n\nMedication adherence in the pilot group improved by 22%, which the clinical team attributed partly to the portal's new medication reminders and plain-language drug information. The hospital system met its CMS compliance deadline with room to spare.\n\nThe project received a Healthcare Design Award for accessibility improvements, and the plain-language glossary system was adopted by two other hospital networks in the region. For me, the most meaningful outcome was an email from a 68-year-old participant in the diary study: 'For the first time, I feel like I understand what my doctor is telling me. I don't have to pretend anymore.'",
    designDecision: {
      title: "Plain Language as a Design Requirement, Not a Nice-to-Have",
      insight: "The diary study revealed that 9 out of 15 patients regularly screenshot health data and send it to family members for 'translation' of medical terminology. Patients weren't lacking intelligence — they were lacking context. The portal was written for clinicians, not for the people it was supposed to serve.",
      decision: "I partnered with the clinical team across 3 workshops to develop a plain-language glossary covering 400+ medical terms. Each clinical term now has a hover/tap explanation written at a 6th-grade reading level, validated by a health literacy specialist. The key tradeoff was screen real estate — dual-layer display takes more space than raw clinical data. We solved this with a progressive approach: plain language shown by default, clinical terminology available on tap for patients who want it. Usability testing confirmed that 85% of patients preferred the plain-language default, while the remaining 15% (mostly patients with clinical backgrounds) appreciated the toggle."
    },
    artifacts: [
      { type: "Affinity Map", image: "/images/projects/healthcare-affinity.jpg", caption: "Synthesizing 4 weeks of diary study data into 4 core themes — the anxiety pattern was the breakthrough finding" },
      { type: "Prototype", image: "/images/projects/healthcare-prototype.jpg", caption: "High-fidelity Health Timeline prototype showing the dual-layer display of clinical data with plain-language context" },
      { type: "A/B Test Results", image: "/images/projects/healthcare-ab.jpg", caption: "Maze results comparing 3 onboarding variations — the single-page progressive flow won decisively with 94% completion" }
    ]
  },
  {
    id: "design-system",
    title: "Nexus Design System",
    description: "Scaling design consistency across a growing product suite of 6 applications",
    thumbnail: "/images/projects/nexus-thumb.jpg",
    tags: ["Design System", "Front-End Dev", "Documentation"],
    heroImage: "/images/projects/nexus-hero.jpg",
    role: "Design System Lead",
    team: "2 designers, 3 engineers",
    timeline: "Ongoing (1.5 years)",
    tools: ["Figma", "Storybook", "React", "TypeScript", "Chromatic", "GitHub Actions"],
    problem: "The company had grown from 1 product to 6 in two years through a combination of organic growth and acquisitions. Each product had been designed and built independently, resulting in a fractured user experience — customers using multiple products encountered different button styles, inconsistent spacing, contradictory interaction patterns, and even different color palettes for the same status indicators (red meant 'error' in one product and 'urgent' in another).\n\nThe cost was both external and internal. Externally, enterprise customers were citing 'lack of platform cohesion' as a reason for evaluating competitors. Internally, 4 design teams were independently building the same components, and engineering spent 40% more time on new features due to redundant component development. A quick audit I ran found 340+ unique button variations across the 6 products — not because users needed that variety, but because no shared system existed.\n\nLeadership greenlit a dedicated design system team with a clear mandate: unify the product suite without disrupting active development timelines.",
    research: "Before designing a single component, I needed to understand the problem from every angle. I started with a comprehensive component audit across all 6 products, cataloging every instance of buttons, form fields, modals, navigation patterns, and typography. The audit revealed the full scale of inconsistency: 340+ button variations, 12 different modal implementations, 8 distinct form field styles, and 5 separate icon libraries.\n\nNext, I surveyed 25 designers and developers to understand their pain points and habits. The survey surfaced a nuance I hadn't anticipated: the problem wasn't that teams wanted to diverge — it was that copying components between products was so difficult that rebuilding from scratch was faster. The system needed to solve distribution as much as design.\n\nI benchmarked design systems from Shopify Polaris, Atlassian Design System, GitHub Primer, and Carbon by IBM. Each had different strengths: Polaris excelled at governance, Primer at developer experience, Carbon at accessibility documentation. I mapped these against our team's constraints — small team, multiple frameworks, need for theming — to define our system's architectural principles.",
    design: "I established a design philosophy of 'convention over configuration' — the system should make the right thing the easy thing. The architecture had three layers:\n\nFoundation: A token-based system of 180+ design tokens covering color, spacing, typography, elevation, and motion. Tokens were semantic ('color-action-primary') rather than descriptive ('blue-500'), enabling themes without touching components. I built tokens in Figma variables with 1:1 parity to CSS custom properties.\n\nComponents: 45 core components built in React with TypeScript, each with full Storybook documentation including usage guidelines, do/don't examples, accessibility notes, and code snippets. Every component was built to WCAG AA by default (AAA where feasible), tested with axe-core in CI, and reviewed by the accessibility team.\n\nPatterns: Documented composition patterns showing how to combine primitives for common use cases — data tables with filtering, multi-step forms, empty states with calls to action. These patterns were the bridge between atomic components and real product needs.\n\nAdoption was the hardest design challenge. I implemented a migration strategy that let teams adopt incrementally — wrapping existing components with system tokens first, then swapping to system components one screen at a time. I also created a Figma plugin that flagged non-system components in design files, giving teams visibility into their migration progress.",
    outcome: "After 18 months, Nexus is the foundation of all 6 products. Design-to-dev handoff time decreased by 50% because designers and developers now speak the same component language. Component reuse reached 89% across the product suite — up from an estimated 15% before the system. New feature development is 35% faster on average because teams compose from existing primitives rather than building from scratch.\n\nThe system has 200+ weekly active users across design and engineering. We ship updates biweekly with automated visual regression testing via Chromatic, and we haven't had a breaking change in 8 months thanks to our semantic versioning and deprecation strategy.\n\nThe business impact was equally clear: the enterprise customer churn rate related to 'platform cohesion' dropped to zero in the last two quarters. The system was cited in a successful Series C pitch as evidence of engineering maturity.\n\nThe lesson I carried forward: a design system is 20% components and 80% communication. The governance model, contribution guidelines, and office hours I established were more important to adoption than any individual component.",
    designDecision: {
      title: "Composition Over Configuration",
      insight: "Six months in, teams were requesting increasingly complex component variants — a button with an icon, a loading state, a badge, and a tooltip, all configurable via props. The component API for Button alone had grown to 23 props, and every new variant multiplied the testing surface. We were heading toward the same complexity we'd set out to eliminate, just centralized instead of distributed.",
      decision: "I led a refactor toward a compositional architecture. Instead of a monolithic Button with 23 props, we built smaller, focused primitives — Button, Icon, Spinner, Badge, Tooltip — designed to compose naturally. A button with an icon and loading state became <Button><Spinner /><Icon /> Submit</Button> instead of <Button icon='check' loading badge={3} tooltip='Save changes'>. This reduced our component API surface by 60% while actually increasing flexibility. The tradeoff was a slightly more verbose JSX syntax, which we validated with 10 developers — 9 preferred the composable approach because it was 'obvious what's happening' without reading documentation."
    },
    artifacts: [
      { type: "Component Audit", image: "/images/projects/nexus-audit.jpg", caption: "Snapshot of the cross-product audit — 340+ button variations that catalyzed the project's approval" },
      { type: "Token System", image: "/images/projects/nexus-tokens.jpg", caption: "Semantic token architecture showing how a single 'action-primary' token maps across themes and platforms" },
      { type: "Documentation", image: "/images/projects/nexus-docs.jpg", caption: "Storybook docs for the Button primitive — usage guidelines, do/don't examples, and accessibility notes" }
    ]
  },
  {
    id: "ar-wayfinding",
    title: "Campus AR Wayfinding",
    description: "HCI capstone exploring spatial computing for navigation on a 300-acre campus",
    thumbnail: "/images/projects/ar-thumb.jpg",
    tags: ["HCI Research", "Prototyping", "UI/UX"],
    heroImage: "/images/projects/ar-hero.jpg",
    role: "Lead Researcher & Prototyper",
    team: "4 graduate researchers",
    timeline: "3 months (academic)",
    tools: ["Unity", "ARKit", "Figma", "Maze", "Tobii Eye Tracker", "SPSS"],
    problem: "University orientation surveys consistently showed that navigating a 300-acre campus with 80+ buildings is one of the top stressors for incoming students. A survey of 450 first-year students revealed that 67% got lost at least once during their first week, 42% were late to a class because they couldn't find the room, and 28% reported that navigation anxiety made them avoid exploring campus altogether.\n\nExisting solutions — static signage, paper maps, and Google Maps — each had critical limitations. Signage assumed familiarity with building names students hadn't learned yet. Paper maps required constant reorientation. Google Maps could route to a building but couldn't help students find Room 312B inside a labyrinthine science complex. The university's accessibility office also flagged that none of these solutions served students with cognitive disabilities, for whom spatial navigation is disproportionately challenging.\n\nOur research question: Can AR wayfinding reduce navigation errors and cognitive load compared to traditional methods, and if so, which AR interaction pattern is most effective?",
    research: "We designed a three-phase research protocol. Phase 1 was contextual inquiry: we shadowed 20 students (10 first-year, 10 transfer) during actual navigation tasks across campus, recording their wayfinding behavior, verbal protocols, and error patterns. We discovered that students relied heavily on landmarks ('turn left at the fountain') rather than cardinal directions, and that indoor-to-outdoor transitions were the most common point of disorientation.\n\nPhase 2 was a literature review of 35 papers on spatial cognition, AR wayfinding, and cognitive load theory. Key findings shaped our design: Wickens' Multiple Resource Theory suggested AR overlays compete for visual attention with the real environment, and Montello's spatial knowledge framework showed that route knowledge (turn-by-turn) and survey knowledge (mental map) develop through different mechanisms. We hypothesized that the best AR approach would support route knowledge without inhibiting survey knowledge development.\n\nPhase 3 was cognitive load measurement. We used the NASA Task Load Index (NASA-TLX) as our primary measure and supplemented it with Tobii eye-tracking glasses to capture attention patterns during navigation. We established baselines using paper maps and Google Maps to compare against our AR prototypes.",
    design: "Based on our research, we designed three distinct AR overlay approaches, each grounded in a different wayfinding theory:\n\n1. Floating Arrows — screen-anchored directional arrows inspired by video game HUDs. This was our 'explicit guidance' condition, providing constant turn-by-turn instructions.\n\n2. Ground-Path Projection — a luminous trail projected onto the ground plane using ARKit surface detection. Inspired by Hansel and Gretel's breadcrumbs, this provided spatial context without demanding focal attention.\n\n3. Landmark Highlighting — AR outlines around key landmarks (fountains, sculptures, distinctive buildings) with semantic labels ('The fountain near the library'). This was our 'cognitive scaffolding' condition, designed to accelerate survey knowledge.\n\nI built functional prototypes of all three in Unity with ARKit, spending extra time on ground-path rendering to ensure it felt spatial and 'attached' to the real world rather than floating. We pilot tested with 5 participants, iterated on each prototype (ground-path opacity was way too high initially — it obscured real obstacles), then ran the full study.\n\nThe within-subjects study had 20 participants each complete 3 navigation tasks (one per condition) across different campus routes, counterbalanced for order effects. Each task involved navigating from an outdoor start point to a specific indoor room.",
    outcome: "The results were clear and nuanced. Ground-path projection reduced navigation errors by 45% compared to paper maps and by 30% compared to Google Maps. But the most interesting finding was the interaction between method and cognitive load.\n\nFloating arrows were fastest for simple outdoor routes but produced the highest NASA-TLX scores (highest cognitive load) and the worst spatial recall — in a surprise follow-up test, participants who used arrows couldn't retrace their route without assistance. Eye-tracking confirmed why: users spent 60% of their time looking at the device, effectively using AR as a crutch rather than a learning tool.\n\nGround-path projection hit the sweet spot: competitive navigation speed with significantly lower cognitive load and, crucially, participants could retrace their route afterward. The ground projection kept attention in the environment rather than on the screen.\n\nLandmark highlighting was slowest for initial navigation but produced the best spatial recall scores — participants were building mental maps. This suggested a compelling design direction: start with ground-path for initial navigation, then progressively shift to landmark highlighting as the student learns the campus.\n\nWe published findings at the CHI 2024 Student Research Competition (honorable mention) and presented to the university's Campus Planning Committee, who are now evaluating AR wayfinding as part of a broader campus accessibility initiative. The eye-tracking methodology has been adopted by two other research groups in our department.",
    designDecision: {
      title: "Ambient Guidance Over Explicit Direction",
      insight: "Eye-tracking data revealed a critical flaw in the most 'helpful' design. Participants using floating arrows spent 60% of navigation time looking at their device screen — essentially replacing spatial awareness with screen dependency. Post-task spatial recall scores were the lowest of any condition, including paper maps. The design that felt most helpful in the moment was actively preventing users from learning their environment.",
      decision: "We committed to ambient, peripherally-processed guidance over explicit turn-by-turn direction. The ground-path projection worked because users could follow it with peripheral vision while maintaining environmental awareness — their eyes stayed on the real world 75% of the time versus 40% with floating arrows. The tradeoff was a 15% slower average navigation time for first-time routes, but we argued this was a feature, not a bug: slightly slower navigation with environmental awareness builds the spatial memory that eventually eliminates the need for AR assistance entirely. We designed for independence, not dependence."
    },
    artifacts: [
      { type: "Contextual Inquiry", image: "/images/projects/ar-inquiry.jpg", caption: "Shadowing a transfer student navigating the science complex — indoor transitions were the primary failure point" },
      { type: "Prototype Comparison", image: "/images/projects/ar-prototypes.jpg", caption: "Side-by-side of all three AR conditions during pilot testing — ground-path opacity needed 3 iterations to get right" },
      { type: "Eye-tracking Analysis", image: "/images/projects/ar-eyetrack.jpg", caption: "Attention heat maps showing the dramatic difference in environmental awareness between floating arrows (left) and ground-path (right)" }
    ]
  }
]

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "Shawn was a pleasure to have on our team during his internship. Within a limited timeframe, he quickly dove into design tasks and saw larger projects to completion during the engagement. Shawn knows his toolset, what software to reach for, and the processes to employ when it comes to creative problem-solving.",
    name: "Internship Supervisor",
    title: "",
    company: ""
  },
  {
    id: "2",
    quote: "Shawn is responsive, helpful and a self-starter. He helped us with a website redesign and not only came to the table with good ideas but was fast working and on schedule. Even though the project is complete, Shawn is still helpful and willing to answer questions.",
    name: "Sara Crow",
    title: "Marketing Manager",
    company: "CrossTx"
  },
  {
    id: "3",
    quote: "Shawn is a superb designer and developer. Not only is he able to come up with a very esthetic and user-friendly layout, he is able to construct it with the necessary web development tools. He would be a twofold asset to any company.",
    name: "Nicholas Marucci",
    title: "Instructor",
    company: "Montana Code School"
  },
  {
    id: "4",
    quote: "Shawn had a solid foundation in UI/UX design that proved to be very useful come course projects. His ability to charge forward into the realm of programming, further displayed his capacity to be highly trainable, as well as eager to learn. I believe he would make a great addition to any team.",
    name: "Lauren Nichols",
    title: "Teaching Assistant",
    company: "Montana Code School"
  },
  {
    id: "5",
    quote: "Shawn has been quite helpful as a co-founder of DropTrip. He is completely committed to its success and works to improve his skills and abilities on a regular basis to make that happen. He stays focused on the task at hand and clearly never stops thinking about the challenges we face and how to solve them. He is willing to jump in wherever needed.",
    name: "",
    title: "Co-founder",
    company: "DropTrip"
  }
]

export const processSteps: ProcessStep[] = [
  {
    id: "discover",
    title: "Discover",
    description: "Casting a wide net to understand users, context, and constraints through mixed research methods",
    tools: ["User Interviews", "Diary Studies", "Contextual Inquiry", "Competitive Analysis", "Literature Review", "Journey Mapping"],
    diamond: 1,
    mode: "diverge"
  },
  {
    id: "define",
    title: "Define",
    description: "Convergent synthesis — distilling research into a focused problem statement, design principles, and measurable success criteria",
    tools: ["Affinity Mapping", "How Might We", "Jobs-to-be-Done", "Design Principles", "Success Metrics"],
    diamond: 1,
    mode: "converge"
  },
  {
    id: "develop",
    title: "Develop",
    description: "Divergent creation — exploring multiple solutions through rapid iteration, from sketches to functional prototypes in code",
    tools: ["Sketching", "Wireframes", "Figma", "React", "Next.js", "Framer Motion"],
    diamond: 2,
    mode: "diverge"
  },
  {
    id: "deliver",
    title: "Deliver",
    description: "Convergent refinement — testing, validating, and shipping the solution with accessibility and performance baked in",
    tools: ["Usability Testing", "A/B Testing", "Accessibility Audits", "Design Systems", "Analytics", "CI/CD"],
    diamond: 2,
    mode: "converge"
  }
]

export const siteConfig = {
  name: "Shawn Farnum",
  title: "UI/UX Designer · Software Developer",
  tagline: "I design and build interfaces people actually want to use.",
  email: "hello@shawnfarnum.com",
  location: "Bozeman, MT",
  social: {
    linkedin: "https://linkedin.com/in/shawnfarnum",
    github: "https://github.com/shawnmfarnum",
    codepen: "https://codepen.io/shawnmfarnum/pens/public",
    dribbble: "https://dribbble.com/shawnmfarnum",
  },
  resumeUrl: "/resume.pdf"
}
