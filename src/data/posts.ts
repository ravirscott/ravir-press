export type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
};

export const SITE = {
  name: "Ravir Press",
  tagline: "Intelligence on Technology & AI",
  description:
    "Ravir Press delivers premium reporting on technology, artificial intelligence, cybersecurity and the digital economy — breaking news, deep analysis, and forward-looking insight.",
  url: "https://ravirpress.com",
  author: "Ravir Press Editorial",
  twitter: "@ravirpress",
};

export const CATEGORIES: Category[] = [
  {
    slug: "breaking-news",
    name: "Breaking News",
    tagline: "Tech as it happens",
    description:
      "The fastest moving stories in technology and AI — product launches, outages, acquisitions, regulatory shocks and market-moving announcements.",
  },
  {
    slug: "analysis-insights",
    name: "Analysis & Insights",
    tagline: "Beyond the headline",
    description:
      "In-depth reporting that explains why a story matters — strategic context, financial implications and the people behind the decisions.",
  },
  {
    slug: "trends-predictions",
    name: "Trends & Predictions",
    tagline: "What comes next",
    description:
      "Forward-looking coverage of emerging technologies, model releases and the macro shifts redrawing the AI and tech landscape.",
  },
  {
    slug: "guides-explainers",
    name: "Guides & Explainers",
    tagline: "Understand it in minutes",
    description:
      "Clear, jargon-free explainers and practical guides for builders, investors and curious readers navigating the AI era.",
  },
  {
    slug: "opinions-editorials",
    name: "Opinions & Editorials",
    tagline: "Argued with conviction",
    description:
      "Editorial commentary and signed opinion pieces from journalists, founders and researchers shaping the conversation.",
  },
  {
    slug: "industry-updates",
    name: "Industry Updates",
    tagline: "Inside the companies",
    description:
      "Earnings, hiring, layoffs, product roadmaps and partnership news from the labs and platforms driving the industry.",
  },
];

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: string; // slug
  tags: string[];
  author: string;
  publishedAt: string; // ISO
  readingMinutes: number;
  heroEyebrow: string;
  body: PostBlock[];
  faqs: { q: string; a: string }[];
};

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string; cite?: string };

export const POSTS: Post[] = [
  {
    slug: "openai-gpt-6-rumors-enterprise-pivot",
    title: "Inside the GPT-6 Rumors: Why OpenAI's Next Model May Be Built for the Enterprise",
    excerpt:
      "Leaked roadmaps and partner briefings suggest OpenAI's next flagship will prioritize reliability and governance over raw benchmark glory.",
    metaDescription:
      "Leaks point to GPT-6 prioritizing enterprise reliability, governance and long-context reasoning over benchmark wins. What it means for the AI market.",
    category: "analysis-insights",
    tags: ["OpenAI", "GPT-6", "Enterprise AI"],
    author: "Mira Shah",
    publishedAt: "2026-04-19T08:00:00Z",
    readingMinutes: 7,
    heroEyebrow: "Exclusive Analysis",
    body: [
      { type: "p", text: "For two years the AI industry has measured progress in benchmark points. The next OpenAI model, according to four people briefed on partner discussions, will be measured in something less glamorous: uptime, predictability and audit trails." },
      { type: "h2", text: "What the leaks actually say" },
      { type: "p", text: "Multiple enterprise partners have been shown a preview roadmap describing a model with longer effective context, deterministic tool-use and an expanded set of governance controls — including per-tenant model cards and on-by-default redaction." },
      { type: "ul", items: [
        "Effective context expanded to multi-million tokens with retrieval-aware routing",
        "Native, deterministic function-calling with retry and cost ceilings",
        "Tenant-scoped fine-tunes that no longer leak across organizations",
        "Built-in audit log of every tool invocation"
      ]},
      { type: "h2", text: "Why the pivot" },
      { type: "p", text: "Consumer ChatGPT growth has flattened in several mature markets. Enterprise contracts, by contrast, are now OpenAI's fastest-growing revenue line — and the friction is no longer capability, it is trust." },
      { type: "quote", text: "Boards do not approve a model because it scored 92 on MMLU. They approve it because their CISO signed off.", cite: "Fortune 500 CIO" },
      { type: "h3", text: "The competitive read" },
      { type: "p", text: "Anthropic and Google have spent the last year courting the same buyers with similar promises. If OpenAI ships first with credible governance primitives, it locks in the segment that is willing to pay the most per token." },
      { type: "h2", text: "What to watch" },
      { type: "p", text: "Expect a developer preview before any consumer launch — a reversal of the GPT-4 playbook. Pricing will likely separate a 'governed' tier from a standard one, mirroring how cloud providers monetize compliance." },
    ],
    faqs: [
      { q: "When will GPT-6 launch?", a: "No official date has been announced. Partner briefings suggest a developer preview before a public release, likely in the second half of the year." },
      { q: "Will GPT-6 be available to consumers?", a: "Yes, but the leaked roadmap prioritizes enterprise rollout first, with consumer access following the developer preview." },
      { q: "Is this confirmed by OpenAI?", a: "OpenAI has not publicly confirmed the roadmap. Reporting is based on briefings shared with enterprise partners." },
    ],
  },
  {
    slug: "eu-ai-act-second-wave-enforcement",
    title: "The EU AI Act's Second Wave: What Changes for Foundation Model Providers This Quarter",
    excerpt:
      "A new set of obligations comes into force, and Brussels is signaling it will not extend grace periods a third time.",
    metaDescription:
      "The EU AI Act's next obligations hit foundation model providers this quarter. What's required, who is exempt and what enforcement could look like.",
    category: "industry-updates",
    tags: ["EU AI Act", "Regulation", "Compliance"],
    author: "Henrik Lindqvist",
    publishedAt: "2026-04-18T14:30:00Z",
    readingMinutes: 6,
    heroEyebrow: "Regulation",
    body: [
      { type: "p", text: "The European AI Office has spent eighteen months staffing up. It is now staffed up. Providers of general-purpose AI models that previously treated the Act as a paper tiger should reread the relevant provisions." },
      { type: "h2", text: "The new obligations" },
      { type: "ul", items: [
        "Mandatory technical documentation for any model trained above the compute threshold",
        "Public summaries of training data sources",
        "Incident reporting within 15 days of a serious malfunction",
        "Adversarial evaluation results published in a standardized format"
      ]},
      { type: "h2", text: "Who is in scope" },
      { type: "p", text: "Any provider placing a general-purpose AI model on the EU market — regardless of where the company is headquartered. The extraterritorial reach is the same mechanism that made GDPR a global standard." },
      { type: "h3", text: "Open-source carve-outs" },
      { type: "p", text: "Genuinely open-weight, non-commercial releases retain a lighter regime. The carve-out narrows considerably the moment a paid API or hosted product touches the model." },
      { type: "h2", text: "Penalties have teeth" },
      { type: "p", text: "Fines scale to a percentage of global turnover, not just EU revenue. Two early enforcement cases are reportedly already on the Office's desk." },
    ],
    faqs: [
      { q: "Does the AI Act apply to non-EU companies?", a: "Yes. Any provider placing a model on the EU market is in scope, regardless of where the company is based." },
      { q: "Are open-source models exempt?", a: "Genuinely open and non-commercial releases benefit from a lighter regime, but the exemption narrows once the model is monetized." },
      { q: "What are the fines?", a: "Penalties scale as a percentage of global annual turnover, with the highest tier reserved for prohibited practices." },
    ],
  },
  {
    slug: "nvidia-rubin-shipment-delays",
    title: "Nvidia Rubin Shipments Slip Six Weeks, Cloud Providers Scramble",
    excerpt:
      "A packaging bottleneck at TSMC has pushed Rubin volume deliveries into the next quarter, forcing hyperscalers to extend Hopper depreciation schedules.",
    metaDescription:
      "Nvidia's next-gen Rubin GPU shipments are delayed six weeks due to advanced packaging constraints. How AWS, Azure and Google Cloud are responding.",
    category: "breaking-news",
    tags: ["Nvidia", "Rubin", "TSMC", "GPUs"],
    author: "Daniel Okafor",
    publishedAt: "2026-04-19T05:15:00Z",
    readingMinutes: 4,
    heroEyebrow: "Breaking",
    body: [
      { type: "p", text: "Volume shipments of Nvidia's Rubin platform have slipped by approximately six weeks, according to two supply-chain sources, after CoWoS-L packaging capacity at TSMC failed to ramp on schedule." },
      { type: "h2", text: "What slipped" },
      { type: "p", text: "Engineering samples are unaffected. The delay impacts the high-volume SKUs cloud providers had pre-allocated for late-spring data center deployments." },
      { type: "ul", items: [
        "First volume shipments now expected in early Q3",
        "Engineering and reference designs already with hyperscalers",
        "Pricing terms reportedly unchanged"
      ]},
      { type: "h2", text: "Hyperscaler response" },
      { type: "p", text: "AWS, Microsoft and Google are extending Hopper depreciation schedules and accelerating purchases of refurbished H100 capacity from secondary markets." },
    ],
    faqs: [
      { q: "Is this delay confirmed by Nvidia?", a: "Nvidia has not commented publicly. The reporting is based on supply chain sources." },
      { q: "Will Rubin pricing change?", a: "Sources indicate pricing terms remain unchanged from the original allocation contracts." },
    ],
  },
  {
    slug: "ai-coding-agents-2026-trends",
    title: "The Five Trends Reshaping AI Coding Agents in 2026",
    excerpt:
      "Autonomous agents are no longer a demo — they are a budget line. Here is where the category is heading next.",
    metaDescription:
      "AI coding agents are moving from demo to production. Five trends defining the category in 2026: long horizons, sandboxing, evals, pricing and governance.",
    category: "trends-predictions",
    tags: ["AI Agents", "Developer Tools", "Trends"],
    author: "Priya Ramanathan",
    publishedAt: "2026-04-17T09:00:00Z",
    readingMinutes: 8,
    heroEyebrow: "Trend Report",
    body: [
      { type: "p", text: "Twelve months ago, an AI coding agent that could close a real GitHub issue end-to-end was a conference keynote. Today it is a procurement decision. Five forces are shaping the next twelve months." },
      { type: "h2", text: "1. Longer horizons, narrower scope" },
      { type: "p", text: "Agents are getting better at multi-hour tasks but only in tightly scoped repositories. The breakthrough is not generality — it is reliable narrowness." },
      { type: "h2", text: "2. Sandboxing becomes table stakes" },
      { type: "p", text: "Every serious vendor now ships ephemeral, network-isolated execution environments. Running an agent against a production repo without one is fast becoming a security finding." },
      { type: "h2", text: "3. Evals replace benchmarks" },
      { type: "p", text: "SWE-bench scores still appear on slides but buyers are demanding repository-specific evaluation harnesses before signing. The vendor that makes evals easy will win procurement." },
      { type: "h2", text: "4. Outcome-based pricing emerges" },
      { type: "p", text: "Per-seat pricing makes no sense for an agent that closes 40 issues overnight. Expect per-PR and per-resolved-ticket pricing to spread quickly." },
      { type: "h2", text: "5. Governance moves left" },
      { type: "p", text: "Security and compliance teams are being pulled into purchasing decisions earlier. The winning products will ship with audit logs, role-based access and policy controls on day one." },
    ],
    faqs: [
      { q: "Are AI coding agents replacing developers?", a: "Not at the team level. They are reshaping what developers spend their time on, with humans focusing more on review, design and exception handling." },
      { q: "What is the biggest blocker to enterprise adoption?", a: "Security and auditability. Enterprises need to know exactly what an agent did, when, and to which systems." },
    ],
  },
  {
    slug: "what-is-rag-explainer-2026",
    title: "What Is Retrieval-Augmented Generation? A Clear Explainer for 2026",
    excerpt:
      "RAG has gone from niche pattern to default architecture. Here is what it is, why it works and where it falls down.",
    metaDescription:
      "A clear, current explainer of Retrieval-Augmented Generation (RAG): how it works, why it matters, common pitfalls and when to use it instead of fine-tuning.",
    category: "guides-explainers",
    tags: ["RAG", "LLM", "Explainer"],
    author: "Ravir Press Editorial",
    publishedAt: "2026-04-16T11:00:00Z",
    readingMinutes: 6,
    heroEyebrow: "Explainer",
    body: [
      { type: "p", text: "Retrieval-Augmented Generation, or RAG, is the technique that makes a large language model answer questions about your data without retraining it. In 2026, it is the most common architecture in enterprise AI." },
      { type: "h2", text: "How it works in one paragraph" },
      { type: "p", text: "When a user asks a question, the system first searches a database of your documents and pulls back the most relevant passages. Those passages are then handed to the language model along with the question. The model writes an answer grounded in what it just read." },
      { type: "h2", text: "Why it works so well" },
      { type: "ul", items: [
        "The model stays up to date without retraining",
        "Answers can cite their sources",
        "Sensitive data never has to be baked into model weights",
        "Costs are predictable — you pay per query, not per training run"
      ]},
      { type: "h2", text: "Where RAG breaks" },
      { type: "p", text: "RAG is only as good as its retrieval. If the right passage is not in the top results, the model will either hallucinate or refuse. Most production failures are retrieval failures, not generation failures." },
      { type: "h3", text: "RAG vs fine-tuning" },
      { type: "p", text: "Use RAG when the knowledge changes often or needs to be cited. Use fine-tuning when you are teaching a model a new skill, tone or format." },
    ],
    faqs: [
      { q: "Is RAG better than fine-tuning?", a: "They solve different problems. RAG injects fresh knowledge at query time; fine-tuning shapes how the model behaves." },
      { q: "Do I need a vector database for RAG?", a: "Often, but not always. Keyword search and hybrid approaches are competitive for many use cases." },
    ],
  },
  {
    slug: "open-source-ai-needs-its-linux-moment",
    title: "Opinion: Open-Source AI Needs Its Linux Moment — And It Needs It Now",
    excerpt:
      "The open ecosystem is producing better models than ever. It is also producing fragmentation that the closed labs are quietly enjoying.",
    metaDescription:
      "Open-source AI is releasing extraordinary models but the ecosystem is fragmenting. An argument for the standards moment the field has been avoiding.",
    category: "opinions-editorials",
    tags: ["Open Source", "Opinion", "AI Ecosystem"],
    author: "Jules Marchetti",
    publishedAt: "2026-04-15T16:00:00Z",
    readingMinutes: 5,
    heroEyebrow: "Editorial",
    body: [
      { type: "p", text: "There has never been a better time to download a model. There has also never been a more confusing time to deploy one. The open-source AI community is repeating, in fast-forward, every mistake the early Linux distributions made — without yet producing a Debian." },
      { type: "h2", text: "The fragmentation tax" },
      { type: "p", text: "Five competing inference runtimes. Three competing fine-tuning frameworks. A serving format that changes every quarter. Every team I speak to spends weeks on plumbing that should be a one-line install." },
      { type: "quote", text: "We did not pick the best model. We picked the model with the least painful runtime." },
      { type: "h2", text: "What a Linux moment looks like" },
      { type: "p", text: "It does not require one project to win. It requires the projects that exist to agree on enough — file formats, tokenizer interfaces, evaluation harnesses — that switching costs collapse." },
      { type: "h2", text: "Why now" },
      { type: "p", text: "Closed labs are shipping platforms, not just models. If the open ecosystem cannot match that experience, the cost advantage will not be enough." },
    ],
    faqs: [
      { q: "Is open-source AI losing to closed labs?", a: "On capability, no. On developer experience and integration, the gap is widening." },
      { q: "What would help most?", a: "Convergence on a small number of formats and runtimes, and shared tooling for evaluation and deployment." },
    ],
  },
  {
    slug: "zero-day-llm-prompt-injection-supply-chain",
    title: "The Quiet Zero-Day: Prompt Injection in Your AI Supply Chain",
    excerpt:
      "Security teams are waking up to a class of vulnerabilities that traditional scanners simply cannot see.",
    metaDescription:
      "Prompt injection is a quiet zero-day class hiding in AI supply chains. How attacks work, real incidents and what defenders can do today.",
    category: "guides-explainers",
    tags: ["Cybersecurity", "Prompt Injection", "AI Security"],
    author: "Aisha N'Diaye",
    publishedAt: "2026-04-14T10:00:00Z",
    readingMinutes: 7,
    heroEyebrow: "Security",
    body: [
      { type: "p", text: "Your AI assistant reads a customer email, follows an instruction hidden inside it, and exfiltrates an internal document. No malware was deployed. No credentials were phished. Welcome to prompt injection." },
      { type: "h2", text: "Why traditional defenses fail" },
      { type: "p", text: "Antivirus, EDR and DLP tools were built to detect code and known patterns. Prompt injection is a natural-language attack that travels inside legitimate content — a support ticket, a calendar invite, a PDF." },
      { type: "h2", text: "Three real incidents" },
      { type: "ul", items: [
        "An enterprise summarizer leaked board-level emails after processing a malicious meeting note",
        "A coding agent committed a backdoored dependency after reading a poisoned README",
        "A customer-service bot issued unauthorized refunds after parsing a crafted complaint"
      ]},
      { type: "h2", text: "Defenses that actually help" },
      { type: "ul", items: [
        "Treat all retrieved or user-supplied text as untrusted, always",
        "Separate the model that reads from the model that acts",
        "Require human approval for high-impact tool calls",
        "Log every tool invocation with the prompt that triggered it"
      ]},
    ],
    faqs: [
      { q: "Can a model be patched against prompt injection?", a: "Not fully. Mitigations reduce risk but the underlying problem is architectural and requires defense in depth." },
      { q: "Is prompt injection covered by existing security frameworks?", a: "OWASP now includes it in its LLM Top 10, and several national CERTs have issued guidance." },
    ],
  },
  {
    slug: "anthropic-claude-enterprise-revenue",
    title: "Anthropic Crosses $5B Run-Rate as Enterprise Claude Adoption Accelerates",
    excerpt:
      "New customer disclosures and partner data point to a sharp acceleration in enterprise spend on Claude.",
    metaDescription:
      "Anthropic has crossed an estimated $5B annualized revenue run-rate, driven by enterprise Claude adoption. Inside the numbers and what comes next.",
    category: "industry-updates",
    tags: ["Anthropic", "Claude", "Enterprise"],
    author: "Daniel Okafor",
    publishedAt: "2026-04-13T13:00:00Z",
    readingMinutes: 5,
    heroEyebrow: "Industry",
    body: [
      { type: "p", text: "Anthropic has crossed an estimated $5 billion annualized revenue run-rate, according to two investors briefed on recent financials, with enterprise contracts contributing the majority of growth." },
      { type: "h2", text: "Where the money is coming from" },
      { type: "ul", items: [
        "Financial services, particularly research and document workflows",
        "Legal and compliance, where citation discipline matters",
        "Customer support platforms standardizing on Claude for tool-use"
      ]},
      { type: "h2", text: "What it means for the market" },
      { type: "p", text: "Anthropic now has the cash, the customers and the model lineage to credibly compete on every front — including consumer, where it has historically underinvested." },
    ],
    faqs: [
      { q: "Is Anthropic profitable?", a: "Like its peers, Anthropic is investing heavily in compute and is not yet profitable on a consolidated basis." },
      { q: "Who are Anthropic's biggest investors?", a: "Amazon and Google are the largest strategic investors, alongside a deep bench of venture and sovereign capital." },
    ],
  },
];

export const getPostsByCategory = (slug: string) =>
  POSTS.filter((p) => p.category === slug).sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

export const getCategory = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);

export const getRecentPosts = (limit = 6) =>
  [...POSTS]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, limit);

export const getRelatedPosts = (post: Post, limit = 3) =>
  POSTS.filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, limit);
