const GITHUB_USERNAME = 'OcheOps';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const PRIVATE_MESSAGES = [
  "You weren't supposed to see this...",
  "This repo is classified. Move along.",
  "Nice try. This one's under NDA with myself.",
  "404: Your clearance level is too low.",
  "Shhh... this repo is in stealth mode.",
  "This is above your pay grade, fam.",
  "I'd tell you, but then I'd have to mass revoke your access.",
  "This commit was made in the shadow realm.",
  "Encrypted with vibes. You wouldn't understand.",
  "Private repo. Not even my mum knows about this one.",
  "Top secret. Like, Area 51 level top secret.",
  "This repo runs on prayers and private keys.",
  "If I showed you this, GitHub would ban us both.",
  "Classified ops. Even Dependabot signed an NDA.",
  "I pushed this at 3AM. It stays in the vault.",
  "Access denied. Try again with sudo and good intentions.",
  "This repo is so private, it doesn't even show on my PC.",
  "Sorry, this one's behind seven proxies.",
  "You need a minimum of 10 years experience to view this.",
  "Hidden behind a VPN, a firewall, and my trust issues.",
  "The code here is written in tears and TypeScript. You can't handle it.",
  "This repo is invite only. And I lost the invite.",
  "Nah fam, this one's cooking. No previews.",
  "Currently in stealth startup mode. Investors only.",
  "If this repo was a movie, it'd be rated R for Restricted.",
  "I can neither confirm nor deny the existence of this repo.",
  "This is the repo I work on when nobody's watching.",
  "Built different. Literally — you can't see the build.",
  "My lawyer said I shouldn't talk about this one.",
  "This repo has more secrets than my .env file.",
];

function getPrivateMessage() {
  return PRIVATE_MESSAGES[Math.floor(Math.random() * PRIVATE_MESSAGES.length)];
}

export default async function handler(req, res) {
  try {
    const headers = { 'User-Agent': 'ocheverse.ng' };
    if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

    const [eventsRes, userRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
    ]);

    const [events, user] = await Promise.all([eventsRes.json(), userRes.json()]);

    const activity = (Array.isArray(events) ? events : [])
      .filter((e) => ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'WatchEvent', 'ForkEvent'].includes(e.type))
      .slice(0, 10)
      .map((e) => {
        let action = '';
        const isPublic = e.public !== false;

        switch (e.type) {
          case 'PushEvent': {
            const count = e.payload.commits?.length || e.payload.size || 1;
            action = `Pushed ${count} commit${count !== 1 ? 's' : ''} to`;
            break;
          }
          case 'CreateEvent':
            action = `Created ${e.payload.ref_type} in`;
            break;
          case 'PullRequestEvent':
            action = `${e.payload.action} PR in`;
            break;
          case 'IssuesEvent':
            action = `${e.payload.action} issue in`;
            break;
          case 'WatchEvent':
            action = 'Starred';
            break;
          case 'ForkEvent':
            action = 'Forked';
            break;
          default:
            action = `${e.type.replace('Event', '')} in`;
        }

        return {
          action,
          repo: isPublic ? e.repo.name.replace(`${GITHUB_USERNAME}/`, '') : null,
          repoUrl: isPublic ? `https://github.com/${e.repo.name}` : null,
          isPrivate: !isPublic,
          privateMessage: !isPublic ? getPrivateMessage() : null,
          date: e.created_at,
          type: e.type,
        };
      });

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    return res.status(200).json({
      activity,
      stats: {
        publicRepos: user.public_repos,
        followers: user.followers,
        avatarUrl: user.avatar_url,
      },
    });
  } catch {
    return res.status(200).json({ activity: [], stats: {} });
  }
}
