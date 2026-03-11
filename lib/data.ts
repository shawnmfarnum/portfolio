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
    id: "cafe-teria",
    title: "Café-Teria",
    description: "Redesigning a school lunch app so students learn to budget and parents actually trust it with their money.",
    lead: "A complete redesign of the My School Bucks app, transforming it from a frustrating, outdated tool into an engaging experience that teaches students financial literacy while giving parents real-time control over spending. The key insight: students and parents have fundamentally different relationships with the same data — the interface has to serve both without compromising either.",
    thumbnail: "/images/projects/cafe-thumb.jpg",
    tags: ["UI/UX", "User Research", "Prototyping"],
    heroImage: "/images/projects/cafe-hero.jpg",
    role: "UX Designer & Researcher",
    team: "Solo (research, design, prototyping)",
    timeline: "Academic project",
    tools: ["Sketch", "User Interviews", "Contextual Inquiry", "Persona Development", "Journey Mapping"],
    sectionHeadings: {
      problem: "An app that frustrated everyone who used it",
      research: "Two users, one app, completely different needs",
      design: "Designing for autonomy and oversight at the same time",
      outcome: "From frustration to financial literacy"
    },
    problem: "The My School Bucks app was supposed to make school lunches easier. Instead, it made them worse. The budgeting tools were confusing, navigation was cumbersome, and the design failed to engage the students who actually used it daily. Parents couldn't track what their kids were spending, and students had no way to know if they'd run out of money before the week ended.\n\nThe result: frustrated parents, overspending students, and an app nobody wanted to open. The redesign had to solve for both audiences simultaneously — giving students autonomy while giving parents peace of mind.",
    research: "I conducted stakeholder interviews with students and parents, then ran contextual inquiry sessions observing real lunchtime behavior in the cafeteria.\n\nSTUDENT INSIGHTS\n\nAlex, a 15-year-old sophomore, makes impulsive lunch decisions based on what his friends are eating. He has no sense of his weekly budget — he just spends until the money runs out. He wanted an app that was 'easy and fun,' with rewards for staying under budget and the ability to see his balance at a glance. Key finding: students make peer-influenced, impulse decisions. They need real-time balance visibility and positive reinforcement, not restrictions.\n\nPARENT INSIGHTS\n\nLaura, a parent of two, managed lunch budgets through cash allowances and bank statement monitoring. She had no visibility into what her kids actually purchased day-to-day. She wanted real-time alerts, spending limits, and transparency into food choices. Security was non-negotiable — two-factor auth and data encryption rated 5/5 in importance.\n\nTHE DESIGN CONSTRAINT\n\nStudents want autonomy and engagement. Parents want control and transparency. These seem like opposing forces, but the research revealed they converge on one principle: both groups want clarity about money. The interface just needs to frame that clarity differently for each audience.",
    design: "DUAL JOURNEY ARCHITECTURE\n\nThe app uses role-based login — students and parents enter through different doors into different experiences, but the underlying data is shared. Students see their daily budget as an engaging visual, with color-coded menus and real-time balance tracking. Parents see a management dashboard with spending trends, alerts, and approval controls.\n\nSTUDENT EXPERIENCE\n\nA vibrant dashboard shows the daily budget front and center. Color-coded menu categories (breakfast, lunch, drinks) make meal planning visual and intuitive. When selections exceed the budget, the app clearly notifies and lets students adjust — teaching budgeting through the interaction itself. Confirmation on successful purchases reinforces responsible spending.\n\nPARENT EXPERIENCE\n\nA calming, professional dashboard provides at-a-glance spending trends and balance overview. Parents set daily and weekly budgets with simple controls. Transaction history provides full transparency. When students exceed their budget, parents get an alert with one-tap approve/deny for additional funds.\n\nTHE BRIDGE\n\nThe approval flow is where both journeys connect. Students learn that exceeding their budget requires requesting more (accountability). Parents stay in control without micromanaging (trust). The app turns a potential friction point into a teaching moment about money management.",
    outcome: "Café-Teria addressed every major pain point from the original app. The redesign delivered intuitive budgeting that teaches financial literacy through use, not instruction. Streamlined navigation replaced the original app's confusing structure. Real-time balance tracking eliminated the 'running out of money on Thursday' problem.\n\nThe dual-journey approach proved that you can design for opposing user needs without compromise — the key is shared data with different presentation layers.\n\nKPI targets included 500 daily active users within 3 months, 50% monthly retention within 6 months, and 3-5 minute average session duration.\n\nWhat I'd Do Differently:\n\nI'd run more structured usability testing with actual students in a cafeteria setting — the contextual inquiry was valuable but I could have validated the prototype in-context rather than in a lab. I'd also explore gamification more deeply — the reward system was surface-level and could drive stronger engagement with deeper integration.",
    designDecision: {
      title: "Role-Based Experiences Over One-Size-Fits-All",
      insight: "Students and parents have fundamentally opposing needs: autonomy vs. control, engagement vs. oversight. A single interface trying to serve both would compromise each. But separate apps would fragment the data.",
      decision: "I designed role-based login that routes users into tailored experiences built on shared data. Students get an engaging, visual budget dashboard. Parents get a management console with alerts and approvals. The approval flow bridges both — students learn accountability, parents maintain oversight without micromanaging."
    },
    artifacts: [
      { type: "User Research", image: "/images/projects/cafe-research.jpg", caption: "Stakeholder interviews with students and parents — discovering that both groups want clarity about money, just framed differently" },
      { type: "Journey Maps", image: "/images/projects/cafe-journey.jpg", caption: "Dual user journeys showing how student and parent paths converge at the budget approval flow" },
      { type: "Prototype", image: "/images/projects/cafe-prototype.jpg", caption: "High-fidelity screens showing the student budget dashboard and parent management console side by side" }
    ]
  },
  {
    id: "droptrip",
    title: "DropTrip",
    description: "Co-founding a gig-economy startup that turns existing road trips into delivery routes — and designing the product from zero.",
    lead: "DropTrip was a startup I co-founded that combined travel and delivery. The core idea: people are already driving between cities — why not let them earn money by delivering packages along the way? My role spanned product design, UX research, and competitive strategy. This case study covers the market research, competitive analysis, and product thinking that shaped the concept from idea to investable product.",
    thumbnail: "/images/projects/droptrip-thumb.jpg",
    tags: ["UI/UX", "Product Design", "Startup"],
    heroImage: "/images/projects/droptrip-hero.jpg",
    role: "Co-Founder & Designer",
    team: "2 co-founders",
    timeline: "Startup venture",
    tools: ["Sketch", "Competitive Analysis", "Market Research", "User Personas", "Business Strategy"],
    sectionHeadings: {
      problem: "A gap between gig economy and long-distance delivery",
      research: "Understanding who drives, who ships, and why nothing connected them",
      design: "Designing trust into a peer-to-peer delivery system",
      outcome: "What building a startup from zero taught me"
    },
    problem: "Shipping packages long distance is expensive and impersonal. Meanwhile, millions of people drive between cities every day with empty trunk space. Gig economy platforms like Uber and Postmates solved local rides and food delivery, but nobody was connecting travelers with people who needed things delivered along their route.\n\nDropTrip was built to close that gap — a peer-to-peer delivery platform where existing travelers monetize their road trips by carrying packages for others. The challenge wasn't just building an app. It was designing trust between strangers exchanging physical goods and money.",
    research: "I mapped the competitive landscape across four direct and adjacent competitors:\n\nUber and Lyft owned ridesharing but had no package delivery capability and weren't built for long-distance routes. Postmates handled local delivery but couldn't serve cross-city needs. Roadie was the closest competitor — delivering 'almost anything' including large items — but wasn't optimized for the use case of planned travel routes.\n\nThe market need came from two sides simultaneously: customers frustrated by expensive shipping services wanted cheaper, more personal alternatives. And frequent travelers — from college students driving home to professionals commuting between cities — wanted flexible income that fit into trips they were already making.\n\nFive core pain points emerged: high shipping costs, inconsistent delivery reliability, the need for flexible income, lack of direct interaction with service providers, and the inability to monetize existing travel. DropTrip was designed to address all five by leveraging existing travel plans rather than creating new delivery routes.",
    design: "TRUST AS THE CORE DESIGN CHALLENGE\n\nPeer-to-peer delivery between strangers requires trust on both sides. The sender trusts a stranger with their package. The driver trusts that the package is safe and legal. The entire product design revolved around building and maintaining that trust.\n\nRATING AND REVIEW SYSTEM\n\nEvery delivery generates mutual reviews — both sender and driver rate each other. This creates accountability from day one and builds reputation over time. High-rated drivers get priority matching, creating an incentive loop for reliable service.\n\nONBOARDING AND VERIFICATION\n\nComprehensive onboarding ensures both drivers and clients understand the platform. Identity verification, trip validation, and package guidelines establish safety parameters before the first delivery happens.\n\nROUTE MATCHING\n\nThe matching algorithm connects packages with travelers whose existing routes pass through the delivery corridor. This is the key innovation — no detours, no dedicated delivery runs. The driver was already going there, which keeps costs low for clients and effort low for drivers.\n\nDISPUTE RESOLUTION\n\nClear escalation paths for issues between drivers and clients. The system handles damaged packages, late deliveries, and miscommunication with structured resolution flows rather than leaving users to figure it out themselves.",
    outcome: "DropTrip validated the core hypothesis: people will pay less for delivery when the driver was already heading that direction, and travelers will carry packages for extra income with minimal effort.\n\nThe project taught me more about product thinking than any class or job before it. Building from zero — with no existing users, no brand trust, and no funding safety net — forces you to make every design decision count. You can't A/B test with zero users. You have to rely on research, competitive intelligence, and instinct.\n\nKey Lessons:\n\nTrust is a design problem, not just a policy problem. You can't just write trust into terms of service — it has to be built into every interaction, from onboarding to dispute resolution.\n\nTwo-sided marketplaces have a cold start problem. You need both supply (drivers) and demand (senders) simultaneously. We focused on driver onboarding first because supply attracts demand.\n\nThe gig economy taught me to design for intermittent, low-commitment users. DropTrip drivers aren't employees — they're people with 20 minutes of spare attention. The interface had to respect that.",
    designDecision: {
      title: "Leveraging Existing Behavior Over Creating New Behavior",
      insight: "Every gig economy app asks users to do something new — drive for Uber, deliver for Postmates. But asking someone to make a dedicated delivery trip is a hard sell. The insight was that millions of people are already making these trips. The product shouldn't create new behavior — it should monetize existing behavior.",
      decision: "DropTrip's entire UX is built around the planned trip. Drivers enter their route first, then get matched with packages along that route. This inverts the typical delivery flow (package first, then find a driver). The result: lower friction for drivers, lower costs for senders, and a fundamentally different competitive position from every other delivery app."
    },
    artifacts: [
      { type: "Competitive Analysis", image: "/images/projects/droptrip-competitive.jpg", caption: "Mapping Uber, Lyft, Postmates, and Roadie against DropTrip's unique position — planned travel as the delivery mechanism" },
      { type: "Market Research", image: "/images/projects/droptrip-market.jpg", caption: "Five core pain points that validated the two-sided market opportunity" },
      { type: "User Personas", image: "/images/projects/droptrip-personas.jpg", caption: "Driver and sender personas spanning college students to working professionals — united by the desire for flexible, low-effort value" }
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
    name: "Casey Ferguson",
    title: "Vice President of Marketing",
    company: "Zoot Enterprises"
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
    name: "Doug Warner",
    title: "CEO",
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
