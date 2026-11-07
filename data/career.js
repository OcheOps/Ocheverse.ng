// Single source of truth for /hire, /projects, /speaking.
// Facts mirror public/David_Gideon_CV.pdf — update both together.

export const profile = {
  name: "David Gideon",
  headline: "Cloud & Platform Engineer · Solutions Architect · DevSecOps",
  location: "Lagos, Nigeria",
  availability: "Open to remote, hybrid and on-site roles · Open to relocation",
  rolesSought: [
    "Platform / Cloud Engineer",
    "Solutions Architect",
    "DevSecOps Engineer",
    "Developer Relations",
  ],
  email: "ocheworks@gmail.com",
  linkedin: "https://www.linkedin.com/in/gideonodavid/",
  github: "https://github.com/OcheOps",
  cv: "/David_Gideon_CV.pdf",
  // Set to a Cal.com / Calendly URL to show a "Book a call" button
  bookingUrl: "https://cal.com/oche-wur6t1",
  certificationsUrl: "https://www.linkedin.com/in/gideonodavid/details/certifications/",
  credlyUrl: "https://www.credly.com/users/oche-gideon",
};

export const impact = [
  {
    value: "75%",
    label: "faster deployments",
    detail: "3 hours → 45 minutes across 20+ environments",
    where: "Coronation Group",
  },
  {
    value: "50%",
    label: "cloud spend cut",
    detail: "$6,000 → $3,000 a month in regulated financial services",
    where: "Coronation Group",
  },
  {
    value: "100+",
    label: "CI/CD pipelines secured",
    detail: "SAST, DAST, dependency and policy checks for 20+ engineers",
    where: "Fusion Intelligence",
  },
  {
    value: "7",
    label: "client engagements",
    detail: "Fintech, government, FMCG, healthtech and education",
    where: "Cumulus HQ · AWS Advanced Partner",
  },
];

export const experience = [
  {
    role: "Solutions Architect",
    company: "Cumulus HQ (AWS Advanced Partner)",
    dates: "Jan 2026 – Present",
    type: "Concurrent consulting",
    summary:
      "Cloud architecture across 7 client engagements; designed an Amazon Bedrock RAG solution with ~$3,000 in initial operational savings.",
  },
  {
    role: "Solutions Architect & Engineering Lead",
    company: "Metcore Digital Technologies",
    dates: "Jan 2026 – Present",
    type: "Concurrent consulting",
    summary:
      "Architecture and infrastructure-as-code guidance for a 20-engineer organization; distributed-system and CI/CD reviews.",
  },
  {
    role: "DevSecOps Engineer",
    company: "Fusion Intelligence",
    dates: "Jan 2024 – Present",
    type: "Full-time",
    summary:
      "Security checks across 100+ pipelines; Go tooling that cut security review from days to minutes; ~30% lower infra costs.",
  },
  {
    role: "Solutions Architect / DevOps Engineer",
    company: "Coronation Group",
    dates: "Jan 2025 – Jan 2026",
    type: "Full-time",
    summary:
      "AWS/Azure hybrid cloud for regulated financial services; 75% faster deploys, 50% lower cloud spend; led a platform sub-team of 3.",
  },
  {
    role: "Systems & Network Administrator",
    company: "Nigerian Ports Authority",
    dates: "Nov 2023 – Oct 2024",
    type: "Professional experience",
    summary: "Enterprise systems and network infrastructure; configuration automation and firewall/VPN controls.",
  },
  {
    role: "DevOps Engineer",
    company: "Redeemer’s University",
    dates: "Oct 2022 – Aug 2023",
    type: "Contract",
    summary: "Containerized workloads; reusable provisioning with Docker, Kubernetes and Terraform.",
  },
];

// `repo` is used to pull live description/language/last-push from GitHub at build time.
export const projects = [
  {
    slug: "clyra-oss",
    name: "Clyra OSS",
    repo: "OcheOps/Clyra-OSS",
    tagline: "Prompt → editable cloud architecture diagram → deployable Terraform.",
    problem:
      "Architecture diagrams and the infrastructure code that implements them drift apart the moment either one changes.",
    built:
      "An architecture workbench: describe a system, get an editable multi-cloud diagram, export Terraform or CloudFormation, or reverse-ingest existing HCL back into a diagram. Ships an MCP server so Claude Desktop can drive it.",
    stack: ["TypeScript", "Terraform", "CloudFormation", "MCP"],
    showStars: false,
  },
  {
    slug: "infra-monitor",
    name: "Infra Monitor",
    repo: "OcheOps/Infra-Monitor",
    tagline: "Self-hosted monitoring for your servers, apps and sites in one CLI.",
    problem:
      "Standing up Prometheus, Grafana, Loki and alerting by hand takes days, so small teams run without observability.",
    built:
      "A guided installer that deploys the full stack on Docker Compose or Kubernetes, with agents, an HTTPS status page, a daily digest and opt-in AI explanations of alerts.",
    stack: ["Go", "Prometheus", "Grafana", "Loki", "Kubernetes"],
    showStars: false,
  },
  {
    slug: "passy",
    name: "Passy",
    repo: "OcheOps/passy",
    tagline: "A terminal-first, encrypted password manager.",
    problem: "Engineers live in the terminal but password managers make them leave it.",
    built:
      "A local AES-256-GCM encrypted vault with clipboard copy and a password generator, packaged for APT and DNF with cross-platform release builds.",
    stack: ["Go", "AES-256-GCM", "APT/DNF packaging"],
    showStars: false,
  },
  {
    slug: "paths-in-tech",
    name: "Paths-in-TECH",
    repo: "OcheOps/Paths-in-TECH",
    tagline: "A public career guide for people finding it hard in tech.",
    problem: "Newcomers to tech get conflicting, gatekept advice about where to start.",
    built:
      "An open, community-starred guide mapping career paths into tech, maintained in public.",
    stack: ["Community", "Technical writing"],
    showStars: true,
  },
];

// Grouped like the CV. Dates as on the CV (some undated).
export const certifications = [
  {
    group: "Architecture & strategy",
    items: [
      { issuer: "AWS", name: "Solutions Architect – Professional", verify: "https://www.credly.com/badges/1d840d8b-82ee-4396-aec2-ae0335ad148e" },
      { issuer: "AWS", name: "Advanced Networking – Specialty", date: "Aug 2025", verify: "https://www.credly.com/badges/450a28ac-e6d5-4bc7-90e7-e8d02f50bb94" },
      { issuer: "AWS", name: "AI Business Strategist", date: "Oct 2026", verify: "https://www.credly.com/badges/9736af63-f73a-4de7-879a-c9e01d37be98" },
      { issuer: "Google Cloud", name: "Professional Cloud Architect", date: "Jan 2026", verify: "https://www.credly.com/badges/0fc7b78e-f826-4846-95c1-4182212829f5" },
      { issuer: "Microsoft", name: "Azure Solutions Architect Expert", date: "Mar 2026" },
    ],
  },
  {
    group: "Cloud & networking",
    items: [
      { issuer: "Microsoft", name: "Azure Network Engineer Associate", date: "May 2026" },
      { issuer: "Microsoft", name: "Azure Administrator Associate", date: "Mar 2025" },
      { issuer: "Microsoft", name: "Azure Developer Associate", date: "Mar 2025" },
      { issuer: "Oracle", name: "OCI Multicloud Architect Professional", date: "Oct 2025" },
      { issuer: "Oracle", name: "OCI Architect", date: "Oct 2025" },
      { issuer: "AWS", name: "Solutions Architect – Associate", date: "Jul 2025", verify: "https://www.credly.com/badges/b482cf4f-a96c-4758-892f-25ca6d575abc" },
    ],
  },
  {
    group: "Platform & security",
    items: [
      { issuer: "CNCF", name: "Kubernetes and Cloud Native Associate (KCNA)", date: "May 2025", verify: "https://www.credly.com/badges/2c099085-271e-4b82-a684-b9af4d70129f" },
      { issuer: "Gremlin", name: "Certified Chaos Engineering Practitioner" },
      { issuer: "Tigera", name: "Certified Calico Operator: AWS Expert", verify: "https://www.credly.com/badges/ad080d1c-0188-43d6-9776-2bd97044f267" },
      { issuer: "ISO", name: "ISO/IEC 27001:2022 Information Security Associate" },
    ],
  },
];

// Talks given. Empty until the first one — the /speaking page handles that honestly.
export const talks = [];

export const speakingTopics = [
  {
    title: "Halving a cloud bill in regulated fintech",
    blurb: "How we took monthly spend from $6k to $3k without slowing delivery or failing an audit.",
  },
  {
    title: "Shifting security left across 100+ pipelines",
    blurb: "SAST, DAST and policy checks that engineers don’t route around, and Go tooling that made review take minutes.",
  },
  {
    title: "Self-hosting CI when the cloud says no",
    blurb: "Billing locks, 40 KB/s uplinks and Cloudflare 524s: running GitHub Actions on your own runners over Tailscale.",
  },
  {
    title: "RAG on Amazon Bedrock for real businesses",
    blurb: "What a retrieval-augmented generation system for an FMCG client actually looked like, cost and all.",
  },
  {
    title: "Building a tech career from Nigeria",
    blurb: "Leveling, remote work and the gap between local and global engineering expectations.",
  },
];

export const speakingFormats = ["Conference talks", "Meetups", "Workshops", "Podcasts", "Panels", "Livestreams"];
