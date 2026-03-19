import { useState } from 'react';

const TECH = [
  // Cloud Platforms
  { name: 'AWS', icon: '☁️', category: 'Cloud', detail: 'EC2, S3, IAM, RDS, VPC, CloudFront, Lambda, API Gateway, Bedrock, Athena' },
  { name: 'Azure', icon: '🔷', category: 'Cloud', detail: 'App Services, VNets, AD, VPNs' },
  { name: 'GCP', icon: '🌐', category: 'Cloud', detail: 'Compute, GKE, Cloud Functions' },
  { name: 'Huawei Cloud', icon: '🔴', category: 'Cloud', detail: 'Hybrid cloud deployments' },
  { name: 'Cloudflare', icon: '🟠', category: 'Cloud', detail: 'Workers, DNS, CDN, Pages' },

  // Containers & Orchestration
  { name: 'Docker', icon: '🐳', category: 'Containers' },
  { name: 'Kubernetes', icon: '☸️', category: 'Containers', detail: 'EKS, Minikube, Deployments, Services, Ingress, HPA' },
  { name: 'Helm', icon: '⛵', category: 'Containers' },
  { name: 'Docker Compose', icon: '🐋', category: 'Containers' },
  { name: 'Trivy', icon: '🔍', category: 'Containers', detail: 'Container security scanning' },

  // IaC & Automation
  { name: 'Terraform', icon: '🏗️', category: 'IaC' },
  { name: 'CloudFormation', icon: '📜', category: 'IaC' },
  { name: 'Bicep', icon: '💪', category: 'IaC' },
  { name: 'Ansible', icon: '🅰️', category: 'IaC' },
  { name: 'Pulumi', icon: '🧱', category: 'IaC' },

  // CI/CD
  { name: 'GitHub Actions', icon: '⚙️', category: 'CI/CD' },
  { name: 'GitLab CI', icon: '🦊', category: 'CI/CD' },
  { name: 'ArgoCD', icon: '🐙', category: 'CI/CD' },

  // Monitoring & Observability
  { name: 'Prometheus', icon: '🔥', category: 'Monitoring' },
  { name: 'Grafana', icon: '📊', category: 'Monitoring' },
  { name: 'Fluent Bit', icon: '📋', category: 'Monitoring' },
  { name: 'Alertmanager', icon: '🚨', category: 'Monitoring' },

  // Security
  { name: 'HashiCorp Vault', icon: '🔐', category: 'Security' },
  { name: 'Kyverno', icon: '🛡️', category: 'Security', detail: 'K8s policy engine' },
  { name: 'DevSecOps', icon: '🔒', category: 'Security', detail: 'ISO 27001, CEH knowledge' },

  // Networking
  { name: 'Networking', icon: '🌐', category: 'Networking', detail: 'TCP/IP, routing, NAT, DNS' },
  { name: 'VPN & Tunnels', icon: '🔗', category: 'Networking', detail: 'IPsec, StrongSwan, Tailscale' },
  { name: 'Caddy', icon: '🔒', category: 'Networking' },
  { name: 'Nginx', icon: '🟢', category: 'Networking' },
  { name: 'Traefik', icon: '🔀', category: 'Networking' },

  // Languages
  { name: 'Go', icon: '🔵', category: 'Language' },
  { name: 'Python', icon: '🐍', category: 'Language' },
  { name: 'JavaScript', icon: '🟨', category: 'Language' },
  { name: 'Java', icon: '☕', category: 'Language' },
  { name: 'Bash', icon: '💻', category: 'Language' },

  // Databases
  { name: 'PostgreSQL', icon: '🐘', category: 'Database' },
  { name: 'DynamoDB', icon: '⚡', category: 'Database' },
  { name: 'SQLite', icon: '🪶', category: 'Database' },
  { name: 'Redis', icon: '🔴', category: 'Database' },
  { name: 'S3 Storage', icon: '🪣', category: 'Database', detail: 'S3-compatible object storage' },

  // Frontend
  { name: 'Next.js', icon: '▲', category: 'Frontend' },
  { name: 'React', icon: '⚛️', category: 'Frontend' },
  { name: 'Tailwind CSS', icon: '🎨', category: 'Frontend' },

  // Platforms & Tools
  { name: 'Linux', icon: '🐧', category: 'Platforms' },
  { name: 'Git', icon: '📦', category: 'Platforms' },
  { name: 'Proxmox', icon: '🖥️', category: 'Platforms' },
  { name: 'Nextcloud', icon: '☁️', category: 'Platforms' },

  // Architecture & Design
  { name: 'System Design', icon: '🏛️', category: 'Architecture', detail: 'Distributed systems, multi-tenant SaaS' },
  { name: 'API Design', icon: '🔌', category: 'Architecture' },
  { name: 'FinOps', icon: '💰', category: 'Architecture', detail: 'Cost optimization with CUR, Athena, Cost Explorer' },
  { name: 'AI Integration', icon: '🤖', category: 'Architecture', detail: 'Bedrock, prompt engineering' },
];

const LEARNING = [
  { name: 'Rust', icon: '🦀' },
  { name: 'Nix', icon: '❄️' },
  { name: 'WebAssembly', icon: '🕸️' },
  { name: 'eBPF', icon: '🐝' },
];

const SOFT_SKILLS = [
  'Technical Leadership', 'Mentorship', 'Product Thinking', 'Problem Solving', 'Communication',
];

const CATEGORIES = ['All', ...new Set(TECH.map((t) => t.category))];

export default function TechStack() {
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === 'All' ? TECH : TECH.filter((t) => t.category === filter);

  return (
    <div>
      {/* Category filters - horizontally scrollable */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 mb-6 scrollbar-none">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                filter === cat
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400 mb-4 text-center">
        {filtered.length} {filter === 'All' ? 'total' : filter.toLowerCase()} tool{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Tech grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {filtered.map((tech) => (
          <div
            key={tech.name}
            onClick={() => setExpanded(expanded === tech.name ? null : tech.name)}
            className={`group relative bg-white dark:bg-gray-800 rounded-xl p-2.5 sm:p-3 border transition-all duration-200 cursor-pointer active:scale-[0.96] ${
              expanded === tech.name
                ? 'border-green-400 dark:border-green-600 shadow-md shadow-green-500/10 col-span-3 sm:col-span-2 lg:col-span-2'
                : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="text-center">
              <span className="text-xl sm:text-2xl block mb-1">{tech.icon}</span>
              <p className="font-semibold text-[11px] sm:text-xs text-gray-900 dark:text-white leading-tight">{tech.name}</p>
              {expanded !== tech.name && (
                <p className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-wider mt-0.5">{tech.category}</p>
              )}
              {expanded === tech.name && tech.detail && (
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{tech.detail}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Soft Skills */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Beyond the Code</h3>
        <div className="flex flex-wrap gap-2">
          {SOFT_SKILLS.map((skill) => (
            <span key={skill} className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Open to learning */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Open to Learning</h3>
        <p className="text-sm text-gray-400 mb-3">Always expanding. Currently exploring:</p>
        <div className="flex flex-wrap gap-2">
          {LEARNING.map((tech) => (
            <div key={tech.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-green-300 dark:border-green-700 hover:border-solid transition-all">
              <span>{tech.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{tech.name}</span>
            </div>
          ))}
          <div className="flex items-center px-3 py-1.5 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 text-sm">
            + whatever ships next
          </div>
        </div>
      </div>
    </div>
  );
}
